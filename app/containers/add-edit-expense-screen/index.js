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
import { showSnackbar } from "../snackbar";

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
      categoryId: null,
      product: null,
      confirmBackNavigation: false,
      reasons: []
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
    const { expenseType, categoryId } = this.props;
    this.setState({ categoryId });
    switch (expenseType) {
      case EXPENSE_TYPES.AUTOMOBILE:
        title = I18n.t("add_edit_expense_screen_title_add_automobile");
        this.setState({
          formType: "product",
          mainCategoryId: MAIN_CATEGORY_IDS.AUTOMOBILE,
          reasons: [
            "Connect with brands",
            "Receive insurance & warranty reminders",
            "Connect with nearest service centres",
            "Receive service schedule",
            "Retrieve a product bill/invoice",
            "Track lifetime expenses",
            "Share personalised reviews",
            "And much more.."
          ]
        });
        break;
      case EXPENSE_TYPES.ELECTRONICS:
        title = I18n.t("add_edit_expense_screen_title_add_electronics");
        this.setState({
          formType: "product",
          mainCategoryId: MAIN_CATEGORY_IDS.ELECTRONICS,
          reasons: [
            "Connect with brands",
            "Receive warranty & insurance reminders",
            "Connect with nearest service centres",
            "Retrieve a product bill/invoice",
            "Track lifetime expenses",
            "Share personalised reviews",
            "And much more.."
          ]
        });
        break;
      case EXPENSE_TYPES.FURNITURE:
        title = I18n.t("add_edit_expense_screen_title_add_furniture");
        this.setState({
          formType: "product",
          mainCategoryId: MAIN_CATEGORY_IDS.FURNITURE,
          reasons: [
            "Connect with brands",
            "Receive warranty reminders",
            "Connect with nearest service centres",
            "Retrieve a product bill/invoice",
            "Track lifetime expenses",
            "Share personalised reviews",
            "And much more.."
          ]
        });
        break;
      case EXPENSE_TYPES.MEDICAL_DOCS:
        title = I18n.t("add_edit_expense_screen_title_add_medical_docs");
        this.setState({
          formType: "medical_docs",
          mainCategoryId: MAIN_CATEGORY_IDS.HEALTHCARE,
          reasons: [
            "Retrieve an insurance policy/record",
            "Connect with insurance providers",
            "Receive insurance reminders",
            "Share personalised reviews",
            "And much more.."
          ]
        });
        break;
      case EXPENSE_TYPES.VISITING_CARD:
        title = I18n.t("add_edit_expense_screen_title_add_visiting_card");
        this.setState({
          formType: "visiting_card",
          mainCategoryId: MAIN_CATEGORY_IDS.PERSONAL,
          confirmBackNavigation: true,
          reasons: [""]
        });
        break;
      case EXPENSE_TYPES.PERSONAL:
        title = I18n.t("add_edit_expense_screen_title_add_personal_doc");
        this.setState({
          formType: "personal_doc",
          mainCategoryId: MAIN_CATEGORY_IDS.PERSONAL,
          confirmBackNavigation: true,
          reasons: [""]
        });
        break;
      case EXPENSE_TYPES.TRAVEL:
        title = I18n.t("add_edit_expense_screen_title_add_travel");
        this.setState({
          formType: "expense",
          mainCategoryId: MAIN_CATEGORY_IDS.TRAVEL,
          reasons: [
            "Personalise your expenses",
            "Retrieve a bill anytime",
            "Get expense insights",
            "And much more.."
          ]
        });
        break;
      case EXPENSE_TYPES.HEALTHCARE:
        title = I18n.t("add_edit_expense_screen_title_add_healthcare");
        this.setState({
          formType: "healthcare_expense",
          mainCategoryId: MAIN_CATEGORY_IDS.HEALTHCARE,
          reasons: [
            "Retrieve a bill/record/prescription",
            "Get expense insights",
            "And much more.."
          ]
        });
        break;
      case EXPENSE_TYPES.FASHION:
        title = I18n.t("add_edit_expense_screen_title_add_fashion");
        this.setState({
          formType: "expense",
          mainCategoryId: MAIN_CATEGORY_IDS.FASHION,
          reasons: [
            "Personalise your expenses",
            "Retrieve a bill anytime",
            "Get expense insights",
            "Share personalised review",
            "And much more.."
          ]
        });
        break;
      case EXPENSE_TYPES.SERVICES:
        title = I18n.t("add_edit_expense_screen_title_add_services");
        this.setState({
          formType: "expense",
          mainCategoryId: MAIN_CATEGORY_IDS.SERVICES,
          reasons: [
            "Retrieve a bill anytime",
            "Get expense insights",
            "And much more.."
          ]
        });
        break;
      case EXPENSE_TYPES.HOME:
        title = I18n.t("add_edit_expense_screen_title_add_home");
        this.setState({
          formType: "expense",
          mainCategoryId: MAIN_CATEGORY_IDS.HOUSEHOLD,
          reasons: [
            "Retrieve a bill anytime",
            "Get expense insights",
            "And much more.."
          ]
        });
        break;
      case EXPENSE_TYPES.REPAIR:
        title = I18n.t("add_edit_expense_screen_title_add_repair");
        this.setState({
          formType: "repair",
          reasons: [""]
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
    const { formType, mainCategoryId, categoryId, reasons } = this.state;
    const { isPreviousScreenOfAddOptions } = this.props;
    switch (formType) {
      case "product":
      case "expense":
        return (
          <ProductOrExpense
            mainCategoryId={mainCategoryId}
            categoryId={categoryId}
            navigator={this.props.navigator}
            confirmBackNavigation={this.confirmBackNavigation}
            reasons={reasons}
            isPreviousScreenOfAddOptions={isPreviousScreenOfAddOptions}
          />
        );
      case "personal_doc":
      case "visiting_card":
        return (
          <PersonalDoc
            formType={formType}
            navigator={this.props.navigator}
            reasons={reasons}
            isPreviousScreenOfAddOptions={isPreviousScreenOfAddOptions}
          />
        );
      case "medical_docs":
      case "healthcare_expense":
        return (
          <ProductOrExpense
            mainCategoryId={mainCategoryId}
            categoryId={categoryId}
            healthcareFormType={formType}
            navigator={this.props.navigator}
            confirmBackNavigation={this.confirmBackNavigation}
            reasons={reasons}
            isPreviousScreenOfAddOptions={isPreviousScreenOfAddOptions}
          />
        );
      case "repair":
        return (
          <Repair
            navigator={this.props.navigator}
            confirmBackNavigation={this.confirmBackNavigation}
            reasons={reasons}
            isPreviousScreenOfAddOptions={isPreviousScreenOfAddOptions}
          />
        );
      default:
        return null;
    }
  }
}

export default AddEditExpenseScreen;
