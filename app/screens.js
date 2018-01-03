import { Navigation } from "react-native-navigation";

import Snackbar from "./containers/snackbar";
import DashboardScreen from "./containers/dashboard-screen";
import EhomeScreen from "./containers/ehome-screen";
import AscScreen from "./containers/asc-screen";
import MoreScreen from "./containers/more-screen";
import IntroScreen from "./containers/intro-screen";
import LoginScreen from "./containers/login-screen";
import VerifyScreen from "./containers/verify-screen";
import TermsScreen from "./containers/terms-screen";
import MainCategoryScreen from "./containers/main-category-screen";
import ProductDetailsScreen from "./containers/product-details-screen";
import DocsUnderProcessingScreen from "./containers/docs-under-processing";
import BillsPopUpScreen from "./containers/bills-popup-screen";
import FaqScreen from "./containers/faq-screen";
import MailboxScreen from "./containers/mailbox-screen";
import TipsScreen from "./containers/tips-screen";
import ProfileScreen from "./containers/profile-screen";
import SearchScreen from "./containers/search-screen";
import AscSearchScreen from "./containers/asc-search-screen";
import AddProductsScreen from "./containers/add-products-screen";
import UploadDocumentScreen from "./containers/upload-document-screen";
import InsightScreen from "./containers/insight-screen";
import TotalTaxScreen from "./containers/total-tax-screen";
import TransactionsScreen from "./containers/transactions-screen";
import AddProductScreen from "./containers/add-product-screen";
import ForceUpdateScreen from "./containers/force-update-screen";

import { SCREENS } from "./constants";

// register all screens of the app (including internal ones)
export function registerScreens(store, Provider) {
  Navigation.registerComponent(
    "InAppNotification",
    () => Snackbar,
    store,
    Provider
  );
  Navigation.registerComponent(
    "IntroScreen",
    () => IntroScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    "LoginScreen",
    () => LoginScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    "VerifyScreen",
    () => VerifyScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    "TermsScreen",
    () => TermsScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    "DashboardScreen",
    () => DashboardScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    "EhomeScreen",
    () => EhomeScreen,
    store,
    Provider
  );
  Navigation.registerComponent("FaqScreen", () => FaqScreen, store, Provider);
  Navigation.registerComponent("TipsScreen", () => TipsScreen, store, Provider);

  Navigation.registerComponent("AscScreen", () => AscScreen, store, Provider);
  Navigation.registerComponent("MoreScreen", () => MoreScreen, store, Provider);
  Navigation.registerComponent("FaqScreen", () => FaqScreen, store, Provider);
  Navigation.registerComponent(
    "ProfileScreen",
    () => ProfileScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    SCREENS.INSIGHTS_SCREEN,
    () => InsightScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    "TotalTaxScreen",
    () => TotalTaxScreen,
    store,
    Provider
  );

  Navigation.registerComponent(
    "MainCategoryScreen",
    () => MainCategoryScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    "ProductDetailsScreen",
    () => ProductDetailsScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    "DocsUnderProcessingScreen",
    () => DocsUnderProcessingScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    "BillsPopUpScreen",
    () => BillsPopUpScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    "MailboxScreen",
    () => MailboxScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    "SearchScreen",
    () => SearchScreen,
    store,
    Provider
  );

  Navigation.registerComponent(
    "AscSearchScreen",
    () => AscSearchScreen,
    store,
    Provider
  );

  Navigation.registerComponent(
    "AddProductsScreen",
    () => AddProductsScreen,
    store,
    Provider
  );

  Navigation.registerComponent(
    "AddProductScreen",
    () => AddProductScreen,
    store,
    Provider
  );

  Navigation.registerComponent(
    "UploadDocumentScreen",
    () => UploadDocumentScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    "TransactionsScreen",
    () => TransactionsScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    "ForceUpdateScreen",
    () => ForceUpdateScreen,
    store,
    Provider
  );
}
