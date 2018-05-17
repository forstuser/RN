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
import { MAIN_CATEGORY_IDS, SUB_CATEGORY_IDS } from "../../../constants";
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
      activeDate: moment(props.product.document_date).format('YYYY-MM-DD'),
      title: 'Select Purchase Date'
    };
  }
  componentDidMount() {
    if (this.props.product.sub_category_id == SUB_CATEGORY_IDS.HOUSERENT) {
      this.setState({
        title: 'Select Payment Date'
      })
    }
  }
  componentWillReceiveProps(newProps) {
    this.setState({
      activeDate: moment(newProps.product.document_date).format('YYYY-MM-DD')
    })
  }

  onSelectDate = async date => {
    const { mainCategoryId, category, product, onPurchaseDateStepDone } = this.props;
    this.setState({
      isLoading: true,
      activeDate: date
    })
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
      })
    }
  };

  render() {
    const { isLoading, activeDate, title } = this.state;

    const { mainCategoryId, category, product } = this.props;

    let subtitle;
    switch (mainCategoryId) {
      case MAIN_CATEGORY_IDS.AUTOMOBILE:
      case MAIN_CATEGORY_IDS.ELECTRONICS:
      case MAIN_CATEGORY_IDS.FASHION:
      case MAIN_CATEGORY_IDS.FURNITURE:
        subtitle = 'Required for warranty calculation';
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
          maxDate={moment().format('YYYY-MM-DD')}
          onSelectDate={this.onSelectDate} />
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
