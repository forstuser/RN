import React from "react";
import { StyleSheet, View, Alert, Platform } from "react-native";
import PropTypes from "prop-types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  getReferenceDataForCategory,
  addPuc,
  updatePuc,
  deletePuc
} from "../api";
import I18n from "../i18n";
import { showSnackbar } from "./snackbar";

import LoadingOverlay from "../components/loading-overlay";
import { ScreenContainer, Text, Button } from "../elements";
import PucForm from "../components/expense-forms/puc-form";
import ChangesSavedModal from "../components/changes-saved-modal";

class AddEditPuc extends React.Component {
  static navigatorStyle = {
    tabBarHidden: true,
    disabledBackGesture: true
  };
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    mainCategoryId: PropTypes.number.isRequired,
    categoryId: PropTypes.number.isRequired,
    productId: PropTypes.number.isRequired,
    jobId: PropTypes.number.isRequired,
    puc: PropTypes.shape({
      id: PropTypes.number,
      effectiveDate: PropTypes.string,
      value: PropTypes.number,
      renewal_type: PropTypes.number,
      sellers: PropTypes.object,
      copies: PropTypes.array
    })
  };

  static navigatorButtons = {
    ...Platform.select({
      ios: {
        leftButtons: [
          {
            id: "backPress",
            icon: require("../images/ic_back_ios.png")
          }
        ]
      }
    })
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  async componentDidMount() {
    const { mainCategoryId, productId, jobId, puc } = this.props;
    let title = I18n.t("add_edit_puc_add_puc");
    if (puc) {
      title = I18n.t("add_edit_puc_edit_puc");
    }

    this.props.navigator.setTitle({ title });

    if (puc) {
      this.props.navigator.setButtons({
        rightButtons: [
          {
            title: I18n.t("add_edit_insurance_delete"),
            id: "delete",
            buttonColor: "red",
            buttonFontSize: 16,
            buttonFontWeight: "600"
          }
        ],
        animated: true
      });
    }
  }

  onNavigatorEvent = event => {
    if (event.type == "NavBarButtonPress") {
      if (event.id == "backPress") {
        Alert.alert(
          I18n.t("add_edit_amc_are_you_sure"),
          I18n.t("add_edit_puc_unsaved_info"),
          [
            {
              text: I18n.t("add_edit_amc_go_back"),
              onPress: () => this.props.navigator.pop()
            },
            {
              text: I18n.t("add_edit_amc_stay"),
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            }
          ]
        );
      } else if (event.id == "delete") {
        const { productId, puc } = this.props;
        Alert.alert(
          I18n.t("add_edit_puc_delete_puc"),
          I18n.t("add_edit_puc_delete_puc_desc"),
          [
            {
              text: I18n.t("add_edit_insurance_yes_delete"),
              onPress: async () => {
                try {
                  this.setState({ isLoading: true });
                  await deletePuc({ productId, pucId: puc.id });
                  this.props.navigator.pop();
                } catch (e) {
                  showSnackbar({
                    text: I18n.t("add_edit_amc_could_not_delete")
                  })
                  this.setState({ isLoading: false });
                }
              }
            },
            {
              text: I18n.t("add_edit_no_dnt_delete"),
              onPress: () => { },
              style: "cancel"
            }
          ]
        );
      }
    }
  };

  onSavePress = async () => {
    const {
      mainCategoryId,
      categoryId,
      productId,
      jobId,
      puc,
      navigator
    } = this.props;
    let data = {
      mainCategoryId,
      categoryId,
      productId,
      jobId,
      ...this.pucForm.getFilledData()
    };

    if (!data.effectiveDate && !data.expiryPeriod) {
      return showSnackbar({
        text: I18n.t("add_edit_puc_select_puc")
      })
    }

    try {
      this.setState({ isLoading: true });
      if (!data.id) {
        await addPuc(data);
      } else {
        await updatePuc(data);
      }
      this.setState({ isLoading: false });
      this.changesSavedModal.show();
    } catch (e) {
      showSnackbar({
        text: e.message
      })
      this.setState({ isLoading: false });
    }
  };

  render() {
    const {
      mainCategoryId,
      categoryId,
      productId,
      jobId,
      puc,
      navigator
    } = this.props;

    const { isLoading } = this.state;
    return (
      <ScreenContainer style={styles.container}>
        <LoadingOverlay visible={isLoading} />
        <ChangesSavedModal
          ref={ref => (this.changesSavedModal = ref)}
          navigator={this.props.navigator}
        />
        <KeyboardAwareScrollView>
          <PucForm
            ref={ref => (this.pucForm = ref)}
            {...{
              mainCategoryId,
              categoryId,
              productId,
              jobId,
              puc,
              navigator,
              isCollapsible: false
            }}
          />
        </KeyboardAwareScrollView>
        <Button
          onPress={this.onSavePress}
          text={I18n.t("add_edit_amc_save")}
          color="secondary"
          borderRadius={0}
        />
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: "#FAFAFA"
  }
});

export default AddEditPuc;
