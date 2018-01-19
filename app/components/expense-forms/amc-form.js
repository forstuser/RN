import React from "react";
import {
  StyleSheet,
  View,
  Image,
  Alert,
  TouchableOpacity,
  TextInput
} from "react-native";

import moment from "moment";

import { MAIN_CATEGORY_IDS } from "../../constants";
import { getReferenceDataBrands, getReferenceDataModels } from "../../api";

import Collapsible from "../../components/collapsible";
import UploadBillOptions from "../../components/upload-bill-options";

import { Text } from "../../elements";
import SelectModal from "../../components/select-modal";
import { colors } from "../../theme";

import ContactFields from "../form-elements/contact-fields";
import CustomTextInput from "../form-elements/text-input";
import CustomDatePicker from "../form-elements/date-picker";
import UploadDoc from "../form-elements/upload-doc";

class AmcForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedDocId: null,
      isDocUploaded: false,
      effectiveDate: null,
      sellerName: "",
      sellerContact: "",
      amount: ""
    };
  }

  componentDidMount() {}

  getFilledData = () => {
    const { uploadedDocId, effectiveDate, sellerName, amount } = this.state;

    let data = {
      id: uploadedDocId,
      effectiveDate: effectiveDate,
      sellerName: sellerName,
      sellerContact: this.sellerContactRef.getFilledData(),
      value: amount
    };

    return data;
  };

  render() {
    const { mainCategoryId, categoryId, product } = this.props;
    const {
      isDocUploaded,
      effectiveDate,
      sellerName,
      sellerContact,
      amount
    } = this.state;
    return (
      <Collapsible
        headerText="AMC (If Applicable)"
        style={styles.container}
        headerStyle={styles.headerStyle}
        headerTextStyle={styles.headerTextStyle}
        icon="plus"
      >
        <View style={styles.innerContainer}>
          <View style={styles.body}>
            <CustomDatePicker
              date={effectiveDate}
              placeholder="AMC Effective Date "
              placeholder2="(Recommended)"
              placeholder2Color={colors.mainBlue}
              onDateChange={effectiveDate => {
                this.setState({ effectiveDate });
              }}
            />
            <CustomTextInput
              placeholder="AMC Seller Name"
              style={styles.input}
              value={sellerName}
              onChangeText={sellerName => this.setState({ sellerName })}
            />

            <ContactFields
              ref={ref => (this.sellerContactRef = ref)}
              value={sellerContact}
              placeholder="Seller Contact"
              style={styles.input}
            />

            <CustomTextInput
              placeholder="AMC Amount"
              style={styles.input}
              value={amount}
              onChangeText={amount => this.setState({ amount })}
            />

            <UploadDoc
              jobId={product.job_id}
              type={2}
              placeholder="Upload AMC Doc "
              placeholder2="(Recommended)"
              placeholder2Color={colors.mainBlue}
              placeholderAfterUpload="Doc Uploaded Successfully"
              navigator={this.props.navigator}
              onUpload={uploadResult => {
                console.log("upload result: ", uploadResult);
                this.setState({
                  isDocUploaded: true,
                  uploadedDocId: uploadResult.amc.id
                });
              }}
            />
          </View>
        </View>
      </Collapsible>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderColor: "#eee",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  headerStyle: {
    borderBottomWidth: 0,
    paddingHorizontal: 20,
    paddingVertical: 20
  },
  headerTextStyle: {
    fontSize: 18
  },
  innerContainer: {
    padding: 20,
    paddingTop: 0,
    backgroundColor: "#fff"
  },
  header: {
    flexDirection: "row",
    marginBottom: 20
  },
  headerText: {
    fontSize: 18,
    flex: 1
  },
  uploadBillBtn: {
    flexDirection: "row",
    alignItems: "center"
  },
  uploadBillBtnTexts: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1
  },
  uploadBillBtnText: {
    fontSize: 14
  },
  input: {
    paddingVertical: 10,
    borderColor: colors.lighterText,
    borderBottomWidth: 2,
    paddingTop: 20,
    height: 60,
    marginBottom: 15
  }
});

export default AmcForm;
