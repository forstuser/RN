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
import I18n from "../../../i18n";
import Analytics from "../../../analytics";

import { Text, Button, ScreenContainer } from "../../../elements";
import { colors, defaultStyles } from "../../../theme";
import {
  SCREENS,
  EXPENSE_TYPES,
  MAIN_CATEGORY_IDS,
  CATEGORY_IDS
} from "../../../constants";

import Step from "../../../components/step";

class ChooseExpenseTypeScreen extends React.Component {
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

  onPressItem = type => {
    Analytics.logEvent(Analytics.EVENTS.CLICK_ON_ADD_PRODUCT_SCREEN, {
      category_name: type
    });
    switch (type) {
      case EXPENSE_TYPES.AUTOMOBILE:
        break;
      case EXPENSE_TYPES.ELECTRONICS:
        break;
      case EXPENSE_TYPES.FURNITURE:
        break;
      case EXPENSE_TYPES.MEDICAL_DOCS:
        break;
      case EXPENSE_TYPES.PERSONAL:
        break;
      case EXPENSE_TYPES.VISITING_CARD:
        break;
      case EXPENSE_TYPES.TRAVEL:
        break;
      case EXPENSE_TYPES.HEALTHCARE:
        break;
      case EXPENSE_TYPES.FASHION:
        break;
      case EXPENSE_TYPES.SERVICES:
        break;
      case EXPENSE_TYPES.HOME:
        break;
      case EXPENSE_TYPES.REPAIR:
        break;
      default:
    }
    this.props.onExpenseTypePress(type);
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
        icon: require("../../../images/main-categories/ic_automobile.png")
      },
      {
        type: EXPENSE_TYPES.ELECTRONICS,
        title: "Electronics & Electricals",
        icon: require("../../../images/main-categories/ic_electronics.png")
      },
      {
        type: EXPENSE_TYPES.FURNITURE,
        title: "Furniture & Hardware",
        icon: require("../../../images/main-categories/ic_furniture.png")
      },
      {
        type: EXPENSE_TYPES.AUTO_INSURANCE,
        title: "Auto Insurance",
        icon: require("../../../images/main-categories/auto_insurance.png")
      },
      {
        type: EXPENSE_TYPES.MEDICAL_DOCS,
        title: "Medical Insurance & Docs",
        icon: require("../../../images/main-categories/ic_medical_prescription.png")
      },
      {
        type: EXPENSE_TYPES.PERSONAL,
        title: "Personal Docs",
        icon: require("../../../images/main-categories/ic_personal_doc.png")
      }
    ];

    const expenseOptions = [
      {
        type: EXPENSE_TYPES.TRAVEL,
        title: "Travel & Dining",
        icon: require("../../../images/main-categories/ic_travel_dining.png")
      },
      {
        type: EXPENSE_TYPES.HEALTHCARE,
        title: "Healthcare",
        icon: require("../../../images/main-categories/ic_healthcare.png")
      },
      {
        type: EXPENSE_TYPES.FASHION,
        title: "Fashion",
        icon: require("../../../images/main-categories/ic_fashion.png")
      },
      {
        type: EXPENSE_TYPES.SERVICES,
        title: "Services",
        icon: require("../../../images/main-categories/ic_services.png")
      },
      {
        type: EXPENSE_TYPES.HOME,
        title: "Home Expenses",
        icon: require("../../../images/main-categories/ic_home_expenses.png")
      },
      {
        type: EXPENSE_TYPES.REPAIR,
        title: "Repair",
        icon: require("../../../images/main-categories/ic_repair.png")
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
      <Step
        skippable={false}
        hideHeader={true}
        title="Add a Product/Expense"
        {...this.props}
      >
        <View collapsable={false} style={styles.container}>
          <View collapsable={false} style={[styles.option, styles.option1]}>
            <View collapsable={false} style={[styles.optionInner]}>
              <Text
                weight="Bold"
                style={[styles.optionTitle, { color: colors.mainBlue }]}
              >
                {I18n.t("add_edit_product_option_product")}
              </Text>
              <View collapsable={false} style={styles.grid}>
                <View collapsable={false} style={styles.itemsRow}>
                  {productOptions
                    .slice(0, 3)
                    .map((item, index) => <Item key={index} item={item} />)}
                </View>
                <View collapsable={false} style={styles.itemsRow}>
                  {productOptions
                    .slice(3, 6)
                    .map((item, index) => <Item key={index} item={item} />)}
                </View>
              </View>
            </View>
          </View>
          <View collapsable={false} style={styles.orContainer}>
            <Text style={styles.or} weight="Bold">
              {I18n.t("add_edit_product_option_or")}
            </Text>
          </View>
          <View collapsable={false} style={[styles.option, styles.option2]}>
            <View collapsable={false} style={[styles.optionInner]}>
              <Text
                weight="Bold"
                style={[styles.optionTitle, { color: colors.pinkishOrange }]}
              >
                {I18n.t("add_edit_product_option_expense")}
              </Text>
              <View collapsable={false} style={styles.grid}>
                <View collapsable={false} style={styles.itemsRow}>
                  {expenseOptions
                    .slice(0, 3)
                    .map((item, index) => <Item key={index} item={item} />)}
                </View>
                <View collapsable={false} style={styles.itemsRow}>
                  {expenseOptions
                    .slice(3, 6)
                    .map((item, index) => <Item key={index} item={item} />)}
                </View>
              </View>
            </View>
            {Platform.OS == "ios" && (
              <Button
                onPress={this.props.onBackPress}
                style={styles.closeBtn}
                text={I18n.t("add_expenses_options_cancel_btn")}
                type="outline"
                color="secondary"
                outlineBtnStyle={{ borderColor: "transparent" }}
              />
            )}
          </View>
        </View>
      </Step>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    justifyContent: "space-between"
  },
  option: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  option1: {},
  option2: {},
  optionInner: {
    justifyContent: "center",
    width: "100%",
    maxWidth: 350
  },
  optionTitle: {
    fontSize: 18,
    margin: 5,
    marginTop: 0
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
    padding: 10,
    ...defaultStyles.card,
    borderRadius: 5
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
    backgroundColor: "#f7f7f7",
    height: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  or: {
    fontSize: 14,
    color: colors.secondaryText
  },
  closeBtn: {
    // margin: 10,
    width: 300,
    height: 30,
    alignSelf: "center",
    marginTop: 10
  }
});
export default ChooseExpenseTypeScreen;
