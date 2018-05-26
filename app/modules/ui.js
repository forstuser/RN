import * as types from "./action-types";
import defaultState from "./default-state";

/**
 * Reducer
 */
export default function uiReducer(state = defaultState.ui, action) {
  switch (action.type) {
    case types.UI_SET_FCM_TOKEN:
      return {
        ...state,
        fcmToken: action.payload.fcmToken
      };
    case types.UI_SET_LANGUAGE:
      return {
        ...state,
        language: action.payload.language
      };
    case types.UI_SET_SCREEN_TO_OPEN_AFTER_LOGIN:
      return {
        ...state,
        screenToOpenAfterLogin: action.payload.screen
      };
    case types.UI_SET_HAS_BLANK_DASHBOARD_TOUR_SHOWN:
      return {
        ...state,
        hasBlankDashboardTourShown: action.payload.hasBlankDashboardTourShown
      };
    case types.UI_SET_HAS_DASHBOARD_TOUR_SHOWN:
      return {
        ...state,
        hasDashboardTourShown: action.payload.hasDashboardTourShown
      };
    case types.UI_SET_HAS_EHOME_TOUR_SHOWN:
      return {
        ...state,
        hasEhomeTourShown: action.payload.hasEhomeTourShown
      };
    case types.UI_SET_HAS_UPLOAD_DOC_TOUR_SHOWN:
      return {
        ...state,
        hasUploadDocTourShown: action.payload.hasUploadDocTourShown
      };
    case types.UI_SET_HAS_UPLOAD_BILL_TOUR_SHOWN:
      return {
        ...state,
        hasUploadBillTourShown: action.payload.hasUploadBillTourShown
      };
    case types.UI_SET_HAS_PRODUCT_CARD_SHOWN:
      return {
        ...state,
        hasProductCardTourShown: action.payload.hasProductCardTourShown
      };
    case types.UI_SET_HAS_UPDATE_APP_SCREEN_SHOWN:
      return {
        ...state,
        hasUpdateAppScreenShown: action.payload.hasUpdateAppScreenShown
      };
    case types.UI_SET_RATE_US_DIALOG_TIMESTAMP:
      return {
        ...state,
        rateUsDialogTimestamp: action.payload.timestamp
      };
    case types.UI_INCREMENT_APP_OPEN:
      return {
        ...state,
        appOpenCount: state.appOpenCount + 1
      };
    default:
      return state;
  }
}

/**
 * Actions
 */
export const actions = {
  incrementAppOpen: fcmToken => {
    return {
      type: types.UI_INCREMENT_APP_OPEN
    };
  },
  setFcmToken: fcmToken => {
    return {
      type: types.UI_SET_FCM_TOKEN,
      payload: { fcmToken: fcmToken }
    };
  },
  setLanguage: language => {
    return {
      type: types.UI_SET_LANGUAGE,
      payload: { language }
    };
  },
  setScreenToOpenAferLogin: screen => {
    return {
      type: types.UI_SET_SCREEN_TO_OPEN_AFTER_LOGIN,
      payload: { screen }
    };
  },
  setUiHasBlankDashboardTourShown: hasBlankDashboardTourShown => {
    return {
      type: types.UI_SET_HAS_BLANK_DASHBOARD_TOUR_SHOWN,
      payload: { hasBlankDashboardTourShown }
    };
  },
  setUiHasDashboardTourShown: hasDashboardTourShown => {
    return {
      type: types.UI_SET_HAS_DASHBOARD_TOUR_SHOWN,
      payload: { hasDashboardTourShown }
    };
  },
  setUiHasEhomeTourShown: hasEhomeTourShown => {
    return {
      type: types.UI_SET_HAS_EHOME_TOUR_SHOWN,
      payload: { hasEhomeTourShown }
    };
  },
  setUiHasUploadDocTourShown: hasUploadDocTourShown => {
    return {
      type: types.UI_SET_HAS_UPLOAD_DOC_TOUR_SHOWN,
      payload: { hasUploadDocTourShown }
    };
  },
  setUiHasUploadBillTourShown: hasUploadBillTourShown => {
    return {
      type: types.UI_SET_HAS_UPLOAD_BILL_TOUR_SHOWN,
      payload: { hasUploadBillTourShown }
    };
  },
  setUiHasProductCardTourShown: hasProductCardTourShown => {
    return {
      type: types.UI_SET_HAS_PRODUCT_CARD_SHOWN,
      payload: { hasProductCardTourShown }
    };
  },
  setUiHasUpdateAppScreenShown: hasUpdateAppScreenShown => {
    return {
      type: types.UI_SET_HAS_UPDATE_APP_SCREEN_SHOWN,
      payload: { hasUpdateAppScreenShown }
    };
  },
  setRateUsDialogTimestamp: timestamp => {
    return {
      type: types.UI_SET_RATE_US_DIALOG_TIMESTAMP,
      payload: { timestamp }
    };
  }
};
