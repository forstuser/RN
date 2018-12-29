import React from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import Modal from "../../components/modal";
import { Text, Button, Image } from "../../elements";
import { colors, defaultStyles } from "../../theme";
import { API_BASE_URL } from "../../api";

import QuantityPlusMinus from "../../components/quantity-plus-minus";

export default class SelectedItemsList extends React.Component {
  state = {
    showDeliveryChargesModal: false
  };
  showModalDeliveryCharge = () => {
    this.setState({ showDeliveryChargesModal: true });
  };
  hideDeliveryChargesModal = () => {
    this.setState({ showDeliveryChargesModal: false });
  };
  render() {
    const {
      //measurementTypes,
      selectedItems,
      changeIndexQuantity,
      skuItemIdsCurrentlyModifying,
      deliveryChargeRules
    } = this.props;

    console.log("Items in My Shopping List_______________:", selectedItems);
    let totalAmount = 0;
    selectedItems.map(item => {
      console.log("item", item);
      totalAmount += item.sku_measurement.mrp;
    });
    let deliveryCharges = {},
      chargesDelivery = 0;
    if (deliveryChargeRules.length > 0) {
      deliveryCharges = deliveryChargeRules.find(
        item =>
          totalAmount > item.minimum_order_value &&
          totalAmount <= item.maximum_order_value
      );
    }
    if (!deliveryCharges || this.props.collectAtStore == true) {
      chargesDelivery = 0;
    } else {
      chargesDelivery = deliveryCharges.delivery_charges;
    }

    console.log("Delivery Charges__________", chargesDelivery);
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          contentContainerStyle={{
            borderBottomWidth: 1,
            borderBottomColor: "#eee",
            backgroundColor: "#fff"
          }}
          data={selectedItems}
          extraData={skuItemIdsCurrentlyModifying}
          ItemSeparatorComponent={() => (
            <View style={{ height: 1, backgroundColor: "#eee" }} />
          )}
          keyExtractor={(item, index) => item.id + "" + index}
          renderItem={({ item, index }) => {
            let cashback = 0;

            if (item.sku_measurement && item.sku_measurement.cashback_percent) {
              cashback =
                ((item.sku_measurement.mrp *
                  item.sku_measurement.cashback_percent) /
                  100) *
                item.quantity;
            }
            if (cashback > 10) {
              cashback = 10;
            }

            let pack_no = "";
            if (
              item.sku_measurement &&
              item.sku_measurement.pack_numbers &&
              item.sku_measurement.pack_numbers > 0
            ) {
              pack_no = " x " + item.sku_measurement.pack_numbers;
            }
            let measurement_acronym = "";
            // if (item.sku_measurement && item.sku_measurement.measurement_type) {
            //   measurement_acronym = measurementTypes.map(acronym => {
            //     return acronym.id == item.sku_measurement.measurement_type;
            //   });
            //   measurement_acronym = measurement_acronym.acronym;
            // }
            let isLoading = false;
            if (
              item.sku_measurement &&
              skuItemIdsCurrentlyModifying.includes(item.sku_measurement.id)
            ) {
              isLoading = true;
              console.log("isLoading: ", isLoading);
            } else {
              isLoading = false;
            }
            let offerPrice = 0;
            if (item.offer_discount > 0) {
              offerPrice = parseFloat(
                parseFloat(item.sku_measurement.mrp) *
                  parseFloat(1 - parseFloat(item.offer_discount) / 100)
              ).toFixed(2);
            }

            let savedPrice = 0;
            if (item.offer_discount && item.offer_discount > 0)
              savedPrice = parseFloat(
                parseFloat(item.sku_measurement.mrp) - parseFloat(offerPrice)
              ).toFixed(2);

            return (
              <View
                style={{
                  flexDirection: "row",
                  padding: 10
                }}
              >
                <View style={{ marginRight: 5 }}>
                  <View>
                    <Image
                      style={{
                        width: 80,
                        height: 80,
                        justifyContent: "flex-start",
                        alignSelf: "flex-start",
                        alignContent: "flex-start"
                      }}
                      resizeMode="contain"
                      source={{
                        uri:
                          API_BASE_URL +
                          `/skus/${item.id}/measurements/${
                            item.sku_measurement.id
                          }/images`
                      }}
                      //source={require("../../images/binbill_logo.png")}
                    />
                    {/* <Icon name="md-checkmark" size={12} color="#fff" /> */}
                  </View>
                </View>
                <View
                  style={{
                    flex: 1
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      weight="Medium"
                      style={{ fontSize: 12, flex: 1, marginRight: 20 }}
                      numberOfLines={3}
                    >
                      {item.offer_title
                        ? item.offer_type == 2 || item.offer_type == 3
                          ? item.title
                              .concat(" (")
                              .concat(item.offer_title)
                              .concat(")")
                          : item.offer_title
                        : item.title}
                      <Text
                        style={{
                          color: colors.mainText,
                          marginRight: 20
                        }}
                      >
                        {/* {item.sku_measurement
                        ? ` (${item.sku_measurement.measurement_value +
                            measurementTypes[
                              item.sku_measurement.measurement_type
                            ].acronym +
                            pack_no})`
                        : ``} */}
                        {item.sku_measurement
                          ? ` (${item.sku_measurement.measurement_value +
                              item.sku_measurement.measurement_acronym +
                              pack_no})`
                          : ``}
                      </Text>
                    </Text>
                    <QuantityPlusMinus
                      style={{ marginRight: 5 }}
                      show={this.props.show}
                      quantity={item.quantity}
                      onMinusPress={() => {
                        changeIndexQuantity(index, item.quantity - 1);
                      }}
                      onPlusPress={() => {
                        changeIndexQuantity(index, item.quantity + 1);
                      }}
                    />
                  </View>
                  <View>
                    <Text>
                      Price: ₹{" "}
                      {item.offer_discount > 0 && item.offer_type == 1
                        ? offerPrice
                        : item.sku_measurement.mrp}{" "}
                      {item.offer_discount > 0 && item.offer_type == 1 ? (
                        <Text style={{ color: colors.success }}>
                          ({item.offer_discount}% off)
                        </Text>
                      ) : null}
                    </Text>
                  </View>
                  {item.offer_discount > 0 && item.offer_type == 1 ? (
                    <View>
                      <Text
                        style={{
                          fontSize: 12,
                          marginTop: 4,
                          textDecorationLine: "line-through",
                          textDecorationColor: "#000"
                        }}
                      >
                        MRP: ₹ {item.sku_measurement.mrp}
                      </Text>
                    </View>
                  ) : (
                    <View />
                  )}
                  {item.offer_discount > 0 && item.offer_type == 1 ? (
                    <View>
                      <Text
                        //weight="Medium"
                        style={{
                          fontSize: 12,
                          marginTop: 8,
                          color: colors.success
                        }}
                      >
                        You save ₹ {savedPrice}
                      </Text>
                    </View>
                  ) : (
                    <View />
                  )}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop:
                        item.offer_discount > 0 ||
                        item.offer_type == 2 ||
                        item.offer_type == 3 ||
                        item.offer_type == 4
                          ? -3
                          : 0
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      {cashback &&
                      cashback > 0 &&
                      (!item.offer_discount ||
                        item.offer_discount <= 0 ||
                        item.offer_type != 1) ? (
                        <Text
                          //weight="Medium"
                          style={{
                            fontSize: 12,
                            color: colors.mainBlue
                          }}
                        >
                          You get cashback ₹ {cashback.toFixed(2)}
                        </Text>
                      ) : cashback &&
                        cashback > 0 &&
                        item.offer_discount &&
                        item.offer_discount > 0 &&
                        item.offer_type == 1 ? (
                        <Text
                          //weight="Medium"
                          style={{
                            fontSize: 12,
                            color: colors.mainBlue,
                            marginTop: 8
                          }}
                        >
                          You get additional cashback of ₹ {cashback.toFixed(2)}
                        </Text>
                      ) : (
                        <View />
                      )}
                    </View>
                    {!this.props.show ? (
                      <TouchableOpacity
                        onPress={() => {
                          changeIndexQuantity(index, 0);
                        }}
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: item.offer_discount > 0 ? -25 : 1,
                          marginRight: 5
                        }}
                      >
                        <Icon name="ios-trash" size={30} color="#999999" />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
                {isLoading && (
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bottom: 0,
                      width: 80,
                      backgroundColor: "rgba(255,255,255,0.5)",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <ActivityIndicator size="small" />
                  </View>
                )}
              </View>
            );
          }}
          ListFooterComponent={() => (
            <View>
              <View
                style={{
                  flexDirection: "row",
                  height: 42,
                  borderTopWidth: 1,
                  borderColor: "#eee",
                  marginHorizontal: 20,
                  alignItems: "center"
                }}
              >
                <Text weight="Medium" style={{ flex: 1 }}>
                  Total Amount
                </Text>
                <Text weight="Medium">
                  Rs. {parseFloat(totalAmount).toFixed(2)}
                </Text>
              </View>
              {chargesDelivery > 0 && this.props.collectAtStore == false ? (
                <View
                  style={{
                    flexDirection: "row",
                    height: 30,
                    marginHorizontal: 20,
                    borderBottomWidth: 1,
                    borderColor: "#eee",
                    alignItems: "center",
                    marginTop: -10
                  }}
                >
                  <Text style={{ flex: 1, fontSize: 12, color: "#777" }}>
                    Home Delivery Charges{" "}
                    <Icon
                      name="md-information-circle"
                      sixe={10}
                      onPress={this.showModalDeliveryCharge}
                    />
                  </Text>

                  <Text style={{ fontSize: 12, color: "#777" }}>
                    Rs. {parseFloat(chargesDelivery).toFixed(2)}
                  </Text>
                </View>
              ) : null}
              {chargesDelivery > 0 && this.props.collectAtStore == false ? (
                <View
                  style={{
                    flexDirection: "row",
                    height: 42,
                    marginHorizontal: 20,
                    alignItems: "center"
                  }}
                >
                  <Text weight="Medium" style={{ flex: 1 }}>
                    Payable Amount
                  </Text>
                  <Text weight="Medium">
                    Rs. {parseFloat(totalAmount + chargesDelivery).toFixed(2)}
                  </Text>
                </View>
              ) : null}
            </View>
          )}
        />
        <Modal
          isVisible={this.state.showDeliveryChargesModal}
          title="Home Delivery Charges"
          style={{
            height: 210,
            ...defaultStyles.card
          }}
          onClosePress={this.hideDeliveryChargesModal}
        >
          <FlatList
            contentContainerStyle={{
              backgroundColor: "#fff"
            }}
            data={deliveryChargeRules}
            ItemSeparatorComponent={() => (
              <View style={{ height: 1, backgroundColor: "#eee" }} />
            )}
            keyExtractor={(item, index) => item.id + "" + index}
            renderItem={({ item, index }) => {
              return (
                <View>
                  <View
                    style={{
                      padding: 10,
                      paddingLeft: 15,
                      paddingRight: 20,
                      height: 40,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    {index == 0 ? (
                      <Text style={{ fontSize: 12 }}>
                        Order Amount less than {item.maximum_order_value}
                      </Text>
                    ) : index == deliveryChargeRules.length - 1 ? (
                      <Text style={{ fontSize: 12 }}>
                        Order Amount {item.minimum_order_value} and above
                      </Text>
                    ) : (
                      <Text style={{ fontSize: 12 }}>
                        Order Amount between {item.minimum_order_value} and{" "}
                        {item.maximum_order_value}
                      </Text>
                    )}
                    <Text style={{ fontSize: 12 }}>
                      ₹ {item.delivery_charges}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        </Modal>
      </View>
    );
  }
}
