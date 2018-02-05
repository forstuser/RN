import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Modal
} from "react-native";
import GridView from "react-native-super-grid";
import I18n from "../i18n";
import Analytics from "../analytics";

import { Text, Button, ScreenContainer } from "../elements";
import { colors } from "../theme";
import { SCREENS, EXPENSE_TYPES } from "../constants";

class AddProductScreen extends React.Component {
  static navigatorStyle = {
    navBarHidden: true
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  show = (showCancelBtn = true) => {
    this.setState({
      isModalVisible: true,
      showCancelBtn
    });
  };

  hide = () => {
    this.props.navigator.dismissModal();
  };

  onPressItem = type => {
    Analytics.logEvent(Analytics.EVENTS.CLICK_ADD_PRODUCT_OPTION);
    this.props.navigator.push({
      screen: SCREENS.ADD_EDIT_EXPENSE_SCREEN,
      passProps: { expenseType: type }
    });
  };

  renderItem = item => {
    const { type, title, icon } = item;
    return (
      <TouchableOpacity
        onPress={() => this.onPressItem(type)}
        key={title}
        style={styles.item}
      >
        <Image style={styles.itemIcon} source={icon} resizeMode="contain" />
        <Text style={styles.itemTitle}>{title}</Text>
      </TouchableOpacity>
    );
  };
  render() {
    const { isModalVisible, showCancelBtn } = this.state;
    const productOptions = [
      {
        type: EXPENSE_TYPES.AUTOMOBILE,
        title: "Automobile",
        icon: require("../images/main-categories/ic_automobile.png")
      },
      {
        type: EXPENSE_TYPES.ELECTRONICS,
        title: "Electronics & Electricals",
        icon: require("../images/main-categories/ic_electronics.png")
      },
      {
        type: EXPENSE_TYPES.FURNITURE,
        title: "Furniture & Hardware",
        icon: require("../images/main-categories/ic_furniture.png")
      },
      {
        type: EXPENSE_TYPES.MEDICAL_DOCS,
        title: "Insurance & Medical Docs",
        icon: require("../images/main-categories/ic_medical_prescription.png")
      },
      {
        type: EXPENSE_TYPES.PERSONAL,
        title: "Personal Doc.",
        icon: require("../images/main-categories/ic_personal_doc.png")
      },
      {
        type: EXPENSE_TYPES.VISITING_CARD,
        title: "Visiting Card",
        icon: require("../images/main-categories/ic_visiting_card.png")
      }
    ];

    const expenseOptions = [
      {
        type: EXPENSE_TYPES.TRAVEL,
        title: "Travel & Dinning",
        icon: require("../images/main-categories/ic_travel_dining.png")
      },
      {
        type: EXPENSE_TYPES.HEALTHCARE,
        title: "Healthcare",
        icon: require("../images/main-categories/ic_healthcare.png")
      },
      {
        type: EXPENSE_TYPES.FASHION,
        title: "Fashion",
        icon: require("../images/main-categories/ic_fashion.png")
      },
      {
        type: EXPENSE_TYPES.SERVICES,
        title: "Services",
        icon: require("../images/main-categories/ic_services.png")
      },
      {
        type: EXPENSE_TYPES.HOME,
        title: "Home Expenses",
        icon: require("../images/main-categories/ic_home_expenses.png")
      },
      {
        type: EXPENSE_TYPES.REPAIR,
        title: "Repair",
        icon: require("../images/main-categories/ic_repair.png")
      }
    ];

    return (
      <View style={styles.container}>
        <View style={styles.option}>
          <Text
            weight="Bold"
            style={[styles.optionTitle, { color: colors.mainBlue }]}
          >
            Add Product & Doc.
          </Text>
          <GridView
            scrollEnabled={false}
            itemDimension={98}
            items={productOptions}
            renderItem={this.renderItem}
            contentContainerStyle={styles.grid}
          />
        </View>
        <View style={styles.orOuterContainer}>
          <View style={styles.orContainer}>
            <Text style={styles.or} weight="Bold">
              OR
            </Text>
          </View>
        </View>
        <View style={styles.option}>
          <Text
            weight="Bold"
            style={[styles.optionTitle, { color: colors.pinkishOrange }]}
          >
            Add Expense
          </Text>
          <GridView
            scrollEnabled={false}
            itemDimension={98}
            items={expenseOptions}
            renderItem={this.renderItem}
            contentContainerStyle={styles.grid}
          />
        </View>
        <Button
          onPress={this.hide}
          style={styles.closeBtn}
          text={I18n.t("add_expenses_options_cancel_btn")}
          type="outline"
          color="secondary"
          outlineBtnStyle={{ borderColor: "transparent" }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 0,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgba(0, 0, 0, 0.1)",
    backgroundColor: "#FFF",
    paddingTop: 30
  },
  option: {
    flex: 1,
    padding: 16,
    backgroundColor: "white"
  },
  grid: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  optionTitle: {
    fontSize: 21,
    marginLeft: 10
  },
  orOuterContainer: {
    backgroundColor: "#F0F0F0",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2
  },
  orContainer: {
    width: 38,
    height: 38,
    backgroundColor: "#F0F0F0",
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -15,
    marginBottom: -15
  },
  or: {
    fontSize: 18
  },
  closeBtn: {
    margin: 10,
    width: 300
  },
  item: {
    height: 98,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    padding: 5,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2
  },
  itemIcon: {
    height: 52,
    width: 52,
    marginBottom: 5
  },
  itemTitle: {
    fontSize: 10,
    textAlign: "center"
  }
});
export default AddProductScreen;
