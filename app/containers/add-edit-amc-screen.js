import React from "react";
import { StyleSheet, View, Alert, Platform } from "react-native";
import PropTypes from "prop-types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import I18n from "../i18n";
import {
  getReferenceDataForCategory,
  addAmc,
  updateAmc,
  deleteAmc
} from "../api";
import { showSnackbar } from "./snackbar";

import LoadingOverlay from "../components/loading-overlay";
import { ScreenContainer, Text, Button } from "../elements";
import AmcForm from "../components/expense-forms/amc-form";

import ChangesSavedModal from "../components/changes-saved-modal";

class AddEditAmc extends React.Component {
  static navigatorStyle = {
    tabBarHidden: true,
    navBarTranslucent: false,
    navBarTransparent: false,
    navBarBackgroundColor: "#fff"
  };

  static propTypes = {
    navigator: PropTypes.object.isRequired,
    mainCategoryId: PropTypes.number.isRequired,
    categoryId: PropTypes.number.isRequired,
    productId: PropTypes.number.isRequired,
    jobId: PropTypes.number.isRequired,
    amc: PropTypes.shape({
      id: PropTypes.number,
      effectiveDate: PropTypes.string,
      value: PropTypes.number,
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
    const { mainCategoryId, productId, jobId, amc } = this.props;
    let title = I18n.t("add_edit_amc_add_amc");
    if (amc) {
      title = I18n.t("add_edit_amc_edit_amc");
    }

    this.props.navigator.setTitle({ title });

    if (amc) {
      this.props.navigator.setButtons({
        rightButtons: [
          {
            title: "Delete",
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
          I18n.t("add_edit_amc_unsaved_info"),
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
        const { productId, amc } = this.props;
        Alert.alert(
          I18n.t("add_edit_amc_delete_amc"),
          I18n.t("add_edit_amc_delete_amc_desc"),
          [
            {
              text: I18n.t("product_details_screen_yes_delete"),
              onPress: async () => {
                try {
                  this.setState({ isLoading: true });
                  await deleteAmc({ productId, amcId: amc.id });
                  this.props.navigator.pop();
                } catch (e) {
                  console.log("e: ", e);
                  (I18n.t("add_edit_amc_could_not_delete"));
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
      amc,
      navigator
    } = this.props;
    let data = {
      mainCategoryId,
      categoryId,
      productId,
      jobId,
      ...this.amcForm.getFilledData()
    };

    if (!data.effectiveDate) {
      return showSnackbar({
        text: I18n.t("add_edit_amc_effective_date")
      })
    }

    try {
      this.setState({ isLoading: true });
      if (!data.id) {
        await addAmc(data);
      } else {
        await updateAmc(data);
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
      amc,
      navigator
    } = this.props;

    const { isLoading } = this.state;
    return (
      <ScreenContainer style={styles.container}>
        <ChangesSavedModal
          ref={ref => (this.changesSavedModal = ref)}
          navigator={this.props.navigator}
        />
        <LoadingOverlay visible={isLoading} />
        <KeyboardAwareScrollView>
          <AmcForm
            ref={ref => (this.amcForm = ref)}
            {...{
              mainCategoryId,
              categoryId,
              productId,
              jobId,
              amc,
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

export default AddEditAmc;
