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
import I18n from "../../i18n";
import { Text } from "../../elements";
import SelectModal from "../../components/select-modal";
import { colors } from "../../theme";

import ContactFields from "../form-elements/contact-fields";
import CustomTextInput from "../form-elements/text-input";
import CustomDatePicker from "../form-elements/date-picker";
import UploadDoc from "../form-elements/upload-doc";

class AmcForm extends React.Component {
  static propTypes = {
    navigator: PropTypes.object,
    mainCategoryId: PropTypes.number.isRequired,
    categoryId: PropTypes.number.isRequired,
    productId: PropTypes.number.isRequired,
    jobId: PropTypes.number,
    amc: PropTypes.shape({
      id: PropTypes.number,
      effectiveDate: PropTypes.string,
      value: PropTypes.number,
      sellers: PropTypes.object,
      copies: PropTypes.array
    }),
    isCollapsible: PropTypes.bool
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
      value: null,
      copies: []
    };
  }

  componentDidMount() {
    this.updateStateFromProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateStateFromProps(nextProps);
  }

  updateStateFromProps = props => {
    if (props.amc) {
      const { amc } = props;

      this.setState(
        {
          id: amc.id,
          effectiveDate: moment(amc.effectiveDate).format("YYYY-MM-DD"),
          value: String(amc.value),
          sellerName: amc.sellers ? amc.sellers.sellerName : "",
          sellerContact: amc.sellers ? amc.sellers.contact : "",
          copies: amc.copies
        },
        () => {
          console.log("amc form new state: ", this.state);
        }
      );
    }
  };

  getFilledData = () => {
    const { id, effectiveDate, sellerName, value } = this.state;

    let data = {
      id: id,
      effectiveDate: effectiveDate,
      sellerName: sellerName,
      sellerContact: this.sellerContactRef.getFilledData(),
      value: value
    };

    return data;
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
      copies
    } = this.state;
    return (
      <Collapsible
        isCollapsible={isCollapsible}
        headerText={I18n.t("expense_forms_amc_form_amc_text")}
        style={styles.container}
        headerStyle={styles.headerStyle}
        headerTextStyle={styles.headerTextStyle}
        icon="plus"
      >
        <View style={styles.innerContainer}>
          <View style={styles.body}>
            <CustomDatePicker
              date={effectiveDate}
              placeholder={I18n.t("expense_forms_amc_form_amc_effective_date")}
              placeholder2={I18n.t("expense_forms_amc_form_amc_recommended")}
              placeholder2Color={colors.mainBlue}
              onDateChange={effectiveDate => {
                this.setState({ effectiveDate });
              }}
            />

            <CustomTextInput
              placeholder={I18n.t("expense_forms_amc_form_amc_seller_name")}
              value={sellerName}
              onChangeText={sellerName => this.setState({ sellerName })}
            />

            <ContactFields
              ref={ref => (this.sellerContactRef = ref)}
              value={sellerContact}
              placeholder={I18n.t("expense_forms_amc_form_amc_seller_contact")}
              keyboardType="numeric"
            />

            <CustomTextInput
              placeholder={I18n.t("expense_forms_amc_form_amc_amount")}
              value={value}
              onChangeText={value => this.setState({ value })}
              keyboardType="numeric"
            />

            <UploadDoc
              productId={productId}
              itemId={id}
              copies={copies}
              jobId={jobId}
              docType="AMC"
              type={2}
              placeholder={I18n.t("expense_forms_amc_form_amc_upload")}
              placeholder2=" (Recommended)"
              placeholder2Color={colors.mainBlue}
              navigator={navigator}
              onUpload={uploadResult => {
                this.setState({
                  id: uploadResult.amc.id,
                  copies: uploadResult.amc.copies
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

export default AmcForm;
