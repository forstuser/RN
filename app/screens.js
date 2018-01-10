import { Navigation } from "react-native-navigation";

import { SCREENS } from "./constants";
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

// register all screens of the app (including internal ones)
export function registerScreens(store, Provider) {
  Navigation.registerComponent(
    SCREENS.SNACKBAR_SCREEN,
    () => Snackbar,
    store,
    Provider
  );
  Navigation.registerComponent(
    SCREENS.INTRO_SCREEN,
    () => IntroScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    SCREENS.LOGIN_SCREEN,
    () => LoginScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    SCREENS.VERIFY_SCREEN,
    () => VerifyScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    SCREENS.TERMS_SCREEN,
    () => TermsScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    SCREENS.DASHBOARD_SCREEN,
    () => DashboardScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    SCREENS.EHOME_SCREEN,
    () => EhomeScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    SCREENS.FAQS_SCREEN,
    () => FaqScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    SCREENS.TIPS_SCREEN,
    () => TipsScreen,
    store,
    Provider
  );

  Navigation.registerComponent(
    SCREENS.ASC_SCREEN,
    () => AscScreen,
    store,
    Provider
  );

  Navigation.registerComponent(
    SCREENS.MORE_SCREEN,
    () => MoreScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    SCREENS.PROFILE_SCREEN,
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
    SCREENS.TOTAL_TAX_SCREEN,
    () => TotalTaxScreen,
    store,
    Provider
  );

  Navigation.registerComponent(
    SCREENS.MAIN_CATEGORY_SCREEN,
    () => MainCategoryScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    SCREENS.PRODUCT_DETAILS_SCREEN,
    () => ProductDetailsScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    SCREENS.DOCS_UNDER_PROCESSING_SCREEN,
    () => DocsUnderProcessingScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    SCREENS.BILLS_POPUP_SCREEN,
    () => BillsPopUpScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    SCREENS.MAILBOX_SCREEN,
    () => MailboxScreen,
    store,
    Provider
  );
  Navigation.registerComponent(
    SCREENS.SEARCH_SCREEN,
    () => SearchScreen,
    store,
    Provider
  );

  Navigation.registerComponent(
    SCREENS.ASC_SEARCH_SCREEN,
    () => AscSearchScreen,
    store,
    Provider
  );

  Navigation.registerComponent(
    SCREENS.ADD_PRODUCTS_SCREEN,
    () => AddProductsScreen,
    store,
    Provider
  );

  Navigation.registerComponent(
    SCREENS.ADD_PRODUCT_SCREEN,
    () => AddProductScreen,
    store,
    Provider
  );

  Navigation.registerComponent(
    SCREENS.UPLOAD_DOCUMENT_SCREEN,
    () => UploadDocumentScreen,
    store,
    Provider
  );

  Navigation.registerComponent(
    SCREENS.TRANSACTIONS_SCREEN,
    () => TransactionsScreen,
    store,
    Provider
  );

  Navigation.registerComponent(
    SCREENS.FORCE_UPDATE_SCREEN,
    () => ForceUpdateScreen,
    store,
    Provider
  );
}
