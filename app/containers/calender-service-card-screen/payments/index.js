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
import { showSnackbar } from "../../snackbar";

import { addCalendarItemPayment } from "../../../api";

import { Text, Button } from "../../../elements";
import KeyValueItem from "../../../components/key-value-item";
import CustomTextInput from "../../../components/form-elements/text-input";
import CustomDatePicker from "../../../components/form-elements/date-picker";
import LoadingOverlay from "../../../components/loading-overlay";
import Analytics from "../../../analytics"
import { defaultStyles, colors } from "../../../theme";

const getMoneyImage = require("../../../images/get_money.png");

class Report extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMarkPaidModalOpen: false,
      amountPaid: 0,
      paidOn: moment().format("YYYY-MM-DD"),
      isAddingPayment: false
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

  addPayment = async () => {
    const {
      isMarkPaidModalOpen,
      amountPaid,
      paidOn,
      isAddingPayment
    } = this.state;
    const { item, reloadScreen } = this.props;

    if (!amountPaid) {
      return showSnackbar({
        text: "Please enter amount paid"
      })
    }

    if (!paidOn) {
      return showSnackbar({
        text: "Please select the date amount paid on"
      })
    }

    this.setState({
      isAddingPayment: true
    });
    Analytics.logEvent(Analytics.EVENTS.CLICK_ADD_PAYMENT, { type: item.service_type.name });
    try {
      await addCalendarItemPayment({ itemId: item.id, amountPaid, paidOn });
      this.setState({
        isMarkPaidModalOpen: false,
        amountPaid: 0,
        paidOn: moment().format("YYYY-MM-DD"),
        isAddingPayment: false
      });
      reloadScreen();
    } catch (e) {
      showSnackbar({
        text: e.message
      })
      this.setState({
        isAddingPayment: false
      });
    }
  };

  render() {
    const {
      isMarkPaidModalOpen,
      amountPaid,
      paidOn,
      isAddingPayment
    } = this.state;
    const { item } = this.props;
    const payments = item.payments;

    return (
      <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
        <Button
          onPress={this.showMarkPaidModal}
          text="Add Payment"
          borderRadius={5}
          color="secondary"
        />

        <View style={styles.paymentHistory}>
          <View style={styles.paymentHistoryItem}>
            <View style={styles.paymentHistoryItemColumn}>
              <Text weight="Bold">Total Amount Paid</Text>
            </View>
            <View style={styles.paymentHistoryItemColumn}>
              <Text weight="Bold">{`₹ ${payments.reduce(
                (total, payment) => total + payment.amount_paid,
                0
              )}`}</Text>
            </View>
          </View>
          {payments.map(payment => (
            <View key={payment.id} style={styles.paymentHistoryItem}>
              <View style={styles.paymentHistoryItemColumn}>
                <Text weight="Medium" style={{ color: colors.secondaryText }}>
                  {moment(payment.paid_on).format("DD MMM YYYY")}
                </Text>
              </View>
              <View style={styles.paymentHistoryItemColumn}>
                <Text
                  weight="Medium"
                  style={{ color: colors.secondaryText }}
                >{`₹ ${payment.amount_paid}`}</Text>
              </View>
            </View>
          ))}
        </View>

        <Modal
          isVisible={isMarkPaidModalOpen}
          avoidKeyboard={Platform.OS == "ios"}
          animationIn="slideInUp"
          useNativeDriver={true}
          onBackdropPress={this.hideMarkPaidModal}
          onBackButtonPress={this.hideMarkPaidModal}
        >
          <View style={[styles.card, styles.modalCard]}>
            <LoadingOverlay visible={isAddingPayment} />
            <TouchableOpacity
              style={styles.modalCloseIcon}
              onPress={this.hideMarkPaidModal}
            >
              <Icon name="md-close" size={30} color={colors.mainText} />
            </TouchableOpacity>
            <Image style={styles.modalImage} source={getMoneyImage} />
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
              onPress={this.addPayment}
              style={[styles.markPaidBtn, styles.modalBtn]}
              text={I18n.t("calendar_service_screen_add_payment_record")}
              color="secondary"
            />
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  paymentHistory: {
    borderColor: "#efefef",
    borderWidth: 1,
    marginTop: 20
  },
  paymentHistoryItem: {
    flexDirection: "row"
  },
  paymentHistoryItemColumn: {
    flex: 1,
    padding: 10,
    borderColor: "#efefef",
    borderWidth: 1
  },
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
    maxWidth: 320,
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
    marginBottom: 10,
    width: 90,
    height: 90
  },
  modalBtn: {
    width: 250
  }
});

export default Report;
