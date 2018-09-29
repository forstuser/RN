import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  FlatList
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";

import {
  updateExpense,
  linkSkusWithExpense,
  getSkuReferenceData
} from "../../api";

import { Text, Button } from "../../elements";
import { defaultStyles, colors } from "../../theme";
import Analytics from "../../analytics";

import { openBillsPopUp } from "../../navigation";

import ChecklistModal from "./checklist-modal";
import SuccessModal from "./success-modal";
import { showSnackbar } from "../../utils/snackbar";

export default class ClaimCashback extends React.Component {
  static navigationOptions = {
    title: "Claim Cashback"
  };

  state = {
    isChecklistModalVisible: false,
    isLoading: false,
    measurementTypes: null
  };

  componentDidMount() {
    this.loadReferenceData();
  }

  loadReferenceData = async () => {
    const { pastItems } = this.state;
    this.setState({ isLoading: true, referenceDataError: null });
    try {
      const res = await getSkuReferenceData();
      let measurementTypes = {};
      res.result.measurement_types.forEach(measurementType => {
        measurementTypes[measurementType.id] = measurementType;
      });
      this.setState({ measurementTypes });
    } catch (referenceDataError) {
      console.log("referenceDataError: ", referenceDataError);
    }
  };

  hideChecklistModal = () => {
    this.setState({ isChecklistModalVisible: false });
  };

  submit = async () => {
    Analytics.logEvent(Analytics.EVENTS.CASHBACK_CLAIM_SUBMIT);
    try {
      const { navigation } = this.props;
      const product = navigation.getParam("product", null);
      const cashbackJob = navigation.getParam("cashbackJob", null);
      const copies = navigation.getParam("copies", []);
      const purchaseDate = navigation.getParam("purchaseDate", null);
      const amount = navigation.getParam("amount", null);
      const isDigitallyVerified = navigation.getParam(
        "isDigitallyVerified",
        false
      );
      const isHomeDelivered = navigation.getParam("isHomeDelivered", undefined);
      const items = navigation.getParam("selectedItems", []);

      const seller = navigation.getParam("selectedSeller", null);

      showSnackbar({ text: "Please wait..." });

      await updateExpense({
        productId: product.id,
        value: Number(amount),
        documentDate: purchaseDate,
        digitallyVerified: isDigitallyVerified,
        homeDelivered: isHomeDelivered,
        isComplete: true,
        sellerId: seller ? seller.id : undefined
      });

      await linkSkusWithExpense({
        productId: product.id,
        jobId: product.job_id,
        skuItems: items.map(item => {
          return {
            selling_price: item.mrp,
            quantity: item.quantity,
            sku_id: item.id,
            sku_measurement_id: item.sku_measurement.id,
            cashback_job_id: cashbackJob.id,
            seller_id: seller ? seller.id : null,
            added_date: item.added_date || moment().toISOString()
          };
        })
      });
      this.successModal.show();
    } catch (error) {
      showSnackbar({ text: error.message });
      console.log("error: ", error);
    }
  };

  render() {
    const { navigation } = this.props;
    const copies = navigation.getParam("copies", []);
    const purchaseDate = navigation.getParam("purchaseDate", null);
    const amount = navigation.getParam("amount", null);
    const items = navigation.getParam("selectedItems", []);

    const seller = navigation.getParam("selectedSeller", null);

    const totalCashback = items.reduce((total, item) => {
      let cashback = 0;
      if (item.sku_measurement && item.sku_measurement.cashback_percent) {
        cashback =
          ((item.sku_measurement.mrp * item.sku_measurement.cashback_percent) /
            100) *
          item.quantity;
      }
      return total + cashback;
    }, 0);

    const { isChecklistModalVisible, measurementTypes } = this.state;
    console.log("items", items);
    return (
      <View style={{ backgroundColor: "#fff", flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              ...defaultStyles.card,
              flex: 1,
              margin: 10,
              borderRadius: 5,
              padding: 10
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.key}>Date:</Text>
                <Text style={styles.value}>
                  {moment(purchaseDate).format("DD MMM, YYYY")}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.key}>Total Amount:</Text>
                <Text style={styles.value}>Rs. {amount}</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10
              }}
            >
              <View style={{ flexDirection: "row", flex: 1, marginRight: 20 }}>
                <Text style={styles.key}>Seller:</Text>
                <Text style={[styles.value, { flexWrap: "wrap" }]}>
                  {seller ? seller.name : ""}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row"
                }}
              >
                <Text style={styles.key}>Expected BBCash:</Text>
                <Text style={styles.value}>Rs. {totalCashback.toFixed(2)}</Text>
              </View>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => {
                  openBillsPopUp({
                    copies: copies
                  });
                }}
                style={{ marginTop: 15, flexDirection: "row" }}
              >
                <Icon name="md-document" color={colors.mainBlue} size={15} />
                <Text
                  weight="Medium"
                  style={{
                    marginLeft: 2,
                    fontSize: 11,
                    color: colors.mainBlue
                  }}
                >
                  View Bill
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                marginTop: 15,
                borderBottomColor: "#efefef",
                borderBottomWidth: 1,
                paddingBottom: 7
              }}
            >
              <Text
                weight="Medium"
                style={{ fontSize: 11, color: colors.secondaryText, flex: 1 }}
              >
                Item List
              </Text>
              <Text
                weight="Medium"
                style={{ fontSize: 11, color: colors.secondaryText }}
              >
                Cashback
              </Text>
            </View>
            <FlatList
              data={items}
              extraData={measurementTypes}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                let cashback = 0;
                if (
                  item.sku_measurement &&
                  item.sku_measurement.cashback_percent
                ) {
                  cashback = (
                    ((item.sku_measurement.mrp *
                      item.sku_measurement.cashback_percent) /
                      100) *
                    item.quantity
                  ).toFixed(2);
                }

                return (
                  <View
                    style={{
                      flexDirection: "row",
                      height: 40,
                      alignItems: "center",
                      borderBottomColor: "#efefef",
                      borderBottomWidth: 1
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", flex: 1, marginRight: 20 }}
                    >
                      <Text weight="Medium" style={{ fontSize: 11 }}>
                        {item.title}
                        <Text
                          style={{
                            fontSize: 11,
                            color: colors.secondaryText,
                            marginLeft: 2
                          }}
                        >
                          {item.sku_measurement && measurementTypes
                            ? ` (${item.sku_measurement.measurement_value +
                                measurementTypes[
                                  item.sku_measurement.measurement_type
                                ].acronym})`
                            : ``}
                        </Text>
                        <Text
                          style={{
                            fontSize: 11,
                            color: colors.secondaryText,
                            marginLeft: 2
                          }}
                        >
                          {` x ${item.quantity}`}
                        </Text>
                      </Text>
                    </View>
                    <Text style={{ fontSize: 11, color: colors.mainBlue }}>
                      {cashback ? "₹" + cashback : "0"}
                    </Text>
                  </View>
                );
              }}
            />
          </View>
        </View>
        <View style={{ marginBottom: 10 }}>
          <TouchableOpacity
            onPress={() => this.setState({ isChecklistModalVisible: true })}
            style={{ alignSelf: "center", alignItems: "center" }}
          >
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: "#f1f1f1",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Image
                style={{ width: 20, height: 26 }}
                source={require("../../images/checklist_icon.png")}
              />
            </View>
            <Text
              style={{ marginTop: 7, color: colors.mainBlue, fontSize: 10 }}
            >
              View Checklist
            </Text>
          </TouchableOpacity>
        </View>
        <Button
          text="Submit"
          onPress={this.submit}
          borderRadius={0}
          color="secondary"
        />
        <ChecklistModal
          isChecklistModalVisible={isChecklistModalVisible}
          hideChecklistModal={this.hideChecklistModal}
        />
        <SuccessModal
          ref={node => {
            this.successModal = node;
          }}
          navigation={this.props.navigation}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  key: {
    fontSize: 11,
    marginRight: 3
  },
  value: {
    fontSize: 11,
    fontWeight: "500"
  }
});
