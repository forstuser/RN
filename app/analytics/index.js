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
  CLICK_VIEW_BILL: "productcard_viewbill",
  CLICK_ON_ADD_PRODUCT_IMAGE: "productcard_addimage",
  CLICK_ON_SHARE_PRODUCT_CARD: "productcard_share",
  COMPLETE_SHARE_PRODUCT: "productcard_share_complete",
  CLICK_ON_REVIEW: "productcard_review_click",
  SUBMIT_REVIEW: "productcard_review_submmit",
  CLICK_ON_ALL_INFO: "productcard_allinfo",
  CLICK_ON_IMPORTANT: "productcard_important",
  CLICK_ON_ADD_WARRANTY: "productcard_adwarranty",
  CLICK_ON_ADD_INSURANCE: "productcard_addinsurance",
  CLICK_ON_ADD_AMC: "productcard_addamc",
  CLICK_ON_ADD_PUC: "productcard_addpuc",
  CLICK_ON_ADD_REPAIR: "productcard_addrepair",
  CLICK_ON_ADD_EXTENDED_WARRANTY: "productcard_extendedwarranty",
  CLICK_SAVE: "productcard_save",
  CLICK_EDIT: "productcard_edit",
  CLICK_ASC_INSIDE_PRODUCT_CARD: "productcard_asc",
  CLICK_CALL: "productcard_contact_call",
  CLICK_EMAIL: "productcard_click_email",
  CLICK_ON_SERVICE_REQUEST: "productcard_click_servicerequest",
  CLICK_NEAREST_ASC_INSIDE_PRODUCT: "productcard_asc",
  CLICK_ON_DELETE_PRODUCT: "productcard_delete",
  //others
  OPEN_ASC_SCREEN: "click_asc",
  SEARCH_ASC: "search_asc",
  CLICK_ON_EXPENSE_INSIGHT: "click_expense",
  OPEN_MAILS: "click_mail",
  SHARE_VIA: "share_Via",
  //Who's absent today
  CLICK_ON_WHO_IS_ABSENT_TODAY: "attendance_click",
  CLICK_ON_ADD_SERVICE: "attendance_addservice",
  SELECT_SERVICE_TYPE: "attendance_selectservicetype",
  CLICK_ADD_PAYMENT: "attendance_addpayment",
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
  CLICK_CREATE_FIRST_LIST_COOK: "eazyday_click_list_cook",
  CLICK_CREATE_FIRST_LIST_WEAR: "eazyday_list_wear",
  CLICK_CREATE_FIRST_LIST_TODO: "eazyday_list_todo",
  CLICK_ON_ADD_NEW_DISH: "eazyday_addnew_dish",
  CLICK_ON_ADD_NEW_WEAR_ITEM: "eazyday_addnew_cloth",
  CLICK_ON_ADD_NEW_WHAT_TO_DO: "eazyday_addnew_todo",
  USE_SEARCH: "search_use",
  //expense card
  VIEW_BILL_EXPENSE_CARD: "expensecard_viewbill",
  EDIT_DETAILS_EXPENSE_CARD: "expensecard_editdetails",
  //Document card
  VIEW_DOC_DOCUMNET_CARD: "documentcard_viewbill",
  EDIT_DETAILS_DOCUMENT_CARD: "documentcard_editdetails",

  API_ERROR: "api_error",







  // these had to be delete
  CLICK_ON_ELECTRONIC_AND_ELECTRICAL: "plus_addpdct_electronics",
  CLICK_ON_AUTOMOBILE: "plus_addproduct_Atomobile",
  CLICK_ON_FURNITURE_AND_HARDWARE: "plus_addproduct_FurnitureAndHardware",
  CLICK_ON_INSURANCE_AND_MEDICAL_DOCS:
    "plus_addproduct_InsuranceAndMedicalDocs",
  CLICK_ON_PERSONAL_DOCS: "plus_addproduct_PersonalDocs",
  CLICK_ON_VISITING_CARD: "plus_addproduct_VisitingCards",
  CLICK_ON_TRAVEL_AND_DINING: "plus_addproduct_TravelAndDining",
  CLICK_ON_HEALTHCARE: "plus_addproduct_Healthcare",
  CLICK_ON_FASHION: "plus_addproduct_Faishon",
  CLICK_ON_SERVICES: "plus_addproduct_Services",
  CLICK_ON_HOME_EXPENSES: "plus_addproduct_HomeExpenses",
  CLICK_ON_REPAIR: "plus_addproduct_Repair",
  ADD_PRODUCT_COMPLETED: "add_addproductCompleted",
  ADD_ANOTHER_PRODUCT: "addanother_addproduct",
  CLICK_PLAY_VIDEO: "Click_playvideo", // remaining
  //eHome
  CLICK_SEARCH: "click_search",
  USE_SEARCH: "use_search",
  //product card

  //ASC

  //OTHERS
  CLICK_MAIL: "Click_mail",
  SHARE_VIA_SCREEN_SHOTS: "Share_Via",
  //ATTENDANCE MANAGER

  CLICK_ON_ATTENDANCE_ITEMS: "click_attendanceitem",
  ADD_ATTENDANCE_ITEM: "Add_attendance",
  CLICK_ABSENT: "Click_Absent",
  ADD_ADD_ATTENDANCE_ITEM: "Add_",
  CLICK_CHANGE_CALENDAR: "Add_Change_Calendar",
  CLICK_CALENDAR_SERVICE_TYPE_: "Click_",
  CLICK_MILK_ABSENT: "Click_Milk_Absent",
  CLICK_MAID_ABSENT: "Click_Maid_Absent",
  CLICK_STAFF_ABSENT: "Click_Staff_Absent",
  CLICK_NEWSPAPER_ABSENT: "Click_Newspaper_Absent",
  CLICK_ADD_PAYMENT_MILK: "Click Add Payment_Milk",
  CLICK_ADD_PAYMENT_MAID: "Click Add Payment_Maid",
  CLICK_ADD_PAYMENT_STAFF: "Click Add Payment_Staff",
  CLICK_ADD_PAYMENT_NEWSPAPER: "Click Add Payment_Newspaper",
  //DO YOU KNOW

  CLICK_ON_SEARCH_TAG: "searchtag_duk",
  //MORE

  // DASHBOARD


  CLICK_ON_MAILBOX: "Click_mail",

  CLICK_CONTACT_AFTER_SALES: "aftersales_pc",
  CLICK_CONTACT_BRAND: "contact_brand",
  CLICK_CONTACT_INSURANCE_PROVIDER: "contact_IP",
  CLICK_CONTACT_WARRANTY_PROVIDER: "contact_thwp",
  CLICK_PRODUCT_EDIT: "product_edit",
  CLICK_URL: "click_url",

  PRODUCT_DELETE_INITIATED: "product_delete_initiated",
  PRODUCT_DELETE_CANCELED: "product_delete_canceled",
  PRODUCT_DELETE_COMPLETE: "product_delete_complete",

  //eazyday
  CLICK_WHO_IS_ABSENT: "Open_attendance",

};

const logEvent = (eventName, data = {}) => {
  console.log(eventName);
  if (__DEV__) {
    const user = store.getState().loggedInUser;
    FirebaseAnalytics.logEvent(eventName, {
      User_Id: user.id,
      User_Name: user.name,
      User_Mobile: user.phone,
      ...data
    });
    FbSdkAppEventsLogger.logEvent(eventName);
  }
};
export default { EVENTS, logEvent };
export { EVENTS, logEvent };
