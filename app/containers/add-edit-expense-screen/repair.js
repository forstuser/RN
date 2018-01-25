import React from "react";
import {
  StyleSheet,
  View,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Icon from "react-native-vector-icons/Entypo";
import { API_BASE_URL, getRepairableProducts, addRepair } from "../../api";
import { ScreenContainer, Text, Button } from "../../elements";

import LoadingOverlay from "../../components/loading-overlay";
import { colors } from "../../theme";
import { MAIN_CATEGORY_IDS } from "../../constants";
import UploadBillOptions from "../../components/upload-bill-options";
import SelectModal from "../../components/select-modal";

import CustomTextInput from "../../components/form-elements/text-input";
import ContactFields from "../../components/form-elements/contact-fields";
import CustomDatePicker from "../../components/form-elements/date-picker";
import HeaderWithUploadOption from "../../components/form-elements/header-with-upload-option";
import UploadDoc from "../../components/form-elements/upload-doc";

import FinishModal from "./finish-modal";

class Repair extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      selectedProduct: null,
      repairDate: null,
      repairAmount: "",
      sellerName: "",
      sellerContact: "",
      warrantyUpto: "",
      isLoading: false,
      isFinishModalVisible: false
    };
  }

  componentDidMount() {
    this.getRepairableProducts();
  }

  getRepairableProducts = async () => {
    this.setState({ isLoading: true });
    try {
      const res = await getRepairableProducts();
      this.setState({
        products: res.product,
        isLoading: false
      });
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  onProductPress = product => {
    this.setState({
      selectedProduct: product
    });
  };

  saveRepair = async () => {
    try {
      const {
        selectedProduct,
        repairDate,
        sellerName,
        repairAmount,
        warrantyUpto
      } = this.state;

      const data = {
        productId: selectedProduct.id,
        repairDate,
        sellerName,
        sellerContact: this.phoneRef.getFilledData(),
        repairAmount,
        warrantyUpto
      };

      this.setState({
        isLoading: true
      });
      await addRepair(data);
      this.setState({
        isLoading: false,
        isFinishModalVisible: true
      });
    } catch (e) {
      Alert.alert(e.message);
      this.setState({
        isLoading: false
      });
    }
  };

  render() {
    const { formType } = this.props;
    const {
      products,
      selectedProduct,
      repairDate,
      repairAmount,
      sellerName,
      sellerContact,
      warrantyUpto,
      isLoading,
      isFinishModalVisible
    } = this.state;
    return (
      <View style={styles.container}>
        <LoadingOverlay visible={isLoading} />
        {products.length == 0 &&
          !isLoading && (
            <View style={styles.noProductsScreen}>
              <Text style={styles.noProductsText}>
                No Products in your eHome
              </Text>
              <TouchableOpacity
                onPress={this.openAddProductScreen}
                style={styles.addProductBtn}
              >
                <Text weight="Bold" style={styles.addProductBtnText}>
                  + Add Product
                </Text>
              </TouchableOpacity>
              <Text style={styles.noProductsText}>to add repair details</Text>
            </View>
          )}
        {products.length > 0 && (
          <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
            <View style={styles.header}>
              <Text weight="Medium" style={styles.selectProductText}>
                Select Product in eHome
              </Text>
              <ScrollView
                style={styles.products}
                contentContainerStyle={styles.productsContentContainer}
                horizontal={true}
              >
                {products.map(product => {
                  return (
                    <TouchableOpacity
                      key={product.key}
                      onPress={() => this.onProductPress(product)}
                      style={[
                        styles.product,
                        selectedProduct && selectedProduct.id == product.id
                          ? { borderColor: colors.mainBlue }
                          : {}
                      ]}
                    >
                      <Image
                        style={styles.productImage}
                        source={{ uri: API_BASE_URL + product.cImageURL + "1" }}
                      />
                      <View style={styles.productTexts}>
                        <Text
                          numberOfLines={1}
                          weight="Bold"
                          style={styles.name}
                        >
                          {product.productName}
                        </Text>
                        <View style={styles.productMetaContainer}>
                          <Text numberOfLines={2} style={styles.productMeta}>
                            {product.categoryName}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
            {products.length > 0 &&
              selectedProduct == null && (
                <View style={styles.selectProductMsgContainer}>
                  <Text weight="Medium" style={styles.selectProductMsg}>
                    Please select a product above
                  </Text>
                </View>
              )}
            {selectedProduct && (
              <View style={styles.formContainer}>
                <View style={styles.form}>
                  <HeaderWithUploadOption
                    title="Repair Details"
                    textBeforeUpload="Upload Bill "
                    textBeforeUpload2="(Recommended) "
                    textBeforeUpload2Color={colors.mainBlue}
                    jobId={selectedProduct ? selectedProduct.jobId : null}
                    type={4}
                    onUpload={uploadResult => {
                      console.log("upload result: ", uploadResult);
                    }}
                    navigator={this.props.navigator}
                  />

                  <CustomDatePicker
                    date={repairDate}
                    placeholder="Repair Date"
                    onDateChange={repairDate => {
                      this.setState({ repairDate });
                    }}
                  />

                  <CustomTextInput
                    placeholder="Repair Amount"
                    value={repairAmount}
                    onChangeText={repairAmount =>
                      this.setState({ repairAmount })
                    }
                  />

                  <CustomTextInput
                    placeholder="Seller Name"
                    value={sellerName}
                    onChangeText={sellerName => this.setState({ sellerName })}
                  />

                  <ContactFields
                    ref={ref => (this.phoneRef = ref)}
                    value={sellerContact}
                    placeholder="Seller Contact"
                  />
                </View>
                <View style={styles.form}>
                  <HeaderWithUploadOption
                    title="Warranty (If Applicable)"
                    hideUploadOption={true}
                    navigator={this.props.navigator}
                  />

                  <CustomTextInput
                    placeholder="Warranty Upto"
                    value={warrantyUpto}
                    onChangeText={warrantyUpto =>
                      this.setState({ warrantyUpto })
                    }
                  />

                  <UploadDoc
                    jobId={selectedProduct.jobId}
                    type={4}
                    placeholder="Upload Warranty Doc"
                    placeholderAfterUpload="Doc Uploaded Successfully"
                    navigator={this.props.navigator}
                    onUpload={uploadResult => {
                      console.log("upload result: ", uploadResult);
                    }}
                  />
                </View>
              </View>
            )}
          </KeyboardAwareScrollView>
        )}
        {selectedProduct && (
          <Button
            style={styles.saveBtn}
            onPress={this.saveRepair}
            text="ADD REPAIR"
            borderRadius={0}
            color="secondary"
          />
        )}
        <FinishModal
          title="Repair added with the product."
          visible={isFinishModalVisible}
          mainCategoryId={null}
          showRepairIcon={true}
          productId={selectedProduct ? selectedProduct.id : null}
          navigator={this.props.navigator}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: "#FAFAFA",
    flex: 1
  },
  noProductsScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  noProductsText: {
    fontSize: 12,
    color: colors.secondaryText
  },
  addProductBtn: {
    marginTop: 7,
    backgroundColor: "#fff",
    width: 130,
    height: 35,
    marginTop: 25,
    marginBottom: 25,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1
  },
  addProductBtnText: {
    color: colors.pinkishOrange
  },
  header: {
    backgroundColor: "#fff",
    borderColor: "#eee",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  selectProductText: {
    textAlign: "center",
    marginBottom: 20
  },
  products: {},
  productsContentContainer: {
    padding: 10
  },
  product: {
    flexDirection: "row",
    padding: 8,
    width: 240,
    height: 64,
    marginRight: 10,
    borderRadius: 2,
    backgroundColor: "#fff",
    alignItems: "center",
    borderColor: "#eee",
    borderWidth: 1
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 16
  },
  productTexts: {
    flex: 1,
    justifyContent: "center"
  },
  productName: {
    fontSize: 14,
    color: colors.mainText
  },
  productMetaContainer: {
    paddingTop: 4
  },
  productMeta: {
    fontSize: 12,
    color: colors.mainText
  },
  selectProductMsgContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center"
  },
  selectProductMsg: {
    fontSize: 20,
    width: 300,
    textAlign: "center",
    color: colors.secondaryText
  },
  form: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderColor: "#eee",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  input: {
    paddingVertical: 10,
    borderColor: colors.lighterText,
    borderBottomWidth: 2,
    height: 40,
    marginBottom: 32
  },
  saveBtn: {}
});

export default Repair;
