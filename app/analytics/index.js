import FirebaseAnalytics from "react-native-firebase-analytics";
const FBSDK = require("react-native-fbsdk");
const FbSdkAppEventsLogger = FBSDK.AppEventsLogger;

import store from "../store";

const EVENTS = {
  REGISTRATION_FB: "registration_fb",
  REGISTRATION_OTP: "registration_otp",
  CLICK_PLUS_ICON: "plus_addproduct",
  CLICK_ON_ELECTRONIC_AND_ELECTRICAL: "plus_addpdct_electronics",
  CLICK_ON_AUTOMOBILE: "plus_addproduct_Atomobile",
  CLICK_ON_FURNITURE_AND_HARDWARE: "plus_addproduct_FurnitureAndHardware",
  CLICK_ON_INSURANCE_AND_MEDICAL_DOCS: "plus_addproduct_InsuranceAndMedicalDocs",
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
  CLICK_I_WILL_DO_IT_LATER: "Click_addproduct_Later",
  CLICK_PLAY_VIDEO: "Click_playvideo", // remaining
  //eHome
  OPEN_EHOME: "click_ehome",
  OPEN_EHOME_CATEGORY: "categoryclick_ehome",
  ADD_PRODUCT_INSIDE_EHOME_MAIN_CATEGORIES: "addproduct_insideehome",
  CLICK_SEARCH: "click_search",
  USE_SEARCH: "use_search",
  //product card
  CLICK_VIEW_BILL: "addbill_pc",
  CLICK_ON_ADD_PRODUCT_IMAGE: "Click_AddProductImage",
  CLICK_ON_SHARE_PRODUCT_CARD: "Click_Shareproductcard",
  COMPLETE_SHARE_PRODUCT: "Click_Shareproductcardcomplete",
  CLICK_ON_REVIEW: "click_review",
  SUBMIT_REVIEW: "Submit_review",
  CLICK_ON_ALL_INFO: "click_allinfo",
  CLICK_ON_IMPORTANT: "click_important",
  CLICK_ON_ADD_WARRANTY: "click_adwarranty",
  CLICK_ON_ADD_INSURANCE: "click_addinsurance",
  CLICK_ON_ADD_AMC: "click_addamc",
  CLICK_ON_ADD_PUC: "click_addpuc",
  CLICK_ON_ADD_REPAIR: "click_addrepair",
  CLICK_ON_ADD_EXTENDED_WARRANTY: "click_extendedwarranty",
  CLICK_SAVE: "click_save",
  CLICK_EDIT: "click_imp_edit",
  CLICK_ASC_INSIDE_PRODUCT_CARD: "Click_Ascproductcard",
  CLICK_CALL: "contact_call",
  CLICK_EMAIL: "click_email",
  CLICK_ON_SERVICE_REQUEST: "Click_servicerequest",
  //ASC
  OPEN_ASC_SCREEN: "click_asc",
  SEARCH_ASC: "search_asc",
  //OTHERS
  OPEN_MAILS: "Click_mailbox",
  CLICK_MAIL: "Click_mail",
  SHARE_VIA_SCREEN_SHOTS: "Share_Via",
  //ATTENDANCE MANAGER
  CLICK_ON_EAZYDAY: "Click_eazyday",
  CLICK_ON_ATTENDANCE_ITEMS: "click_attendanceitem",
  ADD_ATTENDANCE_ITEM: "Add_attendance",
  CLICK_ABSENT: "Click_Absent",
  ADD_ADD_ATTENDANCE_ITEM: "Add_",
  CLICK_ADD_PAYMENT: "Add_Payment_Calendar",
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
  CLICK_ON_DO_YOU_KNOW: "Click_duk",
  CLICK_ON_SHARE_DYK: "Share_Duk",
  CLICK_ON_LIKE_DUK: "like_DUK",
  CLICK_ON_SEARCH_TAG: "searchtag_duk",
  SWIPE_DYK_CARD: "swepecard_Duk",
  //MORE
  CLICK_MORE: "click_more",
  CLICK_ADD_PIN: "click_Pin",
  CLICK_SHARE_APP: "Click_ShareApp",
  CLICK_TIPS_TO_BUILD_YOUR_EHOME: "Click_BuildyoureHome",
  CLICK_FAQ: "Click_FAQ",
  CLICK_LOGOUT_YES: "Click_logoutyes",
  CLICK_ASC_FROM_MORE: "Click_ASC_More",
  // DASHBOARD
  CLICK_ON_EXPENSE_INSIGHT: "click_expenseinsights",
  CLICK_ON_ASC: "Click_ASC",
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
  API_ERROR: "api_error",
  SHARE_VIA: "share_via",

  //eazyday
  CLICK_WHO_IS_ABSENT: "Open_attendance",
  CLICK_WHAT_TO_COOK: "Open_Cook",
  CLICK_WHAT_TO_WEAR_TODAY: "Open_wear",
  CLICK_WHAT_TO_DO_TODAY: "Open_todo",
  CLICK_CREATE_FIRST_LIST_COOK: "Click_List_Cook",
  CLICK_CREATE_FIRST_LIST_WEAR: "Click_List_wear",
  CLICK_CREATE_FIRST_LIST_TODO: "Click_List_todo",
  CLICK_ON_ADD_NEW_DISH: "Click_addnew_Dish",
  CLICK_ON_ADD_NEW_WEAR_ITEM: "Click_addnew_cloth",
  CLICK_ON_ADD_NEW_WHAT_TO_DO: "Click_addnew_todo"
};

const logEvent = (eventName, data = {}) => {
  // console.log("eventName: -", eventName);
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
