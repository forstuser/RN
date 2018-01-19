import React from "react";
import { StyleSheet, View, TextInput, TouchableOpacity } from "react-native";

import { Text } from "../../elements";
import { colors } from "../../theme";

class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };
  }

  componentDidMount() {
    if (this.props.value) {
      this.setState({ value: this.props.value });
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

  render() {
    const {
      style = {},
      placeholder,
      placeholder2,
      placeholder2Color = colors.secondaryText
    } = this.props;
    const { value } = this.state;
    return (
      <View style={[styles.container, style]}>
        <View
          style={[
            styles.placeholderContainer,
            value ? styles.filledInputPlaceholderContainer : {}
          ]}
        >
          <Text
            weight="Medium"
            style={[
              styles.placeholder,
              value ? styles.filledInputPlaceholder : {}
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
          style={styles.textInput}
          value={value}
          onChangeText={text => this.onChangeText(text)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    borderColor: colors.lighterText,
    borderBottomWidth: 2,
    height: 60,
    marginBottom: 15,
    width: "100%"
  },
  placeholderContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end"
  },
  filledInputPlaceholderContainer: {
    alignItems: "flex-start"
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
    position: "absolute",
    top: 20,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "transparent",
    justifyContent: "center"
  }
});

export default CustomTextInput;
