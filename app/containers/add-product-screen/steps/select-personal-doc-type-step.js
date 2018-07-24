import React from "react";
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert
} from "react-native";
import I18n from "../../../i18n";
import { API_BASE_URL, updateProduct } from "../../../api";
import { MAIN_CATEGORY_IDS } from "../../../constants";
import { Text, Button } from "../../../elements";
import { colors } from "../../../theme";
import { showSnackbar } from "../../../utils/snackbar";

import LoadingOverlay from "../../../components/loading-overlay";
import SelectOrCreateItem from "../../../components/select-or-create-item";
import CustomTextInput from "../../../components/form-elements/text-input";

import Step from "../../../components/step";

class AddAmountStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      value: props.product.value || ''
    };
  }

  onPressNext = async () => {
    const { mainCategoryId, category, product, onStepDone } = this.props;
    this.setState({
      isLoading: true
    })
    try {
      const res = await updateProduct({
        mainCategoryId: mainCategoryId,
        categoryId: category.id,
        productId: product.id,
        value: this.state.value
      });

      if (typeof onStepDone == "function") {
        onStepDone(res.product);
      }
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({
        isLoading: false
      })
    }
  };

  render() {
    const { isLoading, value } = this.state;

    const { mainCategoryId, category, product } = this.props;

    return (
      <Step
        title={`Add Amount`}
        showLoader={isLoading}
        {...this.props}
      >
        <View collapsable={false}  style={{ padding: 20 }}>
          <CustomTextInput
            placeholder={I18n.t("expense_forms_expense_basic_expense_amount")}
            value={value ? String(value) : ""}
            onChangeText={value => this.setState({ value })}
            keyboardType="numeric"
          />
          <Button onPress={this.onPressNext} text='Next' style={{ width: 100, height: 40, alignSelf: 'center', marginTop: 20 }} />
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
