import FirebaseAnalytics from "react-native-firebase-analytics";
const FBSDK = require("react-native-fbsdk");
const FbSdkAppEventsLogger = FBSDK.AppEventsLogger;

import store from "../store";

const EVENTS = {
  REGISTRATION_TRUECALLER: "registration_tc",
  REGISTRATION_OTP: "registration_otp",
  CLICK_PLUS_ICON: "plus_addproduct",
  CLICK_ON_ELECTRONIC_AND_ELECTRICAL: "plus_addpdct_electronics",
  CLICK_ON_AUTOMOBILE: "plus_addproduct_Atomobile",
  CLICK_ON_FURNITURE_AND_HARDWARE: "plus_addproduct_Furniture&Hardware",
  CLICK_ON_INSURANCE_AND_MEDICAL_DOCS: "plus_addproduct_Insurance&MedicalDocs",
  CLICK_ON_PERSONAL_DOCS: "plus_addproduct_PersonalDocs",
  CLICK_ON_VISITING_CARD: "plus_addproduct_VisitingCards",
  CLICK_ON_TRAVEL_AND_DINING: "plus_addproduct_Travel&Dining",
  CLICK_ON_HEALTHCARE: "plus_addproduct_Healthcare",
  CLICK_ON_FASHION: "plus_addproduct_Faishon",
  CLICK_ON_SERVICES: "plus_addproduct_Services",
  CLICK_ON_HOME_EXPENSES: "plus_addproduct_HomeExpenses",
  CLICK_ON_REPAIR: "plus_addproduct_Repair",
  CLICK_ADD_PRODUCT_OPTION: "click_addproduct",
  ADD_PRODUCT_COMPLETED: "add_addproduct",
  ADD_ANOTHER_PRODUCT: "addanother_addproduct",
  CLICK_I_WILL_DO_IT_LATER: "Click_addproduct_Later",
  CLICK_PLAY_VIDEO: "Click_playvideo",
  //eHome
  OPEN_EHOME: "click_ehome",
  OPEN_EHOME_CATEGORY: "categoryclick_ehome",
  ADD_PRODUCT_INSIDE_EHOME_MAIN_CATEGORIES: "addproduct_insideehome",
  CLICK_VIEW_BILL: "addbill_pc",
  CLICK_CONTACT_AFTER_SALES: "aftersales_pc",
  CLICK_CONTACT_BRAND: "contact_brand",
  CLICK_CONTACT_INSURANCE_PROVIDER: "contact_IP",
  CLICK_CONTACT_WARRANTY_PROVIDER: "contact_thwp",
  CLICK_PRODUCT_EDIT: "product_edit",
  CLICK_CALL: "contact_call",
  CLICK_EMAIL: "click_email",
  CLICK_URL: "click_url",
  OPEN_ASC_SCREEN: "click_asc",
  SEARCH_ASC: "search_asc",
  CLICK_EXPENSE_CHART: "click_expense",
  OPEN_MAILS: "click_mail",
  PRODUCT_DELETE_INITIATED: "product_delete_initiated",
  PRODUCT_DELETE_CANCELED: "product_delete_canceled",
  PRODUCT_DELETE_COMPLETE: "product_delete_complete",
  API_ERROR: "api_error",
  SHARE_VIA: "share_via"
};

const logEvent = (eventName, data = {}) => {
  if (!__DEV__) {
    const user = store.getState().loggedInUser;
    FirebaseAnalytics.logEvent(eventName, {
      Platform: "iOS",
      "User Id": user.id,
      "User Name": user.name,
      "User Mobile": user.phone,
      ...data
    });
    FbSdkAppEventsLogger.logEvent(eventName);
  }
};
export default { EVENTS, logEvent };
export { EVENTS, logEvent };
