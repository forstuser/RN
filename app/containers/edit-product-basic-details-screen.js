import React from "react";
import { StyleSheet, View, Alert } from "react-native";
import PropTypes from "prop-types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { getReferenceDataForCategory, updateProduct } from "../api";

import LoadingOverlay from "../components/loading-overlay";
import { MAIN_CATEGORY_IDS } from "../constants";
import { ScreenContainer, Text, Button } from "../elements";
import ProductBasicDetailsForm from "../components/expense-forms/product-basic-details-form";
import ExpenseBasicDetailsForm from "../components/expense-forms/expense-basic-details-form";
import ChangesSavedModal from "../components/changes-saved-modal";

class EditProductBasicDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brands: [],
      categoryForms: [],
      subCategories: [],
      isLoading: false
    };
  }

  async componentDidMount() {
    const { product } = this.props;
    let title = "Edit " + product.productName;
    this.props.navigator.setTitle({ title });
    this.fetchCategoryData();
  }

  fetchCategoryData = async () => {
    try {
      this.setState({ isLoading: true });
      const res = await getReferenceDataForCategory(
        this.props.product.categoryId
      );
      this.setState({
        brands: res.categories[0].brands,
        categoryForms: res.categories[0].categoryForms,
        subCategories: res.categories[0].subCategories,
        isLoading: false
      });
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  onSavePress = async () => {
    const { mainCategoryId, categoryId, navigator, product } = this.props;
    let data = {
      mainCategoryId,
      categoryId,
      productId: product.id,
      ...this.basicDetailsForm.getFilledData()
    };

    console.log("data: ", data);

    if (
      [
        MAIN_CATEGORY_IDS.AUTOMOBILE,
        MAIN_CATEGORY_IDS.ELECTRONICS,
        MAIN_CATEGORY_IDS.FURNITURE
      ].indexOf(mainCategoryId) > -1
    ) {
      if (!data.brandId && !data.brandName) {
        return Alert.alert("Please select or enter brand");
      }
    }
    if (!data.purchaseDate) {
      return Alert.alert("Please select a date");
    }

    try {
      this.setState({ isLoading: true });
      await updateProduct(data);
      this.setState({ isLoading: false });
      this.changesSavedModal.show();
    } catch (e) {
      Alert.alert(e.message);
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { product, navigator } = this.props;

    const { brands, categoryForms, subCategories, isLoading } = this.state;

    const {
      id,
      productName,
      purchaseDate,
      value,
      copies,
      sub_category_id
    } = product;
    const selectedBrandId = product.brandId;
    const modelName = product.model;

    let sellerName,
      sellerContact = "";
    if (product.sellers) {
      sellerName = product.sellers.sellerName;
      sellerContact = product.sellers.contact;
    } else if (product.onlineSellers) {
      sellerName = product.onlineSellers.sellerName;
      sellerContact = product.onlineSellers.contact;
    }

    let vinNo = (vinNoId = registrationNo = registrationNoId = imeiNo = imeiNoId = serialNo = serialNoId = nextDueDate = nextDueDateId = null);

    const productMetaDatas = product.metaData || [];

    const imeiMeta = productMetaDatas.find(meta => meta.name == "IMEI Number");
    if (imeiMeta) {
      imeiNo = imeiMeta.value;
      imeiNoId = imeiMeta.id;
    }

    const serialNoMeta = productMetaDatas.find(
      meta => meta.name == "Serial Number"
    );
    if (serialNoMeta) {
      serialNo = serialNoMeta.value;
      serialNoId = serialNoMeta.id;
    }

    const registrationNoMeta = productMetaDatas.find(
      meta => meta.name == "Registration Number"
    );
    if (registrationNoMeta) {
      registrationNo = registrationNoMeta.value;
      registrationNoId = registrationNoMeta.id;
    }

    const vinNoMeta = productMetaDatas.find(
      meta => meta.name.toLowerCase() == "vin"
    );
    if (vinNoMeta) {
      vinNo = vinNoMeta.value;
      vinNoId = vinNoMeta.id;
    }

    const dueDateMeta = productMetaDatas.find(meta => meta.name == "Due date");
    if (dueDateMeta) {
      nextDueDate = dueDateMeta.value;
      nextDueDateId = dueDateMeta.id;
    }

    let showExpenseForm = true;
    if (
      [
        MAIN_CATEGORY_IDS.AUTOMOBILE,
        MAIN_CATEGORY_IDS.ELECTRONICS,
        MAIN_CATEGORY_IDS.FURNITURE
      ].indexOf(product.masterCategoryId) > -1
    ) {
      showExpenseForm = false;
    }

    return (
      <ScreenContainer style={styles.container}>
        <LoadingOverlay visible={isLoading} />
        <ChangesSavedModal
          ref={ref => (this.changesSavedModal = ref)}
          navigator={this.props.navigator}
        />
        <KeyboardAwareScrollView>
          <View style={{ flex: 1 }}>
            {showExpenseForm && (
              <ExpenseBasicDetailsForm
                ref={ref => (this.basicDetailsForm = ref)}
                mainCategoryId={product.masterCategoryId}
                categoryId={product.categoryId}
                category={{
                  id: product.categoryId,
                  name: product.categoryName
                }}
                jobId={product.jobId}
                subCategories={subCategories}
                navigator={navigator}
                {...{
                  productId: id,
                  expenseName: productName,
                  date: purchaseDate,
                  subCategoryId: sub_category_id,
                  value,
                  copies,
                  sellerName,
                  sellerContact,
                  nextDueDate,
                  nextDueDateId
                }}
              />
            )}
            {!showExpenseForm && (
              <ProductBasicDetailsForm
                ref={ref => (this.basicDetailsForm = ref)}
                mainCategoryId={product.masterCategoryId}
                categoryId={product.categoryId}
                category={{
                  id: product.categoryId,
                  name: product.categoryName
                }}
                id={product.id}
                jobId={product.jobId}
                brands={brands}
                categoryForms={categoryForms}
                navigator={navigator}
                {...{
                  id,
                  productName,
                  purchaseDate,
                  selectedBrandId,
                  value,
                  copies,
                  modelName,
                  sellerName,
                  sellerContact,
                  vinNo,
                  vinNoId,
                  registrationNo,
                  registrationNoId,
                  imeiNo,
                  imeiNoId,
                  serialNo,
                  serialNoId
                }}
              />
            )}
          </View>
        </KeyboardAwareScrollView>
        <Button
          onPress={this.onSavePress}
          text="SAVE"
          color="secondary"
          borderRadius={0}
        />
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: "#FAFAFA"
  }
});

export default EditProductBasicDetails;