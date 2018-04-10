import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { Text, Button, ScreenContainer } from "../../elements";
import Modal from "react-native-modal";
import { colors } from "../../theme";
import { API_BASE_URL, setCalendarItemFinishDate } from "../../api";
import { SCREENS } from "../../constants";
import I18n from "../../i18n";
import Icon from "react-native-vector-icons/Ionicons";
import CustomDatePicker from "../../components/form-elements/date-picker";
import LoadingOverlay from "../../components/loading-overlay";
import { showSnackbar } from "../snackbar";
import moment from "moment";

class FinishModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      finishDate: this.props.item.end_date || moment().format("YYYY-MM-DD"),
      isSavingDetails: false
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      finishDate: newProps.item.end_date || moment().format("YYYY-MM-DD")
    });
  }

  finishDateSave = async () => {
    const { finishDate } = this.state;
    const { item, reloadScreen } = this.props;
    this.setState({
      isSavingDetails: true
    });
    try {
      const res = await setCalendarItemFinishDate({
        finishDate,
        itemId: item.id
      });

      this.setState({
        isModalVisible: false,
        isSavingDetails: false
      });

      setTimeout(() => {
        reloadScreen();
      }, 200);
    } catch (e) {
      showSnackbar({
        text: e.message
      });
      this.setState({
        isSavingDetails: false
      });
    }
  };

  show = () => {
    this.setState({
      isModalVisible: true
    });
  };

  hide = () => {
    this.setState({
      isModalVisible: false
    });
  };

  render() {
    const { isModalVisible, isSavingDetails, finishDate } = this.state;
    const { item } = this.props;
    return (
      <Modal useNativeDriver={true} isVisible={isModalVisible}>
        <View style={[styles.card, styles.modalCard]}>
          <LoadingOverlay visible={isSavingDetails} />

          <TouchableOpacity style={styles.modalCloseIcon} onPress={this.hide}>
            <Icon name="md-close" size={30} color={colors.mainText} />
          </TouchableOpacity>
          <CustomDatePicker
            date={finishDate}
            minDate={
              item.calculation_detail[item.calculation_detail.length - 1]
                .effective_date
            }
            maxDate={"2100-01-01"}
            placeholder={I18n.t(
              "add_edit_calendar_service_screen_form_finish_date"
            )}
            onDateChange={finishDate => {
              this.setState({ finishDate });
            }}
          />
          <Text
            weight="Medium"
            style={{ fontSize: 12, color: colors.danger, marginBottom: 10 }}
          >
            {I18n.t("calendar_service_finish_date_warning")}
          </Text>
          <Button
            onPress={this.finishDateSave}
            style={[styles.modalBtn]}
            text={I18n.t("calendar_service_screen_save")}
            color="secondary"
          />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 5,
    width: "100%",
    maxWidth: 320,
    alignSelf: "center",
    padding: 16,
    paddingTop: 50
    // ...defaultStyles.card
  },
  modalCloseIcon: {
    position: "absolute",
    right: 15,
    top: 10
  }
});
export default FinishModal;
