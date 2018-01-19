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

class WarrantyDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: {}
    };
  }

  openAddEditWarrantyScreen = warranty => {
    const { product } = this.props;
    this.props.navigator.push({
      screen: SCREENS.ADD_EDIT_WARRANTY_SCREEN,
      passProps: {
        mainCategoryId: product.masterCategoryId,
        categoryId: product.categoryId,
        productId: product.id,
        jobId: product.jobId,
        warranty: warranty
      }
    });
  };

  render() {
    const { product } = this.props;
    const { warrantyDetails } = product;

    return (
      <View>
        <Collapsible
          headerText={I18n.t("product_details_screen_warranty_title")}
        >
          {warrantyDetails.length > 0 && (
            <View>
              {warrantyDetails.map(warranty => (
                <View>
                  <EditOptionRow
                    date={warranty.expiryDate}
                    onEditPress={() => {
                      this.openAddEditWarrantyScreen(warranty);
                    }}
                  />
                  <KeyValueItem
                    keyText={I18n.t("product_details_screen_warranty_expiry")}
                    valueText={
                      moment(warranty.expiryDate).isValid() &&
                      moment(warranty.expiryDate).format("DD MMM YYYY")
                    }
                  />
                  {warranty.sellers != null && (
                    <KeyValueItem
                      keyText={I18n.t("product_details_screen_warranty_seller")}
                      valueText={warranty.sellers.sellerName}
                    />
                  )}
                  {warranty.sellers != null && (
                    <KeyValueItem
                      keyText={I18n.t(
                        "product_details_screen_warranty_seller_contact"
                      )}
                      ValueComponent={() => (
                        <MultipleContactNumbers
                          contact={warranty.sellers.contact}
                        />
                      )}
                    />
                  )}
                  <ViewBillRow
                    expiryDate={warranty.expiryDate}
                    purchaseDate={warranty.purchaseDate}
                    docType="Warranty"
                    copies={warranty.copies}
                  />
                </View>
              ))}
            </View>
          )}
          {warrantyDetails.length == 0 && (
            <Text
              weight="Bold"
              style={{ textAlign: "center", padding: 16, color: "red" }}
            >
              {I18n.t("product_details_screen_warranty_no_info")}
            </Text>
          )}
          <Button
            text="+ ADD WARRANTY"
            onPress={() => this.openAddEditWarrantyScreen(null)}
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

export default WarrantyDetails;
