import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Platform
} from "react-native";
import moment from "moment";
import LinearGradient from "react-native-linear-gradient";
import { Text, Button } from "../../elements";
import I18n from "../../i18n";
import { colors } from "../../theme";
import { API_BASE_URL } from "../../api";
import { openBillsPopUp } from "../../navigation";
import { SCREENS, SERVICE_TYPE_NAMES } from "../../constants";

const UpcomingServiceItem = ({ item, navigation }) => {
  // console.log("item: ", item);
  let icon = require("../../images/ic_comingup_expiring.png");
  let title = "";
  let subTitle = item.productName;
  let daysRemaining = item.daysRemaining;

  switch (item.productType) {
    case 2:
      title = I18n.t("component_items_warranty_expiry");
      break;
    case 3:
      title = I18n.t("component_items_insurance_expiry");
      break;
    case 4:
      title = I18n.t("component_items_amc_expiry");
      break;
    case 5:
      title = I18n.t("component_items_puc_expiry");
      break;
    case 6:
      title = `${item.schedule.service_number} (${
        SERVICE_TYPE_NAMES[item.schedule.service_type]
      })`;
      break;
    case 7:
      title = I18n.t("component_items_repair_warranty_expiry");
      break;

    //case 1:
    default:
      icon = require("../../images/ic_comingup_bill.png");
      title = item.productName;
      subTitle = "₹ " + item.value;
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
        <Text weight="Bold" style={styles.title}>
          {title}
        </Text>
        <Text style={styles.subTitle}>{subTitle}</Text>
      </View>
      <View style={styles.daysRemainingContainer}>
        <View style={styles.daysRemainingGradients}>
          <LinearGradient
            start={{ x: 0.0, y: 0 }}
            end={{ x: 0.0, y: 1 }}
            colors={[colors.tomato, colors.pinkishOrange]}
            style={{ flex: 1, borderTopLeftRadius: 4, borderTopRightRadius: 4 }}
          />
          <LinearGradient
            start={{ x: 0.0, y: 0 }}
            end={{ x: 0.0, y: 1 }}
            colors={[colors.pinkishOrange, colors.tomato]}
            style={{
              flex: 1,
              marginTop: 2,
              borderBottomLeftRadius: 4,
              borderBottomRightRadius: 4
            }}
          />
          <View style={styles.daysRemainingWapper}>
            <Text weight="Bold" style={styles.daysRemaining}>
              {daysRemaining}
            </Text>
          </View>
        </View>
        <Text weight="Medium" style={{ fontSize: 10 }}>
          Days Left
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    borderColor: "#eaeaea",
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 90
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 16
  },
  centerContainer: {
    flex: 1
  },
  title: {
    fontSize: 12
  },
  subTitle: {
    fontSize: 10,
    color: colors.secondaryText
  },
  daysRemainingContainer: {
    alignItems: "center"
  },
  daysRemainingGradients: {
    width: 40,
    height: 40,
    backgroundColor: "#eee",
    borderRadius: 4
  },
  daysRemainingWapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  daysRemaining: {
    fontSize: 30,
    color: "#fff",
    ...Platform.select({
      android: { marginTop: -5 }
    })
  }
});
export default UpcomingServiceItem;
