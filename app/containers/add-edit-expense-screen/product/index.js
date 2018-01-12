import React from "react";
import { StyleSheet, View, Image, Alert, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { initProduct, getReferenceDataForCategory } from "../../../api";
import { ScreenContainer, Text, Button } from "../../../elements";

import LoadingOverlay from "../../../components/loading-overlay";
import SelectCategoryHeader from "../select-category-header";
import ProductBasicDetailsForm from "./product-basic-details-form";
import ProductInsuranceForm from "./product-insurance-form";
import { colors } from "../../../theme";

class Product extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mainCategoryId: null,
      category: null,
      categoryReferenceData: null,
      product: null,
      isInitializingProduct: false,
      isFetchingReferenceData: false
    };
  }

  componentDidMount() {
    const { product, mainCategoryId } = this.props;
    if (mainCategoryId) {
      this.setState({ mainCategoryId });
    }
  }

  onSelectCategory = category => {
    this.setState({ category }, () => {
      this.initProduct();
      this.fetchCategoryReferenceData();
    });
  };

  fetchCategoryReferenceData = async () => {
    this.setState({ isFetchingReferenceData: true });
    try {
      const data = await getReferenceDataForCategory(this.state.category.id);
      this.setState({
        categoryReferenceData: data.categories[0],
        isFetchingReferenceData: false
      });
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  initProduct = async () => {
    this.setState({ isInitializingProduct: true });
    const { mainCategoryId, category } = this.state;
    try {
      const res = await initProduct(mainCategoryId, category.id);
      this.setState({
        product: res.product,
        isInitializingProduct: false
      });
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  addProduct = () => {
    console.log(
      "this.basicDetailsForm: ",
      this.basicDetailsForm.getFilledData()
    );
  };

  render() {
    const {
      mainCategoryId,
      category,
      product,
      categoryReferenceData,
      isInitializingProduct,
      isFetchingReferenceData
    } = this.state;
    if (!mainCategoryId) {
      return null;
    }
    return (
      <ScreenContainer style={styles.container}>
        <KeyboardAwareScrollView scrollEnabled={product != null}>
          <LoadingOverlay
            visible={isInitializingProduct || isFetchingReferenceData}
          />
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
          {product != null &&
            categoryReferenceData != null && (
              <View style={styles.formsContainer}>
                <ProductBasicDetailsForm
                  ref={ref => (this.basicDetailsForm = ref)}
                  mainCategoryId={mainCategoryId}
                  categoryId={category.id}
                  product={product}
                  categoryReferenceData={categoryReferenceData}
                  navigator={this.props.navigator}
                />
                <View style={styles.separator} />
                <ProductInsuranceForm
                  ref={ref => (this.basicDetailsForm = ref)}
                  mainCategoryId={mainCategoryId}
                  categoryId={category.id}
                  product={product}
                  categoryReferenceData={categoryReferenceData}
                  navigator={this.props.navigator}
                />
              </View>
            )}
        </KeyboardAwareScrollView>
        {product != null &&
          categoryReferenceData != null && (
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

export default Product;
