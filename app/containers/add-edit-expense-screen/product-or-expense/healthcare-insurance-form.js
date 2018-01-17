import React from "react";
import { StyleSheet, View, Image, Alert, TouchableOpacity } from "react-native";

import moment from "moment";

import { MAIN_CATEGORY_IDS } from "../../../constants";
import { getReferenceDataBrands, getReferenceDataModels } from "../../../api";

import Icon from "react-native-vector-icons/Entypo";

import UploadBillOptions from "../../../components/upload-bill-options";

import { Text } from "../../../elements";
import SelectModal from "../../../components/select-modal";
import { colors } from "../../../theme";

import ContactFields from "../form-elements/contact-fields";
import CustomTextInput from "../form-elements/text-input";
import CustomDatePicker from "../form-elements/date-picker";
import HeaderWithUploadOption from "../form-elements/header-with-upload-option";

const AttachmentIcon = () => (
  <Icon name="attachment" size={20} color={colors.pinkishOrange} />
);

class HealthcareInsuranceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isBillUploaded: false,
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
      policyNo: "",
      effectiveDate: null,
      amount: "",
      amountInsured: ""
    };
  }

  componentDidMount() {
    this.setState({
      providers: this.props.categoryReferenceData.insuranceProviders
    });
  }

  getFilledData = () => {
    const {
      planName,
      selectedType,
      insuranceFor,
      selectedProvider,
      providerName,
      policyNo,
      effectiveDate,
      amount,
      amountInsured
    } = this.state;

    let data = {
      productName: planName + (insuranceFor ? `(${insuranceFor})` : ``),
      subCategoryId: selectedType ? selectedType.id : null,
      insurance: {
        effectiveDate: effectiveDate,
        providerId: selectedProvider ? selectedProvider.id : null,
        providerName: providerName,
        policyNo: policyNo,
        value: amount,
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
    const { mainCategoryId, categoryId, product } = this.props;
    const {
      isBillUploaded,
      planName,
      types,
      selectedType,
      insuranceFor,
      providers,
      selectedProvider,
      providerName,
      policyNo,
      effectiveDate,
      amount,
      amountInsured
    } = this.state;
    return (
      <View style={styles.container}>
        <HeaderWithUploadOption
          title="Basic Details"
          textBeforeUpload="Upload Doc"
          textBeforeUpload2=" (recommended)"
          textBeforeUpload2Color={colors.mainBlue}
          jobId={product ? product.job_id : null}
          type={1}
          onUpload={uploadResult => {
            console.log("product: ", product);
            console.log("upload result: ", uploadResult);
            this.setState({ isBillUploaded: true });
          }}
          navigator={this.props.navigator}
        />
        <View style={styles.body}>
          <CustomTextInput
            placeholder="Plan Name"
            style={styles.input}
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
            placeholder="For"
            style={styles.input}
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
            style={styles.input}
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
            style={styles.input}
            value={amount}
            onChangeText={amount => this.setState({ amount })}
          />

          <CustomTextInput
            placeholder="Coverage"
            style={styles.input}
            value={amountInsured}
            onChangeText={amountInsured => this.setState({ amountInsured })}
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
    fontSize: 14,
    paddingVertical: 10,
    borderColor: colors.lighterText,
    borderBottomWidth: 2,
    height: 40,
    marginBottom: 32
  }
});

export default HealthcareInsuranceForm;
