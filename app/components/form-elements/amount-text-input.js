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

class AmountTextInput extends React.Component {
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
      <View collapsable={false}  ref={ref => getRef(ref)} style={[styles.container, style]}>
        <View collapsable={false} 
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
    height: 60,
    backgroundColor: "white",
    padding: 10,
    paddingRight: 10,
    marginBottom: 10,
    borderRadius: 10,
    ...defaultStyles.card
  },
  placeholderContainer: {
    position: "absolute",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    top: 18,
    left: 15
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
    fontSize: 16
  },
  placeholder2: {
    fontSize: 16
  },
  textInput: {
    backgroundColor: "transparent",
    justifyContent: "center",
    height: 70,
    paddingBottom: 15,
    fontSize: 20
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

export default AmountTextInput;
