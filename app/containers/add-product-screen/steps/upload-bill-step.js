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
import { API_BASE_URL, updateProduct, getProductDetails } from "../../../api";
import { MAIN_CATEGORY_IDS, CATEGORY_IDS } from "../../../constants";
import { Text, Button } from "../../../elements";
import { colors } from "../../../theme";
import { showSnackbar } from "../../snackbar";

import LoadingOverlay from "../../../components/loading-overlay";
import SelectOrCreateItem from "../../../components/select-or-create-item";
import UploadDoc from "../../../components/form-elements/upload-doc";

import Step from "../../../components/step";

class UploadBillStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      copies: []
    };
  }

  componentDidMount() {
    this.fetchProduct();
  }

  fetchProduct = async () => {
    this.setState({
      isLoading: true
    });
    try {
      const res = await getProductDetails(this.props.product.id);
      this.setState(
        {
          copies: res.product.copies || []
        },
        () => {
          if (this.state.copies.length == 0) {
            this.uploadDoc.onUploadDocPress();
          }
        }
      );
    } catch (e) {
    } finally {
      this.setState({ isLoading: false });
    }
  };

  onNextPress = async () => {
    const { mainCategoryId, category, product } = this.props;
    const { isLoading, copies } = this.state;
    const { skippable, onUploadBillStepDone } = this.props;
    if (copies.length == 0 && !skippable) {
      return showSnackbar({ text: "Please select a file first" });
    }

    if (
      category.id == CATEGORY_IDS.HEALTHCARE.MEDICAL_DOC ||
      mainCategoryId == MAIN_CATEGORY_IDS.PERSONAL
    ) {
      this.setState({
        isLoading: true
      });
      try {
        const res = await updateProduct({
          mainCategoryId: mainCategoryId,
          categoryId: category.id,
          productId: product.id,
          productName: category.name
        });

        if (typeof onUploadBillStepDone == "function") {
          onUploadBillStepDone(res.product);
        }
      } catch (e) {
        showSnackbar({ text: e.message });
      } finally {
        this.setState({
          isLoading: false
        });
      }
    } else {
      if (typeof onUploadBillStepDone == "function") {
        onUploadBillStepDone();
      }
    }
  };

  render() {
    const { isLoading, copies } = this.state;

    const { mainCategoryId, category, product, navigator } = this.props;

    let title = I18n.t("expense_forms_expense_basic_upload_bill");
    let btnText = "Done";
    switch (category.id) {
      case CATEGORY_IDS.PERSONAL.VISITING_CARD:
        title = "Upload Visiting Card";
        btnText = "Next";
        break;
      case CATEGORY_IDS.PERSONAL.RENT_AGREEMENT:
        title = "Upload Rent Agreement";
        btnText = "Next";
        break;
      case CATEGORY_IDS.PERSONAL.OTHER_PERSONAL_DOC:
        title = "Upload Personal Doc";
        btnText = "Next";
        break;
      case CATEGORY_IDS.HEALTHCARE.MEDICAL_DOC:
        title = "Upload Medical Doc";
        btnText = "Next";
        break;
    }

    return (
      <Step title={title} showLoader={isLoading} {...this.props}>
        <View collapsable={false}  style={{ padding: 20 }}>
          <UploadDoc
            ref={ref => (this.uploadDoc = ref)}
            placeholder={"Select File"}
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
            actionSheetTitle={title}
          />
          <Button
            onPress={this.onNextPress}
            text={btnText}
            style={{
              width: 100,
              height: 40,
              alignSelf: "center",
              marginTop: 20
            }}
          />
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
