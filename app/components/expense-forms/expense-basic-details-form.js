import React from "react";
import { StyleSheet, View, Image, Alert, TouchableOpacity } from "react-native";

import moment from "moment";

import { MAIN_CATEGORY_IDS } from "../../constants";
import { getReferenceDataBrands, getReferenceDataModels } from "../../api";

import { Text } from "../../elements";
import SelectModal from "../../components/select-modal";
import { colors } from "../../theme";
import { I18n } from "../../i18n";
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
      sellerContact: this.sellerContactRef
        ? this.sellerContactRef.getFilledData()
        : undefined,
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
      category,
      showFullForm = false
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
          title={I18n.t("expense_forms_expense_basic_detail")}
          textBeforeUpload={I18n.t("expense_forms_expense_basic_upload_bill")}
          textBeforeUpload2={I18n.t("expense_forms_amc_form_amc_recommended")}
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
              placeholder={I18n.t("expense_forms_expense_basic_expense")}
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

          {showFullForm && (
            <CustomTextInput
              placeholder={I18n.t("expense_forms_expense_basic_expense_name")}
              value={expenseName}
              onChangeText={expenseName => this.setState({ expenseName })}
              hint={I18n.t("expense_forms_expense_basic_expense_recommend")}
            />
          )}

          <CustomDatePicker
            date={date}
            placeholder={I18n.t("expense_forms_expense_basic_expense_date")}
            onDateChange={date => {
              this.setState({ date });
            }}
          />

          <CustomTextInput
            placeholder={I18n.t("expense_forms_expense_basic_expense_amount")}
            underlineColorAndroid="transparent"
            placeholder2="*"
            placeholder2Color={colors.mainBlue}
            value={value ? String(value) : ""}
            onChangeText={value => this.setState({ value })}
            keyboardType="numeric"
          />

          {/* if category is of 'utility' type */}
          {categoryId == 634 && (
            <CustomDatePicker
              date={nextDueDate}
              placeholder={I18n.t(
                "expense_forms_expense_basic_expense_next_date"
              )}
              maxDate={null}
              onDateChange={nextDueDate => {
                this.setState({ nextDueDate });
              }}
            />
          )}

          {showFullForm && (
            <View>
              <CustomTextInput
                placeholder={I18n.t(
                  "expense_forms_expense_basic_expense_seller_name"
                )}
                value={sellerName}
                onChangeText={sellerName => this.setState({ sellerName })}
              />
              <ContactFields
                ref={ref => (this.sellerContactRef = ref)}
                value={sellerContact}
                placeholder={I18n.t(
                  "expense_forms_expense_basic_expense_seller_contact"
                )}
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

export default BasicDetailsForm;
