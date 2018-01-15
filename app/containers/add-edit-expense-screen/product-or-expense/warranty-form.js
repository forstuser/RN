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

import { MAIN_CATEGORY_IDS } from "../../../constants";
import { getReferenceDataBrands, getReferenceDataModels } from "../../../api";

import Icon from "react-native-vector-icons/Entypo";
import DatePicker from "react-native-datepicker";

import Collapsible from "../../../components/collapsible";

import { Text } from "../../../elements";
import SelectModal from "../../../components/select-modal";
import { colors } from "../../../theme";

import UploadDoc from "../form-elements/upload-doc";

class WarrantyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedDocId: null,
      isDocUploaded: false,
      renewalTypes: [],
      selectedRenewalType: null
    };
  }

  componentDidMount() {
    this.setState({
      renewalTypes: this.props.renewalTypes
    });
  }

  getFilledData = () => {
    const { uploadedDocId, effectiveDate, selectedRenewalType } = this.state;

    let data = {
      id: uploadedDocId,
      renewal_type: selectedRenewalType ? selectedRenewalType.id : null
    };

    return data;
  };

  onRenewalTypeSelect = renewalType => {
    if (
      this.state.selectedRenewalType &&
      this.state.selectedRenewalType.id == renewalType.id
    ) {
      return;
    }
    this.setState({
      selectedRenewalType: renewalType
    });
  };

  render() {
    const {
      mainCategoryId,
      categoryId,
      product,
      type = "noraml-warranty"
    } = this.props;
    const { isDocUploaded, renewalTypes, selectedRenewalType } = this.state;

    let title = "Warranty (If Applicable)";
    switch (mainCategoryId) {
      case MAIN_CATEGORY_IDS.AUTOMOBILE:
        title = "Manufacturer Warranty (Optional)";
    }
    return (
      <Collapsible
        headerText={
          type == "noraml-warranty" ? title : "Dual Warranty (If Applicable)"
        }
        style={styles.container}
        headerStyle={styles.headerStyle}
        headerTextStyle={styles.headerTextStyle}
        icon="plus"
      >
        <View style={styles.innerContainer}>
          <View style={styles.body}>
            <SelectModal
              style={styles.input}
              dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
              placeholder="Warranty Upto (in years)"
              placeholderRenderer={({ placeholder }) => (
                <Text weight="Medium" style={{ color: colors.secondaryText }}>
                  {placeholder}
                </Text>
              )}
              selectedOption={selectedRenewalType}
              options={renewalTypes}
              visibleKey="title"
              onOptionSelect={value => {
                this.onRenewalTypeSelect(value);
              }}
              hideAddNew={true}
            />
            <UploadDoc
              jobId={product.job_id}
              type={type == "manufacturer-warranty" ? 5 : 6}
              placeholder="Upload Warranty Doc"
              navigator={this.props.navigator}
              onUpload={uploadResult => {
                console.log("upload result: ", uploadResult);
                this.setState({
                  isDocUploaded: true,
                  uploadedDocId: uploadResult.warranty.id
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
    fontSize: 14,
    paddingVertical: 10,
    borderColor: colors.lighterText,
    borderBottomWidth: 2,
    height: 40,
    marginBottom: 32
  }
});

export default WarrantyForm;
