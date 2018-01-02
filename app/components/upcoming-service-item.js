import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import moment from "moment";
import { Text, Button } from "../elements";
import I18n from "../i18n";
import { colors } from "../theme";
import { API_BASE_URL } from "../api";
import { openBillsPopUp } from "../navigation";

const UpcomingServiceItem = ({ item, navigator }) => {
  let icon = require("../images/ic_comingup_bill.png");
  let title = "";
  let subTitle = "";
  let sidebarTitle = "";
  let sidebarSubTitle = "";

  switch (item.productType) {
    case 1:
      icon = require("../images/ic_comingup_expiring.png");
      title = item.productName;
      subTitle = item.address;
      sidebarTitle = "₹ " + item.value;
      sidebarSubTitle = "on " + moment(item.expiryDate).format("DD MMM");
      break;
    case 2:
      icon = require("../images/ic_comingup_expiring.png");
      title = "Warranty expiring";
      subTitle = item.productName;
      sidebarTitle = "on " + moment(item.expiryDate).format("DD MMM");
      sidebarSubTitle = "";
      break;
    case 3:
      icon = require("../images/ic_comingup_expiring.png");
      title = "Insurance expiring";
      subTitle = item.productName;
      sidebarTitle = "on " + moment(item.expiryDate).format("DD MMM");
      sidebarSubTitle = "";
      break;

    case 4:
      icon = require("../images/ic_comingup_scheduled.png");
      title = "AMC expiring";
      subTitle = item.productName;
      sidebarTitle = "on " + moment(item.expiryDate).format("DD MMM");
      sidebarSubTitle = "";
      break;
    default:
  }
  return (
    <TouchableOpacity
      onPress={() => {
        if (item.productType == 1) {
          openBillsPopUp({
            date: item.purchaseDate,
            id: item.productName,
            copies: item.copies
          });
        } else {
          navigator.push({
            screen: "ProductDetailsScreen",
            passProps: {
              productId: item.productId
            }
          });
        }
      }}
      style={styles.container}
    >
      <Image style={styles.icon} source={icon} />
      <View style={styles.centerContainer}>
        <Text weight="Medium" style={styles.title}>
          {title}
        </Text>
        <Text style={styles.subTitle}>{subTitle}</Text>
      </View>
      <View style={styles.rightContainer}>
        <Text weight="Medium" style={styles.title}>
          {sidebarTitle}
        </Text>
        <Text style={styles.subTitle}>{sidebarSubTitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 14,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    borderColor: "#eaeaea",
    borderTopWidth: 1,
    flexDirection: "row",
    height: 65
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 16
  },
  centerContainer: {
    flex: 1
  },
  title: {
    fontSize: 14,
    color: colors.mainText,
    marginBottom: 2
  },
  subTitle: {
    fontSize: 12,
    color: colors.secondaryText
  }
});
export default UpcomingServiceItem;
