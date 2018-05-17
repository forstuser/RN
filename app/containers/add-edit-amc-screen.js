import React from "react";
import { StyleSheet, View, Alert, Platform } from "react-native";
import PropTypes from "prop-types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import moment from "moment";
import I18n from "../i18n";
import {
  getReferenceDataForCategory,
  addAmc,
  updateAmc,
  deleteAmc
} from "../api";
import { showSnackbar } from "../utils/snackbar";

import LoadingOverlay from "../components/loading-overlay";
import { ScreenContainer, Text, Button } from "../elements";
import AmcForm from "../components/expense-forms/amc-form";

import ChangesSavedModal from "../components/changes-saved-modal";

class AddEditAmc extends React.Component {
  static navigationOptions = {
    tabBarHidden: true,
    navBarTranslucent: false,
    navBarTransparent: false,
    navBarBackgroundColor: "#fff"
  };

  static propTypes = {
    navigation: PropTypes.object.isRequired,
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

  static navigationButtons = {
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
      isLoading: false,
      initialValues: {
        effectiveDate: null,
        value: "",
        sellerName: "",
        sellerContact: ""
      }
    };
    // this.props.navigation.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  async componentDidMount() {
    const {
      mainCategoryId,
      productId,
      jobId,
      amc
    } = this.props.navigation.state.params;
    let title = I18n.t("add_edit_amc_add_amc");
    if (amc) {
      title = I18n.t("add_edit_amc_edit_amc");
    }

    //this.props.navigation.setTitle({ title });

    if (amc) {
      this.setState({
        initialValues: {
          effectiveDate: amc.effectiveDate
            ? moment(amc.effectiveDate).format("YYYY-MM-DD")
            : null,
          value: amc.value,
          sellerName:
            amc.sellers && amc.sellers.sellerName ? amc.sellers.sellerName : "",
          sellerContact:
            amc.sellers && amc.sellers.contact ? amc.sellers.contact : ""
        }
      });
      // this.props.navigation.setButtons({
      //   rightButtons: [
      //     {
      //       title: "Delete",
      //       id: "delete",
      //       buttonColor: "red",
      //       buttonFontSize: 16,
      //       buttonFontWeight: "600"
      //     }
      //   ],
      //   animated: true
      // });
    }
  }

  onNavigatorEvent = event => {
    if (event.type == "NavBarButtonPress") {
      if (event.id == "backPress") {
        let initialValues = this.state.initialValues;
        let newData = this.amcForm.getFilledData();

        console.log("initialValues: ", initialValues, "newData: ", newData);

        if (
          newData.effectiveDate == initialValues.effectiveDate &&
          newData.value == initialValues.value &&
          newData.sellerName == initialValues.sellerName &&
          newData.sellerContact == initialValues.sellerContact
        ) {
          return this.props.navigation.goBack();
        }

        Alert.alert(
          I18n.t("add_edit_amc_are_you_sure"),
          I18n.t("add_edit_amc_unsaved_info"),
          [
            {
              text: I18n.t("add_edit_amc_go_back"),
              onPress: () => this.props.navigation.goBack()
            },
            {
              text: I18n.t("add_edit_amc_stay"),
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            }
          ]
        );
      } else if (event.id == "delete") {
        const { productId, amc } = this.props.navigation.state.params;
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
                  this.props.navigation.goBack();
                } catch (e) {
                  console.log("e: ", e);
                  I18n.t("add_edit_amc_could_not_delete");
                  this.setState({ isLoading: false });
                }
              }
            },
            {
              text: I18n.t("add_edit_no_dnt_delete"),
              onPress: () => {},
              style: "cancel"
            }
          ]
        );
      }
    }
  };

  onSavePress = async () => {
    const { navigation } = this.props;
    const {
      mainCategoryId,
      categoryId,
      productId,
      jobId,
      amc
    } = navigation.state.params;

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
      });
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
      });
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { navigation } = this.props;
    const {
      mainCategoryId,
      categoryId,
      productId,
      jobId,
      amc
    } = navigation.state.params;

    const { isLoading } = this.state;
    return (
      <ScreenContainer style={styles.container}>
        <ChangesSavedModal
          ref={ref => (this.changesSavedModal = ref)}
          navigation={this.props.navigation}
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
              navigation,
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
