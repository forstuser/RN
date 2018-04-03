import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Text } from "../elements";
import { colors } from "../theme";

class PinInput extends React.Component {
  state = {
    pin: ""
  };

  onKeyPress = number => {
    if (this.state.pin.length == 4) return;
    this.setState({
      pin: this.state.pin + `${number}`
    });
  };

  onBackPress = () => {
    this.setState({
      pin: this.state.pin.slice(0, -1)
    });
  };

  onSubmitPress = () => {
    if (this.state.pin.length < 4) return;
    const { onSubmitPress } = this.props;
    if (typeof onSubmitPress == "function") {
      onSubmitPress(this.state.pin);
    }
  };

  render() {
    const { pin } = this.state;
    const {
      title,
      onSubmitPress,
      showForgotOption,
      onForgotOptionPress
    } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text weight="Light" style={styles.title}>
            {title}
          </Text>
          <View style={styles.dots}>
            {[1, 2, 3, 4].map(number => (
              <View
                key={number}
                style={[
                  styles.dot,
                  pin.length >= number ? styles.filledDot : {}
                ]}
              />
            ))}
          </View>
          {showForgotOption && (
            <Text
              onPress={onForgotOptionPress}
              weight="Light"
              style={styles.forgotPin}
            >
              Forgot PIN?
            </Text>
          )}
        </View>
        <View style={styles.keyboard}>
          <View style={styles.keyboardRow}>
            {[1, 2, 3].map(number => (
              <TouchableOpacity
                key={number}
                onPress={() => this.onKeyPress(number)}
                style={styles.keyboardKey}
              >
                <Text weight="Light" style={styles.keyboardKeyText}>
                  {number}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.keyboardRow}>
            {[4, 5, 6].map(number => (
              <TouchableOpacity
                key={number}
                onPress={() => this.onKeyPress(number)}
                style={styles.keyboardKey}
              >
                <Text weight="Light" style={styles.keyboardKeyText}>
                  {number}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.keyboardRow}>
            {[7, 8, 9].map(number => (
              <TouchableOpacity
                key={number}
                onPress={() => this.onKeyPress(number)}
                style={styles.keyboardKey}
              >
                <Text weight="Light" style={styles.keyboardKeyText}>
                  {number}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.keyboardRow}>
            <TouchableOpacity
              onPress={() => this.onBackPress()}
              style={styles.keyboardKey}
            >
              <Icon style={styles.keyboardKeyText} name="ios-backspace" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.onKeyPress(0)}
              style={styles.keyboardKey}
            >
              <Text weight="Light" style={styles.keyboardKeyText}>
                0
              </Text>
            </TouchableOpacity>
            <TouchableWithoutFeedback onPress={this.onSubmitPress}>
              <View style={styles.keyboardKey}>
                <Text
                  weight="Medium"
                  style={[
                    styles.keyboardKeyText,
                    { fontSize: 18 },
                    pin.length < 4 ? { opacity: 0.5 } : {}
                  ]}
                >
                  SUBMIT
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    backgroundColor: colors.mainBlue
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    textAlign: "center",
    color: "#fff",
    fontSize: 35,
    marginBottom: 20
  },
  dots: {
    width: 150,
    minHeight: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  dot: {
    width: 15,
    height: 15,
    borderRadius: 8,
    borderColor: "#fff",
    borderWidth: 1
  },
  filledDot: {
    backgroundColor: "#fff"
  },
  forgotPin: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    textDecorationLine: "underline"
  },
  keyboardRow: {
    width: "100%",
    maxWidth: 420,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  keyboardKey: {
    flex: 1,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    margin: 5
  },
  keyboardKeyText: {
    color: "#fff",
    fontSize: 22
  }
});

export default PinInput;
