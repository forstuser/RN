import React from "react";
import { StyleSheet, View, Alert } from "react-native";
import PropTypes from "prop-types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import I18n from "../i18n";

import {
  getReferenceDataForCategory,
  addInsurance,
  updateInsurance,
  deleteInsurance
} from "../api";

import LoadingOverlay from "../components/loading-overlay";
import { ScreenContainer, Text, Button } from "../elements";
import InsuranceForm from "../components/expense-forms/insurance-form";
import ChangesSavedModal from "../components/changes-saved-modal";

class AddEditInsurance extends React.Component {
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
    insurance: PropTypes.shape({
      insurance: PropTypes.shape({
        id: PropTypes.number,
        effectiveDate: PropTypes.string,
        provider: PropTypes.object,
        providerName: PropTypes.string,
        policyNo: PropTypes.string,
        value: PropTypes.number,
        amountInsured: PropTypes.number,
        copies: PropTypes.array
      })
    })
  };

  static navigatorButtons = {
    leftButtons: [
      {
        id: "back",
        icon: require("../images/ic_back_ios.png")
      }
    ]
  };

  constructor(props) {
    super(props);
    this.state = {
      insuranceProviders: [],
      isLoading: false
    };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  async componentDidMount() {
    const { mainCategoryId, productId, jobId, insurance } = this.props;
    let title = I18n.t("add_edit_insurance_add_insurance");
    if (insurance) {
      title = I18n.t("add_edit_insurance_edit_insurance");
    }

    this.props.navigator.setTitle({ title });

    this.fetchCategoryData();

    if (insurance) {
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
      if (event.id == "back") {
        Alert.alert(
          I18n.t("add_edit_amc_are_you_sure"),
          I18n.t("add_edit_insurance_unsaved_info"),
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
        const { productId, insurance } = this.props;
        Alert.alert(I18n.t("add_edit_insurance_delete_insurance"), [
          {
            text: I18n.t("add_edit_insurance_yes_delete"),
            onPress: async () => {
              try {
                this.setState({ isLoading: true });
                await deleteInsurance({
                  productId,
                  insuranceId: insurance.id
                });
                this.props.navigator.pop();
              } catch (e) {
                Alert.alert(I18n.t("add_edit_amc_could_not_delete"));
                this.setState({ isLoading: false });
              }
            }
          },
          {
            text: I18n.t("add_edit_no_dnt_delete"),
            onPress: () => {},
            style: "cancel"
          }
        ]);
      }
    }
  };

  fetchCategoryData = async () => {
    try {
      this.setState({ isLoading: true });
      const res = await getReferenceDataForCategory(this.props.categoryId);
      this.setState({
        insuranceProviders: res.categories[0].insuranceProviders,
        isLoading: false
      });
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  onSavePress = async () => {
    const {
      mainCategoryId,
      categoryId,
      productId,
      jobId,
      insurance,
      navigator
    } = this.props;
    let data = {
      mainCategoryId,
      categoryId,
      productId,
      jobId,
      ...this.insuranceForm.getFilledData()
    };

    if (!data.providerId && !data.providerName) {
      return Alert.alert(I18n.t("add_edit_insurance_provider_name"));
    }

    console.log("data: ", data);

    try {
      this.setState({ isLoading: true });
      if (!data.id) {
        await addInsurance(data);
      } else {
        await updateInsurance(data);
      }
      this.setState({ isLoading: false });
      this.changesSavedModal.show();
    } catch (e) {
      Alert.alert(e.message);
      this.setState({ isLoading: false });
    }
  };

  render() {
    const {
      mainCategoryId,
      categoryId,
      productId,
      jobId,
      insurance,
      navigator
    } = this.props;

    const { insuranceProviders, isLoading } = this.state;
    return (
      <ScreenContainer style={styles.container}>
        <LoadingOverlay visible={isLoading} />
        <ChangesSavedModal
          ref={ref => (this.changesSavedModal = ref)}
          navigator={this.props.navigator}
        />
        <KeyboardAwareScrollView>
          <InsuranceForm
            ref={ref => (this.insuranceForm = ref)}
            {...{
              mainCategoryId,
              categoryId,
              productId,
              jobId,
              insurance,
              insuranceProviders,
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

export default AddEditInsurance;
