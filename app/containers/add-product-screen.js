import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  TextInput
} from "react-native";
import DeviceInfo from "react-native-device-info";
import DatePicker from "react-native-datepicker";
import moment from "moment";
import LinearGradient from "react-native-linear-gradient";
import { Text, Button, ScreenContainer } from "../elements";
import I18n from "../i18n";
import { colors } from "../theme";
import { API_BASE_URL, getReferenceDataCategories, addProduct } from "../api";
import { openBillsPopUp } from "../navigation";
import SelectModal from "../components/select-modal";

class AddProductScreen extends React.Component {
  static navigatorButtons = {
    rightButtons: [
      {
        title: "CANCEL",
        id: "cancel",
        buttonColor: colors.pinkishOrange,
        buttonFontWeight: "600"
      }
    ]
  };
  constructor(props) {
    super(props);
    this.state = {
      mainCategories: [
        {
          id: 2,
          name: "Electrical and Electronics"
        },
        {
          id: 3,
          name: "Automobiles"
        },
        {
          id: 7,
          name: "Fashion and Fashion Accessories"
        },
        {
          id: 5,
          name: "Healthcare"
        },
        {
          id: 1,
          name: "Home Furnishing and Utensils"
        },
        {
          id: 8,
          name: "Household and Utility Bills"
        },
        {
          id: 6,
          name: "Home and Professional Services"
        },
        {
          id: 4,
          name: "Travel and Dining"
        },
        {
          id: 9,
          name: "Others"
        }
      ],
      selectedMainCategory: null,
      categories: [],
      selectedCategory: null,
      amount: null,
      purchaseDate: null
    };
  }

  componentDidMount() {
    this.props.navigator.setTitle({
      title: "Add Product"
    });
  }

  fetchCategories = async () => {
    try {
      const categories = await getReferenceDataCategories(
        this.state.selectedMainCategory.id
      );
      this.setState({ categories });
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  onMainCategorySelect = mainCategory => {
    if (
      this.state.selectedMainCategory &&
      this.state.selectedMainCategory == mainCategory.id
    ) {
      return;
    }
    this.setState(
      {
        selectedMainCategory: mainCategory,
        categories: [],
        selectedCategory: null
      },
      () => this.fetchCategories()
    );
  };

  onAddProductBtnClick = async () => {
    try {
      const {
        mainCategories,
        selectedMainCategory,
        categories,
        selectedCategory,
        amount,
        purchaseDate
      } = this.state;

      let productName = "";

      if (!selectedMainCategory) {
        return Alert.alert("Please select expense category");
      } else {
        productName = selectedMainCategory.name;
      }

      if (!selectedCategory) {
        return Alert.alert("Please select expense type");
      } else {
        productName = productName = productName + " " + selectedCategory.name;
      }

      await addProduct({
        productName,
        mainCategoryId: selectedMainCategory.id,
        categoryId: selectedCategory.id,
        purchaseCost: amount,
        purchaseDate
      });
      Alert.alert("Product added");
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  render() {
    const {
      mainCategories,
      selectedMainCategory,
      categories,
      selectedCategory,
      amount,
      purchaseDate
    } = this.state;

    return (
      <ScreenContainer style={styles.container}>
        <SelectModal
          style={styles.select}
          dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
          placeholder="Select Expense Category"
          placeholderRenderer={({ placeholder }) => (
            <Text weight="Bold" style={{ color: colors.secondaryText }}>
              {placeholder}
            </Text>
          )}
          selectedOption={selectedMainCategory}
          options={mainCategories}
          onOptionSelect={value => {
            this.onMainCategorySelect(value);
          }}
        />
        <SelectModal
          style={styles.select}
          dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
          placeholder="Select Expense Type"
          placeholderRenderer={({ placeholder }) => (
            <Text weight="Bold" style={{ color: colors.secondaryText }}>
              {placeholder}
            </Text>
          )}
          options={categories}
          selectedOption={selectedCategory}
          onOptionSelect={value => {
            this.setState({
              selectedCategory: value
            });
          }}
        />
        <TextInput
          style={[styles.select]}
          placeholder="Amount (optional)"
          value={amount}
          onChangeText={amount => this.setState({ amount })}
        />
        <DatePicker
          style={{ width: 320, marginBottom: 20 }}
          date={purchaseDate}
          mode="date"
          placeholder="Purchase date (Optional)"
          format="YYYY-MM-DD"
          minDate="2000-01-01"
          maxDate={moment().format("YYYY-MM-DD")}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: "absolute",
              left: 0,
              top: 0,
              width: 0,
              height: 0
            },
            dateInput: {
              backgroundColor: "#fff",
              borderColor: colors.secondaryText,
              borderWidth: 1,
              height: 50,
              borderRadius: 4,
              padding: 14,
              justifyContent: "flex-start",
              alignItems: "flex-start"
            }
          }}
          onDateChange={purchaseDate => {
            this.setState({ purchaseDate });
          }}
        />
        <TouchableOpacity
          // onPress={onUploadBillPress}
          style={[styles.select, { flexDirection: "row", marginBottom: 35 }]}
        >
          <Text weight="Bold" style={{ color: colors.secondaryText, flex: 1 }}>
            Upload Bill (Optional)
          </Text>
          <Image
            style={{ width: 24, height: 24 }}
            source={require("../images/ic_upload_new_pic_orange.png")}
          />
        </TouchableOpacity>
        <Button
          onPress={this.onAddProductBtnClick}
          text="Add Product"
          color="secondary"
          style={{ width: 320 }}
        />
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    width: Dimensions.get("window").width
  },
  title: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 15
  },
  icon: {
    width: 130,
    height: 68
  },
  detectDeviceWrapper: {
    height: 50
  },
  detectDevice: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    marginBottom: 25
  },
  detectDeviceIcon: {
    width: 12,
    height: 12,
    marginRight: 10
  },
  detectDeviceText: {
    fontSize: 14,
    color: "#fff"
  },
  select: {
    backgroundColor: "#fff",
    borderColor: colors.secondaryText,
    borderWidth: 1,
    height: 50,
    width: 320,
    borderRadius: 4,
    padding: 14,
    marginBottom: 20
  }
});
export default AddProductScreen;
