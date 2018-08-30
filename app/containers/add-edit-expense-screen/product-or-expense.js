import React from "react";
import { StyleSheet, View, Image, Alert, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { API_BASE_URL, initProduct, updateProduct } from "../../api";
import { ScreenContainer, Text, Button } from "../../elements";
import I18n from "../../i18n";
import { showSnackbar } from "../../utils/snackbar";
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
import {
  MAIN_CATEGORY_IDS,
  WARRANTY_TYPES,
  CATEGORY_IDS
} from "../../constants";

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
      startMsg: I18n.t("add_edit_expense_screen_title_add_select_type"),
      // startGraphics: expenseIllustration,
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
    console.log("sdddddddddddddddddds", this.props)
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
          startMsg: I18n.t("add_edit_expense_screen_title_add_select_type")
          // startGraphics: productIllustration
        });
      } else if (mainCategoryId == MAIN_CATEGORY_IDS.HEALTHCARE) {
        this.setState({
          startMsg: I18n.t("add_edit_expense_screen_title_add_select_type")
          // startGraphics: docIllustration
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
            productBasicDetails: true
          };
          break;
        case MAIN_CATEGORY_IDS.ELECTRONICS:
          visibleModules = {
            productBasicDetails: true
          };
          break;
        case MAIN_CATEGORY_IDS.FASHION:
          visibleModules.productBasicDetails = true;
          break;
        case MAIN_CATEGORY_IDS.FURNITURE:
          visibleModules.productBasicDetails = true;
          break;
        case MAIN_CATEGORY_IDS.SERVICES:
          visibleModules.expenseBasicDetails = true;
          break;
        case MAIN_CATEGORY_IDS.TRAVEL:
          visibleModules.expenseBasicDetails = true;
          break;
        case MAIN_CATEGORY_IDS.HOUSEHOLD:
          visibleModules.expenseBasicDetails = true;
          break;
        case MAIN_CATEGORY_IDS.HEALTHCARE:
          if (this.props.healthcareFormType == "healthcare_expense") {
            visibleModules.expenseBasicDetails = true;
          }
          break;
      }
      this.setState({
        visibleModules
      });
    }
  }

  onSelectCategory = category => {
    if (typeof this.props.confirmBackNavigation == "function") {
      this.props.confirmBackNavigation();
    }

    const healthcareFormType = this.props.healthcareFormType;
    if (healthcareFormType == "medical_docs") {
      if (category.id == CATEGORY_IDS.HEALTHCARE.INSURANCE) {
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
      if (category.id == CATEGORY_IDS.AUTOMOBILE.CYCLE) {
        const visibleModules = { ...this.state.visibleModules };
        visibleModules.puc = false;
        this.setState({
          visibleModules
        });
      }
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
      showSnackbar({
        text: e.message
      });
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
        if (!data.subCategoryId) {
          return showSnackbar({
            text: "Please select insurance type"
          });
        }
      } else if (this.healthcareMedicalDocForm) {
        data = this.healthcareMedicalDocForm.getFilledData();
        if (data.copies.length == 0) {
          return showSnackbar({
            text: "Please upload the report doc"
          });
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
        case MAIN_CATEGORY_IDS.ELECTRONICS:
        case MAIN_CATEGORY_IDS.FASHION:
          if (data.brandId === undefined && !data.brandName) {
            return showSnackbar({
              text: I18n.t("add_edit_expense_screen_title_add_brand_name")
            });
          }
          break;
        case MAIN_CATEGORY_IDS.FURNITURE:
          if (
            data.categoryId == CATEGORY_IDS.FURNITURE.FURNITURE &&
            !data.subCategoryId
          ) {
            return showSnackbar({
              text: I18n.t("add_edit_expense_screen_title_add_type")
            });
          }
          break;
        case MAIN_CATEGORY_IDS.HOUSEHOLD:
        case MAIN_CATEGORY_IDS.SERVICES:
        case MAIN_CATEGORY_IDS.TRAVEL:
          if (!data.value) {
            return showSnackbar({
              text: I18n.t("add_edit_expense_screen_title_add_amount")
            });
          }
          break;
        case MAIN_CATEGORY_IDS.HEALTHCARE:
          if (
            this.props.healthcareFormType == "healthcare_expense" &&
            !data.value
          ) {
            return showSnackbar({
              text: I18n.t("add_edit_expense_screen_title_add_amount")
            });
          }
      }

      this.setState({ isSavingProduct: true });
      await updateProduct(data);
      // Analytics.logEvent(Analytics.EVENTS.ADD_PRODUCT_COMPLETED, {
      //   maincategory: this.state.mainCategoryId,
      //   category: this.state.category.name
      // });
      this.setState({
        isSavingProduct: false,
        isFinishModalVisible: true
      });
    } catch (e) {
      console.log("error: ", e);
      this.setState({
        isSavingProduct: false
      });
      showSnackbar({
        text: e.message
      });
    }
  };

  render() {
    const { categoryId, reasons } = this.props;
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
          <SelectCategoryHeader
            mainCategoryId={mainCategoryId}
            categoryId={categoryId}
            preSelectCategory={category}
            onCategorySelect={category => {
              this.onSelectCategory(category);
            }}
            healthcareFormType={this.props.healthcareFormType}
          />
          <View collapsable={false} style={styles.separator} />
          {product == null ? (
            <View collapsable={false} style={styles.selectCategoryMsgContainer}>
              <Text weight="Medium" style={styles.selectCategoryMsg}>
                {startMsg}
              </Text>
              {reasons.map((reason, index) => {
                return (
                  <Text weight="Medium" key={index} style={styles.reason}>
                    • {reason}
                  </Text>
                );
              })}
            </View>
          ) : (
              <View collapsable={false} style={styles.formsContainer}>
                {visibleModules.productBasicDetails ? (
                  <View collapsable={false} >
                    <ProductBasicDetailsForm
                      ref={ref => (this.productBasicDetailsForm = ref)}
                      mainCategoryId={mainCategoryId}
                      categoryId={category.id}
                      category={category}
                      id={product.id}
                      jobId={product.job_id}
                      subCategories={subCategories}
                      brands={brands}
                      categoryForms={categoryForms}
                      navigation={this.props.navigation}
                      setWarrantyTypesOnModelSelect={data => {
                        this.setState({
                          defaultWarrantyRenewalTypeId:
                            data.warrantyRenewalTypeId,
                          defaultDualWarrantyRenewalTypeId:
                            data.dualWarrantyRenewalTypeId
                        });
                      }}
                    />
                    <View collapsable={false} style={styles.separator} />
                  </View>
                ) : (
                    <View collapsable={false} />
                  )}

                {visibleModules.expenseBasicDetails ? (
                  <View collapsable={false} >
                    <ExpenseBasicDetailsForm
                      ref={ref => (this.expenseBasicDetailsForm = ref)}
                      mainCategoryId={mainCategoryId}
                      categoryId={category.id}
                      category={category}
                      productId={product.id}
                      jobId={product.job_id}
                      subCategories={subCategories}
                      navigation={this.props.navigation}
                    />
                    <View collapsable={false} style={styles.separator} />
                  </View>
                ) : (
                    <View collapsable={false} />
                  )}

                {visibleModules.healthcareInsuranceForm ? (
                  <View collapsable={false} >
                    <HealthcareInsuranceForm
                      ref={ref => (this.healthcareInsuranceForm = ref)}
                      mainCategoryId={mainCategoryId}
                      categoryId={category.id}
                      category={category}
                      productId={product.id}
                      jobId={product.job_id}
                      insuranceProviders={insuranceProviders}
                      navigation={this.props.navigation}
                    />
                    <View collapsable={false} style={styles.separator} />
                  </View>
                ) : (
                    <View collapsable={false} />
                  )}

                {visibleModules.healthcareMedicalDocuments ? (
                  <View collapsable={false} >
                    <MedicalDocForm
                      ref={ref => (this.healthcareMedicalDocForm = ref)}
                      mainCategoryId={mainCategoryId}
                      categoryId={category.id}
                      category={category}
                      productId={product.id}
                      jobId={product.job_id}
                      categoryReferenceData={categoryReferenceData}
                      navigation={this.props.navigation}
                      subCategories={subCategories}
                    />
                    <View collapsable={false} style={styles.separator} />
                  </View>
                ) : (
                    <View collapsable={false} />
                  )}

                {visibleModules.insurance ? (
                  <View collapsable={false} >
                    <InsuranceForm
                      ref={ref => (this.insuranceForm = ref)}
                      mainCategoryId={mainCategoryId}
                      categoryId={category.id}
                      productId={product.id}
                      jobId={product.job_id}
                      insuranceProviders={insuranceProviders}
                      navigation={this.props.navigation}
                      isCollapsible={
                        mainCategoryId != MAIN_CATEGORY_IDS.AUTOMOBILE ||
                        category.id == CATEGORY_IDS.AUTOMOBILE.CYCLE
                      }
                    />
                    <View collapsable={false} style={styles.separator} />
                  </View>
                ) : (
                    <View collapsable={false} />
                  )}

                {visibleModules.warranty ? (
                  <View collapsable={false} >
                    <WarrantyForm
                      ref={ref => (this.warrantyForm = ref)}
                      mainCategoryId={mainCategoryId}
                      categoryId={category.id}
                      productId={product.id}
                      jobId={product.job_id}
                      renewalTypes={renewalTypes}
                      renewalTypeId={defaultWarrantyRenewalTypeId}
                      navigation={this.props.navigation}
                    />
                    <View collapsable={false} style={styles.separator} />
                  </View>
                ) : (
                    <View collapsable={false} />
                  )}

                {visibleModules.dualWarranty ? (
                  <View collapsable={false} >
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
                      navigation={this.props.navigation}
                    />
                    <View collapsable={false} style={styles.separator} />
                  </View>
                ) : (
                    <View collapsable={false} />
                  )}

                {visibleModules.extendedWarranty ? (
                  <View collapsable={false} >
                    <WarrantyForm
                      ref={ref => (this.extendedWarrantyForm = ref)}
                      mainCategoryId={mainCategoryId}
                      categoryId={category.id}
                      productId={product.id}
                      jobId={product.job_id}
                      renewalTypes={renewalTypes}
                      warrantyProviders={warrantyProviders}
                      warrantyType={WARRANTY_TYPES.EXTENDED}
                      navigation={this.props.navigation}
                    />
                    <View collapsable={false} style={styles.separator} />
                  </View>
                ) : (
                    <View collapsable={false} />
                  )}

                {visibleModules.amc ? (
                  <View collapsable={false} >
                    <AmcForm
                      ref={ref => (this.amcForm = ref)}
                      mainCategoryId={mainCategoryId}
                      categoryId={category.id}
                      productId={product.id}
                      jobId={product.job_id}
                      categoryReferenceData={categoryReferenceData}
                      renewalTypes={renewalTypes}
                      navigation={this.props.navigation}
                    />
                    <View collapsable={false} style={styles.separator} />
                  </View>
                ) : (
                    <View collapsable={false} />
                  )}

                {visibleModules.repair ? (
                  <View collapsable={false} >
                    <RepairForm
                      ref={ref => (this.repairForm = ref)}
                      mainCategoryId={mainCategoryId}
                      categoryId={category.id}
                      productId={product.id}
                      jobId={product.job_id}
                      navigation={this.props.navigation}
                    />
                    <View collapsable={false} style={styles.separator} />
                  </View>
                ) : (
                    <View collapsable={false} />
                  )}

                {visibleModules.puc ? (
                  <View collapsable={false} >
                    <PucForm
                      ref={ref => (this.pucForm = ref)}
                      mainCategoryId={mainCategoryId}
                      categoryId={category.id}
                      productId={product.id}
                      jobId={product.job_id}
                      navigation={this.props.navigation}
                    />
                    <View collapsable={false} style={styles.separator} />
                  </View>
                ) : (
                    <View collapsable={false} />
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
        <LoadingOverlay visible={isInitializingProduct || isSavingProduct} />
        <FinishModal
          title="Product added to your eHome."
          visible={isFinishModalVisible}
          mainCategoryId={mainCategoryId}
          productId={product ? product.id : null}
          navigation={this.props.navigation}
          isPreviousScreenOfAddOptions={this.props.isPreviousScreenOfAddOptions}
        />
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  reason: {
    color: colors.secondaryText,
    // textAlign: 'left',
    fontSize: 12,
    marginLeft: 100,
    alignSelf: "flex-start"
    // color: 'red',
    // flex: 1,
    // alignItems: 'flex-start',
    // selfAlign: 'left'
  },
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
    color: colors.mainBlue,
    marginBottom: 10,
    marginTop: -150
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
