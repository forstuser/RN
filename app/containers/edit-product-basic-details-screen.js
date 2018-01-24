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

class EditProductBasicDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brands: [],
      categoryForms: [],
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
    if ((!data.brandId && !data.brandName) || !data.purchaseDate) {
      return Alert.alert("Please select brand and purchase date");
    }
    if (!data.purchaseDate) {
      return Alert.alert("Please select a date");
    }

    try {
      this.setState({ isLoading: true });
      await updateProduct(data);
      this.setState({ isLoading: false });
      navigator.pop();
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  render() {
    const { product, navigator } = this.props;

    const { brands, categoryForms, isLoading } = this.state;

    const { id, productName, purchaseDate, value, copies } = product;
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

    let vinNo,
      registrationNo,
      imeiNo,
      serialNo = "";

    const productMetaDatas = product.metaData || [];

    const imeiMeta = productMetaDatas.find(meta => meta.name == "IMEI Number");
    if (imeiMeta) {
      imeiNo = imeiMeta.value;
    }

    const serialNoMeta = productMetaDatas.find(
      meta => meta.name == "Serial Number"
    );
    if (serialNoMeta) {
      serialNo = serialNoMeta.value;
    }

    const registrationNoMeta = productMetaDatas.find(
      meta => meta.name == "Registration Number"
    );
    if (registrationNoMeta) {
      registrationNo = registrationNoMeta.value;
    }

    const vinNoMeta = productMetaDatas.find(
      meta => meta.name == "Vehicle Number"
    );
    if (vinNoMeta) {
      vinNo = vinNoMeta.value;
    }

    return (
      <ScreenContainer style={styles.container}>
        <LoadingOverlay visible={isLoading} />
        <KeyboardAwareScrollView>
          <View style={{ flex: 1 }}>
            <ProductBasicDetailsForm
              ref={ref => (this.basicDetailsForm = ref)}
              mainCategoryId={product.masterCategoryId}
              categoryId={product.categoryId}
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
                registrationNo,
                imeiNo,
                serialNo
              }}
            />
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
