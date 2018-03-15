import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  TextInput,
  ScrollView,
  Platform
} from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { MAIN_CATEGORY_IDS, EXPENSE_TYPES } from "../../constants";
import I18n from "../../i18n";

import ProductOrExpense from "./product-or-expense";
import PersonalDoc from "./personal-doc";
import Repair from "./repair";

const ehomeImage = require("../../images/ehome_circle_with_category_icons.png");

class AddEditExpenseScreen extends React.Component {
  static navigatorStyle = {
    tabBarHidden: true,
    disabledBackGesture: true
  };
  static navigatorButtons = {
    ...Platform.select({
      ios: {
        leftButtons: [
          {
            id: "backPress",
            icon: require("../../images/ic_back_ios.png")
          }
        ]
      }
    })
  };

  constructor(props) {
    super(props);
    this.state = {
      formType: null,
      mainCategoryId: null,
      product: null,
      confirmBackNavigation: false
    };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  onNavigatorEvent = event => {
    switch (event.id) {
      case "backPress":
        if (!this.state.confirmBackNavigation) {
          this.props.navigator.pop();
          return;
        }
        Alert.alert(
          I18n.t("add_edit_expense_screen_title_add_sure"),
          I18n.t("add_edit_expense_screen_title_add_docs"),
          [
            {
              text: I18n.t("add_edit_expense_screen_title_add_go_back"),
              onPress: () => this.props.navigator.pop()
            },
            {
              text: I18n.t("add_edit_expense_screen_title_add_stay"),
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            }
          ]
        );

        break;
    }
  };

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
      case EXPENSE_TYPES.MEDICAL_DOCS:
        title = I18n.t("add_edit_expense_screen_title_add_medical_docs");
        this.setState({
          formType: "medical_docs",
          mainCategoryId: MAIN_CATEGORY_IDS.HEALTHCARE
        });
        break;
      case EXPENSE_TYPES.VISITING_CARD:
        title = I18n.t("add_edit_expense_screen_title_add_visiting_card");
        this.setState({
          formType: "visiting_card",
          mainCategoryId: MAIN_CATEGORY_IDS.PERSONAL,
          confirmBackNavigation: true
        });
        break;
      case EXPENSE_TYPES.PERSONAL:
        title = I18n.t("add_edit_expense_screen_title_add_personal_doc");
        this.setState({
          formType: "personal_doc",
          mainCategoryId: MAIN_CATEGORY_IDS.PERSONAL,
          confirmBackNavigation: true
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
          formType: "healthcare_expense",
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
      case EXPENSE_TYPES.REPAIR:
        title = I18n.t("add_edit_expense_screen_title_add_repair");
        this.setState({
          formType: "repair"
        });
        break;
    }
    this.props.navigator.setTitle({
      title
    });
  }

  confirmBackNavigation = () => {
    this.setState({
      confirmBackNavigation: true
    });
  };

  render() {
    const { formType, mainCategoryId } = this.state;
    switch (formType) {
      case "product":
      case "expense":
        return (
          <ProductOrExpense
            mainCategoryId={mainCategoryId}
            navigator={this.props.navigator}
            confirmBackNavigation={this.confirmBackNavigation}
          />
        );
      case "personal_doc":
      case "visiting_card":
        return (
          <PersonalDoc formType={formType} navigator={this.props.navigator} />
        );
      case "medical_docs":
      case "healthcare_expense":
        return (
          <ProductOrExpense
            mainCategoryId={mainCategoryId}
            healthcareFormType={formType}
            navigator={this.props.navigator}
            confirmBackNavigation={this.confirmBackNavigation}
          />
        );
      case "repair":
        return (
          <Repair
            navigator={this.props.navigator}
            confirmBackNavigation={this.confirmBackNavigation}
          />
        );
      default:
        return null;
    }
  }
}

export default AddEditExpenseScreen;
