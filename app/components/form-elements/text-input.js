import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Platform
} from "react-native";
import I18n from "../../i18n";
import { Text } from "../../elements";
import { colors, defaultStyles } from "../../theme";

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

  render() {
    const {
      style = {},
      placeholder,
      placeholder2,
      placeholder2Color = colors.secondaryText,
      hint,
      keyboardType,
      rightSideText = "",
      rightSideTextWidth = 0,
      maxLength,
      secureTextEntry
    } = this.props;
    const { value, isInputFocused } = this.state;
    return (
      <View style={[styles.container, style]}>
        <View
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
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // paddingVertical: 10,
    // marginBottom: 15,
    // width: "100%"
    width: "100%",
    height: 45,
    backgroundColor: "white",
    padding: 10,
    paddingRight: 10,
    marginBottom: 10,
    ...defaultStyles.card
  },
  placeholderContainer: {
    position: "absolute",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    top: 10,
    left: 5
    // paddingVertical: 10
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
    fontSize: 10
  },
  textInput: {
    backgroundColor: "transparent",
    justifyContent: "center",
    height: 40
  },
  rightSideText: {
    position: "absolute",
    right: 5,
    top: 10,
    color: colors.secondaryText
  },
  hint: {
    fontSize: 12,
    color: colors.mainBlue
  }
});

export default CustomTextInput;
