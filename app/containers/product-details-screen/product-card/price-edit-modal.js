import React from "react";
import { StyleSheet, View, TouchableOpacity, Platform } from "react-native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";
import { Text } from "../../../elements";
import { ActionSheetCustom as ActionSheet } from "react-native-actionsheet";
import { colors } from "../../../theme";
import PriceEditInput from "./price-edit-input";
import { showSnackbar } from "../../../utils/snackbar";
import {
  updateProduct,
  updateWarranty,
  updateInsurance,
  updateAmc,
  updatePuc,
  updateRepair
} from "../../../api";

class PriceEditModal extends React.Component {
  state = {
    isModalVisible: false,
    productId: ""
  };

  componentDidMount() {
    this.setState({
      productId: this.props.product.id
    });
  }

  show = () => {
    this.setState({
      isModalVisible: true
    });
  };

  hide = () => {
    this.setState({
      isModalVisible: false
    });
  };
  getData = async (value, id, type) => {
    try {
      if (type) {
        switch (type) {
          case "product":
            await updateProduct({ productId: id, value: value });
            break;
          case "warranty":
            await updateWarranty({
              productId: this.state.productId,
              id: id,
              value: value
            });
            break;
          case "insurance":
            await updateInsurance({
              productId: this.state.productId,
              id: id,
              value: value
            });
            break;
          case "amc":
            await updateAmc({
              productId: this.state.productId,
              id: id,
              value: value
            });
            break;
          case "repair":
            await updateRepair({
              productId: this.state.productId,
              id: id,
              value: value
            });
            break;
        }
        this.props.fetchProductDetails();
      }
    } catch (e) {
      showSnackbar({
        text: e.message
      });
    }
  };

  render() {
    const { isModalVisible } = this.state;
    const { product, totalAmount } = this.props;
    console.log("Product Details", product);
    if (!isModalVisible) return null;

    let amountBreakdownOptions = [];
    let amountBreakdownObject = {};
    if (product.categoryId != 664) {
      amountBreakdownOptions.push({
        name: product.productName || product.categoryName + " Cost",
        type: "product",
        id: product.id,
        date: "",
        price: product.value
      });
    }

    product.warrantyDetails.forEach(item => {
      let date = moment(item.purchaseDate).isValid()
        ? ` (${moment(item.purchaseDate).format("DD MMM YYYY")})`
        : ``;
      amountBreakdownOptions.push({
        name: "Warranty",
        type: "warranty",
        id: item.id,
        date: date,
        price: item.premiumAmount
      });
    });

    product.insuranceDetails.forEach(item => {
      let date = moment(item.purchaseDate).isValid()
        ? ` (${moment(item.purchaseDate).format("DD MMM YYYY")})`
        : ``;
      amountBreakdownOptions.push({
        name: "Insurance",
        type: "insurance",
        id: item.id,
        date: date,
        price: item.premiumAmount
      });
    });

    product.amcDetails.forEach(item => {
      let date = moment(item.purchaseDate).isValid()
        ? ` (${moment(item.purchaseDate).format("DD MMM YYYY")})`
        : ``;
      amountBreakdownOptions.push({
        name: "Amc",
        type: "amc",
        id: item.id,
        date: date,
        price: item.premiumAmount
      });
    });

    product.repairBills.forEach(item => {
      let date = moment(item.purchaseDate).isValid()
        ? ` (${moment(item.purchaseDate).format("DD MMM YYYY")})`
        : ``;
      amountBreakdownOptions.push({
        name: "Repair",
        type: "repair",
        id: item.id,
        date: date,
        price: item.premiumAmount
      });
    });

    // amountBreakdownOptions.push(
    //   {
    //     name: "Total Amount",
    //     date: '',
    //     price: totalAmount,
    //   }
    // );
    console.log("final ", amountBreakdownOptions);
    return (
      <View>
        {isModalVisible && (
          <View>
            <Modal
              isVisible={true}
              useNativeDriver={true}
              onBackButtonPress={this.hide}
              onBackdropPress={this.hide}
              avoidKeyboard={Platform.OS == "ios"}
            >
              <View style={styles.modal}>
                <Text
                  weight="Bold"
                  style={{
                    fontSize: 18,
                    marginLeft: 10,
                    textAlign: "left",
                    marginBottom: 5,
                    color: colors.mainBlue
                  }}
                >
                  Life Cycle Cost Breakup
                </Text>
                {amountBreakdownOptions.map((item, index) => (
                  <View key={index}>
                    <PriceEditInput
                      name={item.name}
                      type={item.type}
                      id={item.id}
                      date={item.date}
                      price={item.price}
                      editable={true}
                      sendData={this.getData}
                    />
                  </View>
                ))}
                <View>
                  <PriceEditInput
                    name="Total Amount"
                    date=""
                    price={totalAmount}
                    editable={false}
                  />
                </View>
                <TouchableOpacity style={styles.closeIcon} onPress={this.hide}>
                  <Icon name="md-close" size={30} color={colors.mainText} />
                </TouchableOpacity>
              </View>
            </Modal>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    paddingTop: 20,
    backgroundColor: "#fff",
    borderRadius: 5
  },
  closeIcon: {
    position: "absolute",
    right: 5,
    top: 10,
    paddingHorizontal: 10
  }
});

export default PriceEditModal;
