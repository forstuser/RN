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

class RepairDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: {}
    };
  }

  openAddEditRepairScreen = repair => {
    const { product } = this.props;

    this.props.navigator.push({
      screen: SCREENS.ADD_EDIT_REPAIR_SCREEN,
      passProps: {
        mainCategoryId: product.masterCategoryId,
        categoryId: product.categoryId,
        productId: product.id,
        jobId: product.jobId,
        repair: repair
      }
    });
  };

  render() {
    const { product } = this.props;
    const { repairBills } = product;

    return (
      <View>
        <Collapsible
          headerText={I18n.t("product_details_screen_repairs_title")}
        >
          {repairBills.length > 0 && (
            <View>
              {repairBills.map(repairBill => (
                <View>
                  <EditOptionRow
                    date={repairBill.expiryDate}
                    onEditPress={() => {
                      this.openAddEditRepairScreen(repairBill);
                    }}
                  />
                  <ViewBillRow
                    expiryDate={repairBill.expiryDate}
                    purchaseDate={repairBill.purchaseDate}
                    docType="Repair Bill"
                    copies={repairBill.copies}
                  />
                  <KeyValueItem
                    keyText={I18n.t(
                      "product_details_screen_repairs_repair_date"
                    )}
                    valueText={
                      moment(repairBill.purchaseDate).isValid() &&
                      moment(repairBill.purchaseDate).format("DD MMM YYYY")
                    }
                  />
                  <KeyValueItem
                    keyText={I18n.t("product_details_screen_repairs_amount")}
                    valueText={repairBill.premiumAmount}
                  />
                  <KeyValueItem
                    keyText={I18n.t("product_details_screen_repairs_for")}
                    valueText={repairBill.repair_for}
                  />
                  <KeyValueItem
                    keyText={I18n.t(
                      "product_details_screen_repairs_warranty_upto"
                    )}
                    valueText={repairBill.warranty_upto}
                  />
                  {repairBill.sellers != null && (
                    <KeyValueItem
                      keyText={I18n.t("product_details_screen_repairs_seller")}
                      valueText={repairBill.sellers.sellerName || ""}
                    />
                  )}
                  {repairBill.sellers != null && (
                    <KeyValueItem
                      keyText={I18n.t(
                        "product_details_screen_repairs_seller_contact"
                      )}
                      ValueComponent={() => (
                        <MultipleContactNumbers
                          contact={repairBill.sellers.contact}
                        />
                      )}
                    />
                  )}
                </View>
              ))}
            </View>
          )}
          {repairBills.length == 0 && (
            <Text
              weight="Bold"
              style={{ textAlign: "center", padding: 16, color: "red" }}
            >
              {I18n.t("product_details_screen_repairs_no_info")}
            </Text>
          )}
          <Button
            text="+ ADD REPAIR"
            onPress={() => this.openAddEditRepairScreen(null)}
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

export default RepairDetails;
