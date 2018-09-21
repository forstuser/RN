import React, { Component } from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { Text, Button, ScreenContainer } from "../../elements";
import { colors } from "../../theme";
import I18n from "../../i18n";
import { PRODUCT_TYPES,SCREENS } from "../../constants";
import Analytics from "../../analytics";
const emptyProducts = require("../../images/empty_product.png");
const emptyExpenses = require("../../images/empty_expense.png");
const emptyDocs = require("../../images/empty_doc.png");
class AddEmptyProductScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  showAddProductOptionsScreen = (screenType) => {
    Analytics.logEvent(Analytics.EVENTS.CLICK_PLUS_ICON);
    //use push here so that we can use 'replace' later
    this.props.navigation.push(SCREENS.ADD_PRODUCT_SCREEN,{'screenType':screenType});
  };

  render() {
    const { type } = this.props;
    let msg = "Add your Products to your eHome for easy access of Product information and to receive timely alerts";
    let btnText = 'Add Product';
    let imageIcon = emptyProducts;
    let screenType = PRODUCT_TYPES.PRODUCT;
    if (type == PRODUCT_TYPES.EXPENSE) {
      msg = "Add your Expenses here for easy tracking";
      btnText = 'Add Expense';
      imageIcon = emptyExpenses;
      screenType = PRODUCT_TYPES.EXPENSE;
    } else if (type == PRODUCT_TYPES.DOCUMENT) {
      msg = "Save your Documents in your eHome for easy access";
      btnText = 'Add Documents';
      imageIcon = emptyDocs;
      screenType = PRODUCT_TYPES.DOCUMENT;
    }

    return (
        <View collapsable={false} style={styles.emptyStateView}>
          <Image
            source={imageIcon}
            style={styles.emptyStateImage}
            resizeMode="contain"
          />
          <Text style={styles.emptyStateMsg}>
            {msg}
          </Text>
          <Button
            onPress={()=>this.showAddProductOptionsScreen(screenType)}
            text={btnText}
            color="secondary"
            style={styles.emptyStateAddItemBtn}
          />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  emptyStateView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  // button: {
  //   width: 320,
  //   height: 50,
  //   fontSize: 16
  // },
  // image: {
  //   width: 144,
  //   height: 134,
  //   resizeMode: "contain"
  // },
  // title: {
  //   fontSize: 18,
  //   color: colors.mainText
  // },
  // below: {
  //   fontSize: 16,
  //   textAlign: "center",
  //   padding: 16,
  //   color: colors.lighterText,
  //   marginTop: 60,
  //   marginBottom: 30
  // },
  emptyStateImage: {
    width: 115,
    height: 130
  },
  emptyStateMsg: {
    fontSize: 16,
    textAlign: "center",
    color: colors.secondaryText,
    marginTop: 30
  },
  emptyStateAddItemBtn: {
    width: 280,
    marginTop: 30,
    alignSelf: "center"
  }
});

export default AddEmptyProductScreen;
