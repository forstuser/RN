import React from "react";
import { Platform } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";

import TabIcon from "./tab-icon";

import DashboardScreen from "../containers/dashboard-screen";
import EhomeScreen from "../containers/ehome-screen";
import EasyLifeScreen from "../containers/easy-life-screen";
import DoYouKnowScreen from "../containers/do-you-know-screen";
import MoreScreen from "../containers/more-screen";

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
import AscScreen from "../containers/asc-screen";
import ProductDetailsScreen from "../containers/product-details-screen";

import { SCREENS } from "../constants";

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
        tabBarLabel: "Eazy Life",
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
    backBehavior: "none"
  }
);

export default createStackNavigator(
  {
    BottomTabStack: {
      screen: BottomTabStack,
      navigationOptions: { header: null }
    },
    [SCREENS.ASC_SCREEN]: AscScreen,
    [SCREENS.PRODUCT_DETAILS_SCREEN]: ProductDetailsScreen
  },
  {}
);
