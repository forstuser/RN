import React from "react";
import {
  StyleSheet,
  Image,
  View,
  Alert,
  TouchableOpacity,
  Platform
} from "react-native";
import moment from "moment";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";

import I18n from "../../../i18n";

import {
  updateCalendarServicePaymentDayToAbsent,
  updateCalendarServicePaymentDayToPresent
} from "../../../api";

import { Text, Button } from "../../../elements";
import KeyValueItem from "../../../components/key-value-item";
import CustomTextInput from "../../../components/form-elements/text-input";
import CustomDatePicker from "../../../components/form-elements/date-picker";

import Month from "../month";

import VerticalKeyValue from "./vertical-key-value";
import { defaultStyles, colors } from "../../../theme";

class Report extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMarkPaidModalOpen: false,
      amountPaid: 0,
      paidOn: moment().format("YYYY-MM-DD")
    };
  }
  hideMarkPaidModal = () => {
    this.setState({
      isMarkPaidModalOpen: false
    });
  };
  showMarkPaidModal = () => {
    this.setState({
      isMarkPaidModalOpen: true
    });
  };
  render() {
    const { isMarkPaidModalOpen, amountPaid, paidOn } = this.state;
    const {
      item,
      activePaymentDetailIndex = 0,
      onPaymentDetailIndexChange
    } = this.props;
    const paymentDetails = item.payment_detail;
    const paymentDetail = paymentDetails[activePaymentDetailIndex];

    const calculationDetails = item.calculation_detail;
    let activeCalculationDetail = calculationDetails[0];
    for (let i = 0; i < calculationDetails.length; i++) {
      const effectiveDate = calculationDetails[i].effective_date.substr(0, 10);
      const diff = moment().diff(moment(effectiveDate), "days");
      if (diff < 0) {
        //if in future
        continue;
      } else {
        activeCalculationDetail = calculationDetails[i];
      }
    }

    const startDate = moment(paymentDetail.start_date)
      .utcOffset("+0000")
      .format("DD-MMM-YYYY");
    const endDate = moment(paymentDetail.end_date)
      .utcOffset("+0000")
      .format("DD-MMM-YYYY");

    const daysPresent = paymentDetail.total_days;
    const daysAbsent = paymentDetail.absent_day_detail.length;
    return (
      <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
        <Month
          paymentDetails={paymentDetails}
          activePaymentDetailIndex={activePaymentDetailIndex}
          onPaymentDetailIndexChange={onPaymentDetailIndexChange}
        />
        <View style={styles.card}>
          <View style={{ flex: 1, backgroundColor: "#EBEBEB" }}>
            <KeyValueItem
              KeyComponent={() => (
                <Text
                  weight="Bold"
                  style={{
                    flex: 1,
                    color: colors.mainText,
                    fontSize: 12
                  }}
                >
                  {I18n.t("my_calendar_screen_summary")}
                </Text>
              )}
            />
          </View>
          <View style={styles.cardBody}>
            <View style={styles.cardPart}>
              <VerticalKeyValue
                keyText={I18n.t("my_calendar_screen_from")}
                valueText={startDate}
              />
              <VerticalKeyValue
                keyText={I18n.t("my_calendar_screen_to")}
                valueText={endDate}
              />
              <View style={{ flex: 1 }} />
            </View>
            <View style={styles.cardPart}>
              <VerticalKeyValue
                keyText={I18n.t("my_calendar_screen_total_days")}
                valueText={I18n.t("my_calendar_screen_days", {
                  count: daysPresent + daysAbsent
                })}
              />
              <VerticalKeyValue
                keyText={I18n.t("my_calendar_screen_days_present")}
                valueText={I18n.t("my_calendar_screen_days", {
                  count: daysPresent
                })}
                valueStyle={{ color: colors.success }}
              />
              <VerticalKeyValue
                keyText={I18n.t("my_calendar_screen_days_absent")}
                valueText={I18n.t("my_calendar_screen_days", {
                  count: daysAbsent
                })}
                valueStyle={{ color: colors.danger }}
              />
            </View>
            <View style={styles.cardPart}>
              <VerticalKeyValue
                keyText={I18n.t("my_calendar_screen_no_of_units")}
                valueText={paymentDetail.total_units}
              />
              <VerticalKeyValue
                keyText={I18n.t("calendar_service_screen_unit_price")}
                valueText={"₹ " + activeCalculationDetail.unit_price}
              />
              <VerticalKeyValue
                keyText={I18n.t("calendar_service_screen_total_amount")}
                valueText={"₹ " + paymentDetail.total_amount}
              />
            </View>
            {!paymentDetail.paid_on && (
              <Button
                onPress={this.showMarkPaidModal}
                style={styles.markPaidBtn}
                text={I18n.t("calendar_service_screen_mark_paid")}
                color="secondary"
                borderRadius={5}
              />
            )}
          </View>
        </View>
        {!paymentDetail.paid_on && (
          <View style={styles.card}>
            <TouchableOpacity style={{ flex: 1, backgroundColor: "#EBEBEB" }}>
              <KeyValueItem
                KeyComponent={() => (
                  <Text
                    weight="Bold"
                    style={{
                      flex: 1,
                      color: colors.mainText,
                      fontSize: 12
                    }}
                  >
                    {I18n.t("calendar_service_screen_payment_details")}
                  </Text>
                )}
                ValueComponent={() => (
                  <Text
                    weight="Bold"
                    style={{
                      fontSize: 12,
                      textAlign: "right",
                      flex: 1,
                      color: colors.pinkishOrange
                    }}
                  >
                    {I18n.t("product_details_screen_edit")}
                  </Text>
                )}
              />
            </TouchableOpacity>
            <View style={styles.cardBody}>
              <KeyValueItem
                keyText={I18n.t("calendar_service_screen_paid_on")}
                valueText={moment().format("DD MMM YYYY")}
              />
              <KeyValueItem
                keyText={I18n.t("calendar_service_screen_amount_paid")}
                valueText={"₹ " + paymentDetail.total_amount}
              />
            </View>
          </View>
        )}
        <Modal
          isVisible={isMarkPaidModalOpen}
          avoidKeyboard={Platform.OS == "ios"}
          animationIn="slideInUp"
          useNativeDriver={true}
          onBackdropPress={this.hideMarkPaidModal}
          onBackButtonPress={this.hideMarkPaidModal}
        >
          <View style={[styles.card, styles.modalCard]}>
            <TouchableOpacity
              style={styles.modalCloseIcon}
              onPress={this.hideMarkPaidModal}
            >
              <Icon name="md-close" size={30} color={colors.mainText} />
            </TouchableOpacity>
            <Image style={styles.modalImage} />
            <CustomTextInput
              placeholder={I18n.t("calendar_service_screen_amount_paid")}
              value={amountPaid}
              onChangeText={amountPaid => this.setState({ amountPaid })}
            />
            <CustomDatePicker
              date={paidOn}
              placeholder={I18n.t("calendar_service_screen_paid_on")}
              onDateChange={paidOn => {
                this.setState({ paidOn });
              }}
            />
            <Button
              style={[styles.markPaidBtn, styles.modalBtn]}
              text={I18n.t("calendar_service_screen_mark_paid")}
              color="secondary"
            />
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#fff",
    marginTop: 10,
    borderRadius: 5,
    ...defaultStyles.card
  },
  cardBody: {
    paddingHorizontal: 5
  },
  cardPart: {
    flexDirection: "row",
    borderColor: "#efefef",
    borderBottomWidth: StyleSheet.hairlineWidth,
    padding: 10
  },
  markPaidBtn: {
    marginBottom: 5
  },
  modalCard: {
    maxWidth: 300,
    alignSelf: "center",
    alignItems: "center",
    padding: 16
  },
  modalCloseIcon: {
    position: "absolute",
    right: 15,
    top: 10
  },
  modalImage: {
    marginTop: 15,
    marginBottom: 30,
    width: 90,
    height: 90,
    backgroundColor: "#4b5aa7",
    borderRadius: 45
  },
  modalBtn: {
    width: 200
  }
});

export default Report;
