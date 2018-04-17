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
import { Text } from "../../../elements";
import { colors } from "../../../theme";
import { showSnackbar } from "../../snackbar";

import { getReferenceDataCategories } from "../../../api";

import LoadingOverlay from "../../../components/loading-overlay";
import SelectOrCreateItem from "../../../components/select-or-create-item";

import Step from "./step";

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
    const { onInsuranceProviderStepDone } = this.props;
    if (typeof onInsuranceProviderStepDone == "function") {
      onInsuranceProviderStepDone({ providerId: provider.id });
    }
  };

  onAddProvider = async providerName => {
    const { onInsuranceProviderStepDone } = this.props;
    if (typeof onInsuranceProviderStepDone == "function") {
      onInsuranceProviderStepDone({ providerName });
    }
  };

  render() {
    const { providers, isLoading } = this.state;
    console.log("providers: ", providers);

    const { mainCategoryId, category, product } = this.props;

    return (
      <Step
        title={`Select insurance provider`}
        skippable={false}
        {...this.props}
      >
        <LoadingOverlay isVisible={isLoading} />
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
