import React from "react";
import {
  StyleSheet,
  View,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
  Dimensions,
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

import { defaultStyles, colors } from "../../../theme";

const cardWidthWhenMany = Dimensions.get("window").width - 52;
const cardWidthWhenOne = Dimensions.get("window").width - 32;

class Report extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditCalculationDetailModalOpen: false
    };
  }
  editCalculationDetail = calculationDetail => {
    this.setState({
      calculationDetailToEdit: calculationDetail
    });
    this.showEditCalculationDetailModal();
  };

  hideEditCalculationDetailModal = () => {
    this.setState({
      isEditCalculationDetailModalOpen: false
    });
  };
  showEditCalculationDetailModal = () => {
    this.setState({
      isEditCalculationDetailModalOpen: true
    });
  };

  render() {
    const {
      calculationDetailToEdit,
      isEditCalculationDetailModalOpen
    } = this.state;
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

    const startDate = moment(paymentDetail.start_date).format("DD-MMM-YYYY");
    const endDate = moment(paymentDetail.end_date).format("DD-MMM-YYYY");

    const daysPresent = paymentDetail.total_days;
    const daysAbsent = paymentDetail.absent_day_detail.length;
    return (
      <View style={{ paddingHorizontal: 8 }}>
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
                  {I18n.t("calendar_service_screen_item_details")}
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
              keyText={I18n.t("calendar_service_screen_product_name")}
              valueText={item.product_name}
            />
            <KeyValueItem
              keyText={I18n.t("calendar_service_screen_provider_name")}
              valueText={item.provider_name}
            />
          </View>
        </View>
        <ScrollView horizontal={true} style={styles.slider}>
          {calculationDetails.map(calculationDetail => (
            <View
              key={calculationDetail.id}
              style={[
                styles.card,
                calculationDetails.length > 1
                  ? { width: cardWidthWhenMany }
                  : { width: cardWidthWhenOne }
              ]}
            >
              <TouchableOpacity
                onPress={() => this.editCalculationDetail(calculationDetail)}
                style={{ flex: 1, backgroundColor: "#EBEBEB" }}
              >
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
                      {moment(calculationDetail.effective_date).format(
                        "DD MMM YYYY"
                      ) +
                        "-" +
                        moment(calculationDetail.end_date).format(
                          "DD MMM YYYY"
                        )}
                    </Text>
                  )}
                  ValueComponent={() => (
                    <Text
                      weight="Bold"
                      style={{
                        fontSize: 12,
                        textAlign: "right",
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
                  keyText={I18n.t("calendar_service_screen_quantity")}
                  valueText={calculationDetail.quantity}
                />
                <KeyValueItem
                  keyText={I18n.t("calendar_service_screen_price")}
                  valueText={calculationDetail.unit_price}
                />
              </View>
            </View>
          ))}
        </ScrollView>
        <Modal
          isVisible={isEditCalculationDetailModalOpen}
          avoidKeyboard={Platform.OS == "ios"}
          animationIn="slideInUp"
          useNativeDriver={true}
          onBackdropPress={this.hideEditCalculationDetailModal}
          onBackButtonPress={this.hideEditCalculationDetailModal}
        >
          <View style={[styles.card, styles.modalCard]}>
            <TouchableOpacity
              style={styles.modalCloseIcon}
              onPress={this.hideEditCalculationDetailModal}
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
    backgroundColor: "#fff",
    marginHorizontal: 8,
    marginBottom: 10,
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
  slider: {
    paddingBottom: 20
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
