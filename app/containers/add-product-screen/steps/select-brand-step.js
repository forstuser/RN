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
import { API_BASE_URL, updateProduct, getReferenceDataBrands } from "../../../api";
import { MAIN_CATEGORY_IDS, CATEGORY_IDS } from "../../../constants";
import { Text } from "../../../elements";
import { colors } from "../../../theme";
import { showSnackbar } from "../../snackbar";

import { getReferenceDataCategories } from "../../../api";

import LoadingOverlay from "../../../components/loading-overlay";
import SelectOrCreateItem from "../../../components/select-or-create-item";

import Step from "../../../components/step";

class SelectBrandStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brands: [],
      isLoading: false
    };
  }

  componentDidMount() {
    this.fetchBrands();
  }

  fetchBrands = async () => {
    const { mainCategoryId, category, product } = this.props;
    this.setState({
      isLoading: true
    })
    try {
      const res = await getReferenceDataBrands(category.id);
      this.setState({
        brands: res
      })
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({
        isLoading: false
      })
    }
  }

  onSelectBrand = async brand => {
    const { mainCategoryId, category, product, onBrandStepDone } = this.props;
    this.setState({
      isLoading: true
    })
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
    } finally {
      this.setState({
        isLoading: false
      })
    }
  };

  onAddBrand = async brandName => {
    const { mainCategoryId, category, product, onBrandStepDone } = this.props;
    this.setState({
      isLoading: true
    })
    try {
      const res = await updateProduct({
        mainCategoryId: mainCategoryId,
        categoryId: category.id,
        productId: product.id,
        brandId: null,
        brandName
      });

      if (typeof onBrandStepDone == "function") {
        onBrandStepDone(res.product);
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
    let { brands, isLoading } = this.state;

    const { mainCategoryId, category, product } = this.props;

    brands = brands.map(brand => ({
      ...brand,
      image: `${API_BASE_URL}/brands/${brand.id}/images`
    }))

    if (category.id == CATEGORY_IDS.FURNITURE.FURNITURE ||
      mainCategoryId == MAIN_CATEGORY_IDS.FASHION) {
      brands = [{ id: 0, name: 'Non-branded' }, ...brands]
    }

    return (
      <Step
        title={`Select ${category.name} brand`}
        subtitle='Required for customer care support'
        skippable={false}
        showLoader={isLoading}
        {...this.props}
      >
        <SelectOrCreateItem
          items={brands}
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
