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
  CATEGORY_IDS,
  PRODUCT_TYPES
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
    let navTitle = 'Add Products';
    let eHomeItems = [];
    const screenType = this.props.screenType;
    const { isModalVisible, showCancelBtn } = this.state;
    const products = [
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
        type: EXPENSE_TYPES.REPAIR,
        title: "Repair",
        icon: require("../../../images/main-categories/ic_repair.png")
      },
      {
        type: EXPENSE_TYPES.AUTO_INSURANCE,
        title: "Auto Insurance",
        icon: require("../../../images/main-categories/auto_insurance.png")
      }

    ];
    const expenses = [{
      type: EXPENSE_TYPES.TRAVEL,
      title: "Travel & Dining",
      icon: require("../../../images/main-categories/ic_travel_dining.png")
    }, {
      type: EXPENSE_TYPES.HEALTHCARE,
      title: "Healthcare",
      icon: require("../../../images/main-categories/ic_healthcare.png")
    }, {
      type: EXPENSE_TYPES.SERVICES,
      title: "Services",
      icon: require("../../../images/main-categories/ic_services.png")
    }, {
      type: EXPENSE_TYPES.HOME,
      title: "Home Expenses",
      icon: require("../../../images/main-categories/ic_home_expenses.png")
    },
    {
      type: EXPENSE_TYPES.FASHION,
      title: "Fashion",
      icon: require("../../../images/main-categories/ic_fashion.png")
    }
    ];
    const docs = [{
      type: EXPENSE_TYPES.MEDICAL_DOCS,
      title: "Medical Docs",
      icon: require("../../../images/main-categories/ic_medical_prescription.png")
    },
    {
      type: EXPENSE_TYPES.MEDICAl_INSURANCE,
      title: "Medical Insurance",
      icon: require("../../../images/categories/insurance.png")
    },
    {
      type: EXPENSE_TYPES.RENT_AGREEMENT,
      title: "Rent Agreement",
      icon: require("../../../images/categories/rent_agreement.png")
    },
    {
      type: EXPENSE_TYPES.VISITING_CARD,
      title: "Visiting Cards",
      icon: require("../../../images/main-categories/ic_visiting_card.png")
    }, {
      type: EXPENSE_TYPES.OTHER_PERSONAL_DOC,
      title: "Personal & Other Docs",
      icon: require("../../../images/main-categories/ic_personal_doc.png")
    }];

    if (screenType == PRODUCT_TYPES.PRODUCT) {
      eHomeItems = products;
      navTitle = 'Add Products'
    } else if (screenType == PRODUCT_TYPES.EXPENSE) {
      eHomeItems = expenses;
      navTitle = 'Add Expenses'
    } else {
      eHomeItems = docs;
      navTitle = 'Add Docs'
    }
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
        <Text weight="Bold" style={styles.itemTitle}>{item.title}</Text>
      </TouchableOpacity>
    );

    return (
      <Step
        skippable={false}
        title={navTitle}
        {...this.props}
      >
        <View collapsable={false} style={styles.container}>
          <View collapsable={false} style={[styles.option, styles.option1]}>
            <View collapsable={false} style={[styles.optionInner]}>
              <View collapsable={false} style={styles.grid}>
                <View collapsable={false} style={styles.itemsRow}>
                  {eHomeItems.map((item, index) => <Item key={index} item={item} />)}
                </View>
              </View>
            </View>
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
    justifyContent: "space-between",
    backgroundColor: "#fff"
  },
  option: {
    flex: 1,
    padding: 16,
    // justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafafa"
  },
  option1: {},
  option2: {},
  optionInner: {
    justifyContent: "center",
    width: "100%",
    maxWidth: 350
  },
  grid: {},
  itemsRow: {
    flexDirection: "column",
    justifyContent: "space-between"
  },
  item: {
    flexDirection: 'row',
    height: 76,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    ...defaultStyles.card,
    borderRadius: 5
  },
  itemIcon: {
    height: 52,
    width: "100%",
    maxWidth: 52,
    margin: 10
  },
  itemTitle: {
    flex: 1,
    fontSize: 15,
    marginLeft: 10,
    textAlign: 'left',
    color: colors.primaryText
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
