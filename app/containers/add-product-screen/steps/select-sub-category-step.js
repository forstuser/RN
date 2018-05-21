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
  getReferenceDatasubCategorys
} from "../../../api";
import { MAIN_CATEGORY_IDS, CATEGORY_IDS } from "../../../constants";
import { Text } from "../../../elements";
import { colors } from "../../../theme";
import { showSnackbar } from "../../../utils/snackbar";

import { getReferenceDataCategories } from "../../../api";

import LoadingOverlay from "../../../components/loading-overlay";
import SelectOrCreateItem from "../../../components/select-or-create-item";

import Step from "../../../components/step";

class SelectSubCategoryStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subCategories: this.props.subCategories || [],
      isLoading: false
    };
  }

  onSelectSubCategory = async subCategory => {
    const {
      mainCategoryId,
      category,
      product,
      onSubCategoryStepDone
    } = this.props;
    this.setState({
      isLoading: true
    });
    try {
      const res = await updateProduct({
        mainCategoryId: mainCategoryId,
        categoryId: category.id,
        productId: product.id,
        subCategoryId: subCategory.id
      });

      if (typeof onSubCategoryStepDone == "function") {
        onSubCategoryStepDone(res.product);
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
    const { subCategories, isLoading } = this.state;

    const { mainCategoryId, category, product } = this.props;

    return (
      <Step
        title={`Select ${category.name} type`}
        showLoader={isLoading}
        {...this.props}
      >
        <SelectOrCreateItem
          items={subCategories.map(subCategory => ({
            ...subCategory,
            image: API_BASE_URL + subCategory.categoryImageUrl
          }))}
          imageKey="image"
          onSelectItem={this.onSelectSubCategory}
          hideAddNew={true}
          hideSearch={category.id == CATEGORY_IDS.HEALTHCARE.MEDICAL_DOC}
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

export default SelectSubCategoryStep;
