import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";
import call from "react-native-phone-call";
import { connect } from "react-redux";

import { loginToApplozic, openChatWithSeller } from "../../applozic";

import { API_BASE_URL } from "../../api";
import { Text, Button } from "../../elements";
import { defaultStyles, colors } from "../../theme";

import { openBillsPopUp } from "../../navigation";

import { LOCATIONS } from "../../constants";

class SellerDetails extends React.Component {
  call = () => {
    const { order } = this.props;
    call({ number: order.seller.contact_no }).catch(e =>
      showSnackbar({
        text: e.message
      })
    );
  };

  onViewBillPress = () => {
    const { order, openUploadBillPopup } = this.props;
    if (order.copies && order.copies.length > 0) {
      openBillsPopUp({
        copies: order.copies || []
      });
    } else {
      openUploadBillPopup();
    }
  };

  startChatWithSeller = async seller => {
    const { order } = this.props;
    this.setState({ isMySellersModalVisible: false });
    const { user } = this.props;
    try {
      await loginToApplozic({ id: user.id, name: user.name });
      openChatWithSeller({ id: order.seller_id });
    } catch (e) {
      showSnackbar({ text: e.message });
    }
  };

  render() {
    const { order, userLocation } = this.props;

    const { seller } = order;
    const orderDate = order.created_at;

    console.log(
      "seller image: " +
      API_BASE_URL +
      `/consumer/sellers/${order.seller_id}/upload/1/images/0`
    );

    return (
      <View style={{}}>
        <Text weight="Bold">Order Summary</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <View style={{ paddingRight: 12 }}>
            <View
              style={{
                width: 68,
                height: 68,
                borderRadius: 35,
                backgroundColor: "#eee"
              }}
            >
              <Image
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 35
                }}
                source={{
                  uri:
                    API_BASE_URL +
                    `/consumer/sellers/${order.seller_id}/upload/1/images/0`
                }}
              />
            </View>
          </View>
          <View style={{ padding: 12, paddingLeft: 0, flex: 1 }}>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1, justifyContent: "center" }}>
                <Text weight="Bold" style={{ fontSize: 13 }}>
                  {seller.seller_name}
                </Text>
                <Text style={{ fontSize: 11 }}>{seller.address}</Text>
                <Text style={{ fontSize: 10, color: "#777777" }}>
                  {moment(orderDate).format("DD MMM, YYYY")} |{" "}
                  {moment(orderDate).format("hh:mm a")}
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    onPress={() => this.call()}
                    style={{
                      marginTop: 8,
                      flexDirection: "row",
                      height: 26,
                      width: 65,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 15,
                      borderColor: "#c5c5c5",
                      borderWidth: 1
                    }}
                  >
                    <Icon
                      name="ios-call-outline"
                      size={18}
                      color={colors.pinkishOrange}
                    />
                    <Text
                      weight="Medium"
                      style={{ fontSize: 9, marginLeft: 7 }}
                    >
                      Call
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={this.startChatWithSeller}
                    style={{
                      marginTop: 8,
                      flexDirection: "row",
                      height: 26,
                      width: 65,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 15,
                      borderColor: "#c5c5c5",
                      borderWidth: 1,
                      marginLeft: 20
                    }}
                  >
                    <Icon
                      name="ios-chatbubbles-outline"
                      size={18}
                      color={colors.pinkishOrange}
                    />
                    <Text
                      weight="Medium"
                      style={{ fontSize: 9, marginLeft: 7 }}
                    >
                      Chat
                    </Text>
                  </TouchableOpacity>
                </View>
                {((order.copies && order.copies.length > 0) ||
                  (order.expense_id &&
                    order.upload_id &&
                    moment().diff(order.updated_at, "hours") < 24 &&
                    userLocation != LOCATIONS.OTHER)) && (
                    <TouchableOpacity
                      onPress={this.onViewBillPress}
                      style={{
                        marginTop: 10,
                        marginBottom: 5,
                        flexDirection: "row",
                        alignItems: "center",
                        borderColor: colors.pinkishOrange,
                        borderWidth: 1,
                        alignSelf: "flex-start",
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 15
                      }}
                    >
                      {/* <Icon
                      name="md-document"
                      color={colors.pinkishOrange}
                      size={15}
                    /> */}
                      <Text
                        weight="Medium"
                        style={{
                          marginTop: -3,
                          marginLeft: 4,
                          fontSize: 12,
                          color: colors.pinkishOrange
                        }}
                      >
                        {order.copies && order.copies.length > 0
                          ? `View Invoice`
                          : `Upload Invoice to Claim Cashback`}
                      </Text>
                    </TouchableOpacity>
                  )}
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.loggedInUser
  };
};

export default connect(mapStateToProps)(SellerDetails);
