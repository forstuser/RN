import React from "react";
import { Platform } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";

import { colors } from "../theme";
import TabIcon from "./tab-icon";

import DashboardScreen from "../containers/dashboard-screen";
import EhomeScreen from "../containers/ehome-screen";
import EasyLifeScreen from "../containers/easy-life-screen";
import DoYouKnowScreen from "../containers/do-you-know-screen";
import MoreScreen from "../containers/more-screen";

import AscScreen from "../containers/asc-screen";
import ProductDetailsScreen from "../containers/product-details-screen";
import MainCategoryScreen from "../containers/main-category-screen";
import BillsPopUpScreen from "../containers/bills-popup-screen";
import FaqScreen from "../containers/faq-screen";
import MailboxScreen from "../containers/mailbox-screen";
import TipsScreen from "../containers/tips-screen";
import ProfileScreen from "../containers/profile-screen";
import SearchScreen from "../containers/search-screen";
import AscSearchScreen from "../containers/asc-search-screen";
import UploadDocumentScreen from "../containers/upload-document-screen";
import InsightScreen from "../containers/insight-screen";
import TransactionsScreen from "../containers/transactions-screen";
import AddProductScreen from "../containers/add-product-screen";
import ForceUpdateScreen from "../containers/force-update-screen";
import AddEditExpenseScreen from "../containers/add-edit-expense-screen";
import AddEditWarrantyScreen from "../containers/add-edit-warranty-screen";
import AddEditInsuranceScreen from "../containers/add-edit-insurance-screen";
import AddEditAmcScreen from "../containers/add-edit-amc-screen";
import AddEditRepairScreen from "../containers/add-edit-repair-screen";
import AddEditPucScreen from "../containers/add-edit-puc-screen";
import EditProductBasicDetailsScreen from "../containers/edit-product-basic-details-screen";
import AddEditPersonalDocScreen from "../containers/add-edit-personal-doc-screen";
import EditMedicalDocScreen from "../containers/edit-medical-doc-screen";
import EditInsuranceScreen from "../containers/edit-healthcare-insurance-screen";
import AddProductOptionsScreen from "../containers/add-product-options-screen";
import DirectUploadDocumentScreen from "../containers/direct-upload-document-screen";
import RateUsScreen from "../containers/rate-us-screen";
import MyCalendarScreen from "../containers/my-calendar-screen";
import AddCalendarServiceScreen from "../containers/add-calendar-service-screen";
import CalendarServiceCardScreen from "../containers/calender-service-card-screen";
import EnterPinPopupScreen from "../containers/enter-pin-popup-screen";
import PinSetupScreen from "../containers/pin-setup-screen";
import WhatToScreen from "../containers/what-to-screen";
import WhatToListScreen from "../containers/what-to-list-screen";
import RegistrationDetailsScreen from "../containers/registration-details-screen";

import { SCREENS } from "../constants";
import rateUsScreen from "../containers/rate-us-screen";

const BottomTabStack = createBottomTabNavigator(
  {
    [SCREENS.DASHBOARD_SCREEN]: {
      screen: DashboardScreen,
      navigationOptions: {
        tabBarLabel: "Dashboard",
        tabBarIcon: ({ focused }) => (
          <TabIcon
            focused={focused}
            source={require("../images/ic_dashboard.png")}
          />
        )
      }
    },
    [SCREENS.EHOME_SCREEN]: {
      screen: EhomeScreen,
      navigationOptions: {
        tabBarLabel: "eHome",
        tabBarIcon: ({ focused }) => (
          <TabIcon
            focused={focused}
            source={require("../images/ic_nav_ehome_off.png")}
          />
        )
      }
    },
    [SCREENS.EASY_LIFE_SCREEN]: {
      screen: EasyLifeScreen,
      navigationOptions: {
        tabBarLabel: "EazyDay",
        tabBarIcon: ({ focused }) => (
          <TabIcon
            focused={focused}
            source={require("../images/ic_calendar.png")}
          />
        )
      }
    },
    [SCREENS.DO_YOU_KNOW_SCREEN]: {
      screen: DoYouKnowScreen,
      navigationOptions: {
        tabBarLabel: "DYK",
        tabBarIcon: ({ focused }) => (
          <TabIcon
            focused={focused}
            source={require("../images/ic_do_you_know.png")}
          />
        )
      }
    },
    [SCREENS.MORE_SCREEN]: {
      screen: MoreScreen,
      navigationOptions: {
        tabBarLabel: "More",
        tabBarIcon: ({ focused }) => (
          <TabIcon
            focused={focused}
            source={require("../images/ic_nav_more_off.png")}
          />
        )
      }
    }
  },
  {
    backBehavior: "none",
    tabBarOptions: {
      activeTintColor: colors.mainBlue,
      inactiveTintColor: colors.lighterText,
      activeBackgroundColor: '#fff',
      inactiveBackgroundColor: '#fff'
    }
  }
);

export default createStackNavigator(
  {
    BottomTabStack: {
      screen: BottomTabStack,
      navigationOptions: { header: null }
    },
    [SCREENS.ASC_SCREEN]: AscScreen,
    [SCREENS.PRODUCT_DETAILS_SCREEN]: ProductDetailsScreen,
    [SCREENS.MAIN_CATEGORY_SCREEN]: MainCategoryScreen,
    [SCREENS.BILLS_POPUP_SCREEN]: BillsPopUpScreen,
    [SCREENS.FAQS_SCREEN]: FaqScreen,
    [SCREENS.MAILBOX_SCREEN]: MailboxScreen,
    [SCREENS.TIPS_SCREEN]: TipsScreen,
    [SCREENS.PROFILE_SCREEN]: ProfileScreen,
    [SCREENS.SEARCH_SCREEN]: SearchScreen,
    [SCREENS.ASC_SEARCH_SCREEN]: AscSearchScreen,
    [SCREENS.UPLOAD_DOCUMENT_SCREEN]: UploadDocumentScreen,
    [SCREENS.INSIGHTS_SCREEN]: InsightScreen,
    [SCREENS.TRANSACTIONS_SCREEN]: TransactionsScreen,
    [SCREENS.ADD_PRODUCT_SCREEN]: AddProductScreen,
    [SCREENS.FORCE_UPDATE_SCREEN]: ForceUpdateScreen,
    [SCREENS.ADD_EDIT_EXPENSE_SCREEN]: AddEditExpenseScreen,
    [SCREENS.ADD_EDIT_WARRANTY_SCREEN]: AddEditWarrantyScreen,
    [SCREENS.ADD_EDIT_INSURANCE_SCREEN]: AddEditInsuranceScreen,
    [SCREENS.ADD_EDIT_AMC_SCREEN]: AddEditAmcScreen,
    [SCREENS.ADD_EDIT_REPAIR_SCREEN]: AddEditRepairScreen,
    [SCREENS.ADD_EDIT_PUC_SCREEN]: AddEditPucScreen,
    [SCREENS.EDIT_PRODUCT_BASIC_DETAILS_SCREEN]: EditProductBasicDetailsScreen,
    [SCREENS.ADD_EDIT_PERSONAL_DOC_SCREEN]: AddEditPersonalDocScreen,
    [SCREENS.EDIT_MEDICAL_DOCS_SCREEN]: EditMedicalDocScreen,
    [SCREENS.EDIT_INSURANCE_SCREEN]: EditInsuranceScreen,
    [SCREENS.ADD_PRODUCT_OPTIONS_SCREEN]: AddProductOptionsScreen,
    [SCREENS.DIRECT_UPLOAD_DOCUMENT_SCREEN]: DirectUploadDocumentScreen,
    [SCREENS.RATE_US_SCREEN]: rateUsScreen,
    [SCREENS.MY_CALENDAR_SCREEN]: MyCalendarScreen,
    [SCREENS.ADD_CALENDAR_SERVICE_SCREEN]: AddCalendarServiceScreen,
    [SCREENS.CALENDAR_SERVICE_CARD_SCREEN]: CalendarServiceCardScreen,
    [SCREENS.ENTER_PIN_POPUP_SCREEN]: EnterPinPopupScreen,
    [SCREENS.PIN_SETUP_SCREEN]: PinSetupScreen,
    [SCREENS.WHAT_TO_SCREEN]: WhatToScreen,
    [SCREENS.WHAT_TO_LIST_SCREEN]: WhatToListScreen,
    [SCREENS.REGISTRATION_DETAILS_SCREEN]: RegistrationDetailsScreen
  },
  {}
);
