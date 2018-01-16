import React from "react";
import { StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Entypo";

import { Text } from "../../../elements";
import { colors } from "../../../theme";

const PlusIcon = () => (
  <Icon name="plus" size={20} color={colors.pinkishOrange} />
);

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
        {!value && (
          <View style={styles.placeholderContainer}>
            <Text weight="Medium" style={styles.placeholder}>
              {placeholder}
            </Text>
            <Text
              weight="Medium"
              style={[styles.placeholder2, { color: placeholder2Color }]}
            >
              {placeholder2}
            </Text>
          </View>
        )}
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
    height: 40,
    marginBottom: 32,
    width: "100%"
  },
  placeholderContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  placeholder: {
    color: colors.secondaryText
  },
  placeholder2: {
    fontSize: 10
  },
  textInput: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "transparent"
  }
});

export default CustomTextInput;
