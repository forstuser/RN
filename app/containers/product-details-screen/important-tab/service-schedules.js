import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";
import Icon from "react-native-vector-icons/dist/Ionicons";
import moment from "moment";
import Modal from "react-native-modal";
import { SCREENS, SERVICE_TYPE_NAMES } from "../../../constants";
import { Text, Button, ScreenContainer } from "../../../elements";
import I18n from "../../../i18n";
import { colors } from "../../../theme";
import Collapsible from "../../../components/collapsible";
import KeyValueItem from "../../../components/key-value-item";

const closeIcon = <Icon name="ios-close" size={30} color="#000" />;

class ServiceSchedules extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false
    };
  }

  componentDidMount() {
    this.updateStateFromProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateStateFromProps(nextProps);
  }

  updateStateFromProps = props => {
    if (props.openServiceSchedule) {
      this.setState({ isModalVisible: true });
    }
  };

  toggleModal = () => {
    this.setState({
      isModalVisible: !this.state.isModalVisible
    });
  };

  scheduleItem = schedule => (
    <KeyValueItem
      keyText={`${schedule.service_number}\n(${
        SERVICE_TYPE_NAMES[schedule.service_type]
      })`}
      ValueComponent={() => (
        <Text
          weight="Medium"
          style={{
            textAlign: "right",
            flex: 1
          }}
        >
          {moment(schedule.due_date).format("MMM DD, YYYY") +
            " or\n" +
            schedule.distance +
            "Kms"}
        </Text>
      )}
    />
  );

  render() {
    const { product } = this.props;
    const { schedule, serviceSchedules } = product;
    const { isModalVisible } = this.state;
    return (
      <View>
        <Collapsible
          headerText={I18n.t("product_details_screen_service_schedule_title")}
        >
          {schedule && this.scheduleItem(schedule)}
          {serviceSchedules &&
            serviceSchedules.length > 0 && (
              <TouchableOpacity
                onPress={this.toggleModal}
                style={{ alignItems: "center", padding: 10 }}
              >
                <Text weight="Medium" style={{ color: colors.pinkishOrange }}>
                  View Complete Schedule
                </Text>
              </TouchableOpacity>
            )}
        </Collapsible>
        <Modal
          isVisible={isModalVisible}
          useNativeDriver={true}
          onBackdropPress={this.toggleModal}
        >
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text weight="Bold" style={styles.modalHeaderTitle}>
                Service Schedule
              </Text>
              <Text weight="Bold" style={styles.modalHeaderProductName}>
                {product.model}
              </Text>
            </View>
            <ScrollView style={styles.modalScheduleContainer}>
              {serviceSchedules.map(serviceSchedule =>
                this.scheduleItem(serviceSchedule)
              )}
            </ScrollView>
            <Button
              onPress={this.toggleModal}
              text="OK"
              color="secondary"
              style={styles.modalOkBtn}
            />
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "#fff",
    borderRadius: 6,
    flex: 1
  },
  modalHeader: {
    padding: 16
  },
  modalHeaderTitle: {
    textAlign: "center",
    fontSize: 20
  },
  modalHeaderProductName: {
    marginTop: 5,
    color: colors.pinkishOrange,
    textAlign: "center"
  },
  modalScheduleContainer: {
    borderColor: "#eee",
    borderTopWidth: StyleSheet.hairlineWidth
  },
  modalOkBtn: {
    margin: 20
  }
});

export default ServiceSchedules;
