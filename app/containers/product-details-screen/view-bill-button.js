import React from "react";
import {
  StyleSheet,
  View,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView
} from "react-native";
import Analytics from "../../analytics";
import I18n from "../../i18n";
import { API_BASE_URL } from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";

import { openBillsPopUp } from "../../navigation";

import { colors } from "../../theme";

import UploadBillOptions from "../../components/upload-bill-options";

const viewBillIcon = require("../../images/ic_ehome_view_bill.png");

class ViewBillButton extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      product,
      navigator,
      docType = "Product",
      btnText = "Bill",
      style
    } = this.props;
    if (product.copies && product.copies.length > 0) {
      return (
        <TouchableOpacity
          onPress={() => {
            Analytics.logEvent(Analytics.EVENTS.CLICK_VIEW_BILL);
            openBillsPopUp({
              date: product.purchaseDate,
              id: product.id,
              copies: product.copies,
              type: docType
            });
          }}
          style={[styles.viewBillBtn, style]}
        >
          <Image style={styles.viewBillIcon} source={viewBillIcon} />
          <Text style={styles.viewBillText}>View {btnText}</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => {
            Analytics.logEvent(Analytics.EVENTS.CLICK_VIEW_BILL);
            this.uploadBillOptions.show(
              product.jobId,
              1,
              product.id,
              product.id
            );
          }}
          style={[styles.viewBillBtn, style]}
        >
          <UploadBillOptions
            ref={o => (this.uploadBillOptions = o)}
            navigator={navigator}
            uploadCallback={() => {}}
          />
          <Image style={styles.viewBillIcon} source={viewBillIcon} />
          <Text style={styles.viewBillText}>
            {I18n.t("product_details_screen_your_upload")} {btnText}
          </Text>
        </TouchableOpacity>
      );
    }
  }
}

const styles = StyleSheet.create({
  viewBillBtn: {
    width: 80,
    position: "absolute",
    right: 10,
    top: 10,
    borderColor: colors.pinkishOrange,
    borderWidth: 2,
    height: 22,
    borderRadius: 2,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 3,
    zIndex: 2
  },
  viewBillIcon: {
    width: 14,
    height: 14,
    marginRight: 2
  },
  viewBillText: {
    fontSize: 10,
    color: colors.pinkishOrange
  }
});

export default ViewBillButton;
