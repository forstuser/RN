import Analytics from "react-native-firebase-analytics";
import store from "../store";

const EVENTS = {
  REGISTRATION_TRUECALLER: "registration_tc",
  REGISTRATION_OTP: "registration_otp",
  CLICK_PLUS_ICON: "plus_addproduct",
  CLICK_ADD_PRODUCT_OPTION: "click_addproduct",
  ADD_PRODUCT_COMPLETED: "add_addproduct",
  ADD_ANOTHER_PRODUCT: "addanother_addproduct",
  OPEN_EHOME: "click_ehome",
  OPEN_EHOME_CATEGORY: "categoryclick_ehome",
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
  API_ERROR: "api_error"
};

const logEvent = (eventName, data = {}) => {
  if (!__DEV__) {
    const user = store.getState().loggedInUser;
    Analytics.logEvent(eventName, {
      Platform: "iOS",
      "User Id": user.id,
      "User Name": user.name,
      "User Mobile": user.phone,
      ...data
    });
  }
};
export default { EVENTS, logEvent };
export { EVENTS, logEvent };
