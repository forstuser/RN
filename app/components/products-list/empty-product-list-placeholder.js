import React, { Component } from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { Text, Button } from "../../elements";
import { colors } from "../../theme";
import I18n from "../../i18n";
import { PRODUCT_TYPES } from "../../constants";
import Analytics from "../../analytics";

class AddEmptyProductScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { type } = this.props;
    let msg = "You have no products";
    if (type == PRODUCT_TYPES.EXPENSE) {
      msg = "You have no expenses";
    } else if (type == PRODUCT_TYPES.DOCUMENT) {
      msg = "You have no documents";
    }

    return (
      <View style={styles.container}>
        <Text weight="Bold" style={styles.desc}>
          {msg}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff"
  },
  button: {
    width: 320,
    height: 50,
    fontSize: 16
  },
  image: {
    width: 144,
    height: 134,
    resizeMode: "contain"
  },
  title: {
    fontSize: 18,
    color: colors.mainText
  },
  desc: {
    fontSize: 16,
    textAlign: "center",
    padding: 20,
    color: "#c2c2c2"
  },
  below: {
    fontSize: 16,
    textAlign: "center",
    padding: 16,
    color: colors.lighterText,
    marginTop: 60,
    marginBottom: 30
  }
});

export default AddEmptyProductScreen;
