import React from "react";
import { StyleSheet, View, Image, Alert, TouchableOpacity } from "react-native";

import moment from "moment";

import { MAIN_CATEGORY_IDS } from "../../constants";
import {
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
import HeaderWithUploadOption from "../form-elements/header-with-upload-option";

class MedicalDocForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productId: null,
      reportTitle: "",
      types: [],
      date: null,
      selectedType: null,
      doctorName: "",
      doctorContact: "",
      copies: [],
      isLoading: false
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
      productId,
      reportTitle = "",
      typeId,
      date = null,
      doctorName = "",
      doctorContact = "",
      copies = [],
      subCategories = []
    } = props;

    let selectedType = null;
    if (typeId) {
      selectedType = subCategories.find(type => type.id == typeId);
    }
    this.setState({
      productId,
      reportTitle,
      selectedType,
      date,
      doctorName,
      doctorContact,
      copies
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
    const { category } = this.props;
    const {
      productId,
      reportTitle,
      selectedType,
      date,
      doctorName,
      doctorContact,
      copies
    } = this.state;

    let data = {
      productId,
      productName: reportTitle || category.name,
      subCategoryId: selectedType ? selectedType.id : null,
      purchaseDate: date,
      sellerName: doctorName,
      sellerContact: this.doctorContactRef
        ? this.doctorContactRef.getFilledData()
        : undefined,
      copies
    };

    return data;
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
    const { jobId, subCategories, showFullForm = false } = this.props;
    const {
      productId,
      reportTitle,
      types,
      selectedType,
      date,
      doctorName,
      doctorContact,
      copies
    } = this.state;
    return (
      <View style={styles.container}>
        <HeaderWithUploadOption
          title={I18n.t("expense_forms_expense_basic_detail")}
          textBeforeUpload={I18n.t("expense_forms_healthcare_upload_doc")}
          textBeforeUpload2="*"
          textBeforeUpload2Color={colors.mainBlue}
          productId={productId}
          itemId={productId}
          jobId={jobId ? jobId : null}
          type={1}
          copies={copies}
          onUpload={uploadResult => {
            console.log("upload result: ", uploadResult);
            this.setState({ copies: uploadResult.product.copies });
          }}
          navigator={this.props.navigator}
        />
        <View style={styles.body}>
          {showFullForm && (
            <CustomTextInput
              placeholder={I18n.t("expense_forms_medical_doc_title")}
              value={reportTitle}
              onChangeText={reportTitle => this.setState({ reportTitle })}
            />
          )}

          <SelectModal
            // style={styles.input}
            dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
            placeholder={I18n.t("expense_forms_healthcare_type")}
            placeholderRenderer={({ placeholder }) => (
              <View style={{ flexDirection: "row" }}>
                <Text weight="Medium" style={{ color: colors.secondaryText }}>
                  {placeholder}
                </Text>
              </View>
            )}
            selectedOption={selectedType}
            options={subCategories}
            onOptionSelect={value => {
              this.onTypeSelect(value);
            }}
            hideAddNew={true}
          />

          <CustomDatePicker
            date={date}
            placeholder={I18n.t("expense_forms_expense_basic_expense_date")}
            onDateChange={date => {
              this.setState({ date });
            }}
          />

          {showFullForm && (
            <View>
              <CustomTextInput
                placeholder={I18n.t("expense_forms_medical_doc_doctor_name")}
                value={doctorName}
                onChangeText={doctorName => this.setState({ doctorName })}
              />

              <ContactFields
                ref={ref => (this.doctorContactRef = ref)}
                value={doctorContact}
                placeholder={I18n.t("expense_forms_medical_doc_doctor_contact")}
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

export default MedicalDocForm;
