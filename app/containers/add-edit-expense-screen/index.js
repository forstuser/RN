import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  TextInput,
  ScrollView
} from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { MAIN_CATEGORY_IDS, EXPENSE_TYPES } from "../../constants";
import I18n from "../../i18n";

import ProductOrExpense from "./product-or-expense";
import PersonalDoc from "./personal-doc";

const ehomeImage = require("../../images/ehome_circle_with_category_icons.png");

class AddEditExpenseScreen extends React.Component {
  static navigatorStyle = {
    tabBarHidden: true
  };
  constructor(props) {
    super(props);
    this.state = {
      formType: null,
      mainCategoryId: null,
      product: null
    };
  }

  componentDidMount() {
    let title = "";
    switch (this.props.expenseType) {
      case EXPENSE_TYPES.AUTOMOBILE:
        title = I18n.t("add_edit_expense_screen_title_add_automobile");
        this.setState({
          formType: "product",
          mainCategoryId: MAIN_CATEGORY_IDS.AUTOMOBILE
        });
        break;
      case EXPENSE_TYPES.ELECTRONICS:
        title = I18n.t("add_edit_expense_screen_title_add_electronics");
        this.setState({
          formType: "product",
          mainCategoryId: MAIN_CATEGORY_IDS.ELECTRONICS
        });
        break;
      case EXPENSE_TYPES.FURNITURE:
        title = I18n.t("add_edit_expense_screen_title_add_furniture");
        this.setState({
          formType: "product",
          mainCategoryId: MAIN_CATEGORY_IDS.FURNITURE
        });
        break;
      case EXPENSE_TYPES.MEDICAL_PRESCRIPTION:
        title = I18n.t("add_edit_expense_screen_title_add_prescription");
        this.setState({
          formType: "prescription",
          mainCategoryId: MAIN_CATEGORY_IDS.HEALTHCARE
        });
        break;
      case EXPENSE_TYPES.VISITING_CARD:
        title = I18n.t("add_edit_expense_screen_title_add_visiting_card");
        this.setState({
          formType: "visiting_card",
          mainCategoryId: MAIN_CATEGORY_IDS.PERSONAL
        });
        break;
      case EXPENSE_TYPES.PERSONAL:
        title = I18n.t("add_edit_expense_screen_title_add_personal_doc");
        this.setState({
          formType: "personal_doc",
          mainCategoryId: MAIN_CATEGORY_IDS.PERSONAL
        });
        break;
      case EXPENSE_TYPES.TRAVEL:
        title = I18n.t("add_edit_expense_screen_title_add_travel");
        this.setState({
          formType: "expense",
          mainCategoryId: MAIN_CATEGORY_IDS.TRAVEL
        });
        break;
      case EXPENSE_TYPES.HEALTHCARE:
        title = I18n.t("add_edit_expense_screen_title_add_healthcare");
        this.setState({
          formType: "expense",
          mainCategoryId: MAIN_CATEGORY_IDS.HEALTHCARE
        });
        break;
      case EXPENSE_TYPES.FASHION:
        title = I18n.t("add_edit_expense_screen_title_add_fashion");
        this.setState({
          formType: "expense",
          mainCategoryId: MAIN_CATEGORY_IDS.FASHION
        });
        break;
      case EXPENSE_TYPES.SERVICES:
        title = I18n.t("add_edit_expense_screen_title_add_services");
        this.setState({
          formType: "expense",
          mainCategoryId: MAIN_CATEGORY_IDS.SERVICES
        });
        break;
      case EXPENSE_TYPES.HOME:
        title = I18n.t("add_edit_expense_screen_title_add_home");
        this.setState({
          formType: "expense",
          mainCategoryId: MAIN_CATEGORY_IDS.HOUSEHOLD
        });
        break;
    }
    this.props.navigator.setTitle({
      title
    });
  }

  render() {
    const { formType, mainCategoryId } = this.state;
    switch (formType) {
      case "product":
      case "expense":
        return (
          <ProductOrExpense
            mainCategoryId={mainCategoryId}
            navigator={this.props.navigator}
          />
        );
      case "personal_doc":
        return <PersonalDoc navigator={this.props.navigator} />;
      default:
        return null;
    }
  }
}

export default AddEditExpenseScreen;
