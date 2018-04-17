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
import { API_BASE_URL, addInsurance } from "../../../api";
import { MAIN_CATEGORY_IDS } from "../../../constants";
import { Text } from "../../../elements";
import { colors } from "../../../theme";
import { showSnackbar } from "../../snackbar";

import { getReferenceDataCategories } from "../../../api";

import LoadingOverlay from "../../../components/loading-overlay";
import DatePickerRn from "../../../components/date-picker-rn";

import Step from "./step";

class SelectPurchaseDateStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
  }

  onSelectDate = async date => {
    const { mainCategoryId, category, product, onInsuranceEffectiveDateStepDone, providerId, providerName } = this.props;
    this.setState({
      isLoading: true
    })
    try {
      const res = await addInsurance({
        productId: product.id,
        effectiveDate: date,
        providerId,
        providerName
      });

      if (typeof onInsuranceEffectiveDateStepDone == "function") {
        onInsuranceEffectiveDateStepDone(res.product);
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
    const { isLoading } = this.state;

    const { mainCategoryId, category, product } = this.props;
    console.log('product.document_date: ', product.document_date)
    return (
      <Step
        title={`Select Insurance Effective Date`}
        skippable={true}
        showLoader={isLoading}
        {...this.props}
      >

        <DatePickerRn
          activeDate={moment(product.document_date).format('YYYY-MM-DD')}
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
