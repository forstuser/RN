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
import { showSnackbar } from "../../snackbar";

import LoadingOverlay from "../../../components/loading-overlay";
import SelectOrCreateItem from "../../../components/select-or-create-item";
import CustomTextInput from "../../../components/form-elements/text-input";

import Step from "../../../components/step";

class AddAmountStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      name: props.product.name || ''
    };
  }

  onPressNext = async () => {
    const { mainCategoryId, category, product, onStepDone, skippable } = this.props;
    const { name } = this.state;
    if ((!name || !name.trim()) && !skippable) {
      return showSnackbar({ text: 'Please enter name first' })
    }

    this.setState({
      isLoading: true
    })

    try {
      const res = await updateProduct({
        mainCategoryId: mainCategoryId,
        categoryId: category.id,
        productId: product.id,
        productName: this.state.name
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
    const { isLoading, name } = this.state;

    const { mainCategoryId, category, product } = this.props;

    return (
      <Step
        title={`Add Name`}
        showLoader={isLoading}
        {...this.props}
      >
        <View style={{ padding: 20 }}>
          <CustomTextInput
            placeholder='Name'
            value={name}
            onChangeText={name => this.setState({ name })}
          />
          <Button onPress={this.onPressNext} text='Done' style={{ width: 100, height: 40, alignSelf: 'center', marginTop: 20 }} />
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
