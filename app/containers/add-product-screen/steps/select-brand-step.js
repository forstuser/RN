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

class SelectBrandStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brands: this.props.brands || [],
      isLoading: false
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      brands: newProps.brands
    });
  }

  onSelectBrand = async brand => {
    const { mainCategoryId, category, product, onBrandStepDone } = this.props;
    try {
      const res = await updateProduct({
        mainCategoryId: mainCategoryId,
        categoryId: category.id,
        productId: product.id,
        brandId: brand.id
      });

      if (typeof onBrandStepDone == "function") {
        onBrandStepDone(res.product);
      }
    } catch (e) {
      showSnackbar({ text: e.message });
    }
  };

  onAddBrand = async brandName => {
    const { mainCategoryId, category, product, onBrandStepDone } = this.props;
    try {
      const res = await updateProduct({
        mainCategoryId: mainCategoryId,
        categoryId: category.id,
        productId: product.id,
        brandName
      });
      if (typeof onBrandStepDone == "function") {
        onBrandStepDone(res.product);
      }
    } catch (e) {
      showSnackbar({ text: e.message });
    }
  };

  render() {
    const { brands, isLoading } = this.state;
    console.log("brands: ", brands);

    const { mainCategoryId, category, product } = this.props;

    return (
      <Step
        title={`Select ${category.name} brand`}
        skippable={false}
        {...this.props}
      >
        <LoadingOverlay isVisible={isLoading} />
        <SelectOrCreateItem
          items={brands.map(brand => ({
            ...brand,
            image: `${API_BASE_URL}/brands/${brand.id}/images`
          }))}
          onSelectItem={this.onSelectBrand}
          onAddItem={this.onAddBrand}
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

export default SelectBrandStep;
