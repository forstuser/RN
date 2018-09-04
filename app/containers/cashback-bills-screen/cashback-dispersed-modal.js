import React from "react";
import { View, TouchableOpacity, FlatList } from "react-native";

import { Text } from "../../elements";
import Modal from "../../components/modal";
import { colors } from "../../theme";

export default class StatusModal extends React.Component {
  state = {
    isVisible: false,
    item: {}
  };

  show = item => {
    this.setState({ isVisible: true, item });
  };

  hide = () => {
    this.setState({ isVisible: false });
  };

  render() {
    const { isVisible, item } = this.state;

    const items = item.expense_sku_items;

    return (
      <Modal
        isVisible={isVisible}
        title={"Cashback Dispersed"}
        onClosePress={this.hide}
        onBackButtonPress={this.hide}
        onBackdropPress={this.hide}
        style={{ height: 420, backgroundColor: "#fff" }}
      >
        <View
          style={{
            padding: 15,
            flex: 1
          }}
        >
          <FlatList
            style={{
              flex: 1,
              borderBottomColor: "#efefef",
              borderBottomWidth: 1
            }}
            data={items}
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
                    <Text weight="Medium" style={{ fontSize: 9 }}>
                      {item.sku.title}
                      <Text
                        style={{
                          fontSize: 9,
                          color: colors.secondaryText,
                          marginLeft: 2
                        }}
                      >
                        {item.sku_measurement
                          ? `  (${item.sku_measurement.measurement_value +
                              item.sku_measurement.measurement.acronym})`
                          : ``}
                      </Text>
                      <Text
                        style={{
                          fontSize: 9,
                          color: colors.secondaryText,
                          marginLeft: 2
                        }}
                      >
                        {` x ${item.quantity}`}
                      </Text>
                    </Text>
                  </View>
                  <Text style={{ fontSize: 9 }}>
                    ₹ {item.available_cashback}
                  </Text>
                </View>
              );
            }}
          />
          <View
            style={{
              flexDirection: "row",
              height: 36,
              borderBottomColor: "#efefef",
              borderBottomWidth: 1,
              alignItems: "center"
            }}
          >
            <Text style={{ fontSize: 11, flex: 1 }} weight="Bold">
              Total Amount
            </Text>
            <Text style={{ fontSize: 11 }} weight="Bold">
              ₹ {item.amount_paid}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              height: 36,
              borderBottomColor: "#efefef",
              borderBottomWidth: 1,
              alignItems: "center"
            }}
          >
            <Text style={{ fontSize: 11, flex: 1 }} weight="Bold">
              Amount Dispersed *
            </Text>
            <Text style={{ fontSize: 11 }} weight="Bold">
              ₹ {item.total_cashback}
            </Text>
          </View>
          <Text style={{ fontSize: 10 }}>
            * Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque vestibulum pretium ligula, sit amet fringilla purus. Ut
            fringilla ultricies consequat.
          </Text>
          <View style={{ marginTop: 15, alignItems: "center" }}>
            <Text style={{ fontSize: 9 }}>
              <Text style={{ color: colors.mainBlue }}>Click here</Text> if you
              have any query.
            </Text>
            <Text
              style={{
                marginTop: 5,
                fontSize: 9,
                textAlign: "center",
                color: colors.mainBlue,
                textDecorationLine: "underline"
              }}
            >
              Terms & Conditions
            </Text>
          </View>
        </View>
      </Modal>
    );
  }
}
