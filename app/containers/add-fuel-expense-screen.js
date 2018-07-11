import React from "react";
import { StyleSheet, View, Alert, Platform, BackHandler } from "react-native";
import PropTypes from "prop-types";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import moment from "moment";
import Analytics from "../analytics";
import I18n from "../i18n";
import { showSnackbar } from "../utils/snackbar";

import {
  createFuelExpense,
  updateFuelExpense,
  deleteFuelExpense
} from "../api";

import LoadingOverlay from "../components/loading-overlay";
import { ScreenContainer, Text, Button } from "../elements";
import AccessoryForm from "../components/expense-forms/accessory-form";
import ChangesSavedModal from "../components/changes-saved-modal";
import SelectModal from "../components/select-modal";
import HeaderBackBtn from "../components/header-nav-back-btn";
import { colors } from "../theme";

import { FUEL_TYPES } from "../constants";
import CustomDatePicker from "../components/form-elements/date-picker";
import CustomTextInput from "../components/form-elements/text-input";
import UploadDoc from "../components/form-elements/upload-doc";

const FUEL_TYPES_ARRAY = [
  { id: FUEL_TYPES.PETROL, name: "Petrol" },
  { id: FUEL_TYPES.DIESEL, name: "Diesel" },
  { id: FUEL_TYPES.CNG, name: "CNG" },
  { id: FUEL_TYPES.LPG, name: "LPG" }
];
class AddFuelExpenseScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    console.log("params: ", params);
    return {
      title: "Refueling & Mileage Calculation",
      headerRight: params.isEditing ? (
        <Text
          onPress={params.onDeletePress}
          weight="Bold"
          style={{ color: colors.danger, marginRight: 10 }}
        >
          Delete
        </Text>
      ) : null,
      headerLeft: <HeaderBackBtn onPress={params.onBackPress} />
    };
  };

  constructor(props) {
    super(props);

    const { navigation } = this.props;
    const { fuelExpense } = navigation.state.params;

    this.state = {
      isLoading: false,
      id: fuelExpense ? fuelExpense.id : null,
      effectiveDate: fuelExpense
        ? moment(fuelExpense.document_date).format("YYYY-MM-DD")
        : moment().format("YYYY-MM-DD"),
      odometerReading: fuelExpense
        ? String(fuelExpense.odometer_reading)
        : null,
      documentNumber: fuelExpense ? String(fuelExpense.document_number) : null,
      value: fuelExpense ? String(fuelExpense.value) : 0,
      fuelQuantity: fuelExpense ? String(fuelExpense.fuel_quantity) : null,
      fuelType: fuelExpense ? fuelExpense.fuel_type : FUEL_TYPES.PETROL,
      copies: fuelExpense ? fuelExpense.copies : []
    };
  }

  async componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    const { product, fuelExpense } = this.props.navigation.state.params;
    let isEditing = false;

    this.props.navigation.setParams({
      onBackPress: this.onBackPress,
      onDeletePress: this.onDeletePress,
      isEditing: !!fuelExpense
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
  }

  onBackPress = () => {
    if (!this.accessoryForm) {
      this.props.navigation.goBack();
    }

    return true;
  };

  onDeletePress = () => {
    const { navigation } = this.props;
    const { product } = navigation.state.params;

    Alert.alert(
      I18n.t("are_you_sure"),
      I18n.t("add_edit_fuel_delete_fuel_desc"),
      [
        {
          text: I18n.t("add_edit_insurance_yes_delete"),
          onPress: async () => {
            try {
              this.setState({ isLoading: true });
              await deleteFuelExpense({
                productId: product.id,
                id: this.state.id
              });
              this.props.navigation.goBack();
            } catch (e) {
              showSnackbar({
                text: "Some error occurred"
              });
              this.setState({ isLoading: false });
            }
          }
        },
        {
          text: I18n.t("add_edit_no_dnt_delete"),
          onPress: () => {},
          style: "cancel"
        }
      ]
    );
  };

  onSavePress = async () => {
    const { navigation } = this.props;
    const { product } = navigation.state.params;

    const {
      id,
      effectiveDate,
      odometerReading,
      fuelQuantity,
      fuelType,
      value
    } = this.state;

    if (!effectiveDate || !odometerReading || !fuelQuantity) {
      return showSnackbar({
        text: "Please enter date, odometer rating and fuel quantity."
      });
    }

    Analytics.logEvent(Analytics.EVENTS.CLICK_SAVE, { entity: "fuel" });

    const data = {
      id,
      productId: product.id,
      effectiveDate,
      odometerReading,
      fuelQuantity,
      value,
      fuelType
    };

    try {
      this.setState({ isLoading: true });
      if (id) {
        await updateFuelExpense(data);
      } else {
        await createFuelExpense(data);
      }
      this.setState({ isLoading: false });
      this.changesSavedModal.show();
    } catch (e) {
      showSnackbar({
        text: e.message
      });
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { navigation } = this.props;
    const { product } = navigation.state.params;

    const {
      id,
      effectiveDate,
      odometerReading,
      documentNumber,
      value,
      fuelQuantity,
      copies,
      fuelType,
      isLoading
    } = this.state;

    return (
      <ScreenContainer style={styles.container}>
        <ChangesSavedModal
          ref={ref => (this.changesSavedModal = ref)}
          navigation={this.props.navigation}
        />
        <KeyboardAwareScrollView contentContainerStyle={{ padding: 16 }}>
          <CustomDatePicker
            date={effectiveDate}
            placeholder="Fueling Date"
            hint={"*"}
            placeholder2Color={colors.mainBlue}
            onDateChange={effectiveDate => {
              this.setState({ effectiveDate });
            }}
          />

          <CustomTextInput
            placeholder="Odometer Reading (Kms)"
            value={odometerReading}
            onChangeText={odometerReading => this.setState({ odometerReading })}
            keyboardType="numeric"
          />

          <SelectModal
            dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
            placeholder="Select Fuel Type"
            placeholderRenderer={({ placeholder }) => (
              <View>
                <Text weight="Medium" style={{ color: colors.secondaryText }}>
                  {placeholder}
                </Text>
              </View>
            )}
            selectedOption={FUEL_TYPES_ARRAY.find(
              fuelTypeItem => fuelTypeItem.id == fuelType
            )}
            options={FUEL_TYPES_ARRAY}
            onOptionSelect={selectedFuelType => {
              this.setState({ fuelType: selectedFuelType.id });
            }}
            hideAddNew={true}
          />

          <CustomTextInput
            placeholder="Fuel Quanity"
            value={fuelQuantity}
            onChangeText={fuelQuantity => this.setState({ fuelQuantity })}
            keyboardType="numeric"
            rightSideText={
              fuelType == FUEL_TYPES.PETROL || fuelType == FUEL_TYPES.DIESEL
                ? "litres"
                : "Kg"
            }
          />

          <CustomTextInput
            placeholder="Amount"
            value={value}
            onChangeText={value => this.setState({ value })}
            keyboardType="numeric"
          />

          <UploadDoc
            productId={product.id}
            itemId={id}
            copies={copies}
            jobId={product.jobId}
            docType="Fuel Bill"
            type={10}
            placeholder="Upload Bill"
            hint={"Recommended"}
            placeholder2Color={colors.mainBlue}
            placeholderAfterUpload="Doc Uploaded Successfully"
            navigation={this.props.navigation}
            onUpload={uploadResult => {
              console.log("upload result: ", uploadResult);
              this.setState({
                id: uploadResult.fuel_details.id,
                copies: uploadResult.fuel_details.copies
              });
            }}
          />
        </KeyboardAwareScrollView>
        <Button
          onPress={this.onSavePress}
          text="Save"
          color="secondary"
          borderRadius={0}
        />
        <LoadingOverlay visible={isLoading} />
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: "#FAFAFA"
  }
});

export default AddFuelExpenseScreen;
