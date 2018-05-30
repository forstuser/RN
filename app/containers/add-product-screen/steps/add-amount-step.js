import React from "react";
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  TextInput
} from "react-native";
import I18n from "../../../i18n";
import { API_BASE_URL, updateProduct } from "../../../api";
import {
  MAIN_CATEGORY_IDS,
  CATEGORY_IDS,
  SUB_CATEGORY_IDS
} from "../../../constants";
import { Text, Button } from "../../../elements";
import { colors } from "../../../theme";
import { showSnackbar } from "../../../utils/snackbar";
import LoadingOverlay from "../../../components/loading-overlay";
import SelectOrCreateItem from "../../../components/select-or-create-item";
import AmountTextInput from "../../../components/form-elements/amount-text-input";
import Step from "../../../components/step";

class AddAmountStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      value: props.product.value || ""
    };
  }

  componentDidMount() {
    // this.input.focus();
  }

  onPressNext = async () => {
    const {
      mainCategoryId,
      category,
      product,
      onStepDone,
      skippable
    } = this.props;
    const { value } = this.state;
    if ((!value || !value.trim()) && !skippable) {
      return showSnackbar({ text: "Please enter amount first" });
    }
    this.setState({
      isLoading: true
    });
    try {
      const res = await updateProduct({
        mainCategoryId: mainCategoryId,
        categoryId: category.id,
        productId: product.id,
        value: this.state.value.substr(1, this.state.value.length)
        // this.state.value.charAt(0) == "₹"
        //   ? (value = value.substr(1))
        //   : this.state.value
      });

      console.log(value, "values");
      if (typeof onStepDone == "function") {
        onStepDone(res.product);
      }
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({
        isLoading: false
      });
    }
  };

  render() {
    const { isLoading, value } = this.state;

    const { mainCategoryId, category, product, subCategoryId } = this.props;
    title = "Add Amount";
    switch (category.id) {
      case CATEGORY_IDS.TRAVEL.TRAVEL:
        title = "Add Travel Expense Amount";
        break;
      case CATEGORY_IDS.TRAVEL.HOTEL_STAY:
        title = "Add Hotel Stay Expense Amount";
        break;
      case CATEGORY_IDS.TRAVEL.DINING:
        title = "Add Dining Expense Amount";
        break;

      case CATEGORY_IDS.HEALTHCARE.EXPENSE:
        if (subCategoryId == SUB_CATEGORY_IDS.MEDICAL_BILL) {
          title = "Add Medical Bill Expense Amount";
        } else {
          title = "Add Hospital Bill Expense Amount";
        }
        break;

      case CATEGORY_IDS.FASHION.FOOTWEAR:
        title = "Add Footware Expense Amount";
        break;
      case CATEGORY_IDS.FASHION.SHADES:
        title = "Add Shades Expense Amount";
        break;
      case CATEGORY_IDS.FASHION.WATCHES:
        title = "Add Watch Expense Amount";
        break;
      case CATEGORY_IDS.FASHION.CLOTHS:
        title = "Add Cloth Expense Amount";
        break;
      case CATEGORY_IDS.FASHION.BAGS:
        title = "Add Bag Expense Amount";
        break;
      case CATEGORY_IDS.FASHION.JEWELLERY:
        title = "Add Jewellery & Accessories Expense Amount";
        break;
      case CATEGORY_IDS.FASHION.MAKEUP:
        title = "Add Make-Up Expense Amount";
        break;

      case CATEGORY_IDS.SERVICES.BEAUTY_AND_SALON:
        title = "Add Beauty & Salon Expense Amount";
        break;
      case CATEGORY_IDS.SERVICES.LESSIONS_HOBBIES:
        title = "Add Lessons & Hobbies Expense Amount";
        break;
      case CATEGORY_IDS.SERVICES.OTHER_SERVICES:
        title = "Add Other Services Expense Amount";
        break;

      case CATEGORY_IDS.HOUSEHOLD.HOUSEHOLD_EXPENSE:
        title = "Add Household Expense Amount";
        break;
      case CATEGORY_IDS.HOUSEHOLD.EDUCATION:
        title = "Add Education Expense Amount";
        break;
      case CATEGORY_IDS.HOUSEHOLD.UTILITY_BILLS:
        title = "Add Utility Bill Expense Amount";
        break;
      case CATEGORY_IDS.HOUSEHOLD.HOME_DECOR:
        title = "Add Home Decor & Furnishing Expense Amount";
        break;
      case CATEGORY_IDS.HOUSEHOLD.OTHER_HOUSEHOLD_EXPENSE:
        title = "Add Other Household Expense Amount";
        break;
    }
    return (
      <Step title={title} showLoader={isLoading} {...this.props}>
        <View collapsable={false} style={{ padding: 20 }}>
          <AmountTextInput
            ref={ref => (this.input = ref)}
            placeholder={"Amount"}
            value={
              value.includes("₹") && value == "₹"
                ? String(value)
                : !value.includes("₹")
                  ? "₹" + String(value)
                  : String(value)
            }
            onChangeText={value => this.setState({ value })}
            keyboardType="numeric"
            style={styles.inputAmount}
          />
          {/* <TextInput
            underlineColorAndroid="transparent"
            placeholder={"Amount"}
            maxLength={10}
            style={styles.phoneInput}
            value={value ? String(value) : ""}
            onChangeText={value => this.setState({ value })}
            keyboardType="phone-pad"
            style={styles.input}
            // leftSideText="₹"
          /> */}

          <Button
            onPress={this.onPressNext}
            text="Next"
            style={{
              width: 100,
              height: 40,
              alignSelf: "center",
              marginTop: 20
            }}
          />
        </View>
      </Step>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default AddAmountStep;
