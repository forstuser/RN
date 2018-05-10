import React from "react";
import { StyleSheet, View, TouchableOpacity, Platform } from "react-native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";
import I18n from "../../../i18n";
import { Text } from "../../../elements";
import KeyValueItem from "../../../components/key-value-item";
import { ActionSheetCustom as ActionSheet } from "react-native-actionsheet";
import ProductReview from "../../../components/product-review";
import { colors } from "../../../theme";
import Analytics from "../../../analytics";

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
        // <View style={{ width: "100%" }}>
        //   <KeyValueItem
        //     keyText={I18n.t("product_details_screen_cost_breakdown_product")}
        //     valueText={`₹ ${product.value}`}
        //   />
        // </View>
        amountBreakdownObject = {
          name: "Product Cost",
          date: '',
          value: product.value
        }
      );
    }

    product.warrantyDetails.forEach(item => {
      let date = moment(item.purchaseDate).isValid()
        ? ` (${moment(item.purchaseDate).format("DD MMM YYYY")})`
        : ``;
      amountBreakdownOptions.push(
        <View style={{ width: "100%" }}>
          <KeyValueItem
            keyText={
              I18n.t("product_details_screen_cost_breakdown_warranty") + date
            }
            valueText={`₹ ${item.premiumAmount}`}
          />
        </View>
      );
    });

    product.insuranceDetails.forEach(item => {
      let date = moment(item.purchaseDate).isValid()
        ? ` (${moment(item.purchaseDate).format("DD MMM YYYY")})`
        : ``;
      amountBreakdownOptions.push(
        <View style={{ width: "100%" }}>
          <KeyValueItem
            keyText={
              I18n.t("product_details_screen_cost_breakdown_insurance") + date
            }
            valueText={`₹ ${item.premiumAmount}`}
          />
        </View>
      );
    });

    product.amcDetails.forEach(item => {
      let date = moment(item.purchaseDate).isValid()
        ? ` (${moment(item.purchaseDate).format("DD MMM YYYY")})`
        : ``;
      amountBreakdownOptions.push(
        <View style={{ width: "100%" }}>
          <KeyValueItem
            keyText={I18n.t("product_details_screen_cost_breakdown_amc") + date}
            valueText={`₹ ${item.premiumAmount}`}
          />
        </View>
      );
    });

    product.repairBills.forEach(item => {
      let date = moment(item.purchaseDate).isValid()
        ? ` (${moment(item.purchaseDate).format("DD MMM YYYY")})`
        : ``;
      amountBreakdownOptions.push(
        <View style={{ width: "100%" }}>
          <KeyValueItem
            keyText={
              I18n.t("product_details_screen_cost_breakdown_repairs") + date
            }
            valueText={`₹ ${item.premiumAmount}`}
          />
        </View>
      );
    });

    amountBreakdownOptions.push(
      <View style={{ width: "100%" }}>
        <KeyValueItem
          keyText={I18n.t("product_details_screen_cost_breakdown_total")}
          valueText={`₹ ${totalAmount}`}
        />
      </View>
    );
    console.log("total amount", totalAmount)
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
                  style={{ fontSize: 12, textAlign: "center", marginBottom: 5 }}
                >
                  Price Break
                </Text>
                />
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
    paddingTop: 40,
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
