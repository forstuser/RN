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
import {
  MAIN_CATEGORY_IDS,
  SUB_CATEGORY_IDS,
  CATEGORY_IDS
} from "../../../constants";
import { Text } from "../../../elements";
import { colors } from "../../../theme";
import { showSnackbar } from "../../../utils/snackbar";
import { getReferenceDataCategories } from "../../../api";

import LoadingOverlay from "../../../components/loading-overlay";
import DatePickerRn from "../../../components/date-picker-rn";

import Step from "../../../components/step";

class SelectPurchaseDateStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      activeDate: moment(props.product.document_date).format("YYYY-MM-DD")
      // title: "Select Purchase Date"
    };
  }
  componentDidMount() {
    if (this.props.product.sub_category_id == SUB_CATEGORY_IDS.HOUSERENT) {
      // this.setState({
      //   title: "Select Payment Date"
      // });
    }
  }
  componentWillReceiveProps(newProps) {
    this.setState({
      activeDate: moment(newProps.product.document_date).format("YYYY-MM-DD")
    });
  }

  onSelectDate = async date => {
    const {
      mainCategoryId,
      category,
      product,
      onPurchaseDateStepDone
    } = this.props;
    this.setState({
      isLoading: true,
      activeDate: date
    });
    try {
      const res = await updateProduct({
        productId: product.id,
        purchaseDate: date
      });

      if (typeof onPurchaseDateStepDone == "function") {
        onPurchaseDateStepDone(res.product);
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
    const { isLoading, activeDate } = this.state;

    const { mainCategoryId, category, product } = this.props;
    switch (category.id) {
      case CATEGORY_IDS.TRAVEL.TRAVEL:
        title = "Select Travel Expense Date";
        break;
      case CATEGORY_IDS.TRAVEL.HOTEL_STAY:
        title = "Select Hotel Stay Expense Date";
        break;
      case CATEGORY_IDS.TRAVEL.DINING:
        title = "Select Dining Expense Date";
        break;

      case CATEGORY_IDS.HEALTHCARE.MEDICAL_DOC:
        title = "Select Medical Bill Expense Date";
        break;
      case CATEGORY_IDS.HEALTHCARE.HOSPITAL_DOC:
        title = "Select Hospital Bill Expense Date";
        break;

      case CATEGORY_IDS.FASHION.FOOTWEAR:
        title = "Select Footware Expense Date";
        break;
      case CATEGORY_IDS.FASHION.SHADES:
        title = "Select Shades Expense Date";
        break;
      case CATEGORY_IDS.FASHION.WATCHES:
        title = "Select Watch Expense Date";
        break;
      case CATEGORY_IDS.FASHION.CLOTHS:
        title = "Select Cloth Expense Date";
        break;
      case CATEGORY_IDS.FASHION.BAGS:
        title = "Select Bag Expense Date";
        break;
      case CATEGORY_IDS.FASHION.JEWELLERY:
        title = "Select Jewellery & Accessories Expense Date";
        break;
      case CATEGORY_IDS.FASHION.MAKEUP:
        title = "Select Make-Up Expense Date";
        break;

      case CATEGORY_IDS.SERVICES.PROFESSIONAL:
        title = "Select Beauty & Salon Expense Date";
        break;
      case CATEGORY_IDS.SERVICES.LESSIONS_HOBBIES:
        title = "Select Lessons & Hobbies Expense Date";
        break;
      case CATEGORY_IDS.SERVICES.OTHER_SERVICES:
        title = "Select Other Services Expense Date";
        break;

      case CATEGORY_IDS.HOUSEHOLD.HOUSEHOLD_EXPENSE:
        title = "Select Household Expense Date";
        break;
      case CATEGORY_IDS.HOUSEHOLD.EDUCATION:
        title = "Select Education Expense Date";
        break;
      case CATEGORY_IDS.HOUSEHOLD.UTILITY_BILLS:
        title = "Select Utility Bill Expense Date";
        break;
      case CATEGORY_IDS.HOUSEHOLD.HOME_DECOR:
        title = "Select Home Decor & Furnishing Expense Date";
        break;
      case CATEGORY_IDS.HOUSEHOLD.OTHER_HOUSEHOLD_EXPENSE:
        title = "Select Other Household Expense Date";
        break;
    }
    let subtitle;
    switch (mainCategoryId) {
      case MAIN_CATEGORY_IDS.AUTOMOBILE:
      case MAIN_CATEGORY_IDS.ELECTRONICS:
      case MAIN_CATEGORY_IDS.FASHION:
      case MAIN_CATEGORY_IDS.FURNITURE:
        subtitle = "Required for warranty calculation";
    }

    return (
      <Step
        title={title}
        subtitle={subtitle}
        skippable={true}
        showLoader={isLoading}
        {...this.props}
      >
        <DatePickerRn
          activeDate={activeDate}
          maxDate={moment().format("YYYY-MM-DD")}
          onSelectDate={this.onSelectDate}
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

export default SelectPurchaseDateStep;
