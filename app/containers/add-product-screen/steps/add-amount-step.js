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
import { MAIN_CATEGORY_IDS } from "../../../constants";
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

    const { mainCategoryId, category, product } = this.props;

    return (
      <Step
        title={`Add ${category.name} Amount`}
        showLoader={isLoading}
        {...this.props}
      >
        <View collapsable={false}  style={{ padding: 20 }}>
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
