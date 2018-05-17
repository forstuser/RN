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
import { showSnackbar } from "../../utils/snackbar";
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
import Analytics from "../../analytics";
import SelectModal from "../../components/select-modal";
import CustomTextInput from "../../components/form-elements/text-input";
import CustomDatePicker from "../../components/form-elements/date-picker";
import SelectWeekDays from "../../components/select-week-days";
import SelectServiceHeader from "./select-service-step";

class AddEditCalendarServiceScreen extends Component {
  static navigationOptions = {
    title: I18n.t("add_edit_calendar_service_screen_title"),
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
    this.props.navigation.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  onNavigatorEvent = event => {
    switch (event.id) {
      case "didAppear":
        break;
    }
  };

  componentDidMount() {
    this.props.navigation.setTitle({
      title: I18n.t("add_  edit_calendar_service_screen_title")
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
    let wagesType = WAGES_CYCLE.DAILY;
    if (serviceType.wages_type != CALENDAR_WAGES_TYPE.PRODUCT) {
      wagesType = WAGES_CYCLE.MONTHLY;
    }
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
      wagesType: wagesType,
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
      return showSnackbar({
        text: "Please enter name"
      });
    }
    if (unitPrice && unitPrice < 0) {
      returnshowSnackbar({
        text: "Amount can't be less than zero"
      });
    }
    if (!startingDate) {
      return showSnackbar({
        text: "Please select a starting date"
      });
    }
    if (selectedDays.length == 0) {
      return showSnackbar({
        text: "Please select week days for this service"
      });
    }

    this.setState({
      isFetchingServiceTypes: true
    });

    let actualQuantity = quantity;
    if (
      (selectedUnitType.id == UNIT_TYPES.GRAM.id ||
        selectedUnitType.id == UNIT_TYPES.MILLILITRE.id) &&
      quantity
    ) {
      actualQuantity = quantity / 1000;
    }

    let quantityToSend = actualQuantity;
    if (
      !quantityToSend &&
      selectedServiceType.wages_type != CALENDAR_WAGES_TYPE.PRODUCT
    ) {
      quantityToSend = null;
    } else if (
      !quantityToSend &&
      selectedServiceType.wages_type == CALENDAR_WAGES_TYPE.PRODUCT
    ) {
      quantityToSend = 0;
    }
    try {
      const res = await createCalendarItem({
        serviceTypeId: selectedServiceType.id,
        productName: name,
        providerName: providerName,
        wagesType: wagesType,
        unitType: actualSelectedUnitType.id,
        unitPrice: unitPrice,
        quantity: quantityToSend,
        effectiveDate: startingDate,
        selectedDays: selectedDays
      });
      this.props.navigation.pop();
    } catch (e) {
      showSnackbar({
        text: e.message
      });
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

    let unitPriceText = I18n.t("calendar_service_screen_unit_price");
    let unitPricePlaceholder = I18n.t("calendar_service_screen_unit_price");
    if (selectedServiceType) {
      switch (selectedServiceType.wages_type) {
        case CALENDAR_WAGES_TYPE.WAGES:
          unitPriceText = I18n.t("add_edit_calendar_service_screen_form_wages");
          unitPricePlaceholder = I18n.t(
            "add_edit_calendar_service_screen_form_wages"
          );
          break;
        case CALENDAR_WAGES_TYPE.FEES:
          unitPriceText = I18n.t("add_edit_calendar_service_screen_form_fees");
          unitPricePlaceholder = I18n.t(
            "add_edit_calendar_service_screen_form_fees"
          );
          break;
        case CALENDAR_WAGES_TYPE.RENTAL:
          unitPriceText = I18n.t(
            "add_edit_calendar_service_screen_form_rental_type"
          );
          unitPricePlaceholder = I18n.t(
            "add_edit_calendar_service_screen_form_rental"
          );
          break;
      }
    }

    if (error) {
      return (
        <ErrorOverlay error={error} onRetryPress={this.fetchReferenceData} />
      );
    }
    return (
      <ScreenContainer style={{ padding: 0, backgroundColor: "#f7f7f7" }}>
        <KeyboardAwareScrollView>
          {!isFetchingServiceTypes ? (
            <SelectServiceHeader
              serviceTypes={serviceTypes}
              visibleServiceTypeIds={visibleServiceTypeIds}
              onServiceTypeSelect={this.onServiceTypeSelect}
            />
          ) : (
            <View collapsable={false} />
          )}
          {selectedServiceType ? (
            <View collapsable={false} style={styles.form}>
              <CustomTextInput
                placeholder={I18n.t(
                  "add_edit_calendar_service_screen_form_name"
                )}
                placeholder2="*"
                placeholder2Color={colors.mainBlue}
                value={name}
                onChangeText={name => this.setState({ name })}
              />
              {false ? (
                <CustomTextInput
                  placeholder={I18n.t(
                    "add_edit_calendar_service_screen_form_provider_name"
                  )}
                  value={providerName}
                  onChangeText={providerName => this.setState({ providerName })}
                />
              ) : (
                <View collapsable={false} />
              )}
              {selectedServiceType.wages_type !=
                CALENDAR_WAGES_TYPE.PRODUCT && (
                <View collapsable={false}>
                  <View collapsable={false}>
                    <Text weight="Medium" style={styles.label}>
                      {unitPriceText}
                    </Text>
                    <View
                      collapsable={false}
                      style={{ flexDirection: "row", marginBottom: 10 }}
                    >
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
                    placeholder={unitPricePlaceholder + " (₹)"}
                    keyboardType="numeric"
                    value={unitPrice}
                    onChangeText={unitPrice => this.setState({ unitPrice })}
                  />
                </View>
              )}
              {selectedServiceType.wages_type == CALENDAR_WAGES_TYPE.PRODUCT ? (
                <View collapsable={false}>
                  <View collapsable={false} style={{ flexDirection: "row" }}>
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
              ) : (
                <View collapsable={false} />
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
          ) : (
            <View collapsable={false} />
          )}
        </KeyboardAwareScrollView>
        {selectedServiceType ? (
          <Button
            onPress={this.createCalendarItem}
            text={I18n.t("my_calendar_screen_add_btn")}
            color="secondary"
            borderRadius={0}
            style={styles.addItemBtn}
          />
        ) : (
          <View collapsable={false} style={styles.selectServiceMsgContainer}>
            <Text weight="Medium" style={styles.selectServiceMsg}>
              Please Select a Type Above
            </Text>
            <View collapsable={false} style={styles.reason}>
              <Text style={styles.reasons} weight="Medium">
                • Mark present and absent days
              </Text>
              <Text style={styles.reasons} weight="Medium">
                • Know your monthly payouts
              </Text>
              <Text style={styles.reasons} weight="Medium">
                • your total outstanding payments
              </Text>
              <Text style={styles.reasons} weight="Medium">
                • Track your daily household expenses
              </Text>
            </View>
          </View>
        )}
        <LoadingOverlay visible={isFetchingServiceTypes} />
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  reason: {
    marginLeft: 80,
    alignSelf: "flex-start"
  },
  reasons: {
    color: colors.secondaryText,
    fontSize: 12
  },
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
    flex: 1,
    marginTop: -90
  },
  selectServiceMsg: {
    fontSize: 20,
    fontWeight: "normal",
    color: colors.mainBlue,
    textAlign: "center",
    marginBottom: 6,
    marginTop: -80
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
