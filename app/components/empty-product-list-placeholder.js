import React, { Component } from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { Text, Button } from "../elements";
import { colors } from "../theme";
import I18n from "../i18n";
import {
  SCREENS,
  MAIN_CATEGORY_IDS,
  CATEGORY_IDS,
  EXPENSE_TYPES
} from "../constants";
import Analytics from "../analytics";

class AddEmptyProductScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onPressItem = item => {
    Analytics.logEvent(Analytics.EVENTS.ADD_PRODUCT_INSIDE_EHOME_MAIN_CATEGORIES);
    this.props.navigator.push({
      screen: SCREENS.ADD_PRODUCT_SCREEN,
      passProps: { expenseType: item.type, category: item.category },
      overrideBackPress: true
    });
  };

  render() {
    const { mainCategoryId, category, navigator } = this.props;
    let item = { category };
    let item2 = null;
    // alert(mainCategoryId);
    switch (mainCategoryId) {
      case MAIN_CATEGORY_IDS.FURNITURE:
        item.type = EXPENSE_TYPES.FURNITURE;
        if (category.id == CATEGORY_IDS.FURNITURE.FURNITURE) {
          item.desc = I18n.t("products_list_no_result_desc_furniture");
          item.image = require("../images/main-categories/ic_furniture.png");
          item.buttonText = I18n.t("add_furniture");
        } else if (category.id == CATEGORY_IDS.FURNITURE.HARDWARE) {
          item.desc = I18n.t("products_list_no_result_desc_hardware");
          item.image = require("../images/categories/hardware.png");
          item.buttonText = I18n.t("add_hardware");
        } else {
          item.desc = I18n.t("products_list_no_result_desc_other_furniture");
          item.image = require("../images/main-categories/ic_furniture.png");
          item.buttonText = I18n.t("add_furniture_hardware");
        }
        break;

      case MAIN_CATEGORY_IDS.ELECTRONICS:
        item = {
          type: EXPENSE_TYPES.ELECTRONICS,
          desc: I18n.t("products_list_no_result_desc_electronics"),
          buttonText: I18n.t("add_electronics"),
          image: require("../images/main-categories/ic_electronics.png")
        };
        break;

      case MAIN_CATEGORY_IDS.AUTOMOBILE:
        item = {
          type: EXPENSE_TYPES.AUTOMOBILE,
          desc: I18n.t("products_list_no_result_desc_automobile"),
          buttonText: I18n.t("add_automobile"),
          image: require("../images/main-categories/ic_automobile.png")
        };
        break;

      case MAIN_CATEGORY_IDS.TRAVEL:
        item.type = EXPENSE_TYPES.TRAVEL;
        if (category.id == CATEGORY_IDS.TRAVEL.TRAVEL) {
          item.desc = I18n.t("products_list_no_result_desc_travel");
          item.buttonText = I18n.t("add_travel");
          item.image = require("../images/main-categories/ic_travel_dining.png");
        } else if (category.id == CATEGORY_IDS.TRAVEL.HOTEL_STAY) {
          item.desc = I18n.t("products_list_no_result_desc_hotel_stay");
          item.buttonText = I18n.t("add_hotel_stay");
          item.image = require("../images/categories/hotel.png");
        } else {
          item.desc = I18n.t("products_list_no_result_desc_dining");
          item.buttonText = I18n.t("add_dining");
          item.image = require("../images/categories/dining.png");
        }
        break;

      case MAIN_CATEGORY_IDS.HEALTHCARE:
        item.type = EXPENSE_TYPES.HEALTHCARE;
        if (category.id == CATEGORY_IDS.HEALTHCARE.EXPENSE) {
          item.desc = I18n.t("products_list_no_result_desc_expense");
          item.buttonText = I18n.t("add_expense");
          item.image = require("../images/main-categories/ic_healthcare.png");
        } else if (category.id == CATEGORY_IDS.HEALTHCARE.MEDICAL_DOC) {
          item.type = EXPENSE_TYPES.MEDICAL_DOCS;

          item.desc = I18n.t("products_list_no_result_desc_medical_docs");
          item.buttonText = I18n.t("add_medical_doc");
          item.image = require("../images/categories/medical_docs.png");
        } else {
          item.type = EXPENSE_TYPES.MEDICAL_DOCS;
          item.desc = I18n.t("products_list_no_result_desc_insurance");
          item.buttonText = I18n.t("add_healthcare");
          item.image = require("../images/categories/insurance.png");
        }
        break;

      case MAIN_CATEGORY_IDS.SERVICES:
        item.type = EXPENSE_TYPES.SERVICES;
        if (category.id == CATEGORY_IDS.SERVICES.OTHER_SERVICES) {
          item.desc = I18n.t("products_list_no_result_desc_other_services");
          item.buttonText = I18n.t("add_other_services");
          item.image = require("../images/main-categories/ic_services.png");
        } else if (category.id == CATEGORY_IDS.SERVICES.PROFESSIONAL) {
          item.desc = I18n.t("products_list_no_result_desc_professional");
          item.buttonText = I18n.t("add_professional");
          item.image = require("../images/categories/professional.png");
        } else {
          item.desc = I18n.t("products_list_no_result_desc_lessons");
          item.buttonText = I18n.t("add_lessons_hobbies");
          item.image = require("../images/categories/hobbies.png");
        }
        break;

      case MAIN_CATEGORY_IDS.FASHION:
        item = {
          type: EXPENSE_TYPES.FASHION,
          desc: I18n.t("products_list_no_result_desc_fashion"),
          buttonText: I18n.t("add_fashion_expense"),
          image: require("../images/main-categories/ic_fashion.png")
        };
        break;

      case MAIN_CATEGORY_IDS.HOUSEHOLD:
        item.type = EXPENSE_TYPES.HOME;
        if (category.id == CATEGORY_IDS.HOUSEHOLD.HOUSEHOLD_EXPENSE) {
          item.desc = I18n.t("products_list_no_result_desc_household_expense");
          item.buttonText = I18n.t("add_household_expense");
          item.image = require("../images/categories/household.png");
        } else if (category.id == CATEGORY_IDS.HOUSEHOLD.UTILITY_BILLS) {
          item.desc = I18n.t("products_list_no_result_desc_utility_bills");
          item.buttonText = I18n.t("add_utility_bills");
          item.image = require("../images/categories/utility_bill.png");
        } else if (category.id == CATEGORY_IDS.HOUSEHOLD.EDUCATION) {
          item.desc = I18n.t("products_list_no_result_desc_education");
          item.buttonText = I18n.t("add_education");
          item.image = require("../images/categories/education.png");
        } else if (category.id == CATEGORY_IDS.HOUSEHOLD.HOME_DECOR) {
          item.desc = I18n.t("products_list_no_result_desc_home_decor");
          item.buttonText = I18n.t("add_home_decor");
          item.image = require("../images/categories/home_decor.png");
        } else {
          item.desc = I18n.t("products_list_no_result_desc_other_household");
          item.buttonText = I18n.t("add_other_household");
          item.image = require("../images/main-categories/ic_home_expenses.png");
        }
        break;

      case MAIN_CATEGORY_IDS.OTHERS:
        item = {
          type: EXPENSE_TYPES.OTHERS,
          desc: I18n.t("products_list_no_result_desc_others"),
          image: require("../images/main-categories/ic_personal_doc.png"),
          buttonText: "Add Others"
        };
        break;

      case MAIN_CATEGORY_IDS.PERSONAL:
        item.type = EXPENSE_TYPES.PERSONAL;
        if (category.id == CATEGORY_IDS.PERSONAL.VISITING_CARD) {
          item.type = EXPENSE_TYPES.VISITING_CARD;
          item.desc = I18n.t("products_list_no_result_desc_visiting_card");
          item.buttonText = I18n.t("add_visiting_card");
          item.image = require("../images/main-categories/ic_visiting_card.png");
        } else if (category.id == CATEGORY_IDS.PERSONAL.RENT_AGREEMENT) {
          item.desc = I18n.t("products_list_no_result_desc_rent_agreement");
          item.buttonText = I18n.t("add_rent_agreement");
          item.image = require("../images/main-categories/ic_personal_doc.png");
        } else {
          item.desc = I18n.t("products_list_no_result_desc_personal");
          item.buttonText = I18n.t("add_personal");
          item.image = require("../images/main-categories/ic_personal_doc.png");
        }
        break;

      default:
        desc = "";
    }
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={item.image} />
        <Text style={styles.desc}>{item.desc}</Text>
        {this.props.mainCategoryId != 9 && (
          <Text style={styles.below}>{I18n.t("product_list_click_below")}</Text>
        )}
        {/* {this.props.mainCategoryId == 9 && ( */}
        <View>
          <Button
            onPress={() => this.onPressItem(item)}
            text={item.buttonText}
            color="secondary"
            style={styles.button}
          />
        </View>
        {/* )} */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff"
  },
  button: {
    width: 320,
    height: 50,
    fontSize: 16
  },
  image: {
    width: 144,
    height: 134,
    resizeMode: "contain"
  },
  title: {
    fontSize: 18,
    color: colors.mainText
  },
  desc: {
    fontSize: 16,
    textAlign: "center",
    padding: 20,
    color: colors.lighterText
  },
  below: {
    fontSize: 16,
    textAlign: "center",
    padding: 16,
    color: colors.lighterText,
    marginTop: 60,
    marginBottom: 30
  }
});

export default AddEmptyProductScreen;
