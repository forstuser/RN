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

class Month extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditQuantityModalOpen: false,
      quantity: this.props.calculationDetail.quantity || 0,
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      quantity: newProps.calculationDetail.quantity || 0
    })
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
    if (this.state.quantity > 0) {
      this.setState({
        quantity: this.state.quantity - 1,
      }, () => {
        this.changeQuantity()
      });

    }

  }
  increaseQuantity = () => {
    this.setState({
      quantity: this.state.quantity + 1,
    }, () => {
      this.changeQuantity()
    });
  }
  changeQuantity = async () => {
    const quantity = this.state.quantity;
    const { item, calculationDetail, date } = this.props;
    console.log("calculationDetail", calculationDetail);
    console.log("item", item);
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
      const nextDate = moment(date).add(1, 'days').format('YYYY-MM-DD');
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
        })
      }


      this.props.reloadScreen();
      this.setState({
        isEditQuantityModalOpen: false,
        // isSavingDetails: false
      });

      // setTimeout(() => {
      //   this.props.reloadScreen();
      // }, 200);
    } catch (e) {
      showSnackbar({
        text: e.message
      });
    }
  };



  render() {
    const { date, isPresent = true, toggleAttendance } = this.props;
    // console.log("calculationDetails in props", calculationDetails)
    const { quantity, isEditQuantityModalOpen } = this.state;
    return (
      <View style={styles.container}>
        <Text weight="Medium" style={styles.date}>
          {moment(date).format("D MMM YYYY")}
        </Text>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <TouchableOpacity onPress={this.decreaseQuantity} style={{ marginTop: 3, flex: 1, flexDirection: "row" }}>
            <Icon
              name="md-remove"
              size={16}
              color={colors.pinkishOrange}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.showEditQuantityModal} style={{ flex: 1, flexDirection: "row" }}><Text>{quantity}</Text></TouchableOpacity>
          <TouchableOpacity onPress={this.increaseQuantity} style={{ marginTop: 3, flex: 1, flexDirection: "row" }}>
            <Icon
              name="md-add"
              size={16}
              color={colors.pinkishOrange}
            />
          </TouchableOpacity>
        </View>
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
            style={[styles.presentAbsent, isPresent ? styles.present : {}]}
          >
            {I18n.t("calendar_service_screen_present")}
          </Text>
        </TouchableOpacity>
        <Modal
          isVisible={isEditQuantityModalOpen}
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
            <CustomTextInput
              style={{ marginTop: 50 }}
              placeholder={"Change Quantity"}
              value={String(quantity)}
              onChangeText={quantity => this.setState({ quantity })}
            />
            <Button
              onPress={this.changeQuantity}
              style={[styles.changeQuantityBtn, styles.modalBtn]}
              text={"Save"}
              color="secondary"
            />
          </View>
        </Modal>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    borderRadius: 3,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 13,
    ...defaultStyles.card
  },
  date: {
    flex: 1
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
  },
});

export default Month;
