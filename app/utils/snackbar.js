import { Alert } from "react-native";

const showSnackbar = ({ text }) => {
  Alert.alert(text);
};

export { showSnackbar };
