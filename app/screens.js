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
import BillsPopUpScreen from "./containers/bills-popup-screen";
import FaqScreen from "./containers/faq-screen";
import MailboxScreen from "./containers/mailbox-screen";
import TipsScreen from "./containers/tips-screen";
import ProfileScreen from "./containers/profile-screen";
import SearchScreen from "./containers/search-screen";
import AscSearchScreen from "./containers/asc-search-screen";
// import AddProductsScreen from "./containers/add-products-screen";
import UploadDocumentScreen from "./containers/upload-document-screen";
import InsightScreen from "./containers/insight-screen";
// import TotalTaxScreen from "./containers/total-tax-screen";
import TransactionsScreen from "./containers/transactions-screen";
// import AddProductScreen from "./containers/add-product-screen";
import ForceUpdateScreen from "./containers/force-update-screen";
import AddEditExpenseScreen from "./containers/add-edit-expense-screen";
import AddEditWarrantyScreen from "./containers/add-edit-warranty-screen";
import AddEditInsuranceScreen from "./containers/add-edit-insurance-screen";
import AddEditAmcScreen from "./containers/add-edit-amc-screen";
import AddEditRepairScreen from "./containers/add-edit-repair-screen";
import AddEditPucScreen from "./containers/add-edit-puc-screen";
import EditProductBasicDetailsScreen from "./containers/edit-product-basic-details-screen";
import AddEditPersonalDocScreen from "./containers/add-edit-personal-doc-screen";
import EditMedicalDocScreen from "./containers/edit-medical-doc-screen";
import EditInsuranceScreen from "./containers/edit-healthcare-insurance-screen";
import AddProductOptionsScreen from "./containers/add-product-options-screen";
import DirectUploadDocumentScreen from "./containers/direct-upload-document-screen";
import RateUsScreen from "./containers/rate-us-screen";
import DoYouKnowScreen from "./containers/do-you-know-screen";
import MyCalendarScreen from "./containers/my-calendar-screen";
import AddCalendarServiceScreen from "./containers/add-calendar-service-screen";
import CalendarServiceCardScreen from "./containers/calender-service-card-screen";
import EnterPinPopupScreen from "./containers/enter-pin-popup-screen";
import PinSetupScreen from "./containers/pin-setup-screen";

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
    SCREENS.MORE_SCREEN,
    () => MoreScreen,
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

  Navigation.registerComponent(
    SCREENS.ADD_EDIT_EXPENSE_SCREEN,
    () => AddEditExpenseScreen,
    store,
    Provider
  );

  Navigation.registerComponent(
    SCREENS.ADD_EDIT_WARRANTY_SCREEN,
    () => AddEditWarrantyScreen,
    store,
    Provider
  );

  Navigation.registerComponent(
    SCREENS.ADD_EDIT_INSURANCE_SCREEN,
    () => AddEditInsuranceScreen,
    store,
    Provider
  );

  Navigation.registerComponent(
    SCREENS.ADD_EDIT_AMC_SCREEN,
    () => AddEditAmcScreen,
    store,
    Provider
  );

  Navigation.registerComponent(
    SCREENS.ADD_EDIT_REPAIR_SCREEN,
    () => AddEditRepairScreen,
    store,
    Provider
  );

  Navigation.registerComponent(
    SCREENS.ADD_EDIT_PUC_SCREEN,
    () => AddEditPucScreen,
    store,
    Provider
  );

  Navigation.registerComponent(
    SCREENS.EDIT_PRODUCT_BASIC_DETAILS_SCREEN,
    () => EditProductBasicDetailsScreen,
    store,
    Provider
  );

  Navigation.registerComponent(
    SCREENS.ADD_EDIT_PERSONAL_DOC_SCREEN,
    () => AddEditPersonalDocScreen,
    store,
    Provider
  );

  Navigation.registerComponent(
    SCREENS.EDIT_MEDICAL_DOCS_SCREEN,
    () => EditMedicalDocScreen,
    store,
    Provider
  );

  Navigation.registerComponent(
    SCREENS.EDIT_INSURANCE_SCREEN,
    () => EditInsuranceScreen,
    store,
    Provider
  );

  Navigation.registerComponent(
    SCREENS.ADD_PRODUCT_OPTIONS_SCREEN,
    () => AddProductOptionsScreen,
    store,
    Provider
  );

  Navigation.registerComponent(
    SCREENS.DIRECT_UPLOAD_DOCUMENT_SCREEN,
    () => DirectUploadDocumentScreen,
    store,
    Provider
  );

  Navigation.registerComponent(
    SCREENS.RATE_US_SCREEN,
    () => RateUsScreen,
    store,
    Provider
  );

  Navigation.registerComponent(
    SCREENS.DO_YOU_KNOW_SCREEN,
    () => DoYouKnowScreen,
    store,
    Provider
  );

  Navigation.registerComponent(
    SCREENS.MY_CALENDAR_SCREEN,
    () => MyCalendarScreen,
    store,
    Provider
  );

  Navigation.registerComponent(
    SCREENS.ADD_CALENDAR_SERVICE_SCREEN,
    () => AddCalendarServiceScreen,
    store,
    Provider
  );

  Navigation.registerComponent(
    SCREENS.CALENDAR_SERVICE_CARD_SCREEN,
    () => CalendarServiceCardScreen,
    store,
    Provider
  );

  Navigation.registerComponent(
    SCREENS.ENTER_PIN_POPUP_SCREEN,
    () => EnterPinPopupScreen,
    store,
    Provider
  );

  Navigation.registerComponent(
    SCREENS.PIN_SETUP_SCREEN,
    () => PinSetupScreen,
    store,
    Provider
  );
}
