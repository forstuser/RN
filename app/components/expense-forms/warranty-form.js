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

import Collapsible from "../collapsible";

import { Text } from "../../elements";
import SelectModal from "../select-modal";
import { colors } from "../../theme";

import UploadDoc from "../form-elements/upload-doc";
import CustomDatePicker from "../form-elements/date-picker";

class WarrantyForm extends React.Component {
  static propTypes = {
    navigator: PropTypes.object,
    mainCategoryId: PropTypes.number.isRequired,
    categoryId: PropTypes.number.isRequired,
    productId: PropTypes.number.isRequired,
    jobId: PropTypes.number.isRequired,
    type: PropTypes.oneOf(["noraml-warranty", "dual-warranty"]),
    renewalTypes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string
      })
    ),
    warranty: PropTypes.shape({
      id: PropTypes.number,
      effectiveDate: PropTypes.string,
      renewal_type: PropTypes.number,
      copies: PropTypes.array
    }),
    isCollapsible: PropTypes.bool
  };

  static defaultProps = {
    type: "noraml-warranty",
    renewalTypes: [],
    isCollapsible: true
  };

  constructor(props) {
    super(props);
    this.state = {
      id: null,
      effectiveDate: null,
      selectedRenewalType: null
    };
  }

  componentDidMount() {
    this.updateStateFromProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateStateFromProps(nextProps);
  }

  updateStateFromProps = props => {
    if (props.warranty) {
      const { warranty, renewalTypes } = props;
      const selectedRenewalType = renewalTypes.find(
        renewalType => renewalType.id == warranty.renewal_type
      );
      this.setState(
        {
          id: warranty.id,
          effectiveDate: moment(warranty.effectiveDate).format("YYYY-MM-DD"),
          selectedRenewalType: selectedRenewalType
        },
        () => {
          console.log("state", this.state);
        }
      );
    }
  };

  getFilledData = () => {
    const { id, effectiveDate, selectedRenewalType } = this.state;

    let data = {
      id: id,
      effectiveDate: effectiveDate,
      renewalType: selectedRenewalType ? selectedRenewalType.id : null
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
      productId,
      jobId,
      type = "noraml-warranty",
      renewalTypes,
      isCollapsible,
      navigator
    } = this.props;
    const { effectiveDate, selectedRenewalType } = this.state;

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
        isCollapsible={isCollapsible}
      >
        <View style={styles.innerContainer}>
          <View style={styles.body}>
            <CustomDatePicker
              date={effectiveDate}
              placeholder="Effective Date"
              placeholder2="*"
              placeholder2Color={colors.mainBlue}
              onDateChange={effectiveDate => {
                this.setState({ effectiveDate });
              }}
            />

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
              jobId={jobId}
              type={type == "manufacturer-warranty" ? 5 : 6}
              placeholder="Upload Warranty Doc"
              navigator={navigator}
              onUpload={uploadResult => {
                console.log("upload result: ", uploadResult);
                this.setState({
                  id: uploadResult.warranty.id
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

export default WarrantyForm;
