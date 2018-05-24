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
import {
  API_BASE_URL,
  updateProduct,
  getReferenceDataModels
} from "../../../api";
import { MAIN_CATEGORY_IDS } from "../../../constants";
import { Text } from "../../../elements";
import { colors } from "../../../theme";
import { showSnackbar } from "../../../utils/snackbar";

import { getReferenceDataCategories } from "../../../api";

import LoadingOverlay from "../../../components/loading-overlay";
import SelectOrCreateItem from "../../../components/select-or-create-item";

import Step from "../../../components/step";

class SelectModelStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      models: this.props.models || [],
      isLoading: false
    };
  }

  componentDidMount() {
    console.log("this.props.product: ", this.props.product);
    this.fetchModels();
  }

  componentWillReceiveProps(newProps) {
    if (models && models.length > 0) {
      this.setState({
        models: newProps.models
      });
    }
  }

  fetchModels = async () => {
    const { mainCategoryId, category, product, onModelStepDone } = this.props;
    this.setState({
      isLoading: true
    });
    try {
      const res = await getReferenceDataModels(category.id, product.brand_id);
      this.setState({
        models: res
      });
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({
        isLoading: false
      });
    }
  };

  onSelectModel = async model => {
    const {
      mainCategoryId,
      category,
      product,
      onModelStepDone,
      brand
    } = this.props;
    this.setState({
      isLoading: true
    });

    try {
      const res = await updateProduct({
        productId: product.id,
        model: model.title,
        isNewModel: false,
        productName: brand ? brand.name + " " + model.title : undefined
      });

      if (typeof onModelStepDone == "function") {
        onModelStepDone(res.product);
      }
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({
        isLoading: false
      });
    }
  };

  onAddModel = async modelName => {
    const {
      mainCategoryId,
      category,
      product,
      onModelStepDone,
      brand
    } = this.props;
    this.setState({
      isLoading: true
    });

    try {
      const res = await updateProduct({
        productId: product.id,
        model: modelName,
        isNewModel: true,
        productName: brand ? brand.name + " " + modelName : undefined
      });
      if (typeof onModelStepDone == "function") {
        onModelStepDone(res.product);
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
    const { models, isLoading } = this.state;
    console.log("models: ", models);
    const { mainCategoryId, category, product } = this.props;

    return (
      <Step
        title={`Select ${category.name} model`}
        subtitle="Required for warranty calculation"
        skippable={false}
        showLoader={isLoading}
        {...this.props}
      >
        <SelectOrCreateItem
          items={models}
          visibleKey="title"
          onSelectItem={this.onSelectModel}
          onAddItem={this.onAddModel}
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

export default SelectModelStep;
