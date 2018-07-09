import { Platform } from "react-native";
import FirebaseAnalytics from "react-native-firebase-analytics";
const FBSDK = require("react-native-fbsdk");
const FbSdkAppEventsLogger = FBSDK.AppEventsLogger;

import store from "../store";

const EVENTS = {
  //registration
  REGISTRATION_FB: "registration_fb",
  REGISTRATION_OTP: "registration_otp",
  REGISTRATION_COMPLETED: "registeration_completed",
  //add product
  CLICK_PLUS_ICON: "plus_add_product",
  CLICK_ON_ADD_PRODUCT_SCREEN: "plus_add_product_category",
  ADD_MORE_PRODUCT: "plus_add_product_addmore",
  CLICK_I_WILL_DO_IT_LATER: "plus_add_product_later",
  //ehome
  OPEN_EHOME: "ehome_click",
  OPEN_EHOME_CATEGORY: "ehome_category_click",
  ADD_PRODUCT_INSIDE_EHOME_MAIN_CATEGORIES: "ehome_add_product_inside",
  //product card
  CLICK_VIEW_BILL: "productcard_view_bill",
  CLICK_ON_ADD_PRODUCT_IMAGE: "productcard_add_image",
  CLICK_ON_SHARE_PRODUCT_CARD: "productcard_share",
  COMPLETE_SHARE_PRODUCT: "productcard_share_complete",
  CLICK_ON_REVIEW: "productcard_review_click",
  SUBMIT_REVIEW: "productcard_review_submit",
  CLICK_ON_ALL_INFO: "productcard_all_info",
  CLICK_ON_IMPORTANT: "productcard_important",
  CLICK_ON_ADD_WARRANTY: "productcard_add_warranty",
  CLICK_ON_ADD_INSURANCE: "productcard_add_insurance",
  CLICK_ON_ADD_ACCESSORY: "productcard_add_accessory",
  CLICK_ON_ADD_AMC: "productcard_add_amc",
  CLICK_ON_ADD_PUC: "productcard_add_puc",
  CLICK_ON_ADD_RC: "productcard_add_rc",
  CLICK_ON_ADD_REPAIR: "productcard_add_repair",
  CLICK_ON_ADD_EXTENDED_WARRANTY: "productcard_extended_warranty",
  CLICK_SAVE: "productcard_save",
  CLICK_EDIT: "productcard_edit",
  CLICK_ASC_INSIDE_PRODUCT_CARD: "productcard_asc",
  CLICK_CALL: "productcard_contact_call",
  CLICK_EMAIL: "productcard_click_email",
  CLICK_ON_WEB_URL: "productcard_click_web_url",
  CLICK_NEAREST_ASC_INSIDE_PRODUCT: "productcard_asc",
  DELETE_PRODUCT: "productcard_delete",
  //others
  OPEN_ASC_SCREEN: "click_asc",
  SEARCH_ASC: "search_asc",
  CLICK_ON_EXPENSE_INSIGHT: "click_expense",
  OPEN_MAILS: "click_mail",
  SHARE_VIA: "share_via",
  //Who's absent today
  CLICK_ON_WHO_IS_ABSENT_TODAY: "attendance_click",
  CLICK_ON_ADD_SERVICE: "attendance_add_service",
  SELECT_SERVICE_TYPE: "attendance_select_service_type",
  CLICK_ADD_PAYMENT: "attendance_add_payment",
  CLICK_ABSENT: "attendance_absent",
  //DO You Know
  CLICK_ON_DO_YOU_KNOW: "dyk_click",
  CLICK_ON_SHARE_DYK: "dyk_share",
  CLICK_ON_LIKE_DUK: "dyk_like",
  SWIPE_DYK_CARD: "dyk_swipecard",
  //More
  CLICK_MORE: "click_more",
  CLICK_ADD_PIN: "click_pin",
  CLICK_SHARE_APP: "click_share_app",
  CLICK_TIPS_TO_BUILD_YOUR_EHOME: "click_build_your_eHome",
  CLICK_FAQ: "click_FAQ",
  CLICK_LOGOUT_YES: "click_logout_yes",
  CLICK_ASC_FROM_MORE: "click_ASC_more",
  //eazyday section
  CLICK_ON_EAZYDAY: "eazyday_open",
  CLICK_WHAT_TO_COOK: "eazyday_open_cook",
  CLICK_WHAT_TO_WEAR_TODAY: "eazyday_open_wear",
  CLICK_WHAT_TO_DO_TODAY: "eazyday_open_todo",
  CLICK_CREATE_FIRST_LIST_COOK: "eazyday_first_list_cook",
  CLICK_CREATE_FIRST_LIST_WEAR: "eazyday_first_list_wear",
  CLICK_CREATE_FIRST_LIST_TODO: "eazyday_first_list_todo",
  CLICK_ON_ADD_NEW_DISH: "eazyday_add_new_dish",
  CLICK_ON_ADD_NEW_WEAR_ITEM: "eazyday_add_new_cloth",
  CLICK_ON_ADD_NEW_WHAT_TO_DO: "eazyday_add_new_todo",
  USE_SEARCH: "search_use",

  //offers
  CLICK_DEALS: "click_deals",
  CLICK_OFFERS: "click_offers",
  CLICK_ACCESSORIES: "click_accessories",
  CLICK_OFFERS_CATEGORY: "click_offers_category",
  CLICK_PRODUCT_ACCESSORIES: "click_accessories_product",

  //expense card
  VIEW_BILL_EXPENSE_CARD: "expensecard_viewbill",
  EDIT_DETAILS_EXPENSE_CARD: "expensecard_editdetails",
  //Document card
  VIEW_DOC_DOCUMNET_CARD: "documentcard_viewbill",
  EDIT_DETAILS_DOCUMENT_CARD: "documentcard_editdetails",
  API_ERROR: "api_error",

  //delete
  CLICK_PRODUCT_EDIT: "product_edit",
  CLICK_URL: "click_url"
};

const logEventInDebug = false;
const logEvent = (eventName, data = {}) => {
  console.log("event", eventName, data);
  if (!__DEV__ || logEventInDebug) {
    const user = store.getState().loggedInUser;
    const eventData = {
      FCM_Id: user.fcmToken,
      User_Id: user.id,
      User_Name: user.name,
      User_Mobile: user.phone,
      ...data
    };

    FbSdkAppEventsLogger.logEvent(eventName);
    FirebaseAnalytics.logEvent(eventName, eventData);
  }
};
export default { EVENTS, logEvent };
export { EVENTS, logEvent };
