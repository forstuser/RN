import React from "react";
import { StyleSheet, View, Image, Alert, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";

import { API_BASE_URL } from "../../api";
import { MAIN_CATEGORY_IDS, CATEGORY_IDS } from "../../constants";
import { getReferenceDataBrands, getReferenceDataModels } from "../../api";
import I18n from "../../i18n";
import { Text } from "../../elements";
import SelectModal from "../../components/select-modal";
import { colors } from "../../theme";

import ContactFields from "../form-elements/contact-fields";
import CustomTextInput from "../form-elements/text-input";
import CustomDatePicker from "../form-elements/date-picker";
import UploadDoc from "../form-elements/upload-doc";
class BasicDetailsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      productName: "",
      subCategories: [],
      selectedSubCategory: null,
      brands: [],
      selectedBrand: null,
      brandName: "",
      categoryFormIdForModelName: null,
      models: [],
      selectedModel: null,
      modelName: "",
      purchaseDate: null,
      value: "",
      sellerName: "",
      sellerContact: "",
      vinNo: "",
      registrationNo: "",
      imeiNo: "",
      serialNo: "",
      vinNoId: null,
      registrationNoId: null,
      imeiNoId: null,
      serialNoId: null
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
      id,
      productName,
      subCategories,
      subCategoryId,
      brands,
      brandId,
      modelName,
      purchaseDate,
      value,
      sellerName,
      sellerContact,
      vinNo,
      registrationNo,
      imeiNo,
      serialNo,
      vinNoId,
      registrationNoId,
      imeiNoId,
      serialNoId,
      copies
    } = props;

    if (!this.state.selectedBrand && !this.state.brandName) {
      if (brandId > 0) {
        const selectedBrand = brands.find(brand => brand.id == brandId);
        this.setState({ selectedBrand }, () => this.fetchModels());
      } else if (brandId == 0) {
        this.setState({ selectedBrand: { id: 0, name: "Non Branded" } });
      }
    }

    if (subCategoryId && !this.state.selectedSubCategory) {
      const selectedSubCategory = subCategories.find(
        subCategory => subCategory.id == subCategoryId
      );
      this.setState({ selectedSubCategory });
    }

    this.setState({
      id,
      productName,
      modelName,
      purchaseDate,
      value,
      sellerName,
      sellerContact,
      vinNo,
      registrationNo,
      imeiNo,
      serialNo,
      vinNoId,
      registrationNoId,
      imeiNoId,
      serialNoId,
      copies
    });
  };

  getFilledData = () => {
    const { category } = this.props;
    const {
      productName,
      selectedSubCategory,
      selectedBrand,
      brandName,
      selectedModel,
      modelName,
      purchaseDate,
      value,
      sellerName,
      vinNo,
      registrationNo,
      imeiNo,
      serialNo,
      vinNoId,
      registrationNoId,
      imeiNoId,
      serialNoId
    } = this.state;

    let metadata = [];

    const { mainCategoryId } = this.props;
    const categoryForms = this.props.categoryForms;

    if (mainCategoryId == MAIN_CATEGORY_IDS.AUTOMOBILE) {
      if (registrationNo) {
        const registrationNoCategoryForm = categoryForms.find(
          categoryForm => categoryForm.title == "Registration Number"
        );
        registrationNoCategoryForm &&
          metadata.push({
            id: registrationNoId,
            categoryFormId: registrationNoCategoryForm.id,
            value: registrationNo,
            isNewValue: false
          });
      }

      if (vinNo) {
        const vinNoCategoryForm = categoryForms.find(
          categoryForm => categoryForm.title.toLowerCase() == "vin"
        );
        vinNoCategoryForm &&
          metadata.push({
            id: vinNoId,
            categoryFormId: vinNoCategoryForm.id,
            value: vinNo,
            isNewValue: false
          });
      }
    } else if (mainCategoryId == MAIN_CATEGORY_IDS.ELECTRONICS) {
      if (this.props.categoryId == 327 && imeiNo) {
        const imeiNoCategoryForm = categoryForms.find(
          categoryForm => categoryForm.title == "IMEI Number"
        );

        imeiNoCategoryForm &&
          metadata.push({
            id: imeiNoId,
            categoryFormId: imeiNoCategoryForm.id,
            value: imeiNo,
            isNewValue: false
          });
      } else if (serialNo) {
        const serialNoCategoryForm = categoryForms.find(
          categoryForm => categoryForm.title == "Serial Number"
        );
        serialNoCategoryForm &&
          metadata.push({
            id: serialNoId,
            categoryFormId: serialNoCategoryForm.id,
            value: serialNo,
            isNewValue: false
          });
      }
    }

    let productNameFromBrandAndModel = "";
    if (selectedBrand) {
      productNameFromBrandAndModel = selectedBrand.name;
    } else if (brandName) {
      productNameFromBrandAndModel = brandName;
    }

    if (selectedModel) {
      productNameFromBrandAndModel =
        productNameFromBrandAndModel + " " + selectedModel.title;
    } else if (modelName) {
      productNameFromBrandAndModel =
        productNameFromBrandAndModel + " " + modelName;
    } else {
      productNameFromBrandAndModel =
        productNameFromBrandAndModel + " " + category.name;
    }

    let data = {
      productName: productName || productNameFromBrandAndModel.trim(),
      purchaseDate: purchaseDate,
      sellerName: sellerName,
      sellerContact: this.sellerContactRef
        ? this.sellerContactRef.getFilledData()
        : undefined,
      subCategoryId: selectedSubCategory ? selectedSubCategory.id : undefined,
      brandId: selectedBrand ? selectedBrand.id : undefined,
      brandName: brandName,
      value: value,
      model: selectedModel ? selectedModel.title : modelName,
      isNewModel: selectedModel ? false : true,
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

  toggleNonBranded = () => {
    const newState = {
      brandName: "",
      models: [],
      modelName: "",
      selectedModel: null
    };
    if (this.state.selectedBrand && this.state.selectedBrand.id == 0) {
      newState.selectedBrand = null;
    } else {
      newState.selectedBrand = { id: 0, name: "Non Branded" };
    }
    this.setState(newState, () => {
      console.log("brand: ", this.state.selectedBrand);
    });
  };

  onBrandSelect = brand => {
    if (this.state.selectedBrand && this.state.selectedBrand.id == brand.id) {
      return;
    }
    this.setState(
      {
        selectedBrand: brand,
        brandName: "",
        models: [],
        modelName: "",
        selectedModel: null
      },
      () => this.fetchModels()
    );
  };

  onBrandNameChange = text => {
    this.setState({
      brandName: text,
      selectedBrand: null,
      models: [],
      modelName: "",
      selectedModel: null
    });
  };

  fetchModels = async () => {
    if (this.state.selectedBrand) {
      try {
        const models = await getReferenceDataModels(
          this.props.categoryId,
          this.state.selectedBrand.id
        );
        this.setState({ models });
      } catch (e) {
        Alert.alert(e.message);
      }
    }
  };

  onModelSelect = model => {
    if (this.state.selectedModel && this.state.selectedModel.id == model.id) {
      return;
    }

    if (typeof this.props.setWarrantyTypesOnModelSelect == "function") {
      this.props.setWarrantyTypesOnModelSelect({
        warrantyRenewalTypeId: model.warranty_renewal_type,
        dualWarrantyRenewalTypeId: model.dual_renewal_type
      });
    }

    this.setState({
      selectedModel: model,
      modelName: ""
    });
  };

  onModelNameChange = text => {
    this.setState({
      modelName: text,
      selectedModel: null
    });
  };

  render() {
    const {
      mainCategoryId,
      categoryId,
      jobId = null,
      navigator,
      subCategories,
      brands,
      category,
      showFullForm = false
    } = this.props;
    const {
      id,
      productName,
      selectedSubCategory,
      selectedBrand,
      brandName,
      models,
      selectedModel,
      modelName,
      purchaseDate,
      value,
      sellerName,
      sellerContact,
      vinNo,
      registrationNo,
      imeiNo,
      serialNo,
      copies
    } = this.state;
    return (
      <View style={styles.container}>
        <Text weight="Medium" style={styles.headerText}>{I18n.t("expense_forms_expense_basic_detail")}</Text>
        <View style={styles.body}>
          {showFullForm && (
            <CustomTextInput
              placeholder={I18n.t("expense_forms_product_basics_name")}
              value={productName}
              onChangeText={productName => this.setState({ productName })}
              hint={I18n.t("expense_forms_expense_basic_expense_recommend")}
            />
          )}

          {categoryId == CATEGORY_IDS.FURNITURE.FURNITURE && (
            <View>
              <SelectModal
                // style={styles.input}
                dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
                placeholder={I18n.t("add_edit_direct_type")}
                placeholderRenderer={({ placeholder }) => (
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      weight="Medium"
                      style={{ color: colors.secondaryText }}
                    >
                      {placeholder}
                    </Text>
                    <Text weight="Medium" style={{ color: colors.mainBlue }}>
                      *
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
              <View>
                <TouchableOpacity
                  style={{
                    paddingTop: 10,
                    paddingBottom:
                      selectedBrand != null && selectedBrand.id == 0 ? 30 : 10,
                    flexDirection: "row"
                  }}
                  onPress={this.toggleNonBranded}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 3,
                      borderWidth: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      borderColor:
                        selectedBrand != null && selectedBrand.id == 0
                          ? colors.pinkishOrange
                          : colors.secondaryText
                    }}
                  >
                    {selectedBrand != null &&
                      selectedBrand.id == 0 && (
                        <Icon
                          name="md-checkmark"
                          size={16}
                          color={colors.pinkishOrange}
                        />
                      )}
                  </View>

                  <Text weight="Medium" style={{ marginLeft: 8, flex: 1 }}>
                    Non Branded
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {(!selectedBrand ||
            (selectedBrand && selectedBrand.id != 0) ||
            categoryId != CATEGORY_IDS.FURNITURE.FURNITURE) && (
              <SelectModal
                // style={styles.input}
                dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
                placeholder={I18n.t("expense_forms_product_basics_name_brand")}
                textInputPlaceholder={I18n.t(
                  "expense_forms_product_basics_brand_name"
                )}
                placeholderRenderer={({ placeholder }) => (
                  <View style={{ flexDirection: "row" }}>
                    <Text weight="Medium" style={{ color: colors.secondaryText }}>
                      {placeholder}
                    </Text>
                    {categoryId != CATEGORY_IDS.FURNITURE.FURNITURE && (
                      <Text weight="Medium" style={{ color: colors.mainBlue }}>
                        *
                    </Text>
                    )}
                  </View>
                )}
                selectedOption={selectedBrand}
                textInputValue={brandName}
                options={brands.map(brand => ({
                  ...brand,
                  image: `${API_BASE_URL}/brands/${brand.id}/images`
                }))}
                imageKey="image"
                onOptionSelect={value => {
                  this.onBrandSelect(value);
                }}
                onTextInputChange={text => this.onBrandNameChange(text)}
              />
            )}

          {(mainCategoryId == MAIN_CATEGORY_IDS.AUTOMOBILE ||
            mainCategoryId == MAIN_CATEGORY_IDS.ELECTRONICS) && (
              <SelectModal
                // style={styles.input}
                visibleKey="title"
                dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
                placeholder={I18n.t("expense_forms_product_basics_model")}
                textInputPlaceholder={I18n.t(
                  "expense_forms_product_basics_enter_model"
                )}
                placeholderRenderer={({ placeholder }) => (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center"
                    }}
                  >
                    <Text weight="Medium" style={{ color: colors.secondaryText }}>
                      {placeholder}
                    </Text>
                    <Text style={{ color: colors.mainBlue, fontSize: 12 }}>
                      {" "}
                      (Required for calculating warranty)
                  </Text>
                  </View>
                )}
                options={models}
                beforeModalOpen={() => {
                  if (selectedBrand || brandName) {
                    return true;
                  }
                  Alert.alert(
                    I18n.t("expense_forms_product_basics_select_brand_first")
                  );
                  return false;
                }}
                selectedOption={selectedModel}
                textInputValue={modelName}
                onOptionSelect={value => {
                  this.onModelSelect(value);
                }}
                onTextInputChange={text => this.setState({ modelName: text })}
              />
            )}

          {showFullForm && (
            <View>
              {categoryId == 327 && (
                <CustomTextInput
                  placeholder={I18n.t("expense_forms_product_basics_imei")}
                  placeholder2={I18n.t(
                    "expense_forms_amc_form_amc_recommended"
                  )}
                  placeholder2Color={colors.mainBlue}
                  value={imeiNo}
                  onChangeText={imeiNo => this.setState({ imeiNo })}
                />
              )}

              {mainCategoryId == MAIN_CATEGORY_IDS.ELECTRONICS &&
                categoryId != 327 && (
                  <CustomTextInput
                    placeholder={I18n.t("expense_forms_product_basics_serial")}
                    placeholder2={I18n.t(
                      "expense_forms_amc_form_amc_recommended"
                    )}
                    placeholder2Color={colors.mainBlue}
                    value={serialNo}
                    onChangeText={serialNo => this.setState({ serialNo })}
                  />
                )}

              {mainCategoryId == MAIN_CATEGORY_IDS.AUTOMOBILE && (
                <View>
                  <CustomTextInput
                    placeholder={I18n.t("expense_forms_product_basics_vin_no")}
                    value={vinNo}
                    onChangeText={vinNo => this.setState({ vinNo })}
                  />
                  <CustomTextInput
                    placeholder={I18n.t(
                      "expense_forms_product_basics_registration_no"
                    )}
                    placeholder2={I18n.t(
                      "expense_forms_amc_form_amc_recommended"
                    )}
                    placeholder2Color={colors.mainBlue}
                    value={registrationNo}
                    onChangeText={registrationNo =>
                      this.setState({ registrationNo })
                    }
                  />
                </View>
              )}
            </View>
          )}
          <CustomDatePicker
            date={purchaseDate}
            placeholder={I18n.t("expense_forms_product_basics_purchase_date")}
            onDateChange={purchaseDate => {
              this.setState({ purchaseDate });
            }}
          />

          {showFullForm && (
            <View>
              <CustomTextInput
                placeholder={I18n.t(
                  "expense_forms_product_basics_purchase_amount"
                )}
                value={value ? String(value) : ""}
                onChangeText={value => this.setState({ value })}
                keyboardType="numeric"
              />

              <CustomTextInput
                placeholder={I18n.t("expense_forms_product_basics_seller_name")}
                value={sellerName}
                onChangeText={sellerName => this.setState({ sellerName })}
              />

              <ContactFields
                ref={ref => (this.sellerContactRef = ref)}
                value={sellerContact}
                placeholder={I18n.t(
                  "expense_forms_product_basics_seller_contact"
                )}
                keyboardType="numeric"
              />
            </View>
          )}
        </View>
        <UploadDoc
          // title={I18n.t("expense_forms_expense_basic_detail")}
          placeholder={I18n.t("expense_forms_expense_basic_upload_bill")}
          placeholder2={I18n.t("expense_forms_amc_form_amc_recommended")}
          placeholder2Color={colors.mainBlue}
          productId={id}
          itemId={id}
          jobId={jobId}
          type={1}
          copies={copies}
          onUpload={uploadResult => {
            this.setState({
              id: uploadResult.product.id,
              copies: uploadResult.product.copies
            });
          }}
          navigator={this.props.navigator}
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
    paddingVertical: 10,
    borderColor: colors.lighterText,
    borderBottomWidth: 2,
    paddingTop: 20,
    height: 50,
    marginBottom: 25
  },
  headerText: {
    fontSize: 18,
    flex: 1,
    marginBottom: 10
  },
});

export default BasicDetailsForm;
