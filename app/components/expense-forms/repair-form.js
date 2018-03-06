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
import { I18n } from "../../i18n";

import Collapsible from "../../components/collapsible";
import UploadBillOptions from "../../components/upload-bill-options";

import { Text } from "../../elements";
import SelectModal from "../../components/select-modal";
import { colors } from "../../theme";

import ContactFields from "../form-elements/contact-fields";
import CustomTextInput from "../form-elements/text-input";
import CustomDatePicker from "../form-elements/date-picker";
import UploadDoc from "../form-elements/upload-doc";

class RepairForm extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    mainCategoryId: PropTypes.number.isRequired,
    categoryId: PropTypes.number.isRequired,
    productId: PropTypes.number.isRequired,
    jobId: PropTypes.number.isRequired,
    repair: PropTypes.shape({
      id: PropTypes.number,
      purchaseDate: PropTypes.string,
      value: PropTypes.number,
      repair_for: PropTypes.string,
      warranty_upto: PropTypes.string,
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
      repairFor: "",
      repairDate: null,
      sellerName: "",
      sellerContact: "",
      value: "",
      warrantyUpto: ""
    };
  }

  componentDidMount() {
    this.updateStateFromProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateStateFromProps(nextProps);
  }

  updateStateFromProps = props => {
    if (props.repair) {
      const { repair } = props;

      this.setState(
        {
          id: repair.id,
          repairDate: moment(repair.purchaseDate).format("YYYY-MM-DD"),
          value: String(repair.value),
          repairFor: repair.repair_for,
          warrantyUpto: repair.warranty_upto,
          sellerName: repair.sellers ? repair.sellers.sellerName : "",
          sellerContact: repair.sellers ? repair.sellers.contact : "",
          copies: repair.copies
        },
        () => {
          console.log("repair form new state: ", this.state);
        }
      );
    }
  };

  getFilledData = () => {
    const {
      id,
      repairDate,
      repairFor,
      sellerName,
      value,
      warrantyUpto
    } = this.state;

    let data = {
      id: id,
      sellerName: sellerName,
      sellerContact: this.sellerContactRef.getFilledData(),
      value: value,
      repairFor: repairFor,
      warrantyUpto: warrantyUpto,
      repairDate: repairDate
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
      repairDate,
      repairFor,
      sellerName,
      sellerContact,
      value,
      warrantyUpto,
      copies
    } = this.state;
    return (
      <Collapsible
        headerText={I18n.t("expense_forms_repair_history")}
        style={styles.container}
        headerStyle={styles.headerStyle}
        headerTextStyle={styles.headerTextStyle}
        icon="plus"
        isCollapsible={isCollapsible}
      >
        <View style={styles.innerContainer}>
          <View style={styles.body}>
            <CustomTextInput
              placeholder={I18n.t("expense_forms_repair_for")}
              value={repairFor}
              onChangeText={repairFor => this.setState({ repairFor })}
            />

            <CustomDatePicker
              date={repairDate}
              placeholder={I18n.t("expense_forms_repair_date ")}
              onDateChange={repairDate => {
                this.setState({ repairDate });
              }}
            />

            <CustomTextInput
              placeholder={I18n.t("expense_forms_repair_seller_name")}
              value={sellerName}
              onChangeText={sellerName => this.setState({ sellerName })}
            />

            <ContactFields
              ref={ref => (this.sellerContactRef = ref)}
              value={sellerContact}
              placeholder={I18n.t("expense_forms_repair_seller_contact")}
              keyboardType="numeric"
            />

            <CustomTextInput
              placeholder={I18n.t("expense_forms_repair_amount")}
              value={value}
              onChangeText={value => this.setState({ value })}
              keyboardType="numeric"
            />

            <UploadDoc
              productId={productId}
              itemId={id}
              copies={copies}
              jobId={jobId}
              docType="Repair Doc"
              type={4}
              placeholder={i18n.t("expense_forms_repair_upload_repair")}
              navigator={this.props.navigator}
              onUpload={uploadResult => {
                console.log("upload result: ", uploadResult);
                this.setState({
                  id: uploadResult.repair.id,
                  copies: uploadResult.repair.copies
                });
              }}
            />

            <CustomTextInput
              placeholder={I18n.t("expense_forms_repair_warranty_upto")}
              value={warrantyUpto}
              onChangeText={warrantyUpto => this.setState({ warrantyUpto })}
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

export default RepairForm;
