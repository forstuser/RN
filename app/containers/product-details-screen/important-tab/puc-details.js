import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";

import call from "react-native-phone-call";
import moment from "moment";

import { SCREENS } from "../../../constants";
import { Text, Button, ScreenContainer } from "../../../elements";
import I18n from "../../../i18n";
import { colors } from "../../../theme";
import Collapsible from "../../../components/collapsible";
import KeyValueItem from "../../../components/key-value-item";

import { openBillsPopUp } from "../../../navigation";

import MultipleContactNumbers from "../multiple-contact-numbers";
import ViewBillRow from "./view-bill-row";
import EditOptionRow from "./edit-option-row";

class PucDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: {}
    };
  }

  openAddEditPucScreen = puc => {
    const { product } = this.props;

    this.props.navigation.navigate(SCREENS.ADD_EDIT_PUC_SCREEN, {
      mainCategoryId: product.masterCategoryId,
      categoryId: product.categoryId,
      productId: product.id,
      jobId: product.jobId,
      puc: puc
    });
  };

  render() {
    const { product } = this.props;
    const { pucDetails } = product;

    return (
      <View collapsable={false}>
        <Collapsible headerText={I18n.t("product_details_screen_puc_title")}>
          {pucDetails.length > 0 ? (
            <View collapsable={false}>
              {pucDetails.map(puc => (
                <View collapsable={false}>
                  <EditOptionRow
                    date={puc.expiryDate}
                    onEditPress={() => {
                      this.openAddEditPucScreen(puc);
                    }}
                  />
                  <ViewBillRow
                    collapsable={false}
                    expiryDate={puc.expiryDate}
                    purchaseDate={puc.purchaseDate}
                    docType="PUC"
                    copies={puc.copies || []}
                  />
                  <KeyValueItem
                    keyText={I18n.t(
                      "product_details_screen_puc_effective_date"
                    )}
                    valueText={
                      puc.effectiveDate
                        ? moment(puc.effectiveDate).format("MMM DD, YYYY")
                        : "-"
                    }
                  />
                  <KeyValueItem
                    keyText={I18n.t("product_details_screen_puc_expiry_date")}
                    valueText={
                      puc.expiryDate
                        ? moment(puc.expiryDate).format("MMM DD, YYYY")
                        : "-"
                    }
                  />
                  <KeyValueItem
                    keyText={I18n.t("product_details_screen_puc_seller")}
                    valueText={puc.sellers ? puc.sellers.sellerName : "-"}
                  />

                  <KeyValueItem
                    keyText={I18n.t(
                      "product_details_screen_puc_seller_contact"
                    )}
                    ValueComponent={() => (
                      <MultipleContactNumbers
                        contact={puc.sellers ? puc.sellers.contact : "-"}
                      />
                    )}
                  />
                </View>
              ))}
            </View>
          ) : (
            <Text
              weight="Bold"
              style={{ textAlign: "center", padding: 16, color: "red" }}
            >
              {I18n.t("product_details_screen_puc_no_info")}
            </Text>
          )}
          <Button
            text={I18n.t("product_details_screen_add_puc")}
            onPress={() => this.openAddEditPucScreen(null)}
            type="outline"
            borderRadius={0}
            outlineBtnStyle={{ borderColor: "transparent" }}
          />
        </Collapsible>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  image: {
    width: 100,
    height: 100
  },
  subTitle: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 30
  }
});

export default PucDetails;
