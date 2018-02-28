import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";
import { Text, Button, ScreenContainer } from "../../../elements";
import moment from "moment";
import I18n from "../../../i18n";
import KeyValueItem from "../../../components/key-value-item";
import { colors } from "../../../theme";
import { openBillsPopUp } from "../../../navigation";

const ViewBillRow = ({ date, onEditPress }) => {
  return (
    <TouchableOpacity
      onPress={onEditPress}
      style={{ flex: 1, backgroundColor: "#EBEBEB" }}
    >
      <KeyValueItem
        ValueComponent={() => (
          <Text
            weight="Bold"
            style={{
              textAlign: "right",
              flex: 1,
              color: colors.pinkishOrange
            }}
          >
            I18n.t("product_details_screen_edit")
          </Text>
        )}
        keyText={moment(date).format("DD MMM,YYYY")}
        ValueComponent={() => (
          <Text
            weight="Bold"
            style={{
              textAlign: "right",
              flex: 1,
              color: colors.pinkishOrange
            }}
          >
            I18n.t("product_details_screen_edit")
          </Text>
        )}
      />
    </TouchableOpacity>
  );
};

export default ViewBillRow;
