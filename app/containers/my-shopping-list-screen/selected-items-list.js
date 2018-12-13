import React from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";

import Icon from "react-native-vector-icons/Ionicons";

import { Text, Button, Image } from "../../elements";
import { colors } from "../../theme";
import { API_BASE_URL } from "../../api";

import QuantityPlusMinus from "../../components/quantity-plus-minus";

export default class SelectedItemsList extends React.Component {
  render() {
    const {
      measurementTypes,
      selectedItems,
      changeIndexQuantity,
      skuItemIdsCurrentlyModifying
    } = this.props;

    console.log("Items in My Shopping List_______________:", selectedItems);
    let totalAmount = 0;
    selectedItems.map(item => {
      console.log("item", item);
      totalAmount += item.sku_measurement.mrp;
    });
    return (
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
                    numberOfLines={2}
                  >
                    {item.title}
                    <Text
                      style={{
                        color: colors.mainText,
                        marginRight: 20
                      }}
                    >
                      {item.sku_measurement
                        ? ` (${item.sku_measurement.measurement_value +
                            measurementTypes[
                              item.sku_measurement.measurement_type
                            ].acronym +
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
                    {item.offer_discount > 0
                      ? offerPrice
                      : item.sku_measurement.mrp}{" "}
                    {item.offer_discount > 0 ? (
                      <Text style={{ color: colors.success }}>
                        ({item.offer_discount}% off)
                      </Text>
                    ) : null}
                  </Text>
                </View>
                {item.offer_discount > 0 ? (
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
                {item.offer_discount > 0 ? (
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
                    marginTop: 0
                  }}
                >
                  <View style={{ flex: 1 }}>
                    {cashback &&
                    (!item.offer_discount || item.offer_discount <= 0) ? (
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
                      item.offer_discount &&
                      item.offer_discount > 0 ? (
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
          <View
            style={{
              flexDirection: "row",
              height: 42,
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: "#eee",
              marginHorizontal: 20,
              alignItems: "center"
            }}
          >
            <Text weight="Medium" style={{ flex: 1 }}>
              Total Amount
            </Text>
            <Text weight="Medium">Rs. {totalAmount}</Text>
          </View>
        )}
      />
    );
  }
}
