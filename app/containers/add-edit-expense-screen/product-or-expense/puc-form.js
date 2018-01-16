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

import { MAIN_CATEGORY_IDS } from "../../../constants";
import { getReferenceDataBrands, getReferenceDataModels } from "../../../api";

import Icon from "react-native-vector-icons/Entypo";
import DatePicker from "react-native-datepicker";

import Collapsible from "../../../components/collapsible";
import UploadBillOptions from "../../../components/upload-bill-options";

import { Text } from "../../../elements";
import SelectModal from "../../../components/select-modal";
import { colors } from "../../../theme";

import ContactFields from "../form-elements/contact-fields";
import CustomTextInput from "../form-elements/text-input";
import CustomDatePicker from "../form-elements/date-picker";
import UploadDoc from "../form-elements/upload-doc";

class PucForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedDocId: null,
      isDocUploaded: false,
      effectiveDate: null,
      sellerName: "",
      sellerContact: "",
      amount: "",
      selectedRenewalType: null,
      renewalTypes: [
        { id: 1, name: "1 Month" },
        { id: 2, name: "2 Months" },
        { id: 3, name: "3 Months" },
        { id: 4, name: "4 Months" },
        { id: 5, name: "5 Months" },
        { id: 6, name: "6 Months" },
        { id: 7, name: "7 Months" },
        { id: 8, name: "8 Months" },
        { id: 9, name: "9 Months" }
      ]
    };
  }

  getFilledData = () => {
    const {
      uploadedDocId,
      effectiveDate,
      sellerName,
      amount,
      selectedRenewalType
    } = this.state;

    let data = {
      id: uploadedDocId,
      sellerName: sellerName,
      sellerContact: this.sellerContactRef.getFilledData(),
      value: amount,
      effectiveDate: effectiveDate,
      expiryPeriod: selectedRenewalType ? selectedRenewalType.id : null
    };

    return data;
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
      effectiveDate,
      sellerName,
      sellerContact,
      amount,
      renewalTypes,
      selectedRenewalType
    } = this.state;
    return (
      <Collapsible
        headerText="PUC (optional)"
        style={styles.container}
        headerStyle={styles.headerStyle}
        headerTextStyle={styles.headerTextStyle}
        icon="plus"
      >
        <View style={styles.innerContainer}>
          <View style={styles.body}>
            <CustomDatePicker
              date={effectiveDate}
              placeholder="PUC Effective Date "
              placeholder2="(Recommended)"
              placeholder2Color={colors.mainBlue}
              onDateChange={effectiveDate => {
                this.setState({ effectiveDate });
              }}
            />

            <SelectModal
              style={styles.input}
              dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
              placeholder="PUC Upto"
              placeholderRenderer={({ placeholder }) => (
                <Text weight="Medium" style={{ color: colors.secondaryText }}>
                  {placeholder}
                </Text>
              )}
              selectedOption={selectedRenewalType}
              options={renewalTypes}
              onOptionSelect={value => {
                this.onRenewalTypeSelect(value);
              }}
              hideAddNew={true}
            />

            <CustomTextInput
              placeholder="PUC Seller Name"
              style={styles.input}
              value={sellerName}
              onChangeText={sellerName => this.setState({ sellerName })}
            />

            <ContactFields
              ref={ref => (this.sellerContactRef = ref)}
              value={sellerContact}
              placeholder="PUC Seller Contact"
              style={styles.input}
            />

            <CustomTextInput
              placeholder="PUC Amount"
              style={styles.input}
              value={amount}
              onChangeText={amount => this.setState({ amount })}
            />

            <UploadDoc
              jobId={product.job_id}
              type={7}
              placeholder="Upload PUC Doc "
              placeholder2="(Recommended)"
              placeholder2Color={colors.mainBlue}
              placeholderAfterUpload="Doc Uploaded Successfully"
              navigator={this.props.navigator}
              onUpload={uploadResult => {
                console.log("upload result: ", uploadResult);
                this.setState({
                  isDocUploaded: true,
                  uploadedDocId: uploadResult.puc.id
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
    fontSize: 14,
    paddingVertical: 10,
    borderColor: colors.lighterText,
    borderBottomWidth: 2,
    height: 40,
    marginBottom: 32
  }
});

export default PucForm;
