import React from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { Text, Image, Button } from "../../elements";
import { colors } from "../../theme";
import { API_BASE_URL } from "../../api";

export default ({ item, index, declineItem, orderStatus }) => {
  let cashback = 0;
  if (item.sku_measurement && item.sku_measurement.cashback_percent) {
    cashback = (
      ((item.sku_measurement.mrp * item.sku_measurement.cashback_percent) /
        100) *
      item.quantity
    ).toFixed(2);
  }

  let updatedCashback = 0;
  if (
    item.suggestion &&
    item.suggestion.sku_measurement &&
    item.suggestion.sku_measurement.cashback_percent
  ) {
    updatedCashback = (
      ((item.suggestion.sku_measurement.mrp *
        item.suggestion.sku_measurement.cashback_percent) /
        100) *
      item.updated_quantity
    ).toFixed(2);
  }

  let pack_no = "";
  let quant = "";

  let suggested_quantity = item.updated_quantity
    ? item.updated_quantity
    : item.quantity;

  if (
    item.sku_measurement &&
    item.sku_measurement.pack_numbers &&
    item.sku_measurement.pack_numbers > 0
  ) {
    pack_no = " x " + item.sku_measurement.pack_numbers;
  }

  if (item.quantity && item.quantity > 1) {
    quant = " x " + item.quantity;
  }

  return (
    <View
      style={{
        flexDirection: "row",
        padding: 10,
        marginHorizontal: 10
      }}
    >
      <View style={{ marginRight: 5 }}>
        <TouchableOpacity
          style={{
            // width: 55,
            // height: 60,
            //borderRadius: 8,
            // alignItems: "center",
            //justifyContent: "center",
            backgroundColor:
              (item.suggestion && orderStatus === 4) || !item.item_availability
                ? colors.secondaryText
                : "#fff"
          }}
        >
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
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 1
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text
            weight="Medium"
            style={{
              fontSize: 12,
              flex: 1,
              marginRight: 20,
              color:
                (item.suggestion && orderStatus === 4) ||
                !item.item_availability
                  ? colors.secondaryText
                  : colors.mainText
            }}
            numberOfLines={2}
          >
            {item.title}
            <Text
              style={{
                color: colors.secondaryText
              }}
            >
              {item.sku_measurement
                ? ` (${item.sku_measurement.measurement_value +
                    item.sku_measurement.measurement_acronym +
                    pack_no +
                    quant})`
                : ``}
            </Text>
          </Text>
          {item.selling_price ? (
            <Text
              style={{
                color: colors.secondaryText
              }}
            >
              Rs. {item.selling_price}
            </Text>
          ) : null}
        </View>
        <View
          style={{
            marginTop: 5
          }}
        >
          <View style={{ flexDirection: "row" }}>
            {cashback > 0 ? (
              <Text
                weight="Medium"
                style={{
                  fontSize: 10,
                  color:
                    (item.suggestion && orderStatus === 4) ||
                    !item.item_availability
                      ? colors.secondaryText
                      : colors.mainBlue
                }}
              >
                You get back ₹ {cashback}
              </Text>
            ) : (
              <View />
            )}
            {item.unit_price && item.unit_price !== 0 ? (
              <Text
                style={{
                  fontSize: 11,
                  position: "absolute",
                  right: 0,
                  top: -5,
                  color:
                    (item.suggestion && orderStatus === 4) ||
                    !item.item_availability
                      ? colors.secondaryText
                      : colors.mainText
                }}
              >
                (Rs. {item.unit_price} x {item.quantity})
              </Text>
            ) : (
              <View />
            )}
          </View>
          {!item.item_availability && !item.suggestion ? (
            <View
              style={{
                height: 20,
                borderRadius: 10,
                borderColor: colors.danger,
                borderWidth: 1,
                width: 105,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 10
              }}
            >
              <Text
                weight="Medium"
                style={{ fontSize: 9, marginTop: -2, color: colors.danger }}
              >
                Item Not Available
              </Text>
            </View>
          ) : null}
          {!item.item_availability && item.suggestion ? (
            <View style={{ marginTop: 25, marginLeft: -61 }}>
              <Text
                weight="Bold"
                style={{ fontSize: 12, color: colors.pinkishOrange }}
              >
                Suggested Item:
              </Text>
              <View style={{ flexDirection: "row", marginTop: 5 }}>
                {/* <TouchableOpacity
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: colors.success,
                    marginLeft: -20
                  }}
                >
                  <Icon name="md-checkmark" size={12} color="#fff" />
                </TouchableOpacity> */}
                <TouchableOpacity
                  style={{
                    width: 55,
                    height: 60,
                    //borderRadius: 8,
                    alignItems: "center",
                    //justifyContent: "center",
                    backgroundColor: "#fff"
                  }}
                >
                  <Image
                    style={{
                      padding: 5,
                      width: 55,
                      height: 60,
                      borderWidth: 1,
                      borderColor: "#e0e0e0"
                    }}
                    resizeMode="contain"
                    source={{
                      uri: API_BASE_URL + `/skus/${item.id}/images`
                    }}
                    //source={require("../../images/binbill_logo.png")}
                  />
                  {/* <Icon name="md-checkmark" size={12} color="#fff" /> */}
                </TouchableOpacity>
                <Text
                  weight="Medium"
                  style={{
                    fontSize: 12,
                    flex: 1,
                    marginLeft: 5,
                    marginRight: 20
                  }}
                  numberOfLines={2}
                >
                  {item.suggestion.title}
                  <Text
                    style={{
                      color: colors.secondaryText
                    }}
                  >
                    {/* {item.suggestion
                      ? ` (${
                          item.suggestion.measurement_value +
                          " X " +
                          item.updated_quantity
                            ? item.updated_quantity
                            : item.quantity
                        })`
                      : ``} */}
                    {` (${item.suggestion.measurement_value +
                      " x " +
                      suggested_quantity})`}
                  </Text>
                </Text>
                {item.selling_price || item.updated_selling_price ? (
                  <Text
                    style={{
                      color: colors.secondaryText
                    }}
                  >
                    Rs.{" "}
                    {item.updated_selling_price
                      ? item.updated_selling_price
                      : item.selling_price}
                  </Text>
                ) : null}
              </View>
              <View style={{ flexDirection: "row", marginTop: 5 }}>
                {cashback ? (
                  <Text
                    weight="Medium"
                    style={{
                      fontSize: 10,
                      color: colors.mainBlue
                    }}
                  >
                    You get back ₹ {updatedCashback}
                  </Text>
                ) : (
                  <View />
                )}
                {item.unit_price && item.unit_price !== 0 ? (
                  <Text
                    style={{
                      fontSize: 11,
                      position: "absolute",
                      right: 0,
                      top: -5
                    }}
                  >
                    (Rs. {item.unit_price} x{" "}
                    {item.updated_quantity
                      ? item.updated_quantity
                      : item.quantity}
                    )
                  </Text>
                ) : (
                  <View />
                )}
              </View>
              <Button
                onPress={declineItem}
                text="Decline"
                color="secondary"
                style={{ height: 23, width: 70, marginTop: 5 }}
                textStyle={{ fontSize: 10 }}
              />
            </View>
          ) : null}

          {(item.updated_measurement || item.updated_quantity) &&
          !item.suggestion ? (
            <View
              style={{
                flexDirection: "column",
                marginTop: 10
              }}
            >
              {item.updated_measurement ? (
                <View
                  style={{
                    height: 20,
                    borderRadius: 10,
                    borderColor: colors.danger,
                    borderWidth: 1,
                    width: 170,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 5
                  }}
                >
                  <Text
                    weight="Medium"
                    style={{ fontSize: 9, marginTop: -2, color: colors.danger }}
                  >
                    Available Quantity{" "}
                    {item.updated_measurement
                      ? ` (${item.updated_measurement.measurement_value +
                          item.updated_measurement.measurement_acronym})`
                      : ``}
                  </Text>
                </View>
              ) : null}
              {item.updated_quantity &&
              item.updated_quantity != item.quantity ? (
                <View
                  style={{
                    height: 20,
                    borderRadius: 10,
                    borderColor: colors.danger,
                    borderWidth: 1,
                    width: 170,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 5,
                    marginTop: 5
                  }}
                >
                  <Text
                    weight="Medium"
                    style={{ fontSize: 9, marginTop: -2, color: colors.danger }}
                  >
                    Available Unit{" "}
                    {item.updated_quantity ? ` (${item.updated_quantity})` : ``}
                  </Text>
                </View>
              ) : null}
              {item.updated_measurement ||
              (item.updated_quantity &&
                item.updated_quantity != item.quantity) ? (
                <Button
                  onPress={declineItem}
                  text="Decline"
                  color="secondary"
                  style={{ height: 23, width: 70, marginTop: 5 }}
                  textStyle={{ fontSize: 10 }}
                />
              ) : null}
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
};
