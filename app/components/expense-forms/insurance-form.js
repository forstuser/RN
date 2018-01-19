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

import { MAIN_CATEGORY_IDS } from "../../constants";
import { getReferenceDataBrands, getReferenceDataModels } from "../../api";

import Collapsible from "../../components/collapsible";

import { Text } from "../../elements";
import SelectModal from "../../components/select-modal";
import { colors } from "../../theme";

import CustomTextInput from "../form-elements/text-input";
import CustomDatePicker from "../form-elements/date-picker";
import UploadDoc from "../form-elements/upload-doc";

class InsuranceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedDocId: null,
      isDocUploaded: false,
      effectiveDate: null,
      providers: [],
      selectedProvider: null,
      providerName: "",
      policyNo: "",
      amount: "",
      coverage: ""
    };
  }

  componentDidMount() {
    this.setState({
      providers: this.props.categoryReferenceData.insuranceProviders
    });
  }

  getFilledData = () => {
    const {
      uploadedDocId,
      effectiveDate,
      selectedProvider,
      providerName,
      policyNo,
      amount,
      coverage
    } = this.state;

    let data = {
      id: uploadedDocId,
      effectiveDate: effectiveDate,
      providerId: selectedProvider ? selectedProvider.id : null,
      providerName: providerName,
      policyNo: policyNo,
      value: amount,
      amountInsured: coverage
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

  render() {
    const { mainCategoryId, categoryId, product } = this.props;
    const {
      isDocUploaded,
      effectiveDate,
      providers,
      selectedProvider,
      providerName,
      policyNo,
      amount,
      coverage
    } = this.state;
    return (
      <Collapsible
        isCollapsed={false}
        isCollapsible={false}
        headerText={
          mainCategoryId == MAIN_CATEGORY_IDS.AUTOMOBILE
            ? "Insurance*"
            : "Insurance (If Applicable)"
        }
        style={styles.container}
        headerStyle={styles.headerStyle}
        headerTextStyle={styles.headerTextStyle}
      >
        <View style={styles.innerContainer}>
          <View style={styles.body}>
            <CustomDatePicker
              date={effectiveDate}
              placeholder="Effective Date "
              placeholder2="(Recommended)"
              placeholder2Color={colors.mainBlue}
              onDateChange={effectiveDate => {
                this.setState({ effectiveDate });
              }}
            />

            <SelectModal
              style={styles.input}
              dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
              placeholder="Insurance Provider"
              textInputPlaceholder="Enter Provider Name"
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
              selectedOption={selectedProvider}
              textInputValue={providerName}
              options={providers}
              onOptionSelect={value => {
                this.onProviderSelect(value);
              }}
              onTextInputChange={text => this.onProviderNameChange(text)}
            />

            <CustomTextInput
              placeholder="Insurance Policy No "
              placeholder2="(Recommended)"
              placeholder2Color={colors.mainBlue}
              style={styles.input}
              value={policyNo}
              onChangeText={policyNo => this.setState({ policyNo })}
            />
            <CustomTextInput
              placeholder="Insurance Premium Amount"
              style={styles.input}
              value={amount}
              onChangeText={amount => this.setState({ amount })}
            />

            <UploadDoc
              jobId={product.job_id}
              type={3}
              placeholder="Upload Policy Document "
              placeholder2="(Recommended)"
              placeholder2Color={colors.mainBlue}
              placeholderAfterUpload="Doc Uploaded Successfully"
              navigator={this.props.navigator}
              onUpload={uploadResult => {
                console.log("upload result: ", uploadResult);
                this.setState({
                  isDocUploaded: true,
                  uploadedDocId: uploadResult.insurance.id
                });
              }}
            />

            <CustomTextInput
              placeholder="Total Coverage"
              style={styles.input}
              value={coverage}
              onChangeText={coverage => this.setState({ coverage })}
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
    height: 60,
    marginBottom: 15
  }
});

export default InsuranceForm;
