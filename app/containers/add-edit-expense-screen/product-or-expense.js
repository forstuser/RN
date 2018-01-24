import React from "react";
import { StyleSheet, View, Image, Alert, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { API_BASE_URL, initProduct, updateProduct } from "../../api";
import { ScreenContainer, Text, Button } from "../../elements";

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
      dualWarrantyItem: null,
      product: null,
      isInitializingProduct: false,
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
      isSavingProduct: false,
      isFinishModalVisible: false
    };
  }

  componentDidMount() {
    const { product, mainCategoryId } = this.props;
    if (mainCategoryId) {
      this.setState({ mainCategoryId });
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
          visibleModules.warranty = true;
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
        if (!data.isDocUploaded) {
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
          if ((!data.brandId && !data.brandName) || !data.purchaseDate) {
            return Alert.alert("Please select brand and purchase date");
          }
          if (!data.insurance.providerId && !data.insurance.providerName) {
            return Alert.alert(
              "Please select or enter insurance provider name"
            );
          }
          if (!data.purchaseDate) {
            return Alert.alert("Please select a date");
          }
        case MAIN_CATEGORY_IDS.ELECTRONICS:
          if ((!data.brandId && !data.brandName) || !data.purchaseDate) {
            return Alert.alert("Please select brand and purchase date");
          }
          if (!data.purchaseDate) {
            return Alert.alert("Please select a date");
          }
        case MAIN_CATEGORY_IDS.FURNITURE:
          if (!data.brandId || !data.purchaseDate) {
            return Alert.alert("Please select brand and purchase date");
          }
          if (!data.purchaseDate) {
            return Alert.alert("Please select a date");
          }
        case MAIN_CATEGORY_IDS.FASHION:
        case MAIN_CATEGORY_IDS.HOUSEHOLD:
        case MAIN_CATEGORY_IDS.SERVICES:
        case MAIN_CATEGORY_IDS.TRAVEL:
          if (!data.purchaseDate) {
            return Alert.alert("Please select a date");
          }
      }

      this.setState({ isSavingProduct: true });
      await updateProduct(data);
      this.setState({
        isSavingProduct: false,
        isFinishModalVisible: true
      });
    } catch (e) {
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
      dualWarrantyItem,
      isInitializingProduct,
      visibleModules,
      isSavingProduct,
      isFinishModalVisible
    } = this.state;
    if (!mainCategoryId) {
      return null;
    }
    return (
      <ScreenContainer style={styles.container}>
        <KeyboardAwareScrollView scrollEnabled={product != null}>
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
                Please click on an icon above to select a type
              </Text>
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
                    id={product.id}
                    jobId={product.job_id}
                    brands={brands}
                    categoryForms={categoryForms}
                    navigator={this.props.navigator}
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
                    product={product}
                    categoryReferenceData={categoryReferenceData}
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
                    product={product}
                    categoryReferenceData={categoryReferenceData}
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
                    navigator={this.props.navigator}
                  />
                  <View style={styles.separator} />
                </View>
              )}

              {visibleModules.dualWarranty &&
                dualWarrantyItem && (
                  <View>
                    <WarrantyForm
                      ref={ref => (this.dualWarrantyForm = ref)}
                      mainCategoryId={mainCategoryId}
                      categoryId={category.id}
                      productId={product.id}
                      jobId={product.job_id}
                      renewalTypes={renewalTypes}
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
            text="ADD PRODUCT"
            borderRadius={0}
            color="secondary"
          />
        )}
        <FinishModal
          title="Product added to your eHome."
          visible={isFinishModalVisible}
          mainCategoryId={mainCategoryId}
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
    height: 200,
    justifyContent: "center",
    alignItems: "center"
  },
  selectCategoryMsg: {
    fontSize: 20,
    width: 300,
    textAlign: "center",
    color: colors.secondaryText
  },
  submitBtn: {
    backgroundColor: colors.pinkishOrange
  },
  submitBtnText: {}
});

export default ProductOrExpense;
