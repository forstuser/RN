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
import { API_BASE_URL, addInsurance } from "../../../api";
import { MAIN_CATEGORY_IDS } from "../../../constants";
import { Text } from "../../../elements";
import { colors } from "../../../theme";
import { showSnackbar } from "../../../utils/snackbar";

import { getReferenceDataCategories } from "../../../api";

import LoadingOverlay from "../../../components/loading-overlay";
import SelectOrCreateItem from "../../../components/select-or-create-item";

import Step from "../../../components/step";

class SelectInsuranceProviderStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      providers: this.props.providers || [],
      isLoading: false
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      providers: newProps.providers
    });
  }

  onSelectProvider = async provider => {
    const { product, onInsuranceProviderStepDone } = this.props;
    this.setState({
      isLoading: true
    });
    try {
      const res = await addInsurance({
        productId: product.id,
        providerId: provider.id
      });

      if (typeof onInsuranceProviderStepDone == "function") {
        onInsuranceProviderStepDone({ insurance: res.insurance });
      }
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({
        isLoading: false
      });
    }
  };

  onAddProvider = async providerName => {
    const {
      mainCategoryId,
      category,
      product,
      onInsuranceProviderStepDone
    } = this.props;
    this.setState({
      isLoading: true
    });
    try {
      const res = await addInsurance({
        mainCategoryId,
        categoryId: category.id,
        productId: product.id,
        providerName
      });

      if (typeof onInsuranceProviderStepDone == "function") {
        onInsuranceProviderStepDone({ insurance: res.insurance });
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
    const { providers, isLoading } = this.state;

    const { mainCategoryId, category, product } = this.props;
    console.log("props in selecct insurance provider", this.props)
    title = `Select insurance provider`;
    if (mainCategoryId == MAIN_CATEGORY_IDS.AUTOMOBILE) {
      title = `Select insurance provider`;
    }

    return (
      <Step
        title={title}
        subtitle="Required for customer care support and renewal reminder"
        skippable={false}
        showLoader={isLoading}
        {...this.props}
      >
        <SelectOrCreateItem
          items={providers.map(provider => ({
            ...provider,
            image: `${API_BASE_URL}/providers/${provider.id}/images`
          }))}
          onSelectItem={this.onSelectProvider}
          onAddItem={this.onAddProvider}
          imageKey="image"
        />
      </Step>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default SelectInsuranceProviderStep;
