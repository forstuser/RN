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

class ServiceSchedules extends React.Component {
  render() {
    const { product, navigator } = this.props;
    const { schedule, serviceSchedules } = product;

    const ScheduleItem = ({ schedule }) => (
      <View style={styles.card}>
        <Text style={{ fontSize: 12, color: colors.secondaryText }}>
          {schedule.service_number}
        </Text>
        <Text weight="Medium">
          {`${moment(schedule.due_date).format("MMM DD, YYYY")} or ${
            schedule.distance
          }Kms (${SERVICE_TYPE_NAMES[schedule.service_type]})`}
        </Text>
      </View>
    );

    return (
      <View style={styles.container}>
        <ScrollView horizontal={true} style={styles.slider}>
          {serviceSchedules.map(schedule => (
            <ScheduleItem schedule={schedule} />
          ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10
  },
  slider: {
    paddingBottom: 20
  },
  card: {
    width: 300,
    backgroundColor: "#fff",
    marginRight: 15,
    marginLeft: 5,
    padding: 10,
    borderRadius: 3,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1
  }
});

export default ServiceSchedules;
