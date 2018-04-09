import { Platform } from "react-native";
import I18n from "./i18n";

const CODEPUSH_KEYS = {
  STAGING:
    Platform.OS == "ios"
      ? "6Aey0a8FKAzWDwc32zUI5AVSNAphHJL0U-57f"
      : "lbLu7tymLbfASj5eYvyhm9Y2nOKdS1mmOpkiG",
  PRODUCTION:
    Platform.OS == "ios"
      ? "K3OHL8lYBDt_3Vj2pRemr_K9xzNpSJDAL-c7M"
      : "zvQIi4UyOza2yFLxBdk5F2nKCaFTS1BmdpyoG"
};

const GLOBAL_VARIABLES = {
  FILES_FOR_DIRECT_UPLOAD: "FILES_FOR_DIRECT_UPLOAD",
  DO_YOU_KNOW_ITEM_ID_TO_OPEN_DIRECTLY: "DO_YOU_KNOW_ITEM_ID_TO_OPEN_DIRECTLY",
  LAST_ACTIVE_TIMESTAMP: "LAST_ACTIVE_TIMESTAMP",
  IS_ENTER_PIN_SCREEN_VISIBLE: "IS_ENTER_PIN_SCREEN_VISIBLE"
};

const EXPENSE_TYPES = {
  AUTOMOBILE: "AUTOMOBILE",
  ELECTRONICS: "ELECTRONICS_ELECTRICALS",
  FURNITURE: "FURNITURE",
  MEDICAL_DOCS: "MEDICAL_DOCS",
  PERSONAL: "PERSONAL",
  VISITING_CARD: "VISITING_CARD",
  TRAVEL: "TRAVEL",
  HEALTHCARE: "HEALTHCARE",
  FASHION: "FASHION",
  SERVICES: "SERVICES",
  HOME: "HOME",
  REPAIR: "REPAIR"
};

const MAIN_CATEGORY_IDS = {
  FURNITURE: 1,
  ELECTRONICS: 2,
  AUTOMOBILE: 3,
  TRAVEL: 4,
  HEALTHCARE: 5,
  SERVICES: 6,
  FASHION: 7,
  HOUSEHOLD: 8,
  OTHERS: 9,
  PERSONAL: 10
};

const CATEGORY_IDS = {
  AUTOMOBILE: {
    CAR: 139,
    BIKE: 138,
    SCOOTER: 150,
    CYCLE: 154,
    VAN: 153
  },
  ELECTRONICS: {
    MOBILE: 327,
    TV: 581,
    LAPTOP: 487,
    AC: 162,
    WATER_PURIFIER: 530,
    REFRIGERATOR: 491,
    WASHING_MACHINE: 541
  },
  FURNITURE: {
    FURNITURE: 20,
    HARDWARE: 72,
    OTHER_FURNITURE_HARDWARE: 73
  },
  HEALTHCARE: {
    INSURANCE: 664,
    EXPENSE: 23,
    MEDICAL_DOC: 86
  },
  HOUSEHOLD: {
    HOME_DECOR: 697,
    HOUSEHOLD_EXPENSE: 26,
    UTILITY_BILLS: 634,
    EDUCATION: 635,
    OTHER_HOUSEHOLD_EXPENSE: 698
  },
  TRAVEL: {
    TRAVEL: 22,
    HOTEL_STAY: 84,
    DINING: 85
  },
  SERVICES: {
    OTHER_SERVICES: 24,
    PROFESSIONAL: 11,
    LESSIONS_HOBBIES: 12
  },
  PERSONAL: {
    RENT_AGREEMENT: 28,
    VISITING_CARD: 27,
    OTHER_PERSONAL_DOC: 111
  }
};

const LANGUAGES = [
  {
    code: "en",
    name: "English"
  },
  {
    code: "hi",
    name: "हिंदी"
  },
  {
    code: "bn",
    name: "বাংলা"
  },
  {
    code: "mr",
    name: "मराठी"
  },
  {
    code: "gu",
    name: "ગુજરાત"
  },
  {
    code: "te",
    name: "తెలుగు"
  },
  {
    code: "ml",
    name: "മലയാളം"
  },
  {
    code: "ta",
    name: "தமிழ்"
  }
];

const UNIT_TYPES = {
  LITRE: {
    id: 1,
    symbol: I18n.t("litre_symbol"),
    name: I18n.t("litre")
  },
  MILLILITRE: {
    id: 2,
    symbol: I18n.t("millilitre_symbol"),
    name: I18n.t("millilitre")
  },
  KILOGRAM: {
    id: 3,
    symbol: I18n.t("kilogram_symbol"),
    name: I18n.t("kilogram")
  },
  GRAM: {
    id: 4,
    symbol: I18n.t("gram_symbol"),
    name: I18n.t("gram")
  },
  UNIT: {
    id: 5,
    symbol: I18n.t("unit_symbol"),
    name: I18n.t("unit")
  },
  DOZEN: {
    id: 6,
    symbol: I18n.t("dozen_symbol"),
    name: I18n.t("dozen")
  }
};

const CALENDAR_SERVICE_TYPES = {
  MILK: 1,
  DAIRY: 2,
  VEGETABLES: 3
};

const CALENDAR_WAGES_TYPE = {
  PRODUCT: 1,
  WAGES: 2,
  FEES: 3
};

const SCREENS = {
  PIN_SETUP_SCREEN: "PIN_SETUP_SCREEN",
  ENTER_PIN_POPUP_SCREEN: "ENTER_PIN_POPUP_SCREEN",
  CALENDAR_SERVICE_CARD_SCREEN: "CALENDAR_SERVICE_CARD_SCREEN",
  ADD_CALENDAR_SERVICE_SCREEN: "ADD_CALENDAR_SERVICE_SCREEN",
  MY_CALENDAR_SCREEN: "MY_CALENDAR_SCREEN",
  DO_YOU_KNOW_SCREEN: "DO_YOU_KNOW_SCREEN",
  RATE_US_SCREEN: "RATE_US_SCREEN",
  DIRECT_UPLOAD_DOCUMENT_SCREEN: "DIRECT_UPLOAD_DOCUMENT_SCREEN",
  ADD_PRODUCT_OPTIONS_SCREEN: "ADD_PRODUCT_OPTIONS_SCREEN",
  EDIT_INSURANCE_SCREEN: "EDIT_INSURANCE_SCREEN",
  EDIT_MEDICAL_DOCS_SCREEN: "EDIT_MEDICAL_DOCS_SCREEN",
  ADD_EDIT_PERSONAL_DOC_SCREEN: "ADD_EDIT_PERSONAL_DOC_SCREEN",
  EDIT_PRODUCT_BASIC_DETAILS_SCREEN: "EDIT_PRODUCT_BASIC_DETAILS_SCREEN",
  ADD_EDIT_PUC_SCREEN: "ADD_EDIT_PUC_SCREEN",
  ADD_EDIT_REPAIR_SCREEN: "ADD_EDIT_REPAIR_SCREEN",
  ADD_EDIT_AMC_SCREEN: "ADD_EDIT_AMC_SCREEN",
  ADD_EDIT_INSURANCE_SCREEN: "ADD_EDIT_INSURANCE_SCREEN",
  ADD_EDIT_WARRANTY_SCREEN: "ADD_EDIT_WARRANTY_SCREEN",
  ADD_EDIT_EXPENSE_SCREEN: "ADD_EDIT_EXPENSE_SCREEN",
  ADD_PRODUCT_SCREEN: "ADD_PRODUCT_SCREEN",
  ADD_PRODUCTS_SCREEN: "ADD_PRODUCTS_SCREEN",
  ASC_SEARCH_SCREEN: "ASC_SEARCH_SCREEN",
  BILLS_POPUP_SCREEN: "BILLS_POPUP_SCREEN",
  DASHBOARD_SCREEN: "DASHBOARD_SCREEN",
  DOCS_UNDER_PROCESSING_SCREEN: "DOCS_UNDER_PROCESSING_SCREEN",
  INSIGHTS_SCREEN: "INSIGHTS_SCREEN",
  INTRO_SCREEN: "INTRO_SCREEN",
  MAILBOX_SCREEN: "MAILBOX_SCREEN",
  MAIN_CATEGORY_SCREEN: "MAIN_CATEGORY_SCREEN",
  MORE_SCREEN: "MORE_SCREEN",
  PRODUCT_DETAILS_SCREEN: "PRODUCT_DETAILS_SCREEN",
  PROFILE_SCREEN: "PROFILE_SCREEN",
  UPLOAD_DOCUMENT_SCREEN: "UPLOAD_DOCUMENT_SCREEN",
  ASC_SCREEN: "ASC_SCREEN",
  EHOME_SCREEN: "EHOME_SCREEN",
  FAQS_SCREEN: "FAQS_SCREEN",
  FORCE_UPDATE_SCREEN: "FORCE_UPDATE_SCREEN",
  LOGIN_SCREEN: "LOGIN_SCREEN",
  SEARCH_SCREEN: "SEARCH_SCREEN",
  SNACKBAR_SCREEN: "SNACKBAR_SCREEN",
  TERMS_SCREEN: "TERMS_SCREEN",
  TIPS_SCREEN: "TIPS_SCREEN",
  TOTAL_TAX_SCREEN: "TOTAL_TAX_SCREEN",
  TRANSACTIONS_SCREEN: "TRANSACTIONS_SCREEN",
  VERIFY_SCREEN: "VERIFY_SCREEN"
};

const WARRANTY_TYPES = {
  NORMAL: 1,
  EXTENDED: 2,
  DUAL: 3
};

const SERVICE_TYPE_NAMES = {
  1: "Free",
  2: "Paid",
  3: "Bonus"
};

const WAGES_CYCLE = {
  DAILY: 0,
  MONTHLY: 1
};

const METADATA_KEYS = {
  VIN: "vin",
  IMEI_NUMBER: "IMEI Number",
  SERIAL_NUMBER: "Serial Number",
  REGISTRATION_NUMBER: "Registration Number",
  DUE_DATE: "Due date",
  MODEL_NAME: "model name",
  MODEL_NUMBER: "model number",
  TYPE: "type"
};

export {
  CODEPUSH_KEYS,
  GLOBAL_VARIABLES,
  MAIN_CATEGORY_IDS,
  CATEGORY_IDS,
  UNIT_TYPES,
  WAGES_CYCLE,
  CALENDAR_SERVICE_TYPES,
  CALENDAR_WAGES_TYPE,
  LANGUAGES,
  SCREENS,
  EXPENSE_TYPES,
  WARRANTY_TYPES,
  SERVICE_TYPE_NAMES,
  METADATA_KEYS
};
