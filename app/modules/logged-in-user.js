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
    case types.LOGGED_IN_USER_SET_USER:
      return {
        ...state,
        id: action.payload.id,
        name: action.payload.name,
        phone: action.payload.phone,
        imageName: action.payload.imageName
      };
    case types.LOGGED_IN_USER_SET_IS_PIN_SET:
      return {
        ...state,
        fcmToken: action.payload.isPinSet
      };
    case types.LOGGED_IN_USER_SET_CODEPUSH_DEPLOYEMENT_STAGING:
      return {
        ...state,
        codepushDeploymentStaging: action.payload.codepushDeploymentStaging
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
  },
  /**
   * user object: {id, name, phone, imageName}
   */
  setLoggedInUser: user => {
    return {
      type: types.LOGGED_IN_USER_SET_USER,
      payload: { ...user }
    };
  },
  setLoggedInUserIsPinSet: isPinSet => {
    return {
      type: types.LOGGED_IN_USER_SET_IS_PIN_SET,
      payload: { isPinSet: isPinSet }
    };
  },
  setLoggedInUserCodepushDeploymentStaging: codepushDeploymentStaging => {
    return {
      type: types.LOGGED_IN_USER_SET_CODEPUSH_DEPLOYEMENT_STAGING,
      payload: { codepushDeploymentStaging: codepushDeploymentStaging }
    };
  }
};
