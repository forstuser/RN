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

class BasicDetailsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expenseName: "",
      subCategories: [],
      selectedSubCategory: null,
      date: null,
      value: "",
      nextDueDate: null,
      nextDueDateId: null,
      sellerName: "",
      sellerContact: ""
    };
  }

  componentDidMount() {}

  componentDidMount() {
    this.updateStateFromProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateStateFromProps(nextProps);
  }

  updateStateFromProps = props => {
    const {
      mainCategoryId,
      expenseName = "",
      date = null,
      nextDueDate = null,
      nextDueDateId = null,
      subCategories = [],
      subCategoryId = null,
      value = null,
      sellerName = "",
      sellerContact = "",
      copies = []
    } = props;

    let selectedSubCategory = null;
    if (subCategoryId) {
      selectedSubCategory = subCategories.find(
        subCategory => subCategory.id == subCategoryId
      );
    }

    if (mainCategoryId != MAIN_CATEGORY_IDS.HEALTHCARE) {
      this.setState({
        subCategories
      });
    }
    this.setState({
      expenseName,
      date,
      nextDueDate,
      nextDueDateId,
      selectedSubCategory,
      value,
      sellerName,
      sellerContact,
      copies
    });
  };

  getFilledData = () => {
    const { category } = this.props;
    const {
      expenseName,
      selectedSubCategory,
      date,
      nextDueDate,
      nextDueDateId,
      sellerName,
      value
    } = this.state;

    let metadata = [];
    //if utility bills
    if (this.props.categoryId == 634 && nextDueDate) {
      metadata.push({
        id: nextDueDateId,
        categoryFormId: 1099,
        value: nextDueDate,
        isNewValue: false
      });
    }

    let data = {
      productName: expenseName || category.name,
      purchaseDate: date,
      sellerName: sellerName,
      sellerContact: this.sellerContactRef.getFilledData(),
      subCategoryId: selectedSubCategory ? selectedSubCategory.id : undefined,
      value: value,
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
    const {
      mainCategoryId,
      categoryId,
      productId,
      jobId,
      category
    } = this.props;
    const {
      expenseName,
      date,
      nextDueDate,
      subCategories,
      selectedSubCategory,
      value,
      sellerName,
      sellerContact,
      copies
    } = this.state;
    return (
      <View style={styles.container}>
        <HeaderWithUploadOption
          title="Basic Details"
          textBeforeUpload="Upload Bill"
          textBeforeUpload2=" (recommended)"
          textBeforeUpload2Color={colors.mainBlue}
          productId={productId}
          itemId={productId}
          jobId={jobId ? jobId : null}
          copies={copies}
          type={1}
          onUpload={uploadResult => {
            console.log("upload result: ", uploadResult);
            this.setState({ copies: uploadResult.product.copies });
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
            value={value ? String(value) : ""}
            onChangeText={value => this.setState({ value })}
            keyboardType="numeric"
          />

          {/* if category is of 'utility' type */}
          {categoryId == 634 && (
            <CustomDatePicker
              date={nextDueDate}
              placeholder="Next Due Date"
              maxDate={null}
              onDateChange={nextDueDate => {
                this.setState({ nextDueDate });
              }}
            />
          )}

          <CustomTextInput
            placeholder="Seller Name"
            value={sellerName}
            onChangeText={sellerName => this.setState({ sellerName })}
          />
          <ContactFields
            ref={ref => (this.sellerContactRef = ref)}
            value={sellerContact}
            placeholder="Seller Contact"
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

export default BasicDetailsForm;
