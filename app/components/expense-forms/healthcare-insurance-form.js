import React from "react";
import { StyleSheet, View, Image, Alert, TouchableOpacity } from "react-native";

import moment from "moment";

import { MAIN_CATEGORY_IDS } from "../../constants";
import {
  API_BASE_URL,
  getReferenceDataBrands,
  getReferenceDataModels,
  getReferenceDataForCategory
} from "../../api";
import I18n from "../../i18n";
import { Text } from "../../elements";
import SelectModal from "../../components/select-modal";
import { colors } from "../../theme";

import ContactFields from "../form-elements/contact-fields";
import CustomTextInput from "../form-elements/text-input";
import CustomDatePicker from "../form-elements/date-picker";
import UploadDoc from "../form-elements/upload-doc";

class HealthcareInsuranceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productId: null,
      planName: "",
      insuranceFor: "",
      types: [],
      selectedType: null,
      insuranceProviders: [],
      selectedProvider: null,
      providerName: "",
      insuranceId: null,
      policyNo: "",
      effectiveDate: null,
      value: "",
      amountInsured: "",
      copies: []
    };
  }

  componentDidMount() {
    this.fetchTypes();
  }

  componentWillReceiveProps(nextProps) {
    this.updateStateFromProps(nextProps);
  }

  updateStateFromProps = props => {
    const {
      typeId,
      productId,
      insuranceId,
      jobId,
      planName,
      insuranceFor,
      value,
      insuranceProviders,
      providerId,
      effectiveDate,
      policyNo,
      amountInsured,
      copies
    } = props;

    let selectedType = null;
    if (typeId) {
      selectedType = this.state.types.find(type => type.id == typeId);
    }

    let selectedProvider = null;
    if (providerId) {
      selectedProvider = insuranceProviders.find(
        provider => provider.id == providerId
      );
    }

    this.setState({
      productId,
      jobId,
      planName,
      insuranceFor,
      insuranceProviders,
      insuranceId,
      value,
      providerId,
      effectiveDate,
      policyNo,
      amountInsured,
      copies,
      selectedType,
      selectedProvider
    });
  };

  fetchTypes = async () => {
    try {
      const res = await getReferenceDataForCategory(this.props.categoryId);
      this.setState(
        {
          types: res.categories[0].subCategories
        },
        () => {
          this.updateStateFromProps(this.props);
        }
      );
    } catch (e) {
      console.log(e);
    }
  };

  getFilledData = () => {
    const { showOnlyGeneralInfo } = this.props;
    const {
      productId,
      planName,
      selectedType,
      insuranceFor,
      selectedProvider,
      insuranceId,
      providerName,
      policyNo,
      effectiveDate,
      value,
      amountInsured
    } = this.state;

    let data = {
      productId: productId,
      productName: planName || "Insurance",
      model: insuranceFor,
      isNewModel: false,
      subCategoryId: selectedType ? selectedType.id : null
    };

    if (!showOnlyGeneralInfo) {
      data.insurance = {
        id: insuranceId,
        effectiveDate: effectiveDate,
        providerId: selectedProvider ? selectedProvider.id : null,
        providerName: providerName,
        policyNo: policyNo,
        value: value,
        amountInsured: amountInsured
      };
    }

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

  onTypeSelect = type => {
    if (this.state.selectedType && this.state.selectedType.id == type.id) {
      return;
    }
    this.setState({
      selectedType: type
    });
  };

  render() {
    const {
      mainCategoryId,
      categoryId,
      jobId,
      showOnlyGeneralInfo = false,
      showFullForm = false
    } = this.props;
    const {
      productId,
      insuranceId,
      planName,
      types,
      selectedType,
      insuranceFor,
      insuranceProviders,
      selectedProvider,
      providerName,
      policyNo,
      effectiveDate,
      value,
      amountInsured,
      copies
    } = this.state;
    return (
      <View style={styles.container}>
        <Text weight="Medium" style={styles.headerText}>
          {I18n.t("expense_forms_healthcare")}
        </Text>
        <View style={styles.body}>
          {showFullForm && (
            <CustomTextInput
              placeholder={I18n.t("expense_forms_healthcare_plan_name")}
              value={planName}
              onChangeText={planName => this.setState({ planName })}
            />
          )}

          <SelectModal
            // style={styles.input}
            dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
            placeholder={I18n.t(
              "main_category_screen_filters_title_categories"
            )}
            placeholderRenderer={({ placeholder }) => (
              <View style={{ flexDirection: "row" }}>
                <Text weight="Medium" style={{ color: colors.secondaryText }}>
                  {placeholder}
                </Text>
                <Text weight="Medium" style={{ color: colors.mainBlue }}>
                  *
                </Text>
              </View>
            )}
            selectedOption={selectedType}
            options={types}
            onOptionSelect={value => {
              this.onTypeSelect(value);
            }}
            hideAddNew={true}
          />

          {showFullForm && (
            <CustomTextInput
              placeholder={I18n.t("expense_forms_healthcare_for")}
              value={insuranceFor}
              onChangeText={insuranceFor => this.setState({ insuranceFor })}
            />
          )}
          {!showOnlyGeneralInfo && (
            <View>
              <SelectModal
                // style={styles.input}
                dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
                placeholder={I18n.t("expense_forms_extended_warranty_provider")}
                placeholderRenderer={({ placeholder }) => (
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      weight="Medium"
                      style={{ color: colors.secondaryText }}
                    >
                      {placeholder}
                    </Text>
                  </View>
                )}
                selectedOption={selectedProvider}
                textInputValue={providerName}
                options={insuranceProviders.map(provider => ({
                  ...provider,
                  image: `${API_BASE_URL}/providers/${provider.id}/images`
                }))}
                imageKey="image"
                onOptionSelect={value => {
                  this.onProviderSelect(value);
                }}
                onTextInputChange={text =>
                  this.setState({ selectedProvider: null, providerName: text })
                }
              />

              {showFullForm && (
                <CustomTextInput
                  placeholder={I18n.t("expense_forms_healthcare_policy")}
                  placeholder2={I18n.t(
                    "expense_forms_amc_form_amc_recommended"
                  )}
                  placeholder2Color={colors.mainBlue}
                  value={policyNo}
                  onChangeText={policyNo => this.setState({ policyNo })}
                />
              )}

              <CustomDatePicker
                date={effectiveDate}
                placeholder={I18n.t("expense_forms_healthcare_effective_date")}
                onDateChange={effectiveDate => {
                  this.setState({ effectiveDate });
                }}
              />

              {showFullForm && (
                <View>
                  <CustomTextInput
                    placeholder={I18n.t(
                      "expense_forms_healthcare_premium_amount"
                    )}
                    value={value > 0 ? String(value) : ""}
                    onChangeText={value => this.setState({ value })}
                    keyboardType="numeric"
                  />
                  <CustomTextInput
                    placeholder={I18n.t("expense_forms_healthcare_coverage")}
                    value={amountInsured > 0 ? String(amountInsured) : ""}
                    onChangeText={amountInsured =>
                      this.setState({ amountInsured })
                    }
                    keyboardType="numeric"
                  />
                </View>
              )}
            </View>
          )}
        </View>
        <UploadDoc
          placeholder={I18n.t("expense_forms_healthcare_upload_doc")}
          placeholder2={I18n.t("expense_forms_amc_form_amc_recommended")}
          placeholder2Color={colors.mainBlue}
          productId={productId}
          itemId={productId}
          jobId={jobId ? jobId : null}
          type={1}
          copies={copies}
          onUpload={uploadResult => {
            this.setState({
              copies: uploadResult.product.copies
            });
          }}
          navigator={this.props.navigator}
          hideUploadOption={showOnlyGeneralInfo}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderColor: "#eee",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  input: {
    // paddingVertical: 10,
    // borderColor: colors.lighterText,
    // borderBottomWidth: 2,
    // paddingTop: 20,
    // height: 50,
    marginBottom: 10
  },
  headerText: {
    fontSize: 18,
    flex: 1,
    marginBottom: 10
  }
});

export default HealthcareInsuranceForm;
