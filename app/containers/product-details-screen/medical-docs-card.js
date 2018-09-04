import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
  ScrollView,
  Platform
} from "react-native";
import _ from "lodash";
import moment from "moment";
import ScrollableTabView, {
  DefaultTabBar
} from "react-native-scrollable-tab-view";
import Icon from "react-native-vector-icons/Entypo";

import Modal from "react-native-modal";

import { SCREENS } from "../../constants";
import { API_BASE_URL, getProductDetails } from "../../api";
import { Text, Button, ScreenContainer, Image } from "../../elements";

import I18n from "../../i18n";

import { colors, defaultStyles } from "../../theme";

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

    this.props.navigation.navigate(SCREENS.EDIT_MEDICAL_DOCS_SCREEN, {
      typeId: product.sub_category_id,
      productId: product.id,
      jobId: product.jobId,
      reportTitle: product.productName,
      date: product.purchaseDate,
      doctorName: seller.name,
      doctorContact: seller.contact,
      copies: product.copies || []
    });
  };

  render() {
    const { product, navigation } = this.props;
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

    let imageSource = { uri: API_BASE_URL + "/" + product.cImageURL };
    if (product.copies && product.copies.length > 0) {
      imageSource = { uri: API_BASE_URL + product.copies[0].copyUrl };
    }

    return (
      <View collapsable={false} style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <Image
            style={styles.image}
            source={{ uri: API_BASE_URL + "/" + product.cImageURL }}
          />
          <Text weight="Bold" style={styles.name}>
            {product.productName}
          </Text>
          <Text weight="Bold" style={styles.subCategoryName}>
            {product.sub_category_name}
          </Text>
          <View
            collapsable={false}
            style={[defaultStyles.card, { margin: 16 }]}
          >
            <TouchableOpacity
              onPress={this.onEditPress}
              style={{
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
                    {I18n.t("product_details_screen_edits")}
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
          </View>
          <View
            collapsable={false}
            style={{ top: 10, position: "absolute", right: 10 }}
          >
            <ViewBillButton
              collapsable={false}
              product={product}
              navigation={navigation}
              docType="Medical Doc"
              btnText={I18n.t("product_details_screen_docs")}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7"
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
