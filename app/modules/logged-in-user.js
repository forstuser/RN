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
    case types.LOGGED_IN_USER_SET_USER:
      return {
        ...state,
        id: action.payload.id,
        name: action.payload.name,
        phone: action.payload.phone,
        imageUrl: action.payload.imageUrl,
        isPinSet: action.payload.isPinSet
      };
    case types.LOGGED_IN_USER_SET_USER_NAME:
      return {
        ...state,
        name: action.payload.name
      };
    case types.LOGGED_IN_USER_SET_IS_PIN_SET:
      return {
        ...state,
        isPinSet: action.payload.isPinSet
      };
    case types.LOGGED_IN_USER_SET_CODEPUSH_DEPLOYEMENT_STAGING:
      return {
        ...state,
        codepushDeploymentStaging: action.payload.codepushDeploymentStaging
      };
    case types.LOGGED_IN_USER_SET_LATEST_DO_YOU_KNOW_READ_ID:
      return {
        ...state,
        latestDoYouKnowReadId: action.payload.latestDoYouKnowReadId
      };
    case types.LOGGED_IN_USER_CLEAR_ALL_DATA:
      return {
        ...defaultState.loggedInUser
      };
    default:
      return state;
  }
}

/**
 * Actions
 */
export const actions = {
  loggedInUserClearAllData: () => {
    return {
      type: types.LOGGED_IN_USER_CLEAR_ALL_DATA
    };
  },
  setLoggedInUserAuthToken: authToken => {
    return {
      type: types.LOGGED_IN_USER_SET_AUTH_TOKEN,
      payload: { authToken: authToken }
    };
  },
  /**
   * user object: {id, name, phone, imageUrl, isPinSet}
   */
  setLoggedInUser: user => {
    return {
      type: types.LOGGED_IN_USER_SET_USER,
      payload: { ...user }
    };
  },
  setLoggedInUserName: name => {
    return {
      type: types.LOGGED_IN_USER_SET_USER_NAME,
      payload: { name }
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
  },
  setLatestDoYouKnowReadId: latestDoYouKnowReadId => {
    return {
      type: types.LOGGED_IN_USER_SET_LATEST_DO_YOU_KNOW_READ_ID,
      payload: { latestDoYouKnowReadId }
    };
  }
};
