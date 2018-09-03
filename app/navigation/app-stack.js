import React from "react";
import { Platform } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {
  createStackNavigator,
  createBottomTabNavigator,
  createDrawerNavigator
} from "react-navigation";

import { colors } from "../theme";
import TabIcon from "./tab-icon";
import CustomTabBar from "./tab-bar";

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
import AddFuelExpenseScreen from "../containers/add-fuel-expense-screen";
import AddEditExpenseScreen from "../containers/add-edit-expense-screen";
import AddEditWarrantyScreen from "../containers/add-edit-warranty-screen";
import AddEditInsuranceScreen from "../containers/add-edit-insurance-screen";
import AddEditAmcScreen from "../containers/add-edit-amc-screen";
import AddEditRepairScreen from "../containers/add-edit-repair-screen";
import AddEditPucScreen from "../containers/add-edit-puc-screen";
import AddEditRcScreen from "../containers/add-edit-rc-screen";
import AddEditAccessoryScreen from "../containers/add-edit-accessory-screen";
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
import DealsScreen from "../containers/deals-screen";
import { SCREENS } from "../constants";
import rateUsScreen from "../containers/rate-us-screen";
import EcommerceScreen from "../containers/e-commerce-screen";
import OrderHistoryScreen from "../containers/order-history-screen";
import WebviewScreen from "../containers/webview-screen";
import CreateShoppingListScreen from "../containers/create-shopping-list-screen";
import MyShoppingListScreen from "../containers/my-shopping-list-screen";
import ClaimCashbackScreen from "../containers/claim-cashback-screen";
import ClaimCashbackSelectItemsScreen from "../containers/claim-cashback-screen/select-items-screen";
import ClaimCashbackSelectSellerScreen from "../containers/claim-cashback-screen/select-seller-screen";
import ClaimCashbackFinalScreen from "../containers/claim-cashback-screen/final-screen";
import AddSellerScreen from "../containers/add-seller-screen";
import SellerDetailsScreen from "../containers/seller-details-screen";
import MySellersScreen from "../containers/my-sellers-screen";
import MySellersCreditTransactionsScreen from "../containers/my-sellers-screen/credit-transactions";
import MySellersPointsTransactionsScreen from "../containers/my-sellers-screen/points-transactions";
import MySellersAssistedServicesScreen from "../containers/my-sellers-screen/assisted-services";
import BBCashWalletScreen from '../containers/BBCashWalletScreen';
import SelectSellerScreen from '../containers/BBCashWalletScreen/select-seller-screen';

const BottomTabStack = createBottomTabNavigator(
  {
    [SCREENS.DASHBOARD_SCREEN]: {
      screen: DashboardScreen,
      navigationOptions: {
        tabBarLabel: "Dashboard",
        tabBarIcon: props => (
          <TabIcon
            {...props}
            source={require("../images/dashboard_tab_icon.png")}
          />
        )
      }
    },
    [SCREENS.EHOME_SCREEN]: {
      screen: EhomeScreen,
      navigationOptions: {
        tabBarLabel: "eHome",
        tabBarIcon: props => (
          <TabIcon {...props} source={require("../images/ehome.png")} />
        )
      }
    },
    [SCREENS.DEALS_SCREEN]: {
      screen: DealsScreen,
      navigationOptions: {
        tabBarLabel: "Deals",
        tabBarIcon: props => (
          <TabIcon {...props} source={require("../images/deals.png")} />
        )
      }
    },
    [SCREENS.CREATE_SHOPPING_LIST_SCREEN]: {
      screen: CreateShoppingListScreen,
      navigationOptions: {
        tabBarLabel: "Shop & Earn",
        tabBarIcon: props => (
          <TabIcon {...props} source={require("../images/shop_and_earn.png")} />
        )
      }
    },
    // [SCREENS.DO_YOU_KNOW_SCREEN]: {
    //   screen: DoYouKnowScreen,
    //   navigationOptions: {
    //     tabBarLabel: "DYK",
    //     tabBarIcon: ({ focused }) => (
    //       <TabIcon
    //         focused={focused}
    //         source={require("../images/ic_do_you_know.png")}
    //       />
    //     )
    //   }
    // },
    [SCREENS.MY_SELLERS_SCREEN]: {
      screen: MySellersScreen,
      navigationOptions: {
        tabBarLabel: "My Seller",
        tabBarIcon: props => (
          <TabIcon {...props} source={require("../images/seller_icon.png")} />
        )
      }
    }
  },
  {
    tabBarComponent: CustomTabBar,
    tabBarPosition: "bottom",
    backBehavior: "none",
    tabBarOptions: {
      activeTintColor: colors.mainBlue,
      inactiveTintColor: "grey",
      activeBackgroundColor: "#fff",
      inactiveBackgroundColor: "#fff"
    }
  }
);

const DrawerNavigator = createDrawerNavigator(
  {
    BottomTabStack: {
      screen: BottomTabStack
    }
  },
  {
    initialRouteName: "BottomTabStack",
    contentComponent: MoreScreen,
    drawerWidth: 300
  }
);

export default createStackNavigator(
  {
    DrawerNavigator: {
      screen: DrawerNavigator,
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
    [SCREENS.ADD_FUEL_EXPENSE_SCREEN]: AddFuelExpenseScreen,
    [SCREENS.ADD_EDIT_EXPENSE_SCREEN]: AddEditExpenseScreen,
    [SCREENS.ADD_EDIT_WARRANTY_SCREEN]: AddEditWarrantyScreen,
    [SCREENS.ADD_EDIT_INSURANCE_SCREEN]: AddEditInsuranceScreen,
    [SCREENS.ADD_EDIT_AMC_SCREEN]: AddEditAmcScreen,
    [SCREENS.ADD_EDIT_REPAIR_SCREEN]: AddEditRepairScreen,
    [SCREENS.ADD_EDIT_PUC_SCREEN]: AddEditPucScreen,
    [SCREENS.ADD_EDIT_RC_SCREEN]: AddEditRcScreen,
    [SCREENS.ADD_EDIT_ACCESSORY_SCREEN]: AddEditAccessoryScreen,
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
    [SCREENS.DEALS_SCREEN]: DealsScreen,
    [SCREENS.ECOMMERCE_SCREEN]: EcommerceScreen,
    [SCREENS.ORDER_HISTORY_SCREEN]: OrderHistoryScreen,
    [SCREENS.WEBVIEW_SCREEN]: WebviewScreen,
    [SCREENS.MY_SHOPPING_LIST_SCREEN]: MyShoppingListScreen,
    [SCREENS.CLAIM_CASHBACK_SCREEN]: ClaimCashbackScreen,
    [SCREENS.CLAIM_CASHBACK_SELECT_ITEMS_SCREEN]: ClaimCashbackSelectItemsScreen,
    [SCREENS.CLAIM_CASHBACK_SELECT_SELLER_SCREEN]: ClaimCashbackSelectSellerScreen,
    [SCREENS.CLAIM_CASHBACK_FINAL_SCREEN]: ClaimCashbackFinalScreen,
    [SCREENS.ADD_SELLER_SCREEN]: AddSellerScreen,
    [SCREENS.SELLER_DETAILS_SCREEN]: SellerDetailsScreen,
    [SCREENS.MY_SELLERS_CREDIT_TRANSACTIONS_SCREEN]: MySellersCreditTransactionsScreen,
    [SCREENS.MY_SELLERS_POINTS_TRANSACTIONS_SCREEN]: MySellersPointsTransactionsScreen,
    [SCREENS.MY_SELLERS_ASSISTED_SERVICES_SCREEN]: MySellersAssistedServicesScreen,
    [SCREENS.BB_CASH_WALLET_SCREEN]: BBCashWalletScreen,
    [SCREENS.SELECT_SELLER_SCREEN_WALLET]: SelectSellerScreen
  },
  {
    initialRouteName: "DrawerNavigator"
  }
);
