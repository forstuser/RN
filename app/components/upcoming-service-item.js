import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import moment from "moment";
import { Text, Button } from "../elements";
import I18n from "../i18n";
import { colors } from "../theme";
import { API_BASE_URL } from "../api";
import { openBillsPopUp } from "../navigation";
import { SCREENS, SERVICE_TYPE_NAMES } from "../constants";


const expiringInText = date => {
  const diff = date.diff(
    moment()
      .utcOffset("+0000")
      .startOf("day"),
    "days"
  );
  if (diff < 0) {
    return "Expired!";
  } else if (diff == 0) {
    return "Expiring Today!";
  } else if (diff == 1) {
    return "Expiring Tomorrow!";
  } else {
    return diff + " days left";
  }
};
const UpcomingServiceItem = ({ item, navigation }) => {
  let icon = require("../images/ic_comingup_bill.png");
  let title = "";
  let subTitle = "";
  let sidebarTitle = "";
  let sidebarSubTitle = "";

  switch (item.productType) {
    case 2:
      icon = require("../images/ic_comingup_expiring.png");
      title = I18n.t("component_items_warranty_expiry");
      subTitle = item.productName;
      sidebarTitle = expiringInText(moment(item.expiryDate));
      sidebarSubTitle = "";
      break;
    case 3:
      icon = require("../images/ic_comingup_expiring.png");
      title = I18n.t("component_items_insurance_expiry");
      subTitle = item.productName;
      sidebarTitle = expiringInText(moment(item.expiryDate));
      sidebarSubTitle = "";
      break;
    case 4:
      icon = require("../images/ic_comingup_expiring.png");
      title = I18n.t("component_items_amc_expiry");
      subTitle = item.productName;
      sidebarTitle = expiringInText(moment(item.expiryDate));
      sidebarSubTitle = "";
      break;
    case 5:
      icon = require("../images/ic_comingup_expiring.png");
      title = I18n.t("component_items_puc_expiry");
      subTitle = item.productName;
      sidebarTitle = expiringInText(moment(item.expiryDate));
      sidebarSubTitle = "";
      break;
    case 6:
      icon = require("../images/ic_comingup_expiring.png");
      title = `${item.schedule.service_number} (${
        SERVICE_TYPE_NAMES[item.schedule.service_type]
        })`;
      subTitle = item.productName;
      sidebarTitle = expiringInText(moment(item.schedule.due_date));
      sidebarSubTitle = "";
      break;
    case 7:
      icon = require("../images/ic_comingup_expiring.png");
      title = I18n.t("component_items_repair_warranty_expiry");
      subTitle = item.productName;
      sidebarTitle = expiringInText(moment(item.dueDate));
      sidebarSubTitle = "";
      break;

    //case 1:
    default:
      icon = require("../images/ic_comingup_expiring.png");
      title = item.productName;
      subTitle = item.address;
      sidebarTitle = "₹ " + item.value;
      sidebarSubTitle =
        moment(item.dueDate).isValid() &&
        "by " + moment(item.dueDate).format("DD MMM");
      break;
  }
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(SCREENS.PRODUCT_DETAILS_SCREEN, {
          productId: item.productId || item.id
        });
      }}
      style={styles.container}
    >
      <Image style={styles.icon} source={icon} />
      <View collapsable={false} style={styles.centerContainer}>
        <Text weight="Medium" style={styles.title}>
          {title}
        </Text>
        <Text style={styles.subTitle}>{subTitle}</Text>
      </View>
      <View collapsable={false} style={styles.rightContainer}>
        <Text weight="Medium" style={styles.expiringText}>
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
  expiringText: {
    color: "#fff",
    backgroundColor: "rgba(255,0,0,0.7)",
    fontSize: 10,
    paddingVertical: 2,
    paddingHorizontal: 5,
    marginLeft: 10
  },
  subTitle: {
    fontSize: 12,
    color: colors.secondaryText
  }
});
export default UpcomingServiceItem;
