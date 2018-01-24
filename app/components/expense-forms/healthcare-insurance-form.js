import React from "react";
import { StyleSheet, View, Image, Alert, TouchableOpacity } from "react-native";

import moment from "moment";

import { MAIN_CATEGORY_IDS } from "../../constants";
import { getReferenceDataBrands, getReferenceDataModels } from "../../api";

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
      types: [
        {
          id: 708,
          name: "Health Insurance"
        },
        {
          id: 725,
          name: "Life Insurance"
        }
      ],
      selectedType: null,
      providers: [],
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
    this.updateStateFromProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateStateFromProps(nextProps);
  }

  updateStateFromProps = props => {
    const {
      typeId,
      productId,
      jobId,
      planName,
      insuranceFor,
      insuranceId,
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

  getFilledData = () => {
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
      productName: planName,
      model: insuranceFor,
      isNewModel: false,
      subCategoryId: selectedType ? selectedType.id : null,
      insurance: {
        id: insuranceId,
        effectiveDate: effectiveDate,
        providerId: selectedProvider ? selectedProvider.id : null,
        providerName: providerName,
        policyNo: policyNo,
        value: value,
        amountInsured: amountInsured
      }
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

  onTypeSelect = type => {
    if (this.state.selectedType && this.state.selectedTyper.id == type.id) {
      return;
    }
    this.setState({
      selectedType: type
    });
  };

  render() {
    const { mainCategoryId, categoryId, jobId } = this.props;
    const {
      productId,
      planName,
      types,
      selectedType,
      insuranceFor,
      providers,
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
          itemId={productId}
          jobId={jobId ? jobId : null}
          type={1}
          copies={copies}
          onUpload={uploadResult => {
            console.log("product: ", product);
            console.log("upload result: ", uploadResult);
            this.setState({ copies: uploadResult.product.copies });
          }}
          navigator={this.props.navigator}
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

          <SelectModal
            style={styles.input}
            dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
            placeholder="Provider"
            placeholderRenderer={({ placeholder }) => (
              <View style={{ flexDirection: "row" }}>
                <Text weight="Medium" style={{ color: colors.secondaryText }}>
                  {placeholder}
                </Text>
              </View>
            )}
            selectedOption={selectedProvider}
            textInputValue={providerName}
            options={providers}
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
    height: 60,
    marginBottom: 15
  }
});

export default HealthcareInsuranceForm;
