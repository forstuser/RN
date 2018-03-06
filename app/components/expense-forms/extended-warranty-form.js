import React from "react";
import {
  StyleSheet,
  View,
  Image,
  Alert,
  TouchableOpacity,
  TextInput
} from "react-native";

import moment from "moment";
import { I18n } from "../../i18n";
import { MAIN_CATEGORY_IDS } from "../../constants";
import { getReferenceDataBrands, getReferenceDataModels } from "../../api";

import Icon from "react-native-vector-icons/Entypo";
import DatePicker from "react-native-datepicker";

import Collapsible from "../../components/collapsible";

import { Text } from "../../elements";
import SelectModal from "../../components/select-modal";
import { colors } from "../../theme";

import CustomDatePicker from "../form-elements/date-picker";
import UploadDoc from "../form-elements/upload-doc";

class ExtendedWarrantyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedDocId: null,
      isDocUploaded: false,
      startDate: null,
      providers: [],
      selectedProvider: null,
      providerName: "",
      renewalTypes: [],
      selectedRenewalType: null
    };
  }

  componentDidMount() {
    this.setState({
      providers: this.props.categoryReferenceData.warrantyProviders,
      renewalTypes: this.props.renewalTypes
    });
  }

  getFilledData = () => {
    const {
      uploadedDocId,
      startDate,
      selectedProvider,
      providerName,
      selectedRenewalType
    } = this.state;

    let data = {
      extendedId: uploadedDocId,
      extendedEffectiveDate: startDate,
      extendedProviderId: selectedProvider ? selectedProvider.id : null,
      extendedRenewalType: selectedRenewalType ? selectedRenewalType.id : null
    };

    return data;
  };

  onProviderSelect = provider => {
    if (
      this.state.selectedProvider &&
      this.state.selectedProvider.id == provider.id
    ) {
      return;
    }
    this.setState({
      selectedProvider: provider,
      providerName: ""
    });
  };

  onProviderNameChange = text => {
    this.setState({
      providerName: text,
      selectedProvider: null
    });
  };

  onRenewalTypeSelect = renewalType => {
    if (
      this.state.selectedRenewalType &&
      this.state.selectedRenewalType.id == renewalType.id
    ) {
      return;
    }
    this.setState({
      selectedRenewalType: renewalType
    });
  };

  render() {
    const { mainCategoryId, categoryId, product } = this.props;
    const {
      isDocUploaded,
      startDate,
      providers,
      selectedProvider,
      providerName,
      renewalTypes,
      selectedRenewalType
    } = this.state;
    return (
      <Collapsible
        headerText={I18n.t("expense_forms_extended_warranty_third_party_text")}
        style={styles.container}
        headerStyle={styles.headerStyle}
        headerTextStyle={styles.headerTextStyle}
        icon="plus"
      >
        <View style={styles.innerContainer}>
          <View style={styles.body}>
            <SelectModal
              style={styles.input}
              dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
              placeholder={I18n.t("expense_forms_extended_warranty_provider")}
              textInputPlaceholder={I18n.t(
                "expense_forms_extended_warranty_provider_name"
              )}
              placeholderRenderer={({ placeholder }) => (
                <Text weight="Medium" style={{ color: colors.secondaryText }}>
                  {placeholder}
                </Text>
              )}
              selectedOption={selectedProvider}
              textInputValue={providerName}
              options={providers}
              onOptionSelect={value => {
                this.onProviderSelect(value);
              }}
              onTextInputChange={text => this.onProviderNameChange(text)}
            />
            <CustomDatePicker
              date={startDate}
              placeholder={I18n.t("expense_forms_extended_warranty_start_date")}
              onDateChange={startDate => {
                this.setState({ startDate });
              }}
            />

            <SelectModal
              style={styles.input}
              dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
              placeholder={I18n.t("expense_forms_extended_warranty_upto")}
              placeholderRenderer={({ placeholder }) => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text weight="Medium" style={{ color: colors.secondaryText }}>
                    {placeholder}
                  </Text>
                  <Text
                    weight="Medium"
                    style={{ color: colors.mainBlue, fontSize: 10 }}
                  >
                    {I18n.t("expense_forms_amc_form_amc_recommended")}
                  </Text>
                </View>
              )}
              selectedOption={selectedRenewalType}
              options={renewalTypes}
              visibleKey={I18n.t("expense_forms_extended_warranty_title")}
              onOptionSelect={value => {
                this.onRenewalTypeSelect(value);
              }}
              hideAddNew={true}
            />

            <UploadDoc
              jobId={product.job_id}
              type={8}
              placeholder={I18n.t("expense_forms_extended_warranty_doc")}
              navigator={this.props.navigator}
              onUpload={uploadResult => {
                console.log("upload result: ", uploadResult);
                this.setState({
                  isDocUploaded: true
                  // uploadedDocId: uploadResult.warranty.id
                });
              }}
            />
          </View>
        </View>
      </Collapsible>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderColor: "#eee",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  headerStyle: {
    borderBottomWidth: 0,
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  headerTextStyle: {
    fontSize: 18
  },
  innerContainer: {
    padding: 20,
    paddingTop: 0,
    backgroundColor: "#fff"
  },
  header: {
    flexDirection: "row",
    marginBottom: 20
  },
  headerText: {
    fontSize: 18,
    flex: 1
  },
  uploadBillBtn: {
    flexDirection: "row",
    alignItems: "center"
  },
  uploadBillBtnTexts: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1
  },
  uploadBillBtnText: {
    fontSize: 14
  },
  input: {
    paddingVertical: 10,
    borderColor: colors.lighterText,
    borderBottomWidth: 2,
    paddingTop: 20,
    height: 50,
    marginBottom: 25
  }
});

export default ExtendedWarrantyForm;
