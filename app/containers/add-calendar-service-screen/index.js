import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  FlatList,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
  Picker
} from "react-native";
import I18n from "../../i18n";
import Icon from "react-native-vector-icons/Ionicons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  API_BASE_URL,
  fetchCalendarReferenceData,
  createCalendarItem
} from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";
import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";

import {
  SCREENS,
  WAGES_CYCLE,
  CALENDAR_WAGES_TYPE,
  UNIT_TYPES,
  CALENDAR_SERVICE_TYPES
} from "../../constants";

import { colors } from "../../theme";

import SelectModal from "../../components/select-modal";
import CustomTextInput from "../../components/form-elements/text-input";
import CustomDatePicker from "../../components/form-elements/date-picker";
import SelectWeekDays from "../../components/select-week-days";
import SelectServiceHeader from "./select-service-header";

class AddEditCalendarServiceScreen extends Component {
  static navigatorStyle = {
    tabBarHidden: true
  };
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isFetchingServiceTypes: true,
      serviceTypes: [],
      visibleServiceTypeIds: [],
      selectedServiceType: null,
      name: "",
      providerName: "",
      wagesType: WAGES_CYCLE.MONTHLY,
      unitPrice: "",
      quantity: "",
      startingDate: null,
      selectedDays: [1, 2, 3, 4, 5, 6, 7],
      unitTypes: [],
      selectedUnitType: null,
      actualSelectedUnitType: null
    };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  onNavigatorEvent = event => {
    switch (event.id) {
      case "didAppear":
        break;
    }
  };

  componentDidMount() {
    this.props.navigator.setTitle({
      title: I18n.t("add_edit_calendar_service_screen_title")
    });
    this.fetchReferenceData();
  }

  fetchReferenceData = async () => {
    this.setState({
      isFetchingServiceTypes: true,
      error: null
    });
    try {
      const res = await fetchCalendarReferenceData();
      this.setState({
        serviceTypes: res.items,
        visibleServiceTypeIds: res.default_ids
      });
    } catch (error) {
      this.setState({
        error
      });
    }
    this.setState({
      isFetchingServiceTypes: false
    });
  };

  onServiceTypeSelect = serviceType => {
    let unitTypes = [];
    switch (serviceType.id) {
      case CALENDAR_SERVICE_TYPES.MILK:
        unitTypes = [UNIT_TYPES.LITRE, UNIT_TYPES.MILLILITRE];
        break;
      case CALENDAR_SERVICE_TYPES.DAIRY:
        unitTypes = [
          UNIT_TYPES.LITRE,
          UNIT_TYPES.MILLILITRE,
          UNIT_TYPES.KILOGRAM,
          UNIT_TYPES.GRAM
        ];
        break;
      case CALENDAR_SERVICE_TYPES.VEGETABLES:
        unitTypes = [UNIT_TYPES.KILOGRAM, UNIT_TYPES.GRAM];
        break;
      default:
        unitTypes = [UNIT_TYPES.UNIT];
        break;
    }
    this.setState({
      name: serviceType.name,
      selectedServiceType: serviceType,
      wagesType: WAGES_CYCLE.DAILY,
      unitTypes,
      selectedUnitType: unitTypes[0],
      actualSelectedUnitType: unitTypes[0]
    });
  };

  onUnitTypeSelect = unitType => {
    let actualSelectedUnitType = unitType;
    if (unitType.id == UNIT_TYPES.GRAM.id) {
      actualSelectedUnitType = UNIT_TYPES.KILOGRAM;
    } else if (unitType.id == UNIT_TYPES.MILLILITRE.id) {
      actualSelectedUnitType = UNIT_TYPES.LITRE;
    }
    this.setState({
      selectedUnitType: unitType,
      actualSelectedUnitType
    });
  };

  toggleDay = day => {
    let selectedDays = [...this.state.selectedDays];
    const idx = selectedDays.indexOf(day);
    if (idx == -1) {
      selectedDays.push(day);
    } else {
      selectedDays.splice(idx, 1);
    }
    this.setState({
      selectedDays
    });
  };

  createCalendarItem = async () => {
    const {
      selectedServiceType,
      name,
      providerName,
      wagesType,
      unitPrice,
      quantity,
      startingDate,
      selectedDays,
      selectedUnitType,
      actualSelectedUnitType,
      type
    } = this.state;

    if (!name) {
      return Alert.alert("Please enter name");
    }
    if (unitPrice && unitPrice < 0) {
      return Alert.alert("Amount can't be less than zero");
    }
    if (!startingDate) {
      return Alert.alert("Please select a starting date");
    }
    if (selectedDays.length == 0) {
      return Alert.alert("Please select week days for this service");
    }

    this.setState({
      isFetchingServiceTypes: true
    });

    let actualQuantity = quantity;
    if (
      selectedUnitType.id == UNIT_TYPES.GRAM.id ||
      selectedUnitType.id == UNIT_TYPES.MILLILITRE.id
    ) {
      actualQuantity = quantity / 1000;
    }

    try {
      const res = await createCalendarItem({
        serviceTypeId: selectedServiceType.id,
        productName: name,
        providerName: providerName,
        wagesType: wagesType,
        unitType: actualSelectedUnitType.id,
        unitPrice: unitPrice,
        quantity: actualQuantity,
        effectiveDate: startingDate,
        selectedDays: selectedDays
      });
      this.props.navigator.pop();
    } catch (e) {
      Alert.alert(e.message);
      this.setState({
        isFetchingServiceTypes: false
      });
    }
  };

  render() {
    const {
      error,
      isFetchingServiceTypes,
      serviceTypes,
      visibleServiceTypeIds,
      selectedServiceType,
      name,
      providerName,
      wagesType,
      unitPrice,
      quantity,
      startingDate,
      selectedDays,
      unitTypes,
      selectedUnitType,
      actualSelectedUnitType
    } = this.state;
    if (error) {
      return (
        <ErrorOverlay error={error} onRetryPress={this.fetchReferenceData} />
      );
    }
    return (
      <ScreenContainer style={{ padding: 0, backgroundColor: "#f7f7f7" }}>
        <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
          {!isFetchingServiceTypes && (
            <SelectServiceHeader
              serviceTypes={serviceTypes}
              visibleServiceTypeIds={visibleServiceTypeIds}
              onServiceTypeSelect={this.onServiceTypeSelect}
            />
          )}
          {selectedServiceType && (
            <View style={styles.form}>
              <CustomTextInput
                placeholder={I18n.t(
                  "add_edit_calendar_service_screen_form_name"
                )}
                placeholder2="*"
                placeholder2Color={colors.mainBlue}
                value={name}
                onChangeText={name => this.setState({ name })}
              />
              {false && (
                <CustomTextInput
                  placeholder={I18n.t(
                    "add_edit_calendar_service_screen_form_provider_name"
                  )}
                  value={providerName}
                  onChangeText={providerName => this.setState({ providerName })}
                />
              )}
              {(selectedServiceType.wages_type == CALENDAR_WAGES_TYPE.WAGES ||
                selectedServiceType.wages_type == CALENDAR_WAGES_TYPE.FEES) && (
                  <View>
                    <View>
                      <Text weight="Medium" style={styles.label}>
                        {selectedServiceType.wages_type ==
                          CALENDAR_WAGES_TYPE.WAGES
                          ? I18n.t(
                            "add_edit_calendar_service_screen_form_wages_type"
                          )
                          : I18n.t(
                            "add_edit_calendar_service_screen_form_fees_tye"
                          )}
                      </Text>
                      <View style={{ flexDirection: "row", marginBottom: 10 }}>
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({
                              wagesType: WAGES_CYCLE.MONTHLY
                            });
                          }}
                          style={styles.radioBtn}
                        >
                          <Icon
                            name={
                              wagesType == WAGES_CYCLE.MONTHLY
                                ? "md-radio-button-on"
                                : "md-radio-button-off"
                            }
                            color={
                              wagesType == WAGES_CYCLE.MONTHLY
                                ? colors.pinkishOrange
                                : colors.secondaryText
                            }
                            size={20}
                          />
                          <Text
                            style={[
                              styles.radioBtnLabel,
                              {
                                color:
                                  wagesType == WAGES_CYCLE.MONTHLY
                                    ? colors.pinkishOrange
                                    : colors.secondaryText
                              }
                            ]}
                          >
                            Monthly
                        </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({
                              wagesType: WAGES_CYCLE.DAILY
                            });
                          }}
                          style={styles.radioBtn}
                        >
                          <Icon
                            name={
                              wagesType == WAGES_CYCLE.DAILY
                                ? "md-radio-button-on"
                                : "md-radio-button-off"
                            }
                            color={
                              wagesType == WAGES_CYCLE.DAILY
                                ? colors.pinkishOrange
                                : colors.secondaryText
                            }
                            size={20}
                          />
                          <Text
                            style={[
                              styles.radioBtnLabel,
                              {
                                color:
                                  wagesType == WAGES_CYCLE.DAILY
                                    ? colors.pinkishOrange
                                    : colors.secondaryText
                              }
                            ]}
                          >
                            Daily
                        </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <CustomTextInput
                      placeholder={
                        selectedServiceType.wages_type ==
                          CALENDAR_WAGES_TYPE.WAGES
                          ? I18n.t("add_edit_calendar_service_screen_form_wages")
                          : I18n.t("add_edit_calendar_service_screen_form_fees")
                      }
                      keyboardType="numeric"
                      value={unitPrice}
                      onChangeText={unitPrice => this.setState({ unitPrice })}
                    />
                  </View>
                )}
              {selectedServiceType.wages_type ==
                CALENDAR_WAGES_TYPE.PRODUCT && (
                  <View>
                    <View style={{ flexDirection: "row" }}>
                      <SelectModal
                        style={styles.selectUnitType}
                        visibleKey="symbol"
                        dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
                        placeholder="Choose Unit Type"
                        placeholderRenderer={({ placeholder }) => (
                          <Text
                            weight="Medium"
                            style={{ color: colors.secondaryText }}
                          >
                            {placeholder}
                          </Text>
                        )}
                        selectedOption={selectedUnitType}
                        options={unitTypes}
                        onOptionSelect={value => {
                          this.onUnitTypeSelect(value);
                        }}
                        hideAddNew={true}
                        hideSearch={true}
                      />
                      <CustomTextInput
                        keyboardType="numeric"
                        style={{ flex: 1 }}
                        placeholder={I18n.t("calendar_service_screen_quantity")}
                        value={quantity}
                        onChangeText={quantity => this.setState({ quantity })}
                        rightSideText={selectedUnitType.symbol}
                        rightSideTextWidth={70}
                      />
                    </View>
                    <CustomTextInput
                      keyboardType="numeric"
                      placeholder={I18n.t("calendar_service_screen_unit_price")}
                      value={unitPrice}
                      onChangeText={unitPrice => this.setState({ unitPrice })}
                      rightSideText={"₹ per " + actualSelectedUnitType.symbol}
                      rightSideTextWidth={100}
                    />
                  </View>
                )}
              <CustomDatePicker
                date={startingDate}
                placeholder={I18n.t(
                  "add_edit_calendar_service_screen_form_starting_date"
                )}
                onDateChange={startingDate => {
                  this.setState({ startingDate });
                }}
              />
              <Text weight="Medium" style={styles.label}>
                Days
              </Text>
              <SelectWeekDays
                selectedDays={selectedDays}
                onDayPress={this.toggleDay}
              />
            </View>
          )}
        </KeyboardAwareScrollView>
        {selectedServiceType && (
          <Button
            onPress={this.createCalendarItem}
            text={I18n.t("my_calendar_screen_add_btn")}
            color="secondary"
            borderRadius={0}
            style={styles.addItemBtn}
          />
        )}
        {!selectedServiceType && (
          <View style={styles.selectServiceMsgContainer}>
            <Text weight="Bold" style={styles.selectServiceMsg}>
              Please Select a Type Above
            </Text>
          </View>
        )}
        <LoadingOverlay visible={isFetchingServiceTypes} />
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  form: {
    padding: 16,
    backgroundColor: "#fff",
    marginTop: 10,
    borderColor: "#eee",
    borderTopWidth: StyleSheet.hairlineWidth
  },
  label: {
    fontSize: 12,
    color: colors.secondaryText,
    marginBottom: 10
  },
  selectUnitType: {
    width: 80,
    marginRight: 20
  },
  selectServiceMsgContainer: {
    flex: 1
  },
  selectServiceMsg: {
    fontSize: 20,
    color: colors.mainBlue,
    textAlign: "center"
  },
  radioBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  radioBtnLabel: {
    marginLeft: 10
  },
  addItemBtn: {
    width: "100%"
  }
});

export default AddEditCalendarServiceScreen;
