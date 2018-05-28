import React from "react";
import {
  StyleSheet,
  View,
  Image,
  Alert,
  TouchableOpacity,
  Platform
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Icon from "react-native-vector-icons/Entypo";
import {
  API_BASE_URL,
  getReferenceDataForCategory,
  updateProduct
} from "../api";
import { ScreenContainer, Text, Button } from "../elements";
import LoadingOverlay from "../components/loading-overlay";
import { colors } from "../theme";
import { MAIN_CATEGORY_IDS, CATEGORY_IDS } from "../constants";
import UploadBillOptions from "../components/upload-bill-options";
import SelectModal from "../components/select-modal";
import HealthcareInsuranceForm from "../components/expense-forms/healthcare-insurance-form";
import I18n from "../i18n";
import { showSnackbar } from "../utils/snackbar";

import CustomTextInput from "../components/form-elements/text-input";
import ContactFields from "../components/form-elements/contact-fields";
import HeaderWithUploadOption from "../components/form-elements/header-with-upload-option";
import FinishModal from "./add-edit-expense-screen/finish-modal";
import ChangesSavedModal from "../components/changes-saved-modal";

class MedicalDoc extends React.Component {
  static navigationOptions = {
    title: I18n.t("add_edit_healthcare_edit_insurance")
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
      mainCategoryId: MAIN_CATEGORY_IDS.HEALTHCARE,
      categoryId: CATEGORY_IDS.HEALTHCARE.INSURANCE,
      isLoading: false,
      isFinishModalVisible: false,
      insuranceProviders: []
    };
    // this.props.navigation.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  onNavigatorEvent = event => {
    switch (event.id) {
      case "backPress":
        Alert.alert(
          I18n.t("add_edit_amc_are_you_sure"),
          I18n.t("add_edit_healthcare_unsaved_info"),
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

        break;
    }
  };

  componentDidMount() {
    this.fetchCategoryData();
  }

  fetchCategoryData = async () => {
    try {
      this.setState({ isLoading: true });
      const res = await getReferenceDataForCategory(this.state.categoryId);
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

  saveDoc = async () => {
    const { navigation } = this.props;
    const { mainCategoryId, categoryId } = navigation.state.params;
    let data = {
      mainCategoryId,
      categoryId,
      ...this.insuranceForm.getFilledData()
    };

    console.log("data: ", data);

    try {
      this.setState({ isLoading: true });
      await updateProduct(data);
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
      typeId,
      productId,
      jobId,
      planName,
      insuranceFor,
      insuranceId,
      value,
      providerId,
      effectiveDate,
      policyNo,
      amountInsured,
      copies
    } = navigation.state.params;

    const {
      mainCategoryId,
      categoryId,
      insuranceProviders,
      isLoading,
      isFinishModalVisible
    } = this.state;
    return (
      <View collapsable={false} style={styles.container}>
        <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
          <LoadingOverlay visible={isLoading} />
          <ChangesSavedModal
            ref={ref => (this.changesSavedModal = ref)}
            navigation={this.props.navigation}
          />
          <HealthcareInsuranceForm
            showFullForm={true}
            ref={ref => (this.insuranceForm = ref)}
            showOnlyGeneralInfo={false}
            showFullForm={true}
            {...{
              typeId,
              categoryId,
              productId,
              jobId,
              planName,
              insuranceFor,
              insuranceId,
              value,
              providerId,
              effectiveDate,
              policyNo,
              amountInsured,
              copies,
              navigation,
              insuranceProviders
            }}
          />
        </KeyboardAwareScrollView>
        <Button
          style={styles.saveBtn}
          onPress={this.saveDoc}
          text={I18n.t("add_edit_amc_save")}
          borderRadius={0}
          color="secondary"
        />
        <FinishModal
          title={I18n.t("add_edit_healthcare_doc_added")}
          visible={isFinishModalVisible}
          mainCategoryId={mainCategoryId}
          navigation={this.props.navigation}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: "#FAFAFA",
    flex: 1
  },
  imageHeader: {
    backgroundColor: "#fff",
    borderColor: "#eee",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
    padding: 40
  },
  headerImage: {
    width: 80,
    height: 90
  },
  form: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderColor: "#eee",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  input: {
    paddingVertical: 10,
    borderColor: colors.lighterText,
    borderBottomWidth: 2,
    height: 40,
    marginBottom: 32
  },
  saveBtn: {}
});

export default MedicalDoc;
