import { combineReducers } from "redux";
import defaultState from "./default-state";
import loggedInUser from "./logged-in-user";
import ui from "./ui";

const reducers = {
  loggedInUser,
  ui
};

export default reducers;
