import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";
import { Text, Button, ScreenContainer } from "../../../../elements";
import moment from "moment";
import KeyValueItem from "../../../../components/key-value-item";
import { colors } from "../../../../theme";
import I18n from "../../../../i18n";
import { openBillsPopUp } from "../../../../navigation";

const ViewBillRow = ({ text, onEditPress }) => {
  return (
    <TouchableOpacity
      onPress={onEditPress}
      style={{ backgroundColor: "#EBEBEB" }}
    >
      <KeyValueItem
        keyText={text}
        ValueComponent={() => (
          <Text
            weight="Bold"
            style={{
              textAlign: "right",
              flex: 1,
              color: colors.pinkishOrange
            }}
          >
            {I18n.t("product_details_screen_edit")}
          </Text>
        )}
      />
    </TouchableOpacity>
  );
};

export default ViewBillRow;
