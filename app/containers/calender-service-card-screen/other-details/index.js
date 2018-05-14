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
import { showSnackbar } from "../../snackbar";

import { updateCalendarItem } from "../../../api";

import { Text, Button } from "../../../elements";
import KeyValueItem from "../../../components/key-value-item";
import CustomTextInput from "../../../components/form-elements/text-input";
import CustomDatePicker from "../../../components/form-elements/date-picker";
import LoadingOverlay from "../../../components/loading-overlay";
import CalculationDetailModal from "./calculation-detail-modal";

import { defaultStyles, colors } from "../../../theme";
import call from "react-native-phone-call";
import { CALENDAR_WAGES_TYPE } from "../../../constants";

const cardWidthWhenMany = Dimensions.get("window").width - 52;
const cardWidthWhenOne = Dimensions.get("window").width - 32;

class Report extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditDetailModalOpen: false,
      productNameToEdit: "",
      providerNameToEdit: "",
      providerNumberToEdit: "",
      isSavingDetails: false,
    };
  }

  componentDidMount() {
    const { item } = this.props;
    this.setState({
      productNameToEdit: item.product_name,
      providerNameToEdit: item.provider_name,
      providerNumberToEdit: item.provider_number
    });
  }

  editCalculationDetail = calculationDetail => {
    this.setState({
      calculationDetailToEdit: calculationDetail
    });
    this.showEditDetailModal();
  };

  hideEditDetailModal = () => {
    this.setState({
      isEditDetailModalOpen: false
    });
  };

  showEditDetailModal = () => {
    this.setState({
      isEditDetailModalOpen: true
    });
  };

  saveDetails = async () => {
    const {
      isEditDetailModalOpen,
      productNameToEdit,
      providerNameToEdit,
      providerNumberToEdit,
      isSavingDetails
    } = this.state;
    const { item, reloadScreen } = this.props;

    if (!productNameToEdit.trim()) {
      return showSnackbar({
        text: "Please enter the name"
      });
    }

    this.setState({
      isSavingDetails: true
    });
    try {
      await updateCalendarItem({
        itemId: item.id,
        productName: productNameToEdit,
        providerName: providerNameToEdit,
        providerNumber: providerNumberToEdit
      });
      this.setState({
        isEditDetailModalOpen: false,
        isSavingDetails: false
      });
      //app crashes on Android without this timeout
      setTimeout(() => reloadScreen(), 200);
    } catch (e) {
      showSnackbar({
        text: e.message
      });
      this.setState({
        isSavingDetails: false
      });
    }
  };
  handlePhonePress = () => {
    console.log("inside call function");
    call({ number: this.state.providerNumberToEdit }).catch(e =>
      showSnackbar({
        text: e.message
      })
    );
  };
  render() {
    const {
      isEditDetailModalOpen,
      productNameToEdit,
      providerNameToEdit,
      providerNumberToEdit,
      isSavingDetails
    } = this.state;
    const { item, reloadScreen } = this.props;

    const serviceType = item.service_type;
    let unitPriceText = I18n.t("calendar_service_screen_unit_price");
    if (serviceType.wages_type == CALENDAR_WAGES_TYPE.WAGES) {
      unitPriceText = I18n.t("add_edit_calendar_service_screen_form_wages");
    } else if (serviceType.wages_type == CALENDAR_WAGES_TYPE.FEES) {
      unitPriceText = I18n.t("add_edit_calendar_service_screen_form_fees");
    } else if (serviceType.wages_type == CALENDAR_WAGES_TYPE.RENTAL) {
      unitPriceText = I18n.t("add_edit_calendar_service_screen_form_rental");
    }

    const calculationDetails = item.calculation_detail;
    const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
    // if (!isEditDetailModalOpen) return null;

    return (
      <View collapsable={false} style={{ paddingHorizontal: 8 }}>
        <View collapsable={false} style={styles.card}>
          <TouchableOpacity
            onPress={this.showEditDetailModal}
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
          <View collapsable={false} style={styles.cardBody}>
            {/* <KeyValueItem
              keyText={I18n.t("calendar_service_screen_product_name")}
              valueText={item.product_name}
            /> */}
            <KeyValueItem
              keyText={"Service Name"}
              valueText={item.provider_name}
            />
            <KeyValueItem
              keyText={I18n.t("calendar_service_screen_provider_number")}
              ValueComponent={() => (
                <TouchableOpacity
                  style={styles.callText}
                  onPress={this.handlePhonePress}
                >
                  <Text style={{ color: colors.pinkishOrange }}>
                    {item.provider_number}{" "}
                    {item.provider_number ? (
                      <Icon name="md-call" size={15} color={colors.tomato} />
                    ) : (
                      ""
                    )}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
        <ScrollView horizontal={true} style={styles.slider}>
          {calculationDetails.map((calculationDetail, index) => {
            const startDate = moment(calculationDetail.effective_date).format(
              "DD MMM YYYY"
            );

            let endDate = "Till End";

            if (index > 0) {
              endDate = moment(calculationDetails[index - 1].effective_date)
                .subtract(1, "days")
                .format("DD MMM YYYY");
            }

            return (
              <View
                collapsable={false}
                key={calculationDetail.id}
                style={[
                  styles.card,
                  calculationDetails.length > 1
                    ? { width: cardWidthWhenMany }
                    : { width: cardWidthWhenOne }
                ]}
              >
                <View
                  collapsable={false}
                  onPress={() => this.editCalculationDetail(calculationDetail)}
                  style={{ backgroundColor: "#EBEBEB" }}
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
                        {startDate + "-" + endDate}
                      </Text>
                    )}
                    ValueComponent={() => {
                      if (index > 0) return null;
                      return (
                        <TouchableOpacity
                          onPress={() => this.calculationDetailModal.show()}
                        >
                          <Text
                            weight="Bold"
                            style={{
                              fontSize: 12,
                              textAlign: "right",
                              color: colors.pinkishOrange
                            }}
                          >
                            {I18n.t("calendar_service_screen_change")}
                          </Text>
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>
                <View collapsable={false} style={styles.cardBody}>
                  {calculationDetail.quantity ? (
                    <KeyValueItem
                      keyText={I18n.t("calendar_service_screen_quantity")}
                      valueText={calculationDetail.quantity}
                    />
                  ) : (
                    <View collapsable={false} />
                  )}
                  <KeyValueItem
                    keyText={unitPriceText}
                    valueText={calculationDetail.unit_price}
                  />
                  {Array.isArray(calculationDetail.selected_days) ? (
                    <View
                      collapsable={false}
                      style={{ flexDirection: "row", padding: 10 }}
                    >
                      {calculationDetail.selected_days.map(day => (
                        <View
                          collapsable={false}
                          key={day}
                          style={styles.weekDay}
                        >
                          <Text weight="Medium" style={styles.weekDayText}>
                            {weekDays[day - 1]}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <View collapsable={false} />
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
        {isEditDetailModalOpen ? (
          <View collapsable={false}>
            <Modal
              isVisible={true}
              avoidKeyboard={Platform.OS == "ios"}
              animationIn="slideInUp"
              useNativeDriver={true}
              onBackdropPress={this.hideEditDetailModal}
              onBackButtonPress={this.hideEditDetailModal}
            >
              <View collapsable={false} style={[styles.card, styles.modalCard]}>
                <LoadingOverlay visible={isSavingDetails} />
                <TouchableOpacity
                  style={styles.modalCloseIcon}
                  onPress={this.hideEditDetailModal}
                >
                  <Icon name="md-close" size={30} color={colors.mainText} />
                </TouchableOpacity>
                {/* <CustomTextInput
              placeholder={I18n.t("calendar_service_screen_product_name")}
              value={productNameToEdit}
              onChangeText={productNameToEdit =>
                this.setState({ productNameToEdit })
              }
            /> */}
                <CustomTextInput
                  placeholder="Service Name"
                  value={providerNameToEdit}
                  onChangeText={providerNameToEdit =>
                    this.setState({ providerNameToEdit })
                  }
                />
                <CustomTextInput
                  placeholder={I18n.t(
                    "calendar_service_screen_provider_number"
                  )}
                  value={providerNumberToEdit}
                  onChangeText={providerNumberToEdit =>
                    this.setState({ providerNumberToEdit })
                  }
                />
                <Button
                  onPress={this.saveDetails}
                  style={[styles.markPaidBtn, styles.modalBtn]}
                  text={I18n.t("calendar_service_screen_save")}
                  color="secondary"
                />
              </View>
            </Modal>
          </View>
        ) : (
          <View collapsable={false} />
        )}
        <CalculationDetailModal
          ref={ref => (this.calculationDetailModal = ref)}
          item={item}
          reloadScreen={reloadScreen}
        />
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
  slider: {
    paddingBottom: 20
  },
  weekDay: {
    backgroundColor: colors.success,
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    borderRadius: 9
  },
  weekDayText: {
    fontSize: 8,
    color: "#fff"
  },
  modalCard: {
    width: "100%",
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
  modalBtn: {
    width: 250
  },
  callText: {
    // backgroundColor: 'green',
    flex: 1,

    alignItems: "flex-end"
  }
});

export default Report;
