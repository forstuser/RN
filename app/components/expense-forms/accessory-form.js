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
import I18n from "../../i18n";
import { MAIN_CATEGORY_IDS, CATEGORY_IDS } from "../../constants";
import {
  API_BASE_URL,
  getReferenceDataBrands,
  getReferenceDataModels
} from "../../api";

import Collapsible from "../../components/collapsible";

import { Text } from "../../elements";
import SelectModal from "../../components/select-modal";
import { colors } from "../../theme";

import CustomTextInput from "../form-elements/text-input";
import CustomDatePicker from "../form-elements/date-picker";
import UploadDoc from "../form-elements/upload-doc";

class AccessoryForm extends React.Component {
  static propTypes = {
    navigation: PropTypes.object,
    mainCategoryId: PropTypes.number.isRequired,
    categoryId: PropTypes.number.isRequired,
    productId: PropTypes.number.isRequired,
    jobId: PropTypes.number,
    accessoryCategories: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string
      })
    ),
    accessory: PropTypes.shape({
      id: PropTypes.number,
      purchaseDate: PropTypes.string,
      accessory_part_id: PropTypes.number,
      value: PropTypes.number,
      warrantyDetails: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          renewal_type: PropTypes.number
        })
      ),
      copies: PropTypes.array
    })
  };

  static defaultProps = {
    accessoryProviders: [],
    isCollapsible: true
  };

  constructor(props) {
    super(props);
    this.state = {
      id: null,
      purchaseDate: null,
      value: "",
      selectedAccessoryCategory: null,
      accessoryCategoryName: "",
      warrantyId: null,
      selectedWarrantyRenewalType: null
    };
  }

  componentDidMount() {
    this.updateStateFromProps(this.props);
    const { accessory } = this.props;

    if (accessory) {
      this.setState({
        copies: accessory.copies || []
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.updateStateFromProps(nextProps);
  }

  updateStateFromProps = props => {
    if (props.accessory) {
      const { accessory, accessoryCategories, renewalTypes } = props;

      let selectedAccessoryCategory = null;
      if (accessory.accessory_part_id) {
        selectedAccessoryCategory = accessoryCategories.find(
          accessoryCategory =>
            accessoryCategory.id == accessory.accessory_part_id
        );
      }

      let selectedWarrantyRenewalType = null;
      if (accessory.warrantyDetails && accessory.warrantyDetails[0]) {
        selectedWarrantyRenewalType = renewalTypes.find(
          renewalType =>
            renewalType.id == accessory.warrantyDetails[0].renewal_type
        );
      }

      this.setState({
        id: accessory.id,
        purchaseDate: moment(accessory.purchaseDate).format("YYYY-MM-DD"),
        selectedAccessoryCategory: selectedAccessoryCategory,
        value: accessory.value,
        warrantyId:
          accessory.warrantyDetails && accessory.warrantyDetails[0]
            ? accessory.warrantyDetails[0].id
            : null,
        selectedWarrantyRenewalType: selectedWarrantyRenewalType
      });
    }
  };

  getFilledData = () => {
    const {
      id,
      purchaseDate,
      selectedAccessoryCategory,
      accessoryCategoryName,
      value,
      warrantyId,
      selectedWarrantyRenewalType
    } = this.state;

    let data = {
      id: id,
      purchaseDate: purchaseDate,
      accessoryPartId: selectedAccessoryCategory
        ? selectedAccessoryCategory.id
        : null,
      accessoryPartName: accessoryCategoryName || null,
      value: value || 0,
      warrantyId: warrantyId,
      warrantyRenewalType: selectedWarrantyRenewalType
        ? selectedWarrantyRenewalType.id
        : null,
      warrantyEffectiveDate: purchaseDate
    };

    return data;
  };

  onAccessoryCategorySelect = accessoryCategory => {
    if (
      this.state.selectedAccessoryCategory &&
      this.state.selectedAccessoryCategory.id == accessoryCategory.id
    ) {
      return;
    }
    this.setState({
      selectedAccessoryCategory: accessoryCategory,
      accessoryCategoryName: ""
    });
  };

  onAccessoryCategoryNameChange = text => {
    this.setState({
      accessoryCategoryName: text,
      selectedAccessoryCategory: null
    });
  };

  onWarrantyRenewalTypeSelect = renewalType => {
    if (
      this.state.selectedWarrantyRenewalType &&
      this.state.selectedWarrantyRenewalType.id == renewalType.id
    ) {
      return;
    }
    this.setState({
      selectedWarrantyRenewalType: renewalType
    });
  };

  render() {
    const {
      navigation,
      mainCategoryId,
      categoryId,
      renewalTypes,
      accessoryCategories,
      productId,
      jobId
    } = this.props;

    const {
      id,
      purchaseDate,
      selectedAccessoryCategory,
      accessoryCategoryName,
      value,
      warrantyId,
      selectedWarrantyRenewalType,
      copies
    } = this.state;

    return (
      <Collapsible
        isCollapsible={false}
        headerText={""}
        style={styles.container}
        headerStyle={styles.headerStyle}
        headerTextStyle={styles.headerTextStyle}
        icon="plus"
      >
        <View collapsable={false} style={styles.innerContainer}>
          <View collapsable={false} style={styles.body}>
            <SelectModal
              dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
              placeholder="Select Part Category"
              textInputPlaceholder="Enter Part Category Name"
              placeholderRenderer={({ placeholder }) => (
                <View collapsable={false} style={{ flexDirection: "row" }}>
                  <Text weight="Medium" style={{ color: colors.secondaryText }}>
                    {placeholder}
                  </Text>
                  {categoryId != 664 ? (
                    <Text weight="Medium" style={{ color: colors.mainBlue }}>
                      *
                    </Text>
                  ) : (
                    <View collapsable={false} />
                  )}
                </View>
              )}
              visibleKey="title"
              selectedOption={selectedAccessoryCategory}
              textInputValue={accessoryCategoryName}
              options={accessoryCategories.map(accessoryCategory => ({
                ...accessoryCategory,
                image: `${API_BASE_URL}/accessory/${
                  accessoryCategory.id
                }/images/thumbnail`
              }))}
              imageKey="image"
              onOptionSelect={value => {
                this.onAccessoryCategorySelect(value);
              }}
              onTextInputChange={text =>
                this.onAccessoryCategoryNameChange(text)
              }
            />

            <CustomDatePicker
              date={purchaseDate}
              placeholder="Purchase Date"
              placeholder2={"*"}
              placeholder2Color={colors.mainBlue}
              onDateChange={purchaseDate => {
                this.setState({ purchaseDate });
              }}
            />

            <CustomTextInput
              placeholder="Purchase Amount (₹)"
              value={value ? String(value) : ""}
              onChangeText={value => this.setState({ value })}
              keyboardType="numeric"
            />

            <SelectModal
              dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
              placeholder="Warranty Period"
              placeholderRenderer={({ placeholder }) => (
                <View collapsable={false}>
                  <Text weight="Medium" style={{ color: colors.secondaryText }}>
                    {placeholder}
                  </Text>
                </View>
              )}
              visibleKey="title"
              selectedOption={selectedWarrantyRenewalType}
              options={renewalTypes}
              onOptionSelect={value => {
                this.onWarrantyRenewalTypeSelect(value);
              }}
              hideAddNew={true}
            />

            <UploadDoc
              productId={productId}
              itemId={id}
              copies={copies}
              jobId={jobId}
              docType="Accessory"
              type={11}
              placeholder="Upload Bill"
              hint={"Recommended"}
              placeholder2Color={colors.mainBlue}
              navigation={navigation}
              onUpload={uploadResult => {
                console.log("upload result: ", uploadResult);
                this.setState({
                  id: uploadResult.accessories.id,
                  copies: uploadResult.accessories.copies
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingTop: 20
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

export default AccessoryForm;
