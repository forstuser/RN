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

  EmptyProductListPlaceholder = ({
    mainCategoryId,
    categoryId,
    navigator
  }) => {};

  render() {
    const { mainCategoryId, categoryId, navigator } = this.props;
    onPressItem = type => {
      Analytics.logEvent(Analytics.EVENTS.CLICK_ADD_PRODUCT_OPTION);
      this.props.navigator.push({
        screen: SCREENS.ADD_EDIT_EXPENSE_SCREEN,
        passProps: { expenseType: type },
        overrideBackPress: true
      });
      console.log(this.props, "passprops");
    };
    // alert(mainCategoryId);
    switch (mainCategoryId) {
      case MAIN_CATEGORY_IDS.FURNITURE:
        if (categoryId == CATEGORY_IDS.FURNITURE.FURNITURE) {
          type = EXPENSE_TYPES.FURNITURE;
          desc = I18n.t("products_list_no_result_desc_furniture");
          image = require("../images/main-categories/ic_furniture.png");
          buttonText = I18n.t("add_furniture");
        } else if (categoryId == CATEGORY_IDS.FURNITURE.HARDWARE) {
          type = EXPENSE_TYPES.FURNITURE;
          desc = I18n.t("products_list_no_result_desc_hardware");
          image = require("../images/categories/hardware.png");
          buttonText = I18n.t("add_hardware");
        } else {
          type = EXPENSE_TYPES.FURNITURE;
          desc = I18n.t("products_list_no_result_desc_other_furniture");
          image = require("../images/main-categories/ic_furniture.png");
          buttonText = I18n.t("add_furniture_hardware");
        }
        break;

      case MAIN_CATEGORY_IDS.ELECTRONICS:
        type = EXPENSE_TYPES.ELECTRONICS;
        desc = I18n.t("products_list_no_result_desc_electronics");
        buttonText = I18n.t("add_electronics");
        image = require("../images/main-categories/ic_electronics.png");
        break;

      case MAIN_CATEGORY_IDS.AUTOMOBILE:
        type = EXPENSE_TYPES.AUTOMOBILE;
        desc = I18n.t("products_list_no_result_desc_automobile");
        buttonText = I18n.t("add_automobile");
        image = require("../images/main-categories/ic_automobile.png");
        break;

      case MAIN_CATEGORY_IDS.TRAVEL:
        if (categoryId == CATEGORY_IDS.TRAVEL.TRAVEL) {
          type = EXPENSE_TYPES.TRAVEL;
          desc = I18n.t("products_list_no_result_desc_travel");
          buttonText = I18n.t("add_travel");
          image = require("../images/main-categories/ic_travel_dining.png");
        } else if (categoryId == CATEGORY_IDS.TRAVEL.HOTEL_STAY) {
          type = EXPENSE_TYPES.TRAVEL;
          desc = I18n.t("products_list_no_result_desc_hotel_stay");
          buttonText = I18n.t("add_hotel_stay");
          image = require("../images/categories/hotel.png");
        } else {
          type = EXPENSE_TYPES.TRAVEL;
          desc = I18n.t("products_list_no_result_desc_dining");
          buttonText = I18n.t("add_dining");
          image = require("../images/categories/dining.png");
        }
        break;

      case MAIN_CATEGORY_IDS.HEALTHCARE:
        if (categoryId == CATEGORY_IDS.HEALTHCARE.EXPENSE) {
          type = EXPENSE_TYPES.HEALTHCARE;
          desc = I18n.t("products_list_no_result_desc_expense");
          buttonText = I18n.t("add_expense");
          image = require("../images/main-categories/ic_healthcare.png");
        } else if (categoryId == CATEGORY_IDS.HEALTHCARE.MEDICAL_DOC) {
          type = EXPENSE_TYPES.HEALTHCARE;
          desc = I18n.t("products_list_no_result_desc_medical_docs");
          buttonText = I18n.t("add_medical_doc");
          image = require("../images/categories/medical_docs.png");
        } else {
          type = EXPENSE_TYPES.HEALTHCARE;
          desc = I18n.t("products_list_no_result_desc_insurance");
          buttonText = I18n.t("add_healthcare");
          image = require("../images/main-categories/ic_healthcare.png");
        }
        break;

      case MAIN_CATEGORY_IDS.SERVICES:
        if (categoryId == CATEGORY_IDS.SERVICES.OTHER_SERVICES) {
          type = EXPENSE_TYPES.SERVICES;
          desc = I18n.t("products_list_no_result_desc_other_services");
          buttonText = I18n.t("add_other_services");
          image = require("../images/main-categories/ic_services.png");
        } else if (categoryId == CATEGORY_IDS.SERVICES.PROFESSIONAL) {
          type = EXPENSE_TYPES.SERVICES;
          desc = I18n.t("products_list_no_result_desc_professional");
          buttonText = I18n.t("add_professional");
          image = require("../images/categories/professional.png");
        } else {
          type = EXPENSE_TYPES.SERVICES;
          desc = I18n.t("products_list_no_result_desc_lessons");
          buttonText = I18n.t("add_lessons_hobbies");
          image = require("../images/categories/hobbies.png");
        }
        break;

      case MAIN_CATEGORY_IDS.FASHION:
        type = EXPENSE_TYPES.FASHION;
        image = require("../images/main-categories/ic_fashion.png");
        desc = I18n.t("products_list_no_result_desc_fashion");
        buttonText = I18n.t("add_fashion_expense");
        break;

      case MAIN_CATEGORY_IDS.HOUSEHOLD:
        if (categoryId == CATEGORY_IDS.HOUSEHOLD.HOUSEHOLD_EXPENSE) {
          type = EXPENSE_TYPES.HOUSEHOLD;
          desc = I18n.t("products_list_no_result_desc_household_expense");
          buttonText = I18n.t("add_household_expense");
          image = require("../images/categories/household.png");
        } else if (categoryId == CATEGORY_IDS.HOUSEHOLD.UTILITY_BILLS) {
          type = EXPENSE_TYPES.HOUSEHOLD;
          desc = I18n.t("products_list_no_result_desc_utility_bills");
          buttonText = I18n.t("add_utility_bills");
          image = require("../images/categories/utility_bill.png");
        } else if (categoryId == CATEGORY_IDS.HOUSEHOLD.EDUCATION) {
          type = EXPENSE_TYPES.HOUSEHOLD;
          desc = I18n.t("products_list_no_result_desc_education");
          buttonText = I18n.t("add_education");
          image = require("../images/categories/education.png");
        } else if (categoryId == CATEGORY_IDS.HOUSEHOLD.HOME_DECOR) {
          type = EXPENSE_TYPES.HOUSEHOLD;
          desc = I18n.t("products_list_no_result_desc_home_decor");
          buttonText = I18n.t("add_home_decor");
          image = require("../images/categories/home_decor.png");
        } else {
          type = EXPENSE_TYPES.HOUSEHOLD;
          desc = I18n.t("products_list_no_result_desc_other_household");
          buttonText = I18n.t("add_other_household");
          image = require("../images/main-categories/ic_home_expenses.png");
        }
        break;

      case MAIN_CATEGORY_IDS.OTHERS:
        type = EXPENSE_TYPES.OTHERS;
        desc = I18n.t("products_list_no_result_desc_others");
        break;

      case MAIN_CATEGORY_IDS.PERSONAL:
        type = EXPENSE_TYPES.PERSONAL;
        desc = I18n.t("products_list_no_result_desc_personal");
        buttonText = I18n.t("add_personal");
        image = require("../images/main-categories/ic_personal_doc.png");
        break;

      default:
        desc = "";
    }
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={image} />
        <Text style={styles.desc}>{desc}</Text>
        <Text style={styles.below}>{I18n.t("product_list_click_below")}</Text>
        <Button
          onPress={() => onPressItem(type)}
          text={buttonText}
          color="secondary"
          style={styles.button}
        />
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
