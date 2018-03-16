import React from "react";
import {
  StyleSheet,
  View,
  Image,
  Alert,
  TouchableOpacity,
  TextInput
} from "react-native";
import I18n from "../../i18n";

import PropTypes from "prop-types";

import moment from "moment";

import { MAIN_CATEGORY_IDS, WARRANTY_TYPES } from "../../constants";
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
    jobId: PropTypes.number,
    warrantyType: PropTypes.oneOf(WARRANTY_TYPES),
    dualWarrantyItem: PropTypes.string,
    renewalTypes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string
      })
    ),
    warrantyProviders: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string
      })
    ),
    warranty: PropTypes.shape({
      id: PropTypes.number,
      effectiveDate: PropTypes.string,
      renewal_type: PropTypes.number,
      provider: PropTypes.object,
      copies: PropTypes.array
    }),
    renewalTypeId: PropTypes.number,
    isCollapsible: PropTypes.bool
  };

  static defaultProps = {
    warrantyType: WARRANTY_TYPES.NORMAL,
    renewalTypes: [],
    warrantyProviders: [],
    isCollapsible: true
  };

  constructor(props) {
    super(props);
    this.state = {
      id: null,
      effectiveDate: null,
      selectedRenewalType: null,
      copies: [],
      selectedProvider: null,
      providerName: null
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
      const { warranty, renewalTypes, warrantyProviders } = props;

      const selectedRenewalType = renewalTypes.find(
        renewalType => renewalType.id == warranty.renewal_type
      );

      let selectedProvider = null;
      if (warranty.provider) {
        selectedProvider = warrantyProviders.find(
          provider => provider.id == warranty.provider.id
        );
      }

      this.setState({
        id: warranty.id,
        effectiveDate: moment(warranty.effectiveDate).format("YYYY-MM-DD"),
        selectedRenewalType: selectedRenewalType,
        selectedProvider: selectedProvider,
        copies: warranty.copies
      });
    } else if (props.renewalTypeId) {
      const { renewalTypeId, renewalTypes } = props;

      const selectedRenewalType = renewalTypes.find(
        renewalType => renewalType.id == renewalTypeId
      );

      this.setState({
        selectedRenewalType: selectedRenewalType
      });
    }
  };

  getFilledData = () => {
    const {
      id,
      effectiveDate,
      selectedRenewalType,
      selectedProvider,
      providerName
    } = this.state;

    let data = {
      id: id,
      effectiveDate: effectiveDate,
      renewalType: selectedRenewalType ? selectedRenewalType.id : null,
      providerId: selectedProvider ? selectedProvider.id : null,
      providerName
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
      mainCategoryId,
      productId,
      jobId,
      warrantyType,
      dualWarrantyItem,
      renewalTypes,
      warrantyProviders,
      isCollapsible,
      navigator
    } = this.props;
    const {
      id,
      effectiveDate,
      selectedRenewalType,
      copies,
      selectedProvider,
      providerName
    } = this.state;

    let title = I18n.t("expense_forms_warranty_Warranty");
    if (mainCategoryId == MAIN_CATEGORY_IDS.AUTOMOBILE) {
      title = I18n.t("expense_forms_warranty_manufacturers");
    }

    switch (warrantyType) {
      case WARRANTY_TYPES.DUAL:
        if (dualWarrantyItem) {
          title =
            dualWarrantyItem + I18n.t("expense_forms_warranty_applicable");
        } else {
          title = I18n.t("expense_forms_warranty_dual_warranty");
        }

        break;
      case WARRANTY_TYPES.EXTENDED:
        title = I18n.t("expense_forms_warranty_third_party");
        break;
    }

    return (
      <Collapsible
        headerText={title}
        style={styles.container}
        headerStyle={styles.headerStyle}
        headerTextStyle={styles.headerTextStyle}
        icon="plus"
        isCollapsible={isCollapsible}
      >
        <View style={styles.innerContainer}>
          <View style={styles.body}>
            {warrantyType == WARRANTY_TYPES.EXTENDED && (
              <View>
                <SelectModal
                  style={styles.input}
                  dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
                  placeholder={I18n.t(
                    "expense_forms_extended_warranty_provider"
                  )}
                  textInputPlaceholder={I18n.t(
                    "expense_forms_extended_warranty_provider_name"
                  )}
                  placeholderRenderer={({ placeholder }) => (
                    <Text
                      weight="Medium"
                      style={{ color: colors.secondaryText }}
                    >
                      {placeholder}
                    </Text>
                  )}
                  selectedOption={selectedProvider}
                  textInputValue={providerName}
                  options={warrantyProviders}
                  onOptionSelect={value => {
                    this.onProviderSelect(value);
                  }}
                  onTextInputChange={text => this.onProviderNameChange(text)}
                />

                <CustomDatePicker
                  date={effectiveDate}
                  placeholder={I18n.t(
                    "expense_forms_healthcare_effective_date"
                  )}
                  placeholder2="*"
                  placeholder2Color={colors.mainBlue}
                  onDateChange={effectiveDate => {
                    this.setState({ effectiveDate });
                  }}
                />
              </View>
            )}
            <SelectModal
              style={styles.input}
              dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
              placeholder={I18n.t("expense_forms_extended_warranty_upto")}
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
              productId={productId}
              itemId={id}
              copies={copies}
              jobId={jobId}
              docType="Warranty"
              type={warrantyType == WARRANTY_TYPES.NORMAL ? 5 : 6}
              placeholder={I18n.t("expense_forms_warranty_upload_warr_doc")}
              navigator={navigator}
              onUpload={uploadResult => {
                console.log("upload result: ", uploadResult);
                this.setState({
                  id: uploadResult.warranty.id,
                  copies: uploadResult.warranty.copies
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

export default WarrantyForm;
