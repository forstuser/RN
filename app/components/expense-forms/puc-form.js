import React from "react";
import {
  StyleSheet,
  View,
  Image,
  Alert,
  TouchableOpacity,
  TextInput
} from "react-native";
import PropTypes from "prop-types";
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

class PucForm extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    mainCategoryId: PropTypes.number.isRequired,
    categoryId: PropTypes.number.isRequired,
    productId: PropTypes.number.isRequired,
    jobId: PropTypes.number.isRequired,
    puc: PropTypes.shape({
      id: PropTypes.number,
      effectiveDate: PropTypes.string,
      value: PropTypes.number,
      renewal_type: PropTypes.number,
      sellers: PropTypes.object,
      copies: PropTypes.array
    })
  };

  static defaultProps = {
    isCollapsible: true
  };

  constructor(props) {
    super(props);
    this.state = {
      id: null,
      effectiveDate: null,
      sellerName: "",
      sellerContact: "",
      value: "",
      selectedRenewalType: null,
      renewalTypes: [
        { id: 1, name: "1 Month" },
        { id: 2, name: "2 Months" },
        { id: 3, name: "3 Months" },
        { id: 4, name: "4 Months" },
        { id: 5, name: "5 Months" },
        { id: 6, name: "6 Months" }
      ]
    };
  }

  componentDidMount() {
    this.updateStateFromProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateStateFromProps(nextProps);
  }

  updateStateFromProps = props => {
    if (props.puc) {
      const { renewalTypes } = this.state;
      const { puc } = props;

      const selectedRenewalType = renewalTypes.find(
        renewalType => renewalType.id == puc.renewal_type
      );

      this.setState(
        {
          id: puc.id,
          effectiveDate: moment(puc.effectiveDate).format("YYYY-MM-DD"),
          value: String(puc.value),
          sellerName: puc.sellers ? puc.sellers.sellerName : "",
          sellerContact: puc.sellers ? puc.sellers.contact : "",
          selectedRenewalType: selectedRenewalType,
          copies: puc.copies
        },
        () => {
          console.log("puc form new state: ", this.state);
        }
      );
    }
  };

  getFilledData = () => {
    const {
      id,
      effectiveDate,
      sellerName,
      value,
      selectedRenewalType
    } = this.state;

    let data = {
      id: id,
      sellerName: sellerName,
      sellerContact: this.sellerContactRef.getFilledData(),
      value: value,
      effectiveDate: effectiveDate,
      expiryPeriod: selectedRenewalType ? selectedRenewalType.id : null
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
      navigator,
      mainCategoryId,
      categoryId,
      productId,
      jobId,
      isCollapsible
    } = this.props;
    const {
      id,
      effectiveDate,
      sellerName,
      sellerContact,
      value,
      renewalTypes,
      selectedRenewalType,
      copies
    } = this.state;

    return (
      <Collapsible
        isCollapsible={isCollapsible}
        headerText="PUC (optional)"
        style={styles.container}
        headerStyle={styles.headerStyle}
        headerTextStyle={styles.headerTextStyle}
        icon="plus"
      >
        <View style={styles.innerContainer}>
          <View style={styles.body}>
            <CustomDatePicker
              date={effectiveDate}
              placeholder="PUC Effective Date "
              placeholder2="(Recommended)"
              placeholder2Color={colors.mainBlue}
              onDateChange={effectiveDate => {
                this.setState({ effectiveDate });
              }}
            />

            <SelectModal
              style={styles.input}
              dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
              placeholder="PUC Upto"
              placeholderRenderer={({ placeholder }) => (
                <Text weight="Medium" style={{ color: colors.secondaryText }}>
                  {placeholder}
                </Text>
              )}
              selectedOption={selectedRenewalType}
              options={renewalTypes}
              onOptionSelect={value => {
                this.onRenewalTypeSelect(value);
              }}
              hideAddNew={true}
            />

            <CustomTextInput
              underlineColorAndroid="transparent"
              placeholder="PUC Seller Name"
              value={sellerName}
              onChangeText={sellerName => this.setState({ sellerName })}
            />

            <ContactFields
              ref={ref => (this.sellerContactRef = ref)}
              value={sellerContact}
              placeholder="PUC Seller Contact"
              keyboardType="numeric"
            />

            <CustomTextInput
              underlineColorAndroid="transparent"
              placeholder="PUC Amount"
              value={value}
              onChangeText={value => this.setState({ value })}
              keyboardType="numeric"
            />

            <UploadDoc
              productId={productId}
              itemId={id}
              copies={copies}
              jobId={jobId}
              docType="PUC"
              type={7}
              placeholder="Upload PUC Doc "
              placeholder2="(Recommended)"
              placeholder2Color={colors.mainBlue}
              placeholderAfterUpload="Doc Uploaded Successfully"
              navigator={this.props.navigator}
              onUpload={uploadResult => {
                console.log("upload result: ", uploadResult);
                this.setState({
                  id: uploadResult.puc.id,
                  copies: uploadResult.puc.copies
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
    height: 50,
    marginBottom: 25
  }
});

export default PucForm;
