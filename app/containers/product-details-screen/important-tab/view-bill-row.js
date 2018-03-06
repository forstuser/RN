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
import KeyValueItem from "../../../components/key-value-item";
import { colors } from "../../../theme";
import { openBillsPopUp } from "../../../navigation";
import I18n from "../../../i18n";

const ViewBillRow = ({ expiryDate, purchaseDate, docType, copies = [] }) => {
  if (!moment(expiryDate).isValid()) {
    return null;
  }
  return (
    <View style={{ flex: 1 }}>
      <KeyValueItem
        keyText={`${docType} Doc`}
        ValueComponent={() => {
          if (copies.length == 0) {
            return (
              <Text
                weight="Medium"
                style={{
                  textAlign: "right",
                  flex: 1
                }}
              >
                -
              </Text>
            );
          }
          return (
            <Text
              onPress={() =>
                openBillsPopUp({
                  date: purchaseDate,
                  id: docType,
                  copies: copies,
                  type: docType
                })
              }
              style={{
                textAlign: "right",
                flex: 1,
                color: colors.pinkishOrange
              }}
            >
              {I18n.t("product_details_screen_view_doc")}
            </Text>
          );
        }}
      />
    </View>
  );
};

export default ViewBillRow;
