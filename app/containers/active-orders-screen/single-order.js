import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { loginToApplozic, openChatWithSeller } from "../../applozic";

import { Text, Button, Image } from "../../elements";
import { defaultStyles, colors } from "../../theme";
import { SCREENS, ORDER_STATUS_TYPES, ORDER_TYPES } from "../../constants";
import { API_BASE_URL } from "../../api";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";
import Analytics from "../../analytics";
import LoadingOverlay from "../../components/loading-overlay";

class SingleOrder extends Component {
  state = {
    isChatClicked: false
  };
  startChatWithSeller = async seller => {
    Analytics.logEvent(Analytics.EVENTS.CLICK_CHAT);
    this.setState({ isChatClicked: true });
    //this.setState({ isMySellersModalVisible: false });
    const { user } = this.props;
    try {
      await loginToApplozic({ id: user.id, name: user.name });
      openChatWithSeller({ id: seller.id });
      this.setState({ isChatClicked: false });
    } catch (e) {
      this.setState({ isChatClicked: false });
      showSnackbar({ text: e.message });
    }
  };
  render() {
    const { item } = this.props;
    let statusType = null;
    let orderType = item.order_type;
    if (item.status_type === ORDER_STATUS_TYPES.COMPLETE)
      statusType = (
        <Text style={{ fontSize: 11, color: colors.success }}>COMPLETED</Text>
      );
    else if (item.status_type === ORDER_STATUS_TYPES.NEW) {
      if (item.is_modified === true)
        statusType = (
          <Text style={{ fontSize: 11, color: colors.success }}>MODIFIED</Text>
        );
      else
        statusType = (
          <Text style={{ fontSize: 11, color: colors.success }}>NEW</Text>
        );
    } else if (item.status_type === ORDER_STATUS_TYPES.APPROVED)
      statusType = (
        <Text style={{ fontSize: 11, color: colors.pinkishOrange }}>
          IN PROGRESS
        </Text>
      );
    else if (item.status_type === ORDER_STATUS_TYPES.CANCELED)
      statusType = (
        <Text style={{ fontSize: 11, color: colors.danger }}>CANCELLED</Text>
      );
    else if (item.status_type === ORDER_STATUS_TYPES.REJECTED)
      statusType = (
        <Text style={{ fontSize: 11, color: colors.danger }}>REJECTED</Text>
      );
    else if (item.status_type === ORDER_STATUS_TYPES.OUT_FOR_DELIVERY)
      statusType = (
        <Text style={{ fontSize: 11, color: colors.mainBlue }}>
          OUT FOR DELIVERY
        </Text>
      );
    let status = <Text weight="Bold">{statusType}</Text>;
    let name = <Text weight="Bold">{item.seller.seller_name}</Text>;
    let quantity = null;
    if (orderType === ORDER_TYPES.FMCG)
      quantity = <Text weight="Bold">{item.order_item_counts}</Text>;
    let service =
      orderType == ORDER_TYPES.ASSISTED_SERVICE ? (
        <Text weight="Bold">
          {item.order_details.length > 0
            ? item.order_details[0].service_name
            : ""}
        </Text>
      ) : null;
    let dateTime = (
      <Text weight="Bold">
        {moment(item.created_at).format("DD MMM, YYYY")}{" "}
        {moment(item.created_at).format("hh:mm a")}
      </Text>
    );
    let amount = <Text weight="Bold">{item.total_amount}</Text>;

    let cashback = <Text weight="Bold">{item.available_cashback}</Text>;
    let cashbackStatus = (
      <Text style={styles.data}>Cashback earned: {cashback}</Text>
    );
    if (item.order_type === 2) {
      cashbackStatus = null;
      cashback = null;
    }

    if (item.cashback_status === 13) {
      cashbackStatus = (
        <Button
          style={{ height: 30, width: 200, marginTop: 10 }}
          text="View Cashback Status"
          onPress={() =>
            this.props.navigation.navigate(SCREENS.CASHBACK_BILLS_SCREEN, {
              orderID: item.job_id
            })
          }
          color="secondary"
          textStyle={{ fontSize: 14 }}
        />
      );
    }

    if (
      item.order_type !== 2 &&
      (item.cashback_status === null ||
        item.cashback_status === 15 ||
        item.cashback_status === 17 ||
        item.cashback_status === 18)
    ) {
      // cashback = <Text weight="Bold">0</Text>;
      // cashbackStatus = (
      //   <Text style={styles.data}>Cashback Upto: {cashback}</Text>
      // );
      cashbackStatus = null;
      cashback = null;
    }

    return (
      <TouchableOpacity style={styles.container} onPress={this.props.onPress}>
        <View style={[styles.box, styles.box1]}>
          <View
            style={{
              width: 70,
              height: 70,
              borderRadius: 34,
              backgroundColor: "#eee",
              alignItems: "center",
              justifyContent: "center"
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
                  `/consumer/sellers/${item.seller_id}/upload/1/images/0`
              }}
            />
          </View>
        </View>
        <View style={[styles.box, styles.box2]}>
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <Text style={styles.info}>Seller: {name}</Text>
            <Text style={styles.status}>{status}</Text>
          </View>
          {orderType == ORDER_TYPES.FMCG ? (
            <Text style={styles.data}>No. of items: {quantity}</Text>
          ) : (
            <Text style={styles.data}>Service requested: {service}</Text>
          )}

          <Text style={styles.data}>Date: {dateTime}</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.data}>Amount: {amount}</Text>
              {cashbackStatus}
            </View>
            <TouchableOpacity
              onPress={() => this.startChatWithSeller(item)}
              style={styles.bottomButton}
            >
              <Image
                source={require("../../images/chat.png")}
                resizeMode="contain"
                style={{ height: 30, width: 30 }}
              />
              <LoadingOverlay visible={this.state.isChatClicked} />
            </TouchableOpacity>
          </View>
        </View>
        {/* <View style={[styles.box, styles.box3]}>
                    <Text style={styles.status}>{status}</Text>
                </View> */}
      </TouchableOpacity>
    );
  }
}

const styles = {
  container: {
    ...defaultStyles.card,
    flex: 1,
    flexDirection: "row",
    borderRadius: 10,
    margin: 10
  },
  box: {},
  box1: {
    padding: 10
  },
  box2: {
    flex: 1,
    paddingBottom: 10
  },

  info: {
    marginTop: 10,
    flex: 2.5
    //marginRight: 5
  },
  data: {
    marginTop: 5
  },
  // status: {
  //   position: "absolute",
  //   top: 13,
  //   right: 10,
  //   flex: 1
  // },
  status: {
    flex: 1,
    textAlign: "right",
    marginTop: 12,
    marginRight: 10,
    fontSize: 16
  },
  imageIcon: {
    height: 60,
    width: 60,
    marginLeft: 10,
    marginTop: 40
  },
  // bottomButton: {
  //   marginRight: 20,
  //   padding: 10
  // },
  bottomButton: {
    position: "absolute",
    right: 5,
    bottom: 0
  },
  bottomButtonIcon: {
    fontSize: 18,
    marginRight: 5
  },
  bottomButtonText: {
    fontSize: 11
  }
};

const mapStateToProps = state => {
  return {
    user: state.loggedInUser
  };
};

export default connect(mapStateToProps)(SingleOrder);
