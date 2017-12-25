import * as types from "./action-types";
import defaultState from "./default-state";

/**
 * Reducer
 */
export default function loggedInUserReducer(
  state = defaultState.loggedInUser,
  action
) {
  switch (action.type) {
    case types.LOGGED_IN_USER_SET_AUTH_TOKEN:
      return {
        ...state,
        authToken: action.payload.authToken
      };
    case types.LOGGED_IN_USER_SET_FCM_TOKEN:
      return {
        ...state,
        fcmToken: action.payload.fcmToken
      };
    default:
      return state;
  }
}

/**
 * Actions
 */
export const actions = {
  setLoggedInUserAuthToken: authToken => {
    return {
      type: types.LOGGED_IN_USER_SET_AUTH_TOKEN,
      payload: { authToken: authToken }
    };
  },
  setLoggedInUserFcmToken: fcmToken => {
    return {
      type: types.LOGGED_IN_USER_SET_FCM_TOKEN,
      payload: { fcmToken: fcmToken }
    };
  }
};
