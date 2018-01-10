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

import { Text, Button } from "../elements";
import { colors } from "../theme";
import { SCREENS } from "../constants";

class AddExpenseModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false
    };
  }

  show = (showCancelBtn = true) => {
    this.setState({
      isModalVisible: true,
      showCancelBtn
    });
  };

  showUploadOptions = () => {
    this.uploadOptions.show();
  };

  hide = () => {
    this.setState({
      isModalVisible: false,
      showCancelBtn: true
    });
  };

  openAddProductScreen = () => {
    this.hide();
    this.props.navigator.push({
      screen: SCREENS.ADD_PRODUCT_SCREEN
    });
  };

  renderItem = item => {
    const { type, title, icon } = item;
    return (
      <TouchableOpacity key={title} style={styles.item}>
        <Image style={styles.itemIcon} source={icon} resizeMode="contain" />
        <Text style={styles.itemTitle}>{title}</Text>
      </TouchableOpacity>
    );
  };
  render() {
    const { isModalVisible, showCancelBtn } = this.state;
    const productOptions = [
      {
        type: "automobile",
        title: "Automobile",
        icon: require("../images/main-categories/ic_automobile.png")
      },
      {
        type: "electronics",
        title: "Electronics & Electricals",
        icon: require("../images/main-categories/ic_electronics.png")
      },
      {
        type: "furniture",
        title: "Furniture & Hardware",
        icon: require("../images/main-categories/ic_furniture.png")
      },
      {
        type: "medical-prescription",
        title: "Medical Prescription",
        icon: require("../images/main-categories/ic_medical_prescription.png")
      },
      {
        type: "personal-doc",
        title: "Personal Doc.",
        icon: require("../images/main-categories/ic_personal_doc.png")
      },
      {
        type: "visiting-card",
        title: "Visiting Card",
        icon: require("../images/main-categories/ic_visiting_card.png")
      }
    ];

    const expenseOptions = [
      {
        type: "travel-dining",
        title: "Travel & Dinning",
        icon: require("../images/main-categories/ic_travel_dining.png")
      },
      {
        type: "healthcare",
        title: "Healthcare",
        icon: require("../images/main-categories/ic_healthcare.png")
      },
      {
        type: "fashion",
        title: "Fashion",
        icon: require("../images/main-categories/ic_fashion.png")
      },
      {
        type: "services",
        title: "Services",
        icon: require("../images/main-categories/ic_services.png")
      },
      {
        type: "home-expenses",
        title: "Home Expenses",
        icon: require("../images/main-categories/ic_home_expenses.png")
      },
      {
        type: "repair",
        title: "Repair",
        icon: require("../images/main-categories/ic_repair.png")
      }
    ];

    return (
      <Modal visible={isModalVisible} animationType="slide">
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
          {showCancelBtn && (
            <Button
              onPress={this.hide}
              style={styles.closeBtn}
              text={I18n.t("add_expenses_options_cancel_btn")}
              type="outline"
              color="secondary"
            />
          )}
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 0,
    paddingTop: 30,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgba(0, 0, 0, 0.1)",
    backgroundColor: "#FFF"
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
export default AddExpenseModal;