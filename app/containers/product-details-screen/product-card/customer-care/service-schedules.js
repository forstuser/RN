import React from "react";
import { StyleSheet, View, TouchableOpacity, ScrollView } from "react-native";
import moment from "moment";

import { Text, Button } from "../../../../elements";
import { colors } from "../../../../theme";
import I18n from "../../../../i18n";

import {
  MAIN_CATEGORY_IDS,
  SCREENS,
  SERVICE_TYPE_NAMES
} from "../../../../constants";

import KeyValueItem from "../../../../components/key-value-item";

class ServiceSchedules extends React.Component {
  render() {
    const { product, navigator } = this.props;
    const { schedule, serviceSchedules } = product;

    const ScheduleItem = ({ schedule }) => (
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

    return (
      <View collapsable={false}  style={styles.container}>
        <View collapsable={false}  style={styles.card}>
          {serviceSchedules.map(schedule => (
            <ScheduleItem schedule={schedule} />
          ))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 8,
    marginTop: 0,
    marginBottom: 30
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 3,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1
  }
});

export default ServiceSchedules;
