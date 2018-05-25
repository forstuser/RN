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
    let title = "Select Expense Type";
    switch (category.id) {
      case CATEGORY_IDS.TRAVEL.TRAVEL:
        title = "Select Travel Expense Type";
        break;
      case CATEGORY_IDS.TRAVEL.HOTEL_STAY:
        title = "Select Hotel Stay Expense Type";
        break;
      case CATEGORY_IDS.TRAVEL.DINING:
        title = "Select Dining Expense Type";
        break;

      case CATEGORY_IDS.HEALTHCARE.MEDICAL_DOC:
        title = "Select Medical Bill Expense Type";
        break;
      case CATEGORY_IDS.HEALTHCARE.HOSPITAL_DOC:
        title = "Select Hospital Bill Expense Type";
        break;

      case CATEGORY_IDS.FASHION.FOOTWEAR:
        title = "Select Footware Expense Type";
        break;
      case CATEGORY_IDS.FASHION.SHADES:
        title = "Select Shades Expense Type";
        break;
      case CATEGORY_IDS.FASHION.WATCHES:
        title = "Select Watch Expense Type";
        break;
      case CATEGORY_IDS.FASHION.CLOTHS:
        title = "Select Cloth Expense Type";
        break;
      case CATEGORY_IDS.FASHION.BAGS:
        title = "Select Bag Expense Type";
        break;
      case CATEGORY_IDS.FASHION.JEWELLERY:
        title = "Select Jewellery & Accessories Expense Type";
        break;
      case CATEGORY_IDS.FASHION.MAKEUP:
        title = "Select Make-Up Expense Type";
        break;

      case CATEGORY_IDS.SERVICES.PROFESSIONAL:
        title = "Select Beauty & Salon Expense Type";
        break;
      case CATEGORY_IDS.SERVICES.LESSIONS_HOBBIES:
        title = "Select Lessons & Hobbies Expense Type";
        break;
      case CATEGORY_IDS.SERVICES.OTHER_SERVICES:
        title = "Select Other Services Expense Type";
        break;

      case CATEGORY_IDS.HOUSEHOLD.HOUSEHOLD_EXPENSE:
        title = "Select Household Expense Type";
        break;
      case CATEGORY_IDS.HOUSEHOLD.EDUCATION:
        title = "Select Education Expense Type";
        break;
      case CATEGORY_IDS.HOUSEHOLD.UTILITY_BILLS:
        title = "Select Utility Bill Expense Type";
        break;
      case CATEGORY_IDS.HOUSEHOLD.HOME_DECOR:
        title = "Select Home Decor & Furnishing Expense Type";
        break;
      case CATEGORY_IDS.HOUSEHOLD.OTHER_HOUSEHOLD_EXPENSE:
        title = "Select Other Household Expense Type";
        break;
    }
    return (
      <Step title={title} showLoader={isLoading} {...this.props}>
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
