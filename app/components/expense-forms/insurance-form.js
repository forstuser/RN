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

import { MAIN_CATEGORY_IDS, CATEGORY_IDS } from "../../constants";
import { getReferenceDataBrands, getReferenceDataModels } from "../../api";

import Collapsible from "../../components/collapsible";

import { Text } from "../../elements";
import SelectModal from "../../components/select-modal";
import { colors } from "../../theme";

import CustomTextInput from "../form-elements/text-input";
import CustomDatePicker from "../form-elements/date-picker";
import UploadDoc from "../form-elements/upload-doc";

class InsuranceForm extends React.Component {
  static propTypes = {
    navigator: PropTypes.object,
    mainCategoryId: PropTypes.number.isRequired,
    categoryId: PropTypes.number.isRequired,
    productId: PropTypes.number.isRequired,
    jobId: PropTypes.number,
    insuranceProviders: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string
      })
    ),
    insurance: PropTypes.shape({
      id: PropTypes.number,
      effectiveDate: PropTypes.string,
      provider: PropTypes.object,
      providerName: PropTypes.string,
      policyNo: PropTypes.string,
      value: PropTypes.number,
      amountInsured: PropTypes.number,
      copies: PropTypes.array
    }),
    isCollapsible: PropTypes.bool
  };

  static defaultProps = {
    insuranceProviders: [],
    isCollapsible: true
  };

  constructor(props) {
    super(props);
    this.state = {
      id: null,
      effectiveDate: null,
      selectedProvider: null,
      providerName: "",
      policyNo: "",
      value: null,
      amountInsured: null
    };
  }

  componentDidMount() {
    this.updateStateFromProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateStateFromProps(nextProps);
  }

  updateStateFromProps = props => {
    if (props.insurance) {
      const { insurance, insuranceProviders } = props;

      let selectedProvider = null;
      if (insurance.provider) {
        selectedProvider = insuranceProviders.find(
          provider => provider.id == insurance.provider.id
        );
      }

      this.setState({
        id: insurance.id,
        effectiveDate: moment(insurance.effectiveDate).format("YYYY-MM-DD"),
        policyNo: insurance.policyNo,
        value: insurance.value,
        amountInsured: insurance.amountInsured,
        selectedProvider: selectedProvider,
        copies: insurance.copies
      });
    }
  };

  getFilledData = () => {
    const {
      id,
      effectiveDate,
      selectedProvider,
      providerName,
      policyNo,
      value,
      amountInsured
    } = this.state;

    let data = {
      id: id,
      effectiveDate: effectiveDate,
      providerId: selectedProvider ? selectedProvider.id : null,
      providerName: providerName,
      policyNo: policyNo,
      value: value || 0,
      amountInsured: amountInsured || 0
    };

    return data;
  };

  onProviderSelect = provider => {
    if (
      this.state.selectedProvider &&
      this.state.selectedProvider.id == provider.id
    ) {
      return;
    }
    this.setState({
      selectedProvider: provider,
      providerName: ""
    });
  };

  onProviderNameChange = text => {
    this.setState({
      providerName: text,
      selectedProvider: null
    });
  };

  render() {
    const {
      navigator,
      mainCategoryId,
      categoryId,
      insuranceProviders,
      productId,
      jobId,
      isCollapsible = true
    } = this.props;

    const {
      id,
      effectiveDate,
      selectedProvider,
      providerName,
      policyNo,
      value,
      amountInsured,
      copies
    } = this.state;

    let title = "Insurance (If Applicable)";
    if (
      mainCategoryId == MAIN_CATEGORY_IDS.AUTOMOBILE &&
      categoryId != CATEGORY_IDS.AUTOMOBILE.CYCLE
    ) {
      title = "Insurance*";
    } else if (categoryId == 664) {
      title = "Insurance Details";
    }
    return (
      <Collapsible
        isCollapsible={isCollapsible}
        headerText={title}
        style={styles.container}
        headerStyle={styles.headerStyle}
        headerTextStyle={styles.headerTextStyle}
        icon="plus"
      >
        <View style={styles.innerContainer}>
          <View style={styles.body}>
            <CustomDatePicker
              date={effectiveDate}
              placeholder="Effective Date "
              placeholder2="(Recommended)"
              placeholder2Color={colors.mainBlue}
              onDateChange={effectiveDate => {
                this.setState({ effectiveDate });
              }}
            />

            <SelectModal
              style={styles.input}
              dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
              placeholder="Insurance Provider"
              textInputPlaceholder="Enter Provider Name"
              placeholderRenderer={({ placeholder }) => (
                <View style={{ flexDirection: "row" }}>
                  <Text weight="Medium" style={{ color: colors.secondaryText }}>
                    {placeholder}
                  </Text>
                  {categoryId != 664 && (
                    <Text weight="Medium" style={{ color: colors.mainBlue }}>
                      *
                    </Text>
                  )}
                </View>
              )}
              selectedOption={selectedProvider}
              textInputValue={providerName}
              options={insuranceProviders}
              onOptionSelect={value => {
                this.onProviderSelect(value);
              }}
              onTextInputChange={text => this.onProviderNameChange(text)}
            />

            <CustomTextInput
              placeholder="Insurance Policy No "
              placeholder2="(Recommended)"
              placeholder2Color={colors.mainBlue}
              value={policyNo}
              onChangeText={policyNo => this.setState({ policyNo })}
            />

            <CustomTextInput
              placeholder="Insurance Premium Amount"
              value={value ? String(value) : ""}
              onChangeText={value => this.setState({ value })}
              keyboardType="numeric"
            />

            <UploadDoc
              productId={productId}
              itemId={id}
              copies={copies}
              jobId={jobId}
              docType="Insurance"
              type={3}
              placeholder="Upload Policy Doc"
              navigator={navigator}
              onUpload={uploadResult => {
                console.log("upload result: ", uploadResult);
                this.setState({
                  id: uploadResult.insurance.id,
                  copies: uploadResult.insurance.copies
                });
              }}
            />

            <CustomTextInput
              placeholder="Total Coverage"
              value={amountInsured ? String(amountInsured) : ""}
              onChangeText={amountInsured => this.setState({ amountInsured })}
              keyboardType="numeric"
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

export default InsuranceForm;
