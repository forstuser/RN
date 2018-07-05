import Snackbar from "react-native-snackbar";
import { colors } from "../theme";

const LENGTH_SHORT = Snackbar.LENGTH_SHORT;
const LENGTH_LONG = Snackbar.LENGTH_LONG;
const LENGTH_INDEFINITE = Snackbar.LENGTH_INDEFINITE;

const show = ({ title, duration }) => {
  if (title) {
    Snackbar.show({
      title,
      duration,
      action: {
        title: "OK",
        color: colors.pinkishOrange
      }
    });
  }
};

const showSnackbar = ({ text }) => {
  show({ title: text, duration: Snackbar.LENGTH_SHORT });
};

export { showSnackbar, show, LENGTH_SHORT, LENGTH_LONG, LENGTH_INDEFINITE };
