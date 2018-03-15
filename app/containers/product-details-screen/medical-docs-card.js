import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
  Text as NativeText
} from "react-native";
import _ from "lodash";
import moment from "moment";
import ScrollableTabView, {
  DefaultTabBar
} from "react-native-scrollable-tab-view";
import Icon from "react-native-vector-icons/Entypo";
import { Navigation } from "react-native-navigation";

import Modal from "react-native-modal";

import { SCREENS } from "../../constants";
import { API_BASE_URL, getProductDetails } from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";

import I18n from "../../i18n";

import { colors } from "../../theme";

import LoadingOverlay from "../../components/loading-overlay";
import KeyValueItem from "../../components/key-value-item";
import MultipleContactNumbers from "./multiple-contact-numbers";

let mapIcon = require("../../images/ic_details_map.png");
import { openBillsPopUp } from "../../navigation";

import ViewBillButton from "./view-bill-button";

class MedicalDocsCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onEditPress = () => {
    const { product } = this.props;
    let seller = {
      name: "",
      contact: ""
    };

    if (product.sellers) {
      seller = {
        name: product.sellers.sellerName || "",
        contact: product.sellers.contact || ""
      };
    }

    this.props.navigator.push({
      screen: SCREENS.EDIT_MEDICAL_DOCS_SCREEN,
      passProps: {
        typeId: product.sub_category_id,
        productId: product.id,
        jobId: product.jobId,
        reportTitle: product.productName,
        date: product.purchaseDate,
        doctorName: seller.name,
        doctorContact: seller.contact,
        copies: product.copies || []
      },
      overrideBackPress: true
    });
  };

  render() {
    const { product } = this.props;
    let seller = {
      name: "",
      contact: ""
    };

    if (product.sellers) {
      seller = {
        name: product.sellers.sellerName || "",
        contact: product.sellers.contact || ""
      };
    }

    let imageSource = { uri: API_BASE_URL + "/" + product.cImageURL + "0" };
    if (product.copies && product.copies.length > 0) {
      imageSource = { uri: API_BASE_URL + product.copies[0].copyUrl };
    }

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <ViewBillButton
            product={product}
            navigator={navigator}
            docType="Medical Doc"
            btnText={I18n.t("product_details_screen_docs")}
          />
          <Image
            style={styles.image}
            source={{ uri: API_BASE_URL + "/" + product.cImageURL + "0" }}
          />
          <Text weight="Bold" style={styles.name}>
            {product.productName}
          </Text>
          <Text weight="Bold" style={styles.subCategoryName}>
            {product.sub_category_name}
          </Text>
          <TouchableOpacity
            onPress={this.onEditPress}
            style={{
              marginTop: 20,
              width: "100%",
              backgroundColor: "#EBEBEB"
            }}
          >
            <KeyValueItem
              KeyComponent={() => (
                <Text
                  weight="Bold"
                  style={{
                    flex: 1,
                    color: colors.mainText,
                    fontSize: 16
                  }}
                >
                  {I18n.t("product_details_screen_general_info")}
                </Text>
              )}
              ValueComponent={() => (
                <Text
                  weight="Bold"
                  style={{
                    textAlign: "right",
                    flex: 1,
                    color: colors.pinkishOrange
                  }}
                >
                  {I18n.t(" product_details_screen_edits")}
                </Text>
              )}
            />
          </TouchableOpacity>
          <KeyValueItem keyText="Name" valueText={product.productName} />

          <KeyValueItem
            keyText="Doctor/Hospital Name"
            valueText={seller.name}
          />
          <KeyValueItem
            keyText="Date"
            valueText={moment(product.purchaseDate).format("MMM DD, YYYY")}
          />
          <KeyValueItem
            keyText="Contact"
            ValueComponent={() => (
              <MultipleContactNumbers contact={seller.contact} />
            )}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30
  },
  contentContainer: {
    alignItems: "center"
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 20
  },
  name: {
    fontSize: 24
  },
  subCategoryName: {
    fontSize: 16,
    color: colors.secondaryText
  },
  metaUnderName: {
    fontSize: 16,
    color: colors.secondaryText,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 18
  },
  totalText: {
    fontSize: 24,
    marginBottom: 7
  },
  totalAmount: {
    fontSize: 24
  },
  contactAfterSalesBtn: {
    position: "absolute",
    bottom: 10,
    left: 16,
    right: 16
  }
});

export default MedicalDocsCard;
