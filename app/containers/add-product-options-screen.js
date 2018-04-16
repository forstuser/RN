import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  Platform,
  ScrollView,
  Dimensions
} from "react-native";
import GridView from "react-native-super-grid";
import I18n from "../i18n";
import Analytics from "../analytics";

import { Text, Button, ScreenContainer } from "../elements";
import { colors, defaultStyles } from "../theme";
import {
  SCREENS,
  EXPENSE_TYPES,
  MAIN_CATEGORY_IDS,
  CATEGORY_IDS
} from "../constants";

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
    switch (type) {
      case EXPENSE_TYPES.AUTOMOBILE:
        Analytics.logEvent(Analytics.EVENTS.CLICK_ON_AUTOMOBILE);
        break;
      case EXPENSE_TYPES.ELECTRONICS:
        Analytics.logEvent(Analytics.EVENTS.CLICK_ON_ELECTRONIC_AND_ELECTRICAL);
        break;
      case EXPENSE_TYPES.FURNITURE:
        Analytics.logEvent(Analytics.EVENTS.CLICK_ON_FURNITURE_AND_HARDWARE);
        break;
      case EXPENSE_TYPES.MEDICAL_DOCS:
        Analytics.logEvent(Analytics.EVENTS.CLICK_ON_INSURANCE_AND_MEDICAL_DOCS);
        break;
      case EXPENSE_TYPES.PERSONAL:
        Analytics.logEvent(Analytics.EVENTS.CLICK_ON_PERSONAL_DOCS);
        break;
      case EXPENSE_TYPES.VISITING_CARD:
        Analytics.logEvent(Analytics.EVENTS.CLICK_ON_VISITING_CARD);
        break;
      case EXPENSE_TYPES.TRAVEL:
        Analytics.logEvent(Analytics.EVENTS.CLICK_ON_TRAVEL_AND_DINING);
        break;
      case EXPENSE_TYPES.HEALTHCARE:
        Analytics.logEvent(Analytics.EVENTS.CLICK_ON_HEALTHCARE);
        break;
      case EXPENSE_TYPES.FASHION:
        Analytics.logEvent(Analytics.EVENTS.CLICK_ON_FASHION);
        break;
      case EXPENSE_TYPES.SERVICES:
        Analytics.logEvent(Analytics.EVENTS.CLICK_ON_SERVICES);
        break;
      case EXPENSE_TYPES.HOME:
        Analytics.logEvent(Analytics.EVENTS.CLICK_ON_HOME_EXPENSES);
        break;
      case EXPENSE_TYPES.REPAIR:
        Analytics.logEvent(Analytics.EVENTS.CLICK_ON_REPAIR);
        break;
      default:
    }
    this.props.navigator.push({
      screen: SCREENS.ADD_EDIT_EXPENSE_SCREEN,
      passProps: { expenseType: type, isPreviousScreenOfAddOptions: true },
      overrideBackPress: true
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
        title: "Automobiles",
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
        title: "Personal Docs",
        icon: require("../images/main-categories/ic_personal_doc.png")
      },
      {
        type: EXPENSE_TYPES.VISITING_CARD,
        title: "Visiting Cards",
        icon: require("../images/main-categories/ic_visiting_card.png")
      }
    ];

    const expenseOptions = [
      {
        type: EXPENSE_TYPES.TRAVEL,
        title: "Travel & Dining",
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

    const Item = ({ item }) => (
      <TouchableOpacity
        onPress={() => this.onPressItem(item.type)}
        key={item.title}
        style={styles.item}
      >
        <Image
          style={styles.itemIcon}
          source={item.icon}
          resizeMode="contain"
        />
        <Text style={styles.itemTitle}>{item.title}</Text>
      </TouchableOpacity>
    );

    return (
      <View style={styles.container}>
        <View style={[styles.option, styles.option1]}>
          <View style={[styles.optionInner]}>
            <Text
              weight="Bold"
              style={[styles.optionTitle, { color: colors.mainBlue }]}
            >
              {I18n.t("add_edit_product_option_product")}
            </Text>
            <View style={styles.grid}>
              <View style={styles.itemsRow}>
                {productOptions
                  .slice(0, 3)
                  .map((item, index) => <Item key={index} item={item} />)}
              </View>
              <View style={styles.itemsRow}>
                {productOptions
                  .slice(3, 6)
                  .map((item, index) => <Item key={index} item={item} />)}
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.option, styles.option2]}>
          <View style={[styles.optionInner]}>
            <Text
              weight="Bold"
              style={[styles.optionTitle, { color: colors.pinkishOrange }]}
            >
              {I18n.t("add_edit_product_option_expense")}
            </Text>
            <View style={styles.grid}>
              <View style={styles.itemsRow}>
                {expenseOptions
                  .slice(0, 3)
                  .map((item, index) => <Item key={index} item={item} />)}
              </View>
              <View style={styles.itemsRow}>
                {expenseOptions
                  .slice(3, 6)
                  .map((item, index) => <Item key={index} item={item} />)}
              </View>
            </View>
          </View>
          {Platform.OS == "ios" && (
            <Button
              onPress={this.hide}
              style={styles.closeBtn}
              text={I18n.t("add_expenses_options_cancel_btn")}
              type="outline"
              color="secondary"
              outlineBtnStyle={{ borderColor: "transparent" }}
            />
          )}
        </View>
        <View style={styles.orContainer}>
          <Text style={styles.or} weight="Bold">
            {I18n.t("add_edit_product_option_or")}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    padding: 0,
    justifyContent: "space-between"
  },
  option: {
    height: Dimensions.get("window").height / 2 - 5,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    ...defaultStyles.card
  },
  option1: {
    marginBottom: 10,
    ...Platform.select({
      ios: {
        paddingTop: 20
      },
      android: {
        paddingTop: 0
      }
    })
  },
  option2: {
    ...Platform.select({
      ios: {
        paddingBottom: 5
      },
      android: {
        paddingBottom: 45
      }
    })
  },
  optionInner: {
    justifyContent: "center",
    width: "100%",
    maxWidth: 350
  },
  optionTitle: {
    fontSize: 18,
    margin: 5
  },
  grid: {},
  itemsRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  item: {
    flex: 1,
    height: 95,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    padding: 10,
    ...defaultStyles.card
  },
  itemIcon: {
    height: 52,
    width: "100%",
    maxWidth: 52,
    marginBottom: 5,
    marginTop: 5
  },
  itemTitle: {
    fontSize: 10,
    textAlign: "center"
  },
  orContainer: {
    ...defaultStyles.card,
    position: "absolute",
    top: Dimensions.get("window").height / 2 - 25,
    left: Dimensions.get("window").width / 2 - 25,
    backgroundColor: "#f7f7f7",
    width: 50,
    height: 50,
    elevation: 3,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center"
  },
  or: {
    fontSize: 18
  },
  closeBtn: {
    // margin: 10,
    width: 300,
    height: 30,
    alignSelf: "center",
    marginTop: 10
  }
});
export default AddProductScreen;
