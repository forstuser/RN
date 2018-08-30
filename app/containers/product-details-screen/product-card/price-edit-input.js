import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Platform
} from "react-native";
import { Text } from "../../../elements";
import { colors, defaultStyles } from "../../../theme";
import Eicon from "react-native-vector-icons/EvilIcons";
import Icon from "react-native-vector-icons/Ionicons";

class PriceEditInput extends React.Component {
  constructor(props) {
    super(props);
    this.input = null;
    this.state = {
      value: "",
      type: "",
      id: "",
      isInputFocused: false,
      correctIcon: false
    };
  }

  componentDidMount() {
    if (this.props.price) {
      this.setState({
        value: String(this.props.price),
        type: this.props.type,
        id: this.props.id
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.price) {
      this.setState({ value: String(nextProps.price) });
    }
  }

  onChangeText = newValue => {
    if (typeof this.props.onChangeText == "function") {
      this.props.onChangeText(newValue);
    }
    this.setState({
      value: newValue
    });
  };
  onInputFocus = () => {
    this.setState({
      isInputFocused: true
    });
    if (this.state.correctIcon == false)
      this.setState({
        correctIcon: true
      });
  };
  onInputBlur = () => {
    this.setState({
      isInputFocused: false
    });
  };

  focus = () => {
    this.input.focus();
  };

  toggleIcon = () => {
    if (this.state.correctIcon == false)
      this.setState({
        correctIcon: true
      });
    else {
      this.setState({
        correctIcon: false
      });
    }
  };
  updateAmount = () => {
    this.props.sendData(
      this.state.value.substr(1, this.state.value.length),
      this.props.id,
      this.props.type
    );
  };

  render() {
    const { name, type, id, date, editable = true } = this.props;
    const { value, isInputFocused, correctIcon } = this.state;

    return (
      <View style={styles.container}>
        <View style={{ flex: 1.5 }}>
          <Text weight="Regular">
            {name}
            {date}
          </Text>
        </View>
        <View style={styles.innerContainer}>
          <View style={styles.textInput}>
            <TextInput
              style={editable ? {} : { fontWeight: "bold", color: "#000" }}
              ref={ref => (this.input = ref)}
              underlineColorAndroid="transparent"
              value={
                value.includes("₹") && value == "₹"
                  ? String(value)
                  : !value.includes("₹")
                    ? "₹" + String(value)
                    : String(value)
              }
              onFocus={this.onInputFocus}
              onBlur={this.onInputBlur}
              onChangeText={text => this.onChangeText(text)}
              maxLength={10}
              editable={editable}
              keyboardType="numeric"
            />
          </View>
          {editable ? (
            <View style={styles.icon}>
              {!correctIcon && (
                <TouchableOpacity
                  style={{ marginTop: 0 }}
                  onPress={event => {
                    this.input.focus(), this.toggleIcon();
                  }}
                >
                  <Eicon name="pencil" size={30} color={colors.mainBlue} />
                </TouchableOpacity>
              )}
              {correctIcon && (
                <TouchableOpacity
                  style={{ marginTop: 4 }}
                  onPress={event => {
                    this.toggleIcon(), this.updateAmount();
                  }}
                >
                  <Icon
                    name="ios-checkmark-circle"
                    size={30}
                    color={colors.mainBlue}
                  />
                </TouchableOpacity>
              )}
            </View>
          ) : (
              <View style={styles.icon} />
            )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    height: 45,
    borderTopWidth: 1,
    borderColor: "#efefef",
    alignItems: "center",
    paddingHorizontal: 10
  },
  innerContainer: {
    flex: 1,
    flexDirection: "row",
    marginRight: 5,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  textInput: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10
  },
  icon: {
    flex: 1,
    marginTop: -3
  },

  white: {
    backgroundColor: "transparent"
  }
});

export default PriceEditInput;
