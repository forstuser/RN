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
import { API_BASE_URL, addInsurance, updateInsurance } from "../../../api";
import { MAIN_CATEGORY_IDS } from "../../../constants";
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
      isLoading: false
    };
  }

  onSelectDate = async date => {
    const { product, insurance, onInsuranceEffectiveDateStepDone } = this.props;
    this.setState({
      isLoading: true
    });
    try {
      const res = await updateInsurance({
        productId: product.id,
        id: insurance.id,
        effectiveDate: date
      });

      if (typeof onInsuranceEffectiveDateStepDone == "function") {
        onInsuranceEffectiveDateStepDone();
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
    const { isLoading } = this.state;

    const { mainCategoryId, category, product } = this.props;
    console.log("product.document_date: ", product.document_date);
    return (
      <Step
        title={`Select Effective Date`}
        subtitle="Required for renewal reminder"
        skippable={true}
        showLoader={isLoading}
        {...this.props}
      >
        <DatePickerRn
          activeDate={moment(product.document_date).format("YYYY-MM-DD")}
          maxDate={moment().format("YYYY-MM-DD")}
          onSelectDate={this.onSelectDate}
        />
        <View
          style={{
            flex: 1,
            padding: 10,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Text
            style={{
              color: colors.secondaryText,
              fontSize: 12,
              textAlign: "center"
            }}
          >
            If you skip this, we will consider your purchase date as the
            insurance date by default. Don't worry, you can always edit this
            later.
          </Text>
        </View>
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
