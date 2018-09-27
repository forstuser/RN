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
    const { openCashbackGuidelinesScreen } = this.props;
    const { isVisible, item } = this.state;

    let title = "Approved";
    let description = item.status_message;
    if (item.is_pending) {
      title = "Pending Approval";
    } else if (item.is_underprogress || item.is_partial) {
      title = "In Progress";
    } else if (item.is_rejected) {
      title = "Rejected";
    } else if (item.is_discarded) {
      statusText = "Discarded";
    }

    const items = item.expense_sku_items;

    let totalCashback = 0;
    let modalHeight = 200;

    if (items) {
      totalCashback = items.reduce((total, item) => {
        return total + item.available_cashback;
      }, 0);

      if (title == "Approved") {
        modalHeight = 225 + items.length * 40;
      }

      if (modalHeight > 500) {
        modalHeight = 500;
      }
    }

    return (
      <Modal
        isVisible={isVisible}
        title={"Cashback " + title}
        onClosePress={this.hide}
        onBackButtonPress={this.hide}
        onBackdropPress={this.hide}
        style={{
          height: modalHeight,
          backgroundColor: "#fff"
        }}
      >
        <View
          style={{
            padding: 15,
            flex: 1
          }}
        >
          <Text>{item.status_message}</Text>

          {title == "Approved" ? (
            <View style={{ flex: 1 }}>
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
                    Fixed Cashback
                  </Text>
                </View>
                <Text style={{ fontSize: 9 }}>₹ 2</Text>
              </View>
              <View style={{ flex: 1 }}>
                <FlatList
                  style={{
                    borderBottomColor: "#efefef",
                    borderBottomWidth: 1
                  }}
                  data={items}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => {
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
                          style={{
                            flexDirection: "row",
                            flex: 1,
                            marginRight: 20
                          }}
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
                  Total
                </Text>
                <Text style={{ fontSize: 11 }} weight="Bold">
                  ₹ {totalCashback + 2}
                </Text>
              </View>
            </View>
          ) : null}
          <View style={{ marginTop: 15, alignItems: "center" }}>
            {/* <Text style={{ fontSize: 14 }}>
              <Text style={{ color: colors.mainBlue }}>Click here</Text> if you
              have any query.
            </Text> */}
            <Text
              onPress={openCashbackGuidelinesScreen}
              style={{
                marginTop: 5,
                fontSize: 14,
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
