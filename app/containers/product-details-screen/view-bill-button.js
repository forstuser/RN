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
        <View style={{
          alignItems: "center"
        }}>
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
          </TouchableOpacity>
          <Text weight="Medium" style={styles.viewBillText}>VIEW {btnText.toUpperCase()}</Text>
        </View>
      );
    } else {
      return (
        <View style={{
          alignItems: "center"
        }}>
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
            uploadCallback={() => { }}
          />
          <Image style={styles.viewBillIcon} source={viewBillIcon} />
        </TouchableOpacity>
        <Text style={styles.viewBillText} weight="Medium" >
            {I18n.t("product_details_screen_your_upload").toUpperCase()} {btnText.toUpperCase()}
          </Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  viewBillBtn: {
    width: 40,
    // position: "absolute",
    // right: 10,
    top: 10,
    borderColor: colors.pinkishOrange,
    borderWidth: 2,
    height: 40,
    borderRadius: 100,
    // flexDirection: "row",
    alignItems: "center",
    // paddingHorizontal: 3,
    zIndex: 2
  },
  viewBillIcon: {
    width: 14,
    height: 14,
    marginTop: 10
  },
  viewBillText: {
    fontSize: 10,
    textAlign: "center",
    color: '#9b9b9b',
    marginTop:10,
  }
});

export default ViewBillButton;
