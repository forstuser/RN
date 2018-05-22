import Snackbar from "react-native-snackbar";
import { colors } from "../theme";

const showSnackbar = ({ text }) => {
  // Alert.alert(text);
  Snackbar.show({
    title: text,
    duration: Snackbar.LENGTH_SHORT,
    action: {
      title: "OK",
      color: colors.pinkishOrange
    }
  });
};

export { showSnackbar };
