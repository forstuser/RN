import React from "react";
import { StyleSheet, View, Image, Alert, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";

import { API_BASE_URL } from "../../api";
import {
  MAIN_CATEGORY_IDS,
  CATEGORY_IDS,
  METADATA_KEYS
} from "../../constants";
import { getReferenceDataBrands, getReferenceDataModels } from "../../api";
import I18n from "../../i18n";
import { Text } from "../../elements";
import SelectModal from "../../components/select-modal";
import { colors } from "../../theme";
import { showSnackbar } from "../../utils/snackbar";

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
      sellerAddress: "",
      sellerContact: "",
      chasisNumber: "",
      registrationNo: "",
      imeiNo: "",
      serialNo: "",
      chasisNumberId: null,
      registrationNoId: null,
      imeiNoId: null,
      serialNoId: null
    };
  }

  componentDidMount() {
    this.updateStateFromProps(this.props);
    const { copies } = this.props;
    this.setState({
      copies: copies || []
    });
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
      sellerAddress,
      sellerContact,
      chasisNumber,
      registrationNo,
      imeiNo,
      serialNo,
      chasisNumberId,
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
        this.setState({ selectedBrand: { id: 0, name: "Unbranded" } });
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
      sellerAddress,
      sellerContact,
      chasisNumber,
      registrationNo,
      imeiNo,
      serialNo,
      chasisNumberId,
      registrationNoId,
      imeiNoId,
      serialNoId
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
      sellerAddress,
      chasisNumber,
      registrationNo,
      imeiNo,
      serialNo,
      chasisNumberId,
      registrationNoId,
      imeiNoId,
      serialNoId
    } = this.state;

    let metadata = [];

    const { mainCategoryId } = this.props;
    const categoryForms = this.props.categoryForms;

    if (mainCategoryId == MAIN_CATEGORY_IDS.AUTOMOBILE) {
      const registrationNoCategoryForm = categoryForms.find(
        categoryForm => categoryForm.title == METADATA_KEYS.REGISTRATION_NUMBER
      );
      registrationNoCategoryForm &&
        metadata.push({
          id: registrationNoId,
          categoryFormId: registrationNoCategoryForm.id,
          value: registrationNo,
          isNewValue: false
        });
      const chasisNumberCategoryForm = categoryForms.find(categoryForm => {
        console.log(categoryForm.title, "cat for title ---------");
        console.log(METADATA_KEYS.CHASIS_NUMBER, "MET KEY FOR CHASIS NUMBER");
        categoryForm.title.toLowerCase() == METADATA_KEYS.CHASIS_NUMBER;
      });
      chasisNumberCategoryForm &&
        metadata.push({
          id: chasisNumberId,
          categoryFormId: chasisNumberCategoryForm.id,
          value: chasisNumber,
          isNewValue: false
        });
    } else if (mainCategoryId == MAIN_CATEGORY_IDS.ELECTRONICS) {
      if (this.props.categoryId == CATEGORY_IDS.ELECTRONICS.MOBILE) {
        const imeiNoCategoryForm = categoryForms.find(
          categoryForm => categoryForm.title == METADATA_KEYS.IMEI_NUMBER
        );

        imeiNoCategoryForm &&
          metadata.push({
            id: imeiNoId,
            categoryFormId: imeiNoCategoryForm.id,
            value: imeiNo,
            isNewValue: false
          });
      } else {
        const serialNoCategoryForm = categoryForms.find(
          categoryForm => categoryForm.title == METADATA_KEYS.SERIAL_NUMBER
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
      sellerAddress: sellerAddress,
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
      newState.selectedBrand = { id: 0, name: "Unbranded" };
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
        let catID = this.props.categoryId;
        if (this.props.mainCategoryId == MAIN_CATEGORY_IDS.E_E) {
          catID = this.props.subCategoryId;
        }
        const models = await getReferenceDataModels(
          catID,
          this.state.selectedBrand.id
        );
        this.setState({ models });
      } catch (e) {
        showSnackbar({
          text: e.message
        });
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
      navigation,
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
      sellerAddress,
      sellerContact,
      chasisNumber,
      registrationNo,
      imeiNo,
      serialNo,
      copies
    } = this.state;

    console.log("categoryId:", categoryId);

    return (
      <View collapsable={false} style={styles.container}>
        <Text weight="Medium" style={styles.headerText}>
          {I18n.t("expense_forms_expense_basic_detail")}
        </Text>
        <View collapsable={false} style={styles.body}>
          {(showFullForm || mainCategoryId == MAIN_CATEGORY_IDS.FASHION) && (
            <CustomTextInput
              placeholder={I18n.t("expense_forms_product_basics_name")}
              value={productName}
              maxLength={20}
              onChangeText={productName => this.setState({ productName })}
              hint={I18n.t("expense_forms_expense_basic_expense_recommend")}
            />
          )}
          {categoryId == CATEGORY_IDS.FURNITURE.FURNITURE && (
            <SelectModal
              dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
              placeholder={I18n.t("add_edit_direct_type")}
              placeholderRenderer={({ placeholder }) => (
                <View collapsable={false} style={{ flexDirection: "row" }}>
                  <Text weight="Medium" style={{ color: colors.secondaryText }}>
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
          )}
          {(categoryId == CATEGORY_IDS.FURNITURE.FURNITURE ||
            mainCategoryId == MAIN_CATEGORY_IDS.FASHION) && (
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
                collapsable={false}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 3,
                  borderWidth: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  borderColor:
                    selectedBrand && selectedBrand.id == 0
                      ? colors.pinkishOrange
                      : colors.secondaryText
                }}
              >
                {selectedBrand &&
                  selectedBrand.id == 0 && (
                    <Icon
                      name="md-checkmark"
                      size={16}
                      color={colors.pinkishOrange}
                    />
                  )}
              </View>

              <Text weight="Medium" style={{ marginLeft: 8, flex: 1 }}>
                Unbranded
              </Text>
            </TouchableOpacity>
          )}

          {(!selectedBrand ||
            (selectedBrand && selectedBrand.id != 0) ||
            (categoryId != CATEGORY_IDS.FURNITURE.FURNITURE &&
              mainCategoryId != MAIN_CATEGORY_IDS.FASHION)) && (
            <SelectModal
              // style={styles.input}
              dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
              placeholder={I18n.t("expense_forms_product_basics_name_brand")}
              textInputPlaceholder={I18n.t(
                "expense_forms_product_basics_brand_name"
              )}
              placeholderRenderer={({ placeholder }) => (
                <View collapsable={false} style={{ flexDirection: "row" }}>
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
                  collapsable={false}
                  style={{
                    flexDirection: "row",
                    alignItems: "center"
                  }}
                >
                  <Text weight="Medium" style={{ color: colors.secondaryText }}>
                    {placeholder}
                  </Text>
                </View>
              )}
              hint="Required for warranty calculation"
              options={models}
              beforeModalOpen={() => {
                if (selectedBrand || brandName) {
                  return true;
                }
                showSnackbar({
                  text: I18n.t(
                    "expense_forms_product_basics_select_brand_first"
                  )
                });
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

          {showFullForm ? (
            <View collapsable={false}>
              {categoryId == 327 && (
                <CustomTextInput
                  placeholder={I18n.t("expense_forms_product_basics_imei")}
                  hint={I18n.t("expense_forms_amc_form_amc_recommended")}
                  placeholder2Color={colors.mainBlue}
                  value={imeiNo}
                  onChangeText={imeiNo => this.setState({ imeiNo })}
                />
              )}

              {mainCategoryId == MAIN_CATEGORY_IDS.ELECTRONICS &&
                categoryId != 327 && (
                  <CustomTextInput
                    placeholder={I18n.t("expense_forms_product_basics_serial")}
                    hint={I18n.t("expense_forms_amc_form_amc_recommended")}
                    placeholder2Color={colors.mainBlue}
                    value={serialNo}
                    onChangeText={serialNo => this.setState({ serialNo })}
                  />
                )}

              {mainCategoryId == MAIN_CATEGORY_IDS.AUTOMOBILE ? (
                <View collapsable={false}>
                  <CustomTextInput
                    placeholder={I18n.t(
                      "expense_forms_product_basics_chasis_no"
                    )}
                    value={chasisNumber}
                    onChangeText={chasisNumber =>
                      this.setState({ chasisNumber })
                    }
                  />
                  <CustomTextInput
                    placeholder={I18n.t(
                      "expense_forms_product_basics_registration_no"
                    )}
                    hint={I18n.t("expense_forms_amc_form_amc_recommended")}
                    placeholder2Color={colors.mainBlue}
                    value={registrationNo}
                    onChangeText={registrationNo =>
                      this.setState({ registrationNo })
                    }
                  />
                </View>
              ) : (
                <View collapsable={false} />
              )}
            </View>
          ) : (
            <View collapsable={false} />
          )}
          <CustomDatePicker
            date={purchaseDate}
            placeholder={I18n.t("expense_forms_product_basics_purchase_date")}
            onDateChange={purchaseDate => {
              this.setState({ purchaseDate });
            }}
          />
          {showFullForm || mainCategoryId == MAIN_CATEGORY_IDS.FASHION ? (
            <CustomTextInput
              placeholder={I18n.t(
                "expense_forms_product_basics_purchase_amount"
              )}
              value={value ? String(value) : ""}
              onChangeText={value => this.setState({ value })}
              keyboardType="numeric"
            />
          ) : (
            <View collapsable={false} />
          )}
          {showFullForm ? (
            <View collapsable={false}>
              <CustomTextInput
                placeholder={I18n.t("expense_forms_product_basics_seller_name")}
                value={sellerName}
                onChangeText={sellerName => this.setState({ sellerName })}
              />
              <CustomTextInput
                placeholder={"Seller Address"}
                value={sellerAddress}
                onChangeText={sellerAddress => this.setState({ sellerAddress })}
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
          ) : (
            <View collapsable={false} />
          )}
        </View>
        <UploadDoc
          // title={I18n.t("expense_forms_expense_basic_detail")}
          placeholder={I18n.t("expense_forms_expense_basic_upload_bill")}
          hint={I18n.t("expense_forms_amc_form_amc_recommended")}
          placeholder2Color={colors.mainBlue}
          productId={id}
          itemId={id}
          jobId={jobId}
          type={1}
          copies={copies}
          onUpload={uploadResult => {
            console.log("uploadResult:", uploadResult);
            this.setState({
              id: uploadResult.product.id,
              copies: uploadResult.product.copies
            });
          }}
          navigation={this.props.navigation}
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
  }
});

export default BasicDetailsForm;
