import React from "react";
import { StyleSheet, View, Alert, Platform, BackHandler } from "react-native";
import PropTypes from "prop-types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import moment from "moment";
import Analytics from "../analytics";
import I18n from "../i18n";
import { showSnackbar } from "../utils/snackbar";

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
import HeaderBackBtn from "../components/header-nav-back-btn";
import { colors } from "../theme";

class AddEditInsurance extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      title: params.isEditing
        ? I18n.t("add_edit_insurance_edit_insurance")
        : I18n.t("add_edit_insurance_add_insurance"),
      headerRight: params.isEditing ? (
        <Text
          onPress={params.onDeletePress}
          weight="Bold"
          style={{ color: colors.danger, marginRight: 10 }}
        >
          Delete
        </Text>
      ) : null,
      headerLeft: <HeaderBackBtn onPress={params.onBackPress} />
    };
  };

  static propTypes = {
    navigation: PropTypes.object.isRequired,
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

  constructor(props) {
    super(props);
    this.state = {
      insuranceProviders: [],
      isLoading: false,
      initialValues: {
        effectiveDate: null,
        value: "",
        policyNo: "",
        amountInsured: 0,
        providerId: null,
        providerName: ""
      }
    };
  }

  async componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    const {
      mainCategoryId,
      productId,
      jobId,
      insurance
    } = this.props.navigation.state.params;

    this.fetchCategoryData();

    this.props.navigation.setParams({
      onBackPress: this.onBackPress
    });

    if (insurance) {
      this.props.navigation.setParams({
        isEditing: true,
        onDeletePress: this.onDeletePress
      });

      this.setState({
        initialValues: {
          effectiveDate: insurance.effectiveDate
            ? moment(insurance.effectiveDate).format("YYYY-MM-DD")
            : null,
          value: insurance.value,
          policyNo: insurance.policyNo,
          amountInsured: insurance.amountInsured || 0,
          providerId: insurance.provider ? insurance.provider.id : null,
          providerName: ""
        }
      });
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  onBackPress = () => {
    let initialValues = this.state.initialValues;
    let newData = this.insuranceForm.getFilledData();

    if (
      newData.effectiveDate == initialValues.effectiveDate &&
      newData.providerId == initialValues.providerId &&
      newData.providerName == initialValues.providerName &&
      newData.policyNo == initialValues.policyNo &&
      newData.value == initialValues.value &&
      newData.amountInsured == initialValues.amountInsured
    ) {
      this.props.navigation.goBack();
    } else {
      Alert.alert(
        I18n.t("add_edit_amc_are_you_sure"),
        I18n.t("add_edit_insurance_unsaved_info"),
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
    }
    return true;
  };

  onDeletePress = () => {
    const { productId, insurance } = this.props.navigation.state.params;
    Alert.alert(
      I18n.t("add_edit_insurance_delete_insurance"),
      I18n.t("add_edit_insurance_delete_insurance_desc"),
      [
        {
          text: I18n.t("add_edit_insurance_yes_delete"),
          onPress: async () => {
            try {
              this.setState({ isLoading: true });
              await deleteInsurance({
                productId,
                insuranceId: insurance.id
              });
              this.props.navigation.goBack();
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
  };

  fetchCategoryData = async () => {
    try {
      this.setState({ isLoading: true });
      const res = await getReferenceDataForCategory(
        this.props.navigation.state.params.categoryId
      );
      this.setState({
        insuranceProviders: res.categories[0].insuranceProviders,
        isLoading: false
      });
    } catch (e) {
      showSnackbar({
        text: e.message
      });
    }
  };

  onSavePress = async () => {
    const { navigation } = this.props;
    const {
      mainCategoryId,
      categoryId,
      productId,
      jobId,
      insurance
    } = navigation.state.params;
    let data = {
      mainCategoryId,
      categoryId,
      productId,
      jobId,
      ...this.insuranceForm.getFilledData()
    };

    if (!data.providerId && !data.providerName) {
      return showSnackbar({
        text: I18n.t("add_edit_insurance_provider_name")
      });
    }

    console.log("data: ", data);
    Analytics.logEvent(Analytics.EVENTS.CLICK_SAVE, { entity: "insurance" });

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
      insurance
    } = navigation.state.params;

    const { insuranceProviders, isLoading } = this.state;
    return (
      <ScreenContainer style={styles.container}>
        <LoadingOverlay visible={isLoading} />
        <ChangesSavedModal
          ref={ref => (this.changesSavedModal = ref)}
          navigation={this.props.navigation}
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

export default AddEditInsurance;
