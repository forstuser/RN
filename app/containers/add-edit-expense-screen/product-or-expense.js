import React from "react";
import { StyleSheet, View, Image, Alert, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { API_BASE_URL, initProduct, updateProduct } from "../../api";
import { ScreenContainer, Text, Button } from "../../elements";
import Analytics from "../../analytics";
import FinishModal from "./finish-modal";
import LoadingOverlay from "../../components/loading-overlay";
import SelectCategoryHeader from "./select-category-header";
import ProductBasicDetailsForm from "../../components/expense-forms/product-basic-details-form";
import ExpenseBasicDetailsForm from "../../components/expense-forms/expense-basic-details-form";
import HealthcareInsuranceForm from "../../components/expense-forms/healthcare-insurance-form";
import MedicalDocForm from "../../components/expense-forms/medical-doc-form";
import InsuranceForm from "../../components/expense-forms/insurance-form";
import WarrantyForm from "../../components/expense-forms/warranty-form";
import ExtendedWarrantyForm from "../../components/expense-forms/extended-warranty-form";
import RepairForm from "../../components/expense-forms/repair-form";
import AmcForm from "../../components/expense-forms/amc-form";
import PucForm from "../../components/expense-forms/puc-form";
import { colors } from "../../theme";
import { MAIN_CATEGORY_IDS, WARRANTY_TYPES } from "../../constants";

const expenseIllustration = require("../../images/add-expense-illustration.png");
const productIllustration = require("../../images/add-product-illustration.png");
const docIllustration = require("../../images/add-doc-illustration.png");

class ProductOrExpense extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mainCategoryId: null,
      category: null,
      subCategoryId: null,
      categoryReferenceData: null,
      renewalTypes: [],
      warrantyProviders: [],
      insuranceProviders: [],
      brands: [],
      categoryForms: [],
      subCategories: [],
      dualWarrantyItem: null,
      product: null,
      isInitializingProduct: false,
      startMsg: "Select a type above and Add Expense in Less Than 15 Sec ",
      startGraphics: expenseIllustration,
      visibleModules: {
        productBasicDetails: false,
        expenseBasicDetails: false,
        insurance: false,
        warranty: false,
        dualWarranty: false,
        extendedWarranty: false,
        amc: false,
        repair: false,
        puc: false
      },
      defaultWarrantyRenewalTypeId: null,
      defaultDualWarrantyRenewalTypeId: null,
      isSavingProduct: false,
      isFinishModalVisible: false
    };
  }

  componentDidMount() {
    const { product, mainCategoryId } = this.props;
    if (mainCategoryId) {
      this.setState({ mainCategoryId });

      if (
        [
          MAIN_CATEGORY_IDS.AUTOMOBILE,
          MAIN_CATEGORY_IDS.ELECTRONICS,
          MAIN_CATEGORY_IDS.FURNITURE
        ].indexOf(mainCategoryId) > -1
      ) {
        this.setState({
          startMsg: "Select a type above and Add Product in Less Than 30 Sec",
          startGraphics: productIllustration
        });
      } else if (mainCategoryId == MAIN_CATEGORY_IDS.HEALTHCARE) {
        this.setState({
          startMsg: "Select a type above and Add Documents in Less Than 10 Sec",
          startGraphics: docIllustration
        });
      }

      let visibleModules = {
        productBasicDetails: false,
        expenseBasicDetails: false,
        healthcareInsuranceForm: false,
        healthcareMedicalDocuments: false,
        insurance: false,
        warranty: false,
        dualWarranty: false,
        extendedWarranty: false,
        amc: false,
        repair: false,
        puc: false
      };
      switch (mainCategoryId) {
        case MAIN_CATEGORY_IDS.AUTOMOBILE:
          visibleModules = {
            productBasicDetails: true,
            insurance: true,
            warranty: true,
            dualWarranty: true,
            extendedWarranty: true,
            amc: true,
            repair: true,
            puc: true
          };
          break;
        case MAIN_CATEGORY_IDS.ELECTRONICS:
          visibleModules = {
            productBasicDetails: true,
            insurance: true,
            warranty: true,
            dualWarranty: true,
            extendedWarranty: true,
            amc: true,
            repair: true,
            puc: false
          };
          break;
        case MAIN_CATEGORY_IDS.FURNITURE:
          visibleModules.productBasicDetails = true;
          visibleModules.warranty = true;
          visibleModules.repair = true;
          break;
        case MAIN_CATEGORY_IDS.SERVICES:
          visibleModules.expenseBasicDetails = true;
          visibleModules.warranty = true;
          break;
        case MAIN_CATEGORY_IDS.TRAVEL:
          visibleModules.expenseBasicDetails = true;
          break;
        case MAIN_CATEGORY_IDS.HOUSEHOLD:
          visibleModules.expenseBasicDetails = true;
          visibleModules.warranty = true;
          break;
        case MAIN_CATEGORY_IDS.FASHION:
          visibleModules.expenseBasicDetails = true;
          visibleModules.warranty = true;
          break;
        case MAIN_CATEGORY_IDS.HEALTHCARE:
          if (this.props.healthcareFormType == "healthcare_expense") {
            visibleModules.expenseBasicDetails = true;
            visibleModules.warranty = true;
          }
          break;
      }
      this.setState({
        visibleModules
      });
    }
  }

  onSelectCategory = category => {
    const healthcareFormType = this.props.healthcareFormType;

    if (healthcareFormType == "medical_docs") {
      if (category.id == 664) {
        //category 'insurance'
        this.setState({
          visibleModules: {
            healthcareInsuranceForm: true
          }
        });
      } else {
        this.setState({
          visibleModules: {
            healthcareMedicalDocuments: true
          }
        });
      }
    }
    if (healthcareFormType == "healthcare_expense") {
      this.setState(
        { category: { id: 23, name: "Expenses" }, subCategoryId: category.id },
        () => {
          this.initProduct();
        }
      );
    } else {
      this.setState({ category }, () => {
        this.initProduct();
      });
    }
  };

  initProduct = async () => {
    this.setState({ isInitializingProduct: true, product: null });
    const { mainCategoryId, category } = this.state;
    try {
      const res = await initProduct(mainCategoryId, category.id);
      this.setState({
        product: res.product,
        isInitializingProduct: false,
        categoryReferenceData: res.categories[0],
        renewalTypes: res.renewalTypes || [],
        warrantyProviders: res.categories[0].warrantyProviders,
        insuranceProviders: res.categories[0].insuranceProviders,
        brands: res.categories[0].brands,
        categoryForms: res.categories[0].categoryForms,
        subCategories: res.categories[0].subCategories,
        dualWarrantyItem: res.categories[0].dual_warranty_item
      });
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  updateProduct = async () => {
    try {
      let data = {};
      if (this.productBasicDetailsForm) {
        data = this.productBasicDetailsForm.getFilledData();
      } else if (this.expenseBasicDetailsForm) {
        data = this.expenseBasicDetailsForm.getFilledData();
      } else if (this.healthcareInsuranceForm) {
        data = this.healthcareInsuranceForm.getFilledData();
        if (!data.insurance.providerId && !data.insurance.providerName) {
          return Alert.alert("Please select or enter an insurance provider");
        }
      } else if (this.healthcareMedicalDocForm) {
        data = this.healthcareMedicalDocForm.getFilledData();
        if (data.copies.length == 0) {
          return Alert.alert("Please upload the report doc");
        }
        delete data.isDocUploaded;
      }

      data.productId = this.state.product.id;
      data.mainCategoryId = this.state.mainCategoryId;
      data.categoryId = this.state.category.id;

      if (this.state.subCategoryId && !data.subCategoryId) {
        data.subCategoryId = this.state.subCategoryId;
      }

      if (this.warrantyForm) {
        data.warranty = this.warrantyForm.getFilledData();
        if (this.dualWarrantyForm) {
          const dualWarranty = this.dualWarrantyForm.getFilledData();
          data.warranty.dualId = dualWarranty.id;
          data.dualRenewalType = dualWarranty.renewalType;
        }
        if (this.extendedWarrantyForm) {
          const extendedWarranty = this.extendedWarrantyForm.getFilledData();
          data.warranty = {
            ...data.warranty,
            extendedId: extendedWarranty.id,
            extendedRenewalType: extendedWarranty.renewalType,
            extendedProviderId: extendedWarranty.providerId,
            extendedProviderName: extendedWarranty.providerName,
            extendedEffectiveDate: extendedWarranty.effectiveDate
          };
        }
      }

      if (this.insuranceForm) {
        data.insurance = this.insuranceForm.getFilledData();
      }
      if (this.amcForm) {
        data.amc = this.amcForm.getFilledData();
      }
      if (this.repairForm) {
        data.repair = this.repairForm.getFilledData();
      }
      if (this.pucForm) {
        data.puc = this.pucForm.getFilledData();
      }

      console.log("data: ", data);
      switch (this.state.mainCategoryId) {
        case MAIN_CATEGORY_IDS.AUTOMOBILE:
          if (!data.brandId && !data.brandName) {
            return Alert.alert("Please select or enter brand name");
          }
          if (!data.purchaseDate) {
            return Alert.alert("Please select a purchase date");
          }
          if (!data.insurance.providerId && !data.insurance.providerName) {
            return Alert.alert(
              "Please select or enter insurance provider name"
            );
          }
          break;
        case MAIN_CATEGORY_IDS.ELECTRONICS:
        case MAIN_CATEGORY_IDS.FURNITURE:
          if (!data.brandId && !data.brandName) {
            return Alert.alert("Please select or enter brand name");
          }
          if (!data.purchaseDate) {
            return Alert.alert("Please select a purchase date");
          }
          break;
        case MAIN_CATEGORY_IDS.FASHION:
        case MAIN_CATEGORY_IDS.HOUSEHOLD:
        case MAIN_CATEGORY_IDS.SERVICES:
        case MAIN_CATEGORY_IDS.TRAVEL:
          if (!data.purchaseDate) {
            return Alert.alert("Please select a date");
          }
          break;
        case MAIN_CATEGORY_IDS.HEALTHCARE:
          if (
            this.props.healthcareFormType == "healthcare_expense" &&
            !data.purchaseDate
          ) {
            return Alert.alert("Please select a date");
          }
      }

      this.setState({ isSavingProduct: true });
      await updateProduct(data);
      Analytics.logEvent(Analytics.EVENTS.ADD_PRODUCT_COMPLETED, {
        maincategory: this.state.mainCategoryId,
        category: this.state.category.name
      });
      this.setState({
        isSavingProduct: false,
        isFinishModalVisible: true
      });
    } catch (e) {
      console.log("error: ", e);
      this.setState({
        isSavingProduct: false
      });
      Alert.alert(e.message);
    }
  };

  render() {
    const {
      mainCategoryId,
      category,
      product,
      categoryReferenceData,
      renewalTypes,
      insuranceProviders,
      warrantyProviders,
      brands,
      categoryForms,
      subCategories,
      dualWarrantyItem,
      isInitializingProduct,
      visibleModules,
      isSavingProduct,
      isFinishModalVisible,
      startMsg,
      startGraphics,
      defaultWarrantyRenewalTypeId,
      defaultDualWarrantyRenewalTypeId
    } = this.state;

    if (!mainCategoryId) {
      return null;
    }
    return (
      <ScreenContainer style={styles.container}>
        <KeyboardAwareScrollView
          scrollEnabled={product != null}
          contentContainerStyle={product == null ? { flex: 1 } : {}}
        >
          <LoadingOverlay visible={isInitializingProduct || isSavingProduct} />
          <SelectCategoryHeader
            mainCategoryId={mainCategoryId}
            preSelectCategory={category}
            onCategorySelect={category => {
              this.onSelectCategory(category);
            }}
            healthcareFormType={this.props.healthcareFormType}
          />
          <View style={styles.separator} />
          {product == null && (
            <View style={styles.selectCategoryMsgContainer}>
              <Text weight="Medium" style={styles.selectCategoryMsg}>
                {startMsg}
              </Text>
              {/*<Image
                resizeMode="contain"
                style={styles.selectCategoryImage}
                source={startGraphics}
              />*/}
            </View>
          )}
          {product != null && (
            <View style={styles.formsContainer}>
              {visibleModules.productBasicDetails && (
                <View>
                  <ProductBasicDetailsForm
                    ref={ref => (this.productBasicDetailsForm = ref)}
                    mainCategoryId={mainCategoryId}
                    categoryId={category.id}
                    category={category}
                    id={product.id}
                    jobId={product.job_id}
                    brands={brands}
                    categoryForms={categoryForms}
                    navigator={this.props.navigator}
                    setWarrantyTypesOnModelSelect={data => {
                      this.setState({
                        defaultWarrantyRenewalTypeId:
                          data.warrantyRenewalTypeId,
                        defaultDualWarrantyRenewalTypeId:
                          data.dualWarrantyRenewalTypeId
                      });
                    }}
                  />
                  <View style={styles.separator} />
                </View>
              )}

              {visibleModules.expenseBasicDetails && (
                <View>
                  <ExpenseBasicDetailsForm
                    ref={ref => (this.expenseBasicDetailsForm = ref)}
                    mainCategoryId={mainCategoryId}
                    categoryId={category.id}
                    category={category}
                    productId={product.id}
                    jobId={product.job_id}
                    subCategories={subCategories}
                    navigator={this.props.navigator}
                  />
                  <View style={styles.separator} />
                </View>
              )}

              {visibleModules.healthcareInsuranceForm && (
                <View>
                  <HealthcareInsuranceForm
                    ref={ref => (this.healthcareInsuranceForm = ref)}
                    mainCategoryId={mainCategoryId}
                    categoryId={category.id}
                    category={category}
                    productId={product.id}
                    jobId={product.job_id}
                    insuranceProviders={insuranceProviders}
                    navigator={this.props.navigator}
                  />
                  <View style={styles.separator} />
                </View>
              )}

              {visibleModules.healthcareMedicalDocuments && (
                <View>
                  <MedicalDocForm
                    ref={ref => (this.healthcareMedicalDocForm = ref)}
                    mainCategoryId={mainCategoryId}
                    categoryId={category.id}
                    category={category}
                    productId={product.id}
                    jobId={product.job_id}
                    categoryReferenceData={categoryReferenceData}
                    navigator={this.props.navigator}
                  />
                  <View style={styles.separator} />
                </View>
              )}

              {visibleModules.insurance && (
                <View>
                  <InsuranceForm
                    ref={ref => (this.insuranceForm = ref)}
                    mainCategoryId={mainCategoryId}
                    categoryId={category.id}
                    productId={product.id}
                    jobId={product.job_id}
                    insuranceProviders={insuranceProviders}
                    navigator={this.props.navigator}
                    isCollapsible={
                      mainCategoryId != MAIN_CATEGORY_IDS.AUTOMOBILE
                    }
                  />
                  <View style={styles.separator} />
                </View>
              )}

              {visibleModules.warranty && (
                <View>
                  <WarrantyForm
                    ref={ref => (this.warrantyForm = ref)}
                    mainCategoryId={mainCategoryId}
                    categoryId={category.id}
                    productId={product.id}
                    jobId={product.job_id}
                    renewalTypes={renewalTypes}
                    renewalTypeId={defaultWarrantyRenewalTypeId}
                    navigator={this.props.navigator}
                  />
                  <View style={styles.separator} />
                </View>
              )}

              {visibleModules.dualWarranty && (
                <View>
                  <WarrantyForm
                    ref={ref => (this.dualWarrantyForm = ref)}
                    mainCategoryId={mainCategoryId}
                    categoryId={category.id}
                    productId={product.id}
                    jobId={product.job_id}
                    renewalTypes={renewalTypes}
                    renewalTypeId={defaultDualWarrantyRenewalTypeId}
                    warrantyType={WARRANTY_TYPES.DUAL}
                    dualWarrantyItem={dualWarrantyItem}
                    navigator={this.props.navigator}
                  />
                  <View style={styles.separator} />
                </View>
              )}

              {visibleModules.extendedWarranty && (
                <View>
                  <WarrantyForm
                    ref={ref => (this.extendedWarrantyForm = ref)}
                    mainCategoryId={mainCategoryId}
                    categoryId={category.id}
                    productId={product.id}
                    jobId={product.job_id}
                    renewalTypes={renewalTypes}
                    warrantyProviders={warrantyProviders}
                    warrantyType={WARRANTY_TYPES.EXTENDED}
                    navigator={this.props.navigator}
                  />
                  <View style={styles.separator} />
                </View>
              )}

              {visibleModules.amc && (
                <View>
                  <AmcForm
                    ref={ref => (this.amcForm = ref)}
                    mainCategoryId={mainCategoryId}
                    categoryId={category.id}
                    productId={product.id}
                    jobId={product.job_id}
                    categoryReferenceData={categoryReferenceData}
                    renewalTypes={renewalTypes}
                    navigator={this.props.navigator}
                  />
                  <View style={styles.separator} />
                </View>
              )}

              {visibleModules.repair && (
                <View>
                  <RepairForm
                    ref={ref => (this.repairForm = ref)}
                    mainCategoryId={mainCategoryId}
                    categoryId={category.id}
                    productId={product.id}
                    jobId={product.job_id}
                    navigator={this.props.navigator}
                  />
                  <View style={styles.separator} />
                </View>
              )}

              {visibleModules.puc && (
                <View>
                  <PucForm
                    ref={ref => (this.pucForm = ref)}
                    mainCategoryId={mainCategoryId}
                    categoryId={category.id}
                    productId={product.id}
                    jobId={product.job_id}
                    navigator={this.props.navigator}
                  />
                  <View style={styles.separator} />
                </View>
              )}
            </View>
          )}
        </KeyboardAwareScrollView>
        {product != null && (
          <Button
            onPress={this.updateProduct}
            text="ADD"
            borderRadius={0}
            color="secondary"
          />
        )}
        <FinishModal
          title="Product added to your eHome."
          visible={isFinishModalVisible}
          mainCategoryId={mainCategoryId}
          productId={product ? product.id : null}
          navigator={this.props.navigator}
        />
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: "#FAFAFA"
  },
  separator: {
    height: 10
  },
  selectCategoryMsgContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
    borderColor: "#eee",
    borderTopWidth: StyleSheet.hairlineWidth
  },
  selectCategoryMsg: {
    fontSize: 20,
    width: 300,
    textAlign: "center",
    color: colors.mainBlue
  },
  selectCategoryImage: {
    marginTop: 20,
    width: 300,
    height: 300
  },
  submitBtn: {
    backgroundColor: colors.pinkishOrange
  },
  submitBtnText: {}
});

export default ProductOrExpense;
