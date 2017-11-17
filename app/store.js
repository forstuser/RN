import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { persistStore, persistCombineReducers } from "redux-persist";
import storage from "redux-persist/es/storage"; // default: localStorage if web, AsyncStorage if react-native
import reducers from "./modules";

const config = {
  key: "root",
  storage
};

const rootReducer = persistCombineReducers(config, reducers);

let middlewares = [thunk];

export default (store = createStore(
  rootReducer,
  undefined,
  compose(applyMiddleware(...middlewares))
));
