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

class BasicDetailsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isBillUploaded: false,
      expenseName: "",
      subCategories: [],
      selectedSubCategory: null,
      date: null,
      amount: "",
      nextDueDate: null,
      sellerName: "",
      sellerContact: ""
    };
  }

  componentDidMount() {
    if (this.props.mainCategoryId != MAIN_CATEGORY_IDS.HEALTHCARE) {
      this.setState({
        subCategories: this.props.categoryReferenceData.subCategories
      });
    }
  }

  getFilledData = () => {
    const {
      expenseName,
      selectedSubCategory,
      date,
      nextDueDate,
      sellerName,
      amount
    } = this.state;

    let metadata = [];
    //if utility bills
    if (this.props.categoryId == 634 && nextDueDate) {
      metadata.push({
        categoryFormId: 1099,
        value: nextDueDate,
        isNewValue: false
      });
    }

    let data = {
      productName: expenseName,
      purchaseDate: date,
      sellerName: sellerName,
      sellerContact: this.sellerContactRef.getFilledData(),
      subCategoryId: selectedSubCategory ? selectedSubCategory.id : undefined,
      value: amount,
      metadata: metadata
    };

    return data;
  };

  onSubCategorySelect = subCategory => {
    if (
      this.state.selectedSubCategory &&
      this.state.selectedSubCategory.id == subCategory.id
    ) {
      return;
    }
    this.setState({
      selectedSubCategory: subCategory
    });
  };

  render() {
    const { mainCategoryId, categoryId, product } = this.props;
    const {
      isBillUploaded,
      expenseName,
      date,
      nextDueDate,
      subCategories,
      selectedSubCategory,
      amount,
      sellerName,
      sellerContact
    } = this.state;
    return (
      <View style={styles.container}>
        <HeaderWithUploadOption
          title="Basic Details"
          textBeforeUpload="Upload Bill"
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
          {subCategories.length > 0 && (
            <SelectModal
              style={styles.input}
              dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
              placeholder="Expense Type"
              placeholderRenderer={({ placeholder }) => (
                <View style={{ flexDirection: "row" }}>
                  <Text weight="Medium" style={{ color: colors.secondaryText }}>
                    {placeholder}
                  </Text>
                </View>
              )}
              selectedOption={selectedSubCategory}
              options={subCategories}
              onOptionSelect={value => {
                this.onSubCategorySelect(value);
              }}
              hideAddNew={true}
            />
          )}

          <CustomTextInput
            placeholder="Expense Name"
            style={styles.input}
            value={expenseName}
            onChangeText={expenseName => this.setState({ expenseName })}
          />

          <CustomDatePicker
            date={date}
            placeholder="Date"
            placeholder2="*"
            placeholder2Color={colors.mainBlue}
            onDateChange={date => {
              this.setState({ date });
            }}
          />

          <CustomTextInput
            placeholder="Amount"
            style={styles.input}
            value={amount}
            onChangeText={amount => this.setState({ amount })}
          />

          {/* if category is of 'utility' type */}
          {categoryId == 634 && (
            <CustomDatePicker
              date={nextDueDate}
              placeholder="Next Due Date"
              onDateChange={nextDueDate => {
                this.setState({ nextDueDate });
              }}
            />
          )}

          <CustomTextInput
            placeholder="Seller Name"
            style={styles.input}
            value={sellerName}
            onChangeText={sellerName => this.setState({ sellerName })}
          />
          <ContactFields
            ref={ref => (this.sellerContactRef = ref)}
            value={sellerContact}
            placeholder="Seller Contact"
            style={styles.input}
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

export default BasicDetailsForm;
