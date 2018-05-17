import React from "react";
import { StyleSheet, View, Alert, Platform } from "react-native";
import PropTypes from "prop-types";
import moment from "moment";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import I18n from "../i18n";
import { showSnackbar } from "../utils/snackbar";

import {
  getReferenceDataForCategory,
  addWarranty,
  updateWarranty,
  deleteWarranty
} from "../api";

import LoadingOverlay from "../components/loading-overlay";
import { ScreenContainer, Text, Button } from "../elements";
import WarrantyForm from "../components/expense-forms/warranty-form";
import { WARRANTY_TYPES } from "../constants";
import ChangesSavedModal from "../components/changes-saved-modal";
import Analytics from "../analytics";

class AddEditWarranty extends React.Component {
  static navigationOptions = {
    tabBarHidden: true,
    disabledBackGesture: true
  };
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    mainCategoryId: PropTypes.number.isRequired,
    categoryId: PropTypes.number.isRequired,
    productId: PropTypes.number.isRequired,
    jobId: PropTypes.number.isRequired,
    warrantyType: PropTypes.oneOf(WARRANTY_TYPES),
    warranty: PropTypes.shape({
      id: PropTypes.number,
      effectiveDate: PropTypes.string,
      value: PropTypes.number,
      renewal_type: PropTypes.number,
      provider: PropTypes.object,
      copies: PropTypes.array
    })
  };

  static defaultProps = {
    warrantyType: WARRANTY_TYPES.NORMAL
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
      renewalTypes: [],
      warrantyProviders: [],
      isLoading: false,
      initialValues: {
        effectiveDate: null,
        value: "",
        renewalType: null,
        providerId: null,
        providerName: null
      }
    };
    // this.props.navigation.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  async componentDidMount() {
    const {
      mainCategoryId,
      productId,
      jobId,
      warrantyType,
      warranty
    } = this.props;
    let title = "Add Warranty";
    if (warrantyType == WARRANTY_TYPES.NORMAL && warranty) {
      title = "Edit Warranty";
    } else if (warrantyType == WARRANTY_TYPES.DUAL && !warranty) {
      title = "Add Dual Warranty";
    } else if (warrantyType != WARRANTY_TYPES.DUAL && warranty) {
      title = "Edit Dual Warranty";
    } else if (warrantyType == WARRANTY_TYPES.EXTENDED && !warranty) {
      title = "Add Third Party Warranty";
    } else if (warrantyType == WARRANTY_TYPES.EXTENDED && warranty) {
      title = "Edit Third Party Warranty";
    }

    this.props.navigation.setTitle({ title });

    this.fetchCategoryData();

    if (warranty) {
      this.setState({
        initialValues: {
          effectiveDate: warranty.effectiveDate
            ? moment(warranty.effectiveDate).format("YYYY-MM-DD")
            : null,
          value: warranty.value,
          renewalType: warranty.renewal_type,
          providerId: warranty.provider ? warranty.provider.id : null,
          providerName: null
        }
      });
      this.props.navigation.setButtons({
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
        let initialValues = this.state.initialValues;
        let newData = this.warrantyForm.getFilledData();

        // console.log("initialValues: ", initialValues, "newData: ", newData);

        if (
          newData.effectiveDate == initialValues.effectiveDate &&
          newData.providerId == initialValues.providerId &&
          newData.providerName == initialValues.providerName &&
          newData.renewalType == initialValues.renewalType &&
          newData.value == initialValues.value
        ) {
          return this.props.navigation.pop();
        }
        Alert.alert(
          I18n.t("add_edit_amc_are_you_sure"),
          I18n.t("add_edit_warranty_unsaved_info"),
          [
            {
              text: I18n.t("add_edit_amc_go_back"),
              onPress: () => this.props.navigation.pop()
            },
            {
              text: I18n.t("add_edit_amc_stay"),
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            }
          ]
        );
      } else if (event.id == "delete") {
        const { productId, warranty } = this.props;
        Alert.alert(
          I18n.t("add_edit_warranty_delete_warranty"),
          I18n.t("add_edit_warranty_delete_warranty_desc"),
          [
            {
              text: I18n.t("add_edit_insurance_yes_delete"),
              onPress: async () => {
                try {
                  this.setState({ isLoading: true });
                  await deleteWarranty({ productId, warrantyId: warranty.id });
                  this.props.navigation.pop();
                } catch (e) {
                  showSnackbar({
                    text: I18n.t("add_edit_amc_could_not_delete")
                  });
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

  fetchCategoryData = async () => {
    try {
      this.setState({ isLoading: true });
      const res = await getReferenceDataForCategory(this.props.categoryId);
      this.setState({
        renewalTypes: res.renewalTypes,
        warrantyProviders: res.categories[0].warrantyProviders,
        isLoading: false
      });
    } catch (e) {
      showSnackbar({
        text: e.message
      });
    }
  };

  onSavePress = async () => {
    const {
      mainCategoryId,
      categoryId,
      productId,
      jobId,
      warranty,
      navigation,
      warrantyType
    } = this.props;
    let data = {
      mainCategoryId,
      categoryId,
      productId,
      jobId,
      warrantyType,
      ...this.warrantyForm.getFilledData()
    };

    if (warrantyType == WARRANTY_TYPES.EXTENDED && !data.effectiveDate) {
      return showSnackbar({
        text: I18n.t("add_edit_warranty_effective_date")
      });
    }

    if (!data.renewalType) {
      return showSnackbar({
        text: "Please upload doc or select warranty upto"
      });
    }

    if (warrantyType == WARRANTY_TYPES.EXTENDED) {
      Analytics.logEvent(Analytics.EVENTS.CLICK_SAVE, {
        entity: "extended warranty"
      });
    } else {
      Analytics.logEvent(Analytics.EVENTS.CLICK_SAVE, { entity: "warranty" });
    }
    try {
      this.setState({ isLoading: true });
      if (!data.id) {
        await addWarranty(data);
      } else {
        await updateWarranty(data);
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
    const {
      mainCategoryId,
      categoryId,
      productId,
      jobId,
      warranty,
      navigation,
      warrantyType
    } = this.props;

    const { renewalTypes, warrantyProviders, isLoading } = this.state;
    return (
      <ScreenContainer style={styles.container}>
        <LoadingOverlay visible={isLoading} />
        <ChangesSavedModal
          ref={ref => (this.changesSavedModal = ref)}
          navigation={this.props.navigation}
        />
        <KeyboardAwareScrollView>
          <WarrantyForm
            ref={ref => (this.warrantyForm = ref)}
            {...{
              warrantyType,
              mainCategoryId,
              categoryId,
              productId,
              jobId,
              warranty,
              renewalTypes,
              warrantyProviders,
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

export default AddEditWarranty;
