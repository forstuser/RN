import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Entypo";

import CustomTextInput from "./text-input";
import { colors } from "../../theme";

const PlusIcon = () => (
  <Icon name="plus" size={20} color={colors.pinkishOrange} />
);

class ContactFields extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [""]
    };
  }

  componentDidMount() {
    if (this.props.value) {
      const contacts = this.props.value.split(/\,|\/|\\/);
      this.setState({ contacts });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      const contacts = nextProps.value.split(/\,|\/|\\/);
      this.setState({ contacts });
    }
  }

  getFilledData = () => {
    return this.state.contacts.join("\\");
  };

  addField = () => {
    let contacts = [...this.state.contacts];
    contacts.push("");
    this.setState({
      contacts
    });
  };

  onTextChange = (index, text) => {
    let contacts = [...this.state.contacts];
    contacts[index] = text;
    this.setState({
      contacts
    });
  };
  render() {
    const { placeholder, keyboardType = "numeric", style = {} } = this.props;
    return (
      <View collapsable={false}>
        {this.state.contacts.map((contact, index) => (
          <View collapsable={false} key={index} style={[styles.field, style]}>
            <CustomTextInput
              style={styles.textInput}
              placeholder={placeholder + " " + (index > 0 ? index + 1 : "")}
              value={contact}
              onChangeText={text => this.onTextChange(index, text)}
              keyboardType={keyboardType}
            />
            {index === 0 ? (
              <TouchableOpacity onPress={this.addField} style={styles.plusBtn}>
                <PlusIcon />
              </TouchableOpacity>
            ) : (
              <View collapsable={false} />
            )}
          </View>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  field: {
    flexDirection: "row",
    width: "100%"
  },
  textInput: {
    flex: 1,
    paddingRight: 50
  },
  plusBtn: {
    position: "absolute",
    width: 40,
    height: 40,
    right: 0,
    bottom: 15,
    alignItems: "flex-end",
    justifyContent: "center"
  }
});

export default ContactFields;
