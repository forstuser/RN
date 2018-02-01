import React from "react";
import { StyleSheet, View, Image, Alert, TouchableOpacity } from "react-native";

import moment from "moment";

import { MAIN_CATEGORY_IDS } from "../../constants";
import {
  getReferenceDataBrands,
  getReferenceDataModels,
  getReferenceDataForCategory
} from "../../api";

import { Text } from "../../elements";
import SelectModal from "../../components/select-modal";
import { colors } from "../../theme";

import ContactFields from "../form-elements/contact-fields";
import CustomTextInput from "../form-elements/text-input";
import CustomDatePicker from "../form-elements/date-picker";
import HeaderWithUploadOption from "../form-elements/header-with-upload-option";

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
    this.updateStateFromProps(this.props);
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
      this.setState({
        types: res.categories[0].subCategories
      });
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
      showOnlyGeneralInfo = false
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
        <HeaderWithUploadOption
          title="Basic Details"
          textBeforeUpload="Upload Doc"
          textBeforeUpload2=" (recommended)"
          textBeforeUpload2Color={colors.mainBlue}
          productId={productId}
          itemId={insuranceId}
          jobId={jobId ? jobId : null}
          type={3}
          copies={copies}
          onUpload={uploadResult => {
            this.setState({
              insuranceId: uploadResult.insurance.id,
              copies: uploadResult.product.copies
            });
          }}
          navigator={this.props.navigator}
          hideUploadOption={showOnlyGeneralInfo}
        />
        <View style={styles.body}>
          <CustomTextInput
            placeholder="Plan Name"
            value={planName}
            onChangeText={planName => this.setState({ planName })}
          />

          <SelectModal
            style={styles.input}
            dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
            placeholder="Type"
            placeholderRenderer={({ placeholder }) => (
              <View style={{ flexDirection: "row" }}>
                <Text weight="Medium" style={{ color: colors.secondaryText }}>
                  {placeholder}
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

          <CustomTextInput
            placeholder="For (Self/Child/Wife/Parents/Family/Etc.)"
            value={insuranceFor}
            onChangeText={insuranceFor => this.setState({ insuranceFor })}
          />
          {!showOnlyGeneralInfo && (
            <View>
              <SelectModal
                style={styles.input}
                dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
                placeholder="Provider"
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
                options={insuranceProviders}
                onOptionSelect={value => {
                  this.onProviderSelect(value);
                }}
                onTextInputChange={text =>
                  this.setState({ selectedProvider: null, providerName: text })
                }
              />

              <CustomTextInput
                placeholder="Policy No"
                placeholder2=" (Recommended)"
                placeholder2Color={colors.mainBlue}
                value={policyNo}
                onChangeText={policyNo => this.setState({ policyNo })}
              />

              <CustomDatePicker
                date={effectiveDate}
                placeholder="Effective Date"
                onDateChange={effectiveDate => {
                  this.setState({ effectiveDate });
                }}
              />

              <CustomTextInput
                placeholder="Premium Amount"
                value={value > 0 ? String(value) : ""}
                onChangeText={value => this.setState({ value })}
                keyboardType="numeric"
              />

              <CustomTextInput
                placeholder="Coverage"
                value={amountInsured > 0 ? String(amountInsured) : ""}
                onChangeText={amountInsured => this.setState({ amountInsured })}
                keyboardType="numeric"
              />
            </View>
          )}
        </View>
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
    paddingVertical: 10,
    borderColor: colors.lighterText,
    borderBottomWidth: 2,
    paddingTop: 20,
    height: 50,
    marginBottom: 25
  }
});

export default HealthcareInsuranceForm;
