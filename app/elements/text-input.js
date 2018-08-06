import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Platform
} from "react-native";
import I18n from "../i18n";
import { Text } from "./";
import { colors, defaultStyles } from "../theme";

class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      isInputFocused: false
    };
  }

  componentDidMount() {
    if (this.props.value) {
      this.setState({ value: this.props.value });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      this.setState({ value: nextProps.value });
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
  };
  onInputBlur = () => {
    this.setState({
      isInputFocused: false
    });
  };

  focus = () => {
    this.input.focus();
  };

  render() {
    const {
      style = {},
      innerContainerStyle = {},
      placeholder,
      placeholder2,
      placeholder2Color = colors.secondaryText,
      hint,
      keyboardType,
      rightSideText = "",
      rightSideTextWidth = 0,
      maxLength,
      secureTextEntry,
      getRef = () => {}
    } = this.props;
    const { value, isInputFocused } = this.state;
    return (
      <View style={[styles.container, style]}>
        <View style={[styles.innerContainer, innerContainerStyle]}>
          <View
            collapsable={false}
            style={[
              styles.placeholderContainer,
              { right: rightSideTextWidth },
              value || isInputFocused
                ? styles.filledInputPlaceholderContainer
                : {}
            ]}
          >
            <Text
              weight="Medium"
              style={[
                styles.placeholder,
                value || isInputFocused ? styles.filledInputPlaceholder : {}
              ]}
            >
              {placeholder}
            </Text>
            <Text
              weight="Medium"
              style={[styles.placeholder2, { color: placeholder2Color }]}
            >
              {placeholder2}
            </Text>
          </View>

          <TextInput
            ref={ref => (this.input = ref)}
            underlineColorAndroid="transparent"
            keyboardType={keyboardType}
            style={[styles.textInput, { paddingRight: rightSideTextWidth }]}
            value={value}
            onFocus={this.onInputFocus}
            onBlur={this.onInputBlur}
            onChangeText={text => this.onChangeText(text)}
            maxLength={maxLength}
            secureTextEntry={secureTextEntry}
          />
          {rightSideText ? (
            <Text weight="Medium" style={styles.rightSideText}>
              {rightSideText}
            </Text>
          ) : null}
        </View>
        {hint ? (
          <Text weight="Regular" style={styles.hint}>
            {hint}
          </Text>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 15
  },
  innerContainer: {
    width: "100%",
    paddingRight: 10,
    borderBottomColor: "#c2c2c2",
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  placeholderContainer: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    bottom: 10,
    left: 0
    // paddingVertical: 10,
  },
  filledInputPlaceholderContainer: {
    alignItems: "flex-start",
    top: 0,
    paddingVertical: 0
  },
  placeholder: {
    color: colors.secondaryText
  },
  filledInputPlaceholder: {
    fontSize: 10
  },
  placeholder2: {
    fontSize: 10,
    marginLeft: 2
  },
  textInput: {
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    paddingTop: 8,
    height: 45,
    width: "100%"
  },
  rightSideText: {
    position: "absolute",
    right: 5,
    top: 10,
    color: colors.secondaryText
  },
  hint: {
    color: colors.mainBlue,
    fontSize: 10
  }
});

export default CustomTextInput;
