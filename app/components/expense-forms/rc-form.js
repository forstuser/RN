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
import I18n from "../../i18n";

import Collapsible from "../../components/collapsible";
import UploadBillOptions from "../../components/upload-bill-options";

import { Text } from "../../elements";
import SelectModal from "../../components/select-modal";
import { colors } from "../../theme";

import ContactFields from "../form-elements/contact-fields";
import CustomTextInput from "../form-elements/text-input";
import CustomDatePicker from "../form-elements/date-picker";
import UploadDoc from "../form-elements/upload-doc";

class RcForm extends React.Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    mainCategoryId: PropTypes.number.isRequired,
    categoryId: PropTypes.number.isRequired,
    productId: PropTypes.number.isRequired,
    jobId: PropTypes.number.isRequired,
    rc: PropTypes.shape({
      id: PropTypes.number,
      effective_date: PropTypes.string,
      renewal_type: PropTypes.number,
      document_number: PropTypes.string,
      state: PropTypes.shape({
        id: PropTypes.number,
        state_name: PropTypes.string
      }),
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
      selectedRenewalType: { id: 18, title: "15 Years" },
      rcNumber: "",
      selectedState: null
    };
  }

  componentDidMount() {
    this.updateStateFromProps(this.props);
    const { rc } = this.props;
    if (rc) {
      this.setState({
        copies: rc.copies || []
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.updateStateFromProps(nextProps);
  }

  updateStateFromProps = props => {
    if (props.rc) {
      const { rc, renewalTypes, states } = props;

      const selectedRenewalType = renewalTypes.find(
        renewalType => renewalType.id == rc.renewal_type
      );

      let selectedState = null;
      if (rc.state) {
        selectedState = states.find(state => state.id == rc.state.id);
      }

      this.setState(
        {
          id: rc.id,
          effectiveDate: moment(rc.effective_date).format("YYYY-MM-DD"),
          selectedRenewalType: selectedRenewalType,
          rcNumber: rc.document_number,
          selectedState: selectedState
        },
        () => {
          console.log("rc form new state: ", this.state);
        }
      );
    }
  };

  getFilledData = () => {
    const {
      id,
      effectiveDate,
      selectedRenewalType,
      rcNumber,
      selectedState
    } = this.state;

    let data = {
      id: id,
      effectiveDate,
      renewalType: selectedRenewalType ? selectedRenewalType.id : null,
      rcNumber,
      stateId: selectedState ? selectedState.id : null
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

  onStateSelect = state => {
    if (this.state.selectedState && this.state.selectedState.id == state.id) {
      return;
    }
    this.setState({
      selectedState: state
    });
  };

  render() {
    const {
      navigation,
      mainCategoryId,
      categoryId,
      productId,
      jobId,
      isCollapsible,
      renewalTypes,
      states
    } = this.props;
    const {
      id,
      effectiveDate,
      selectedRenewalType,
      rcNumber,
      selectedState,
      copies
    } = this.state;

    return (
      <Collapsible
        isCollapsible={isCollapsible}
        headerText={""}
        style={styles.container}
        headerStyle={styles.headerStyle}
        headerTextStyle={styles.headerTextStyle}
        icon="plus"
      >
        <View collapsable={false} style={styles.innerContainer}>
          <View collapsable={false} style={styles.body}>
            <CustomDatePicker
              date={effectiveDate}
              placeholder="Date of Registration"
              placeholder2={"*"}
              placeholder2Color={colors.mainBlue}
              onDateChange={effectiveDate => {
                this.setState({ effectiveDate });
              }}
            />

            <SelectModal
              // style={styles.input}
              dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
              placeholder="Registration Valid Upto"
              hint={"Helps in expiry reminder"}
              visibleKey="title"
              style={{ paddingTop: 0 }}
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
              placeholder={"Registration Number"}
              value={rcNumber}
              onChangeText={rcNumber => this.setState({ rcNumber })}
            />

            <SelectModal
              // style={styles.input}
              visibleKey="state_name"
              dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
              placeholder="State of Registration"
              style={{ paddingTop: 0 }}
              placeholderRenderer={({ placeholder }) => (
                <Text weight="Medium" style={{ color: colors.secondaryText }}>
                  {placeholder}
                </Text>
              )}
              selectedOption={selectedState}
              options={states}
              onOptionSelect={value => {
                this.onStateSelect(value);
              }}
              hideAddNew={true}
            />

            <UploadDoc
              productId={productId}
              itemId={id}
              copies={copies}
              jobId={jobId}
              docType="RC"
              type={9}
              placeholder="Upload RC Doc"
              hint={"Recommended"}
              placeholder2Color={colors.mainBlue}
              placeholderAfterUpload="Doc Uploaded Successfully"
              navigation={this.props.navigation}
              onUpload={uploadResult => {
                console.log("upload result: ", uploadResult);
                this.setState({
                  id: uploadResult.rc.id,
                  copies: uploadResult.rc.copies
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
    paddingTop: 20,
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

export default RcForm;
