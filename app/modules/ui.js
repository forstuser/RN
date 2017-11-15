import * as types from "./action-types";
import defaultState from "./default-state";

/**
 * Reducer
 */
export default function uiReducer(state = defaultState.ui, action) {
  switch (action.type) {
    case types.UI_SET_UNREAD_MESSAGES_COUNT:
      return {
        ...state,
        unreadMessagesCount: action.payload.count
      };
    default:
      return state;
  }
}

/**
 * Actions
 */
export const actions = {
  setUiUnreadMessagesCount: count => {
    return {
      type: types.UI_SET_UNREAD_MESSAGES_COUNT,
      payload: { count }
    };
  }
};
