import React from "react";
import { StyleSheet, View, Image, Alert, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { initProduct, getReferenceDataForCategory } from "../../../api";
import { ScreenContainer, Text, Button } from "../../../elements";

import LoadingOverlay from "../../../components/loading-overlay";
import SelectCategoryHeader from "../select-category-header";
import ProductBasicDetailsForm from "./product-basic-details-form";
import ExpenseBasicDetailsForm from "./expense-basic-details-form";
import InsuranceForm from "./insurance-form";
import WarrantyForm from "./warranty-form";
import ExtendedWarrantyForm from "./extended-warranty-form";
import RepairForm from "./repair-form";
import AmcForm from "./amc-form";
import PucForm from "./puc-form";
import { colors } from "../../../theme";
import { MAIN_CATEGORY_IDS } from "../../../constants";

class ProductOrExpense extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mainCategoryId: null,
      category: null,
      categoryReferenceData: null,
      renewalTypes: [],
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
      }
    };
  }

  componentDidMount() {
    const { product, mainCategoryId } = this.props;
    if (mainCategoryId) {
      this.setState({ mainCategoryId });
      let visibleModules = {
        productBasicDetails: false,
        expenseBasicDetails: false,
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
      }
      this.setState({
        visibleModules
      });
    }
  }

  onSelectCategory = category => {
    this.setState({ category }, () => {
      this.initProduct();
    });
  };

  initProduct = async () => {
    this.setState({ isInitializingProduct: true });
    const { mainCategoryId, category } = this.state;
    try {
      const res = await initProduct(mainCategoryId, category.id);
      this.setState({
        product: res.product,
        isInitializingProduct: false,
        categoryReferenceData: res.categories[0],
        renewalTypes: res.renewalTypes || []
      });
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  addProduct = () => {
    console.log(
      "this.basicDetailsForm: ",
      this.productBasicDetailsForm.getFilledData()
    );
    console.log("this.insuranceForm: ", this.insuranceForm.getFilledData());
    console.log("this.warrantyForm: ", this.warrantyForm.getFilledData());
    console.log(
      "this.dualWarrantyForm: ",
      this.dualWarrantyForm.getFilledData()
    );
    console.log(
      "this.extendedWarrantyForm: ",
      this.extendedWarrantyForm.getFilledData()
    );
    console.log("this.amcForm: ", this.amcForm.getFilledData());
    console.log("this.repairForm: ", this.repairForm.getFilledData());
    console.log("this.pucForm: ", this.pucForm.getFilledData());
  };

  render() {
    const {
      mainCategoryId,
      category,
      product,
      categoryReferenceData,
      renewalTypes,
      isInitializingProduct,
      visibleModules
    } = this.state;
    if (!mainCategoryId) {
      return null;
    }
    return (
      <ScreenContainer style={styles.container}>
        <KeyboardAwareScrollView scrollEnabled={product != null}>
          <LoadingOverlay visible={isInitializingProduct} />
          <SelectCategoryHeader
            mainCategoryId={mainCategoryId}
            preSelectCategory={category}
            onCategorySelect={category => {
              this.onSelectCategory(category);
            }}
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
                    product={product}
                    categoryReferenceData={categoryReferenceData}
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

              {visibleModules.insurance && (
                <View>
                  <InsuranceForm
                    ref={ref => (this.insuranceForm = ref)}
                    mainCategoryId={mainCategoryId}
                    categoryId={category.id}
                    product={product}
                    categoryReferenceData={categoryReferenceData}
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
                    product={product}
                    categoryReferenceData={categoryReferenceData}
                    renewalTypes={renewalTypes}
                    navigator={this.props.navigator}
                  />
                  <View style={styles.separator} />
                </View>
              )}

              {visibleModules.dualWarranty && (
                <View>
                  <WarrantyForm
                    type="dual-warranty"
                    ref={ref => (this.dualWarrantyForm = ref)}
                    mainCategoryId={mainCategoryId}
                    categoryId={category.id}
                    product={product}
                    categoryReferenceData={categoryReferenceData}
                    renewalTypes={renewalTypes}
                    navigator={this.props.navigator}
                  />
                  <View style={styles.separator} />
                </View>
              )}

              {visibleModules.extendedWarranty && (
                <View>
                  <ExtendedWarrantyForm
                    ref={ref => (this.extendedWarrantyForm = ref)}
                    mainCategoryId={mainCategoryId}
                    categoryId={category.id}
                    product={product}
                    categoryReferenceData={categoryReferenceData}
                    renewalTypes={renewalTypes}
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
                    product={product}
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
                    product={product}
                    categoryReferenceData={categoryReferenceData}
                    renewalTypes={renewalTypes}
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
                    product={product}
                    categoryReferenceData={categoryReferenceData}
                    renewalTypes={renewalTypes}
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
            onPress={this.addProduct}
            text="ADD PRODUCT"
            borderRadius={0}
            color="secondary"
          />
        )}
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
