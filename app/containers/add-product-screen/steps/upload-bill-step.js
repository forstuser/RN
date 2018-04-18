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
import { MAIN_CATEGORY_IDS, CATEGORY_IDS } from "../../../constants";
import { Text, Button } from "../../../elements";
import { colors } from "../../../theme";
import { showSnackbar } from "../../snackbar";


import LoadingOverlay from "../../../components/loading-overlay";
import SelectOrCreateItem from "../../../components/select-or-create-item";
import UploadDoc from "../../../components/form-elements/upload-doc";

import Step from "./step";

class UploadBillStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
  }

  render() {
    const { isLoading, copies } = this.state;

    const { mainCategoryId, category, product, onUploadBillStepDone, navigator } = this.props;

    let title = I18n.t("expense_forms_expense_basic_upload_bill");
    if (category.id == CATEGORY_IDS.PERSONAL.VISITING_CARD) {
      title = 'Upload Visiting Card'
    } else if (category.id == CATEGORY_IDS.HEALTHCARE.MEDICAL_DOC) {
      title = 'Upload Medical Doc'
    }

    return (
      <Step
        title={title}
        showLoader={isLoading}
        {...this.props}
      >
        <View style={{ padding: 20 }}>
          <UploadDoc
            placeholder={'Select File'}
            productId={product.id}
            itemId={product.id}
            jobId={product.job_id}
            type={1}
            copies={copies}
            onUpload={uploadResult => {
              this.setState({
                copies: uploadResult.product.copies
              });
            }}
            navigator={navigator}
          />
          <Button onPress={onUploadBillStepDone} text='Done' style={{ width: 100, height: 40, alignSelf: 'center', marginTop: 20 }} />
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

export default UploadBillStep;
