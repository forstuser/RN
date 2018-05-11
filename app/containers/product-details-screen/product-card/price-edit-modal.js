import React from "react";
import { StyleSheet, View, TouchableOpacity, Platform } from "react-native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";
import { Text } from "../../../elements";
import KeyValueItem from "../../../components/key-value-item";
import { ActionSheetCustom as ActionSheet } from "react-native-actionsheet";
import { colors } from "../../../theme";
import PriceEditInput from "./price-edit-input"
class PriceEditModal extends React.Component {
  state = {
    isModalVisible: false
  };

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

  render() {
    const { isModalVisible } = this.state;
    const { product, totalAmount } = this.props;
    if (!isModalVisible) return null;

    let amountBreakdownOptions = [];
    let amountBreakdownObject = {};
    if (product.categoryId != 664) {
      amountBreakdownOptions.push(
        {
          name: "Product Cost",
          date: '',
          price: product.value
        }
      );
    }

    product.warrantyDetails.forEach(item => {
      let date = moment(item.purchaseDate).isValid()
        ? ` (${moment(item.purchaseDate).format("DD MMM YYYY")})`
        : ``;
      amountBreakdownOptions.push(
        {
          name: "Warranty",
          date: date,
          price: item.premiumAmount
        }
      );
    });

    product.insuranceDetails.forEach(item => {
      let date = moment(item.purchaseDate).isValid()
        ? ` (${moment(item.purchaseDate).format("DD MMM YYYY")})`
        : ``;
      amountBreakdownOptions.push(
        {
          name: "Insurance",
          date: date,
          price: item.premiumAmount
        }
      );
    });

    product.amcDetails.forEach(item => {
      let date = moment(item.purchaseDate).isValid()
        ? ` (${moment(item.purchaseDate).format("DD MMM YYYY")})`
        : ``;
      amountBreakdownOptions.push(
        {
          name: "Amc",
          date: date,
          price: item.premiumAmount
        }
      );
    });

    product.repairBills.forEach(item => {
      let date = moment(item.purchaseDate).isValid()
        ? ` (${moment(item.purchaseDate).format("DD MMM YYYY")})`
        : ``;
      amountBreakdownOptions.push(
        {
          name: "Repair",
          date: date,
          price: item.premiumAmount
        }
      );
    });

    // amountBreakdownOptions.push(
    //   {
    //     name: "Total Amount",
    //     date: '',
    //     price: totalAmount
    //   }
    // );
    console.log("final ", amountBreakdownOptions)
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
                <TouchableOpacity style={styles.closeIcon} onPress={this.hide}>
                  <Icon name="md-close" size={30} color={colors.mainText} />
                </TouchableOpacity>
                <Text
                  weight="Bold"
                  style={{ fontSize: 18, marginLeft: 10, textAlign: "left", marginBottom: 5, color: colors.mainBlue }}
                >
                  Product Cost Breakup
                </Text>
                {amountBreakdownOptions.map((item, index) => (
                  <View key={index} style={{ paddingLeft: 10, borderBottomWidth: 1 }}>
                    <PriceEditInput
                      name={item.name}
                      date={item.date}
                      price={item.price}
                    /></View>
                ))}
                <View style={{ paddingLeft: 10, borderBottomWidth: 1, backgroundColor: '#f3f3f3' }}>
                  <PriceEditInput
                    name="Total Amount"
                    date=""
                    price={totalAmount}
                  /></View>
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
    right: 15,
    top: 10
  }
});

export default PriceEditModal;
