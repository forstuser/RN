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
import moment from "moment";
import I18n from "../../../i18n";
import { API_BASE_URL, updateProduct } from "../../../api";
import { MAIN_CATEGORY_IDS } from "../../../constants";
import { Text } from "../../../elements";
import { colors } from "../../../theme";
import { showSnackbar } from "../../snackbar";

import { getReferenceDataCategories } from "../../../api";

import LoadingOverlay from "../../../components/loading-overlay";
import DatePickerRn from "../../../components/date-picker-rn";

import Step from "./step";

class SelectBrandStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: moment().format("YYYY-MM-DD"),
      isLoading: false
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({});
  }

  onSelectDate = async date => {
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

  render() {
    const { date, isLoading } = this.state;

    const { mainCategoryId, category, product } = this.props;

    return (
      <Step title={`Select Purchase Date`} skippable={true} {...this.props}>
        <LoadingOverlay isVisible={isLoading} />
        <DatePickerRn date={date} />
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
