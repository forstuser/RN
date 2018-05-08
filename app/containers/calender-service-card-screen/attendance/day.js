import React from "react";
import { StyleSheet, View, TouchableOpacity, Platform } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";
import I18n from "../../../i18n";
import { Text, Button } from "../../../elements";
import { colors, defaultStyles } from "../../../theme";
import Modal from "react-native-modal";
import LoadingOverlay from "../../../components/loading-overlay";
import CustomTextInput from "../../../components/form-elements/text-input";
import { addCalendarItemCalculationDetail } from "../../../api";
import {
  CALENDAR_SERVICE_TYPES,
  CALENDAR_WAGES_TYPE
} from "../../../constants";

class Month extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditQuantityModalOpen: false,
      quantity: Number(this.props.calculationDetail.quantity) || 0
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      quantity: Number(newProps.calculationDetail.quantity) || 0
    });
  }

  hideEditQuantityModal = () => {
    this.setState({
      isEditQuantityModalOpen: false
    });
  };
  showEditQuantityModal = () => {
    this.setState({
      isEditQuantityModalOpen: true
    });
  };

  decreaseQuantity = () => {
    const { item } = this.props;

    if (this.state.quantity > 0) {
      let newQuantity = this.state.quantity - 1;
      if (item.service_type.id == CALENDAR_SERVICE_TYPES.MILK) {
        newQuantity = this.state.quantity - 0.25;
      }
      if (newQuantity < 0) {
        newQuantity = 0;
      }
      this.setState(
        {
          quantity: newQuantity
        },
        () => {
          this.changeQuantity();
        }
      );
    }
  };
  increaseQuantity = () => {
    const { item } = this.props;
    this.setState(
      {
        quantity:
          item.service_type.id == CALENDAR_SERVICE_TYPES.MILK
            ? this.state.quantity + 0.25
            : this.state.quantity + 1
      },
      () => {
        this.changeQuantity();
      }
    );
  };

  changeQuantity = async () => {
    const quantity = this.state.quantity;
    const { item, calculationDetail, date } = this.props;
    try {
      await addCalendarItemCalculationDetail({
        itemId: item.id,
        unitType: calculationDetail.unit.id,
        unitPrice: calculationDetail.unit_price,
        quantity: quantity,
        effectiveDate: date,
        selectedDays: calculationDetail.selected_days
      });

      let isNextDateRequestRequired = true;
      const nextDate = moment(date)
        .add(1, "days")
        .format("YYYY-MM-DD");
      for (let i = 0; i < item.calculation_detail.length; i++) {
        if (item.calculation_detail[i].effective_date === nextDate) {
          isNextDateRequestRequired = false;
          break;
        }
      }

      if (isNextDateRequestRequired) {
        await addCalendarItemCalculationDetail({
          itemId: item.id,
          unitType: calculationDetail.unit.id,
          unitPrice: calculationDetail.unit_price,
          quantity: calculationDetail.quantity,
          effectiveDate: nextDate,
          selectedDays: calculationDetail.selected_days
        });
      }
      this.props.reloadScreen();
      this.setState({
        isEditQuantityModalOpen: false
      });
    } catch (e) {
      showSnackbar({
        text: e.message
      });
    }
  };

  render() {
    const {
      date,
      isPresent = true,
      toggleAttendance,
      calculationDetail,
      item
    } = this.props;
    // console.log("calculationDetails in props", calculationDetails)
    const { quantity, isEditQuantityModalOpen } = this.state;
    const isDateAfterToday = moment(date).isAfter(moment().startOf("day"));

    console.log("date: ", date, "isDateAfterToday: ", isDateAfterToday);
    if (!isEditQuantityModalOpen) return null;

    return (
      <View style={styles.container}>
        <Text weight="Medium" style={styles.date}>
          {moment(date).format("D MMM YYYY")}
        </Text>
        {isPresent &&
          item.service_type.wages_type == CALENDAR_WAGES_TYPE.PRODUCT && (
            <View style={{ flexDirection: "row", width: 80 }}>
              <TouchableOpacity
                onPress={this.decreaseQuantity}
                style={{
                  marginTop: 3,
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center"
                }}
              >
                <Icon name="md-remove" size={16} color={colors.pinkishOrange} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.showEditQuantityModal}
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  minWidth: 20
                }}
              >
                <Text>{quantity}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.increaseQuantity}
                style={{
                  marginTop: 3,
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center"
                }}
              >
                <Icon name="md-add" size={16} color={colors.pinkishOrange} />
              </TouchableOpacity>
            </View>
          )}
        <TouchableOpacity
          onPress={toggleAttendance}
          style={styles.presentAbsentContainer}
        >
          <Text
            weight="Medium"
            style={[styles.presentAbsent, !isPresent ? styles.absent : {}]}
          >
            {I18n.t("calendar_service_screen_absent")}
          </Text>
          <Text
            weight="Medium"
            style={[
              styles.presentAbsent,
              isPresent && !isDateAfterToday ? styles.present : {},
              isPresent && isDateAfterToday ? styles.presentAfterToday : {}
            ]}
          >
            {I18n.t("calendar_service_screen_present")}
          </Text>
        </TouchableOpacity>
        {isEditQuantityModalOpen && (
          <View>
            <Modal
              isVisible={true}
              avoidKeyboard={Platform.OS == "ios"}
              animationIn="slideInUp"
              useNativeDriver={true}
              onBackdropPress={this.hideEditQuantityModal}
              onBackButtonPress={this.hideEditQuantityModal}
            >
              <View style={[styles.card, styles.modalCard]}>
                {/* <LoadingOverlay visible={isAddingPayment} /> */}
                <TouchableOpacity
                  style={styles.modalCloseIcon}
                  onPress={this.hideEditQuantityModal}
                >
                  <Icon name="md-close" size={30} color={colors.mainText} />
                </TouchableOpacity>
                <Text
                  weight="Bold"
                  style={{
                    marginTop: 30,
                    marginBottom: 10,
                    alignSelf: "flex-start"
                  }}
                >
                  {moment(date).format("D MMM YYYY")}
                </Text>
                <CustomTextInput
                  keyboardType="numeric"
                  style={{ marginTop: 50 }}
                  placeholder={"Change Quantity"}
                  value={String(quantity)}
                  onChangeText={quantity => this.setState({ quantity })}
                  rightSideText={
                    calculationDetail.unit ? calculationDetail.unit.title : ""
                  }
                />
                <Button
                  onPress={this.changeQuantity}
                  style={[styles.changeQuantityBtn, styles.modalBtn]}
                  text={"Save"}
                  color="secondary"
                />
              </View>
            </Modal>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    borderRadius: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 13,
    ...defaultStyles.card
  },
  date: {
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center"
  },
  presentAbsentContainer: {
    flexDirection: "row",
    backgroundColor: "#efefef",
    borderColor: "#999",
    borderWidth: 1,
    borderRadius: 2
  },
  presentAbsent: {
    fontSize: 9,
    padding: 8
  },
  present: {
    backgroundColor: colors.success,
    color: "#fff"
  },
  presentAfterToday: {
    backgroundColor: "#999"
  },
  absent: {
    backgroundColor: colors.danger,
    color: "#fff"
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    marginTop: 10,
    borderRadius: 5,
    ...defaultStyles.card
  },
  modalCard: {
    maxWidth: 320,
    alignSelf: "center",
    alignItems: "center",
    padding: 16
  },
  changeQuantityBtn: {
    marginTop: 10,
    marginBottom: 5
  },
  modalBtn: {
    width: 250
  },
  modalCloseIcon: {
    position: "absolute",
    right: 15,
    top: 10,
    // bottom: 10,
    marginTop: 10
  }
});

export default Month;
