import RNSnackbar from "react-native-snackbar";
import { colors } from "../theme";

const snackbar = {
  LENGTH_SHORT: RNSnackbar.LENGTH_SHORT,
  LENGTH_LONG: RNSnackbar.LENGTH_LONG,
  LENGTH_INDEFINITE: RNSnackbar.LENGTH_INDEFINITE,
  show: ({ title, duration }) => {
    if (title) {
      RNSnackbar.show({
        title,
        duration,
        action: {
          title: "OK",
          color: colors.pinkishOrange
        }
      });
    }
  }
};

const showSnackbar = ({ text }) => {
  snackbar.show({ title: text, duration: RNSnackbar.LENGTH_SHORT });
};

export default snackbar;
export { showSnackbar };
