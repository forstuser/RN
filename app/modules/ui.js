import * as types from "./action-types";
import defaultState from "./default-state";

/**
 * Reducer
 */
export default function uiReducer(state = defaultState.ui, action) {
  switch (action.type) {
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
    default:
      return state;
  }
}

/**
 * Actions
 */
export const actions = {
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
  }
};
