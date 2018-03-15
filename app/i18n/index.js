import I18n from "react-native-i18n";
import store from "../store";
import en from "./locales/en";
import hi from "./locales/hi";

I18n.fallbacks = true;
I18n.defaultLocale = "en";

I18n.translations = {
  en,
  hi
};

export default I18n;
