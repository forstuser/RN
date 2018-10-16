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

    return (
      <FlatList
        contentContainerStyle={{
          borderBottomWidth: 1,
          borderBottomColor: "#eee"
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
                      uri: API_BASE_URL + `/skus/${item.id}/images`
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
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 5
                  }}
                >
                  <View style={{ flex: 1 }}>
                    {cashback ? (
                      <Text
                        weight="Medium"
                        style={{
                          fontSize: 10,
                          color: colors.mainBlue
                        }}
                      >
                        Cashback Up to ₹ {cashback.toFixed(2)}
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
                        marginTop: 1,
                        marginRight: 5
                      }}
                    >
                      <Icon
                        name="ios-trash-outline"
                        size={30}
                        color="#999999"
                      />
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
      />
    );
  }
}
