import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  FlatList
} from "react-native";
import moment from "moment";
import { Text, Button } from "../elements";
import I18n from "../i18n";
import { colors } from "../theme";
import UpcomingServiceItem from "./upcoming-service-item";

class UpcomingServicesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listHeight: "less"
    };
  }

  toggleListHeight = () => {
    if (this.state.listHeight == "less") {
      this.setState({
        listHeight: "auto"
      });
    } else {
      this.setState({
        listHeight: "less"
      });
    }
  };
  render() {
    const upcomingServices = this.props.upcomingServices;
    const listHeight = this.state.listHeight;
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.list,
            listHeight == "less" ? styles.listLessHeight : {}
          ]}
        >
          {upcomingServices.map(item => (
            <UpcomingServiceItem
              key={item.id}
              item={item}
              navigator={this.props.navigator}
            />
          ))}
        </View>
        {upcomingServices.length > 2 && (
          <Button
            onPress={this.toggleListHeight}
            color="secondary"
            type="outline"
            text={listHeight == "less" ? "View More +" : "View Less -"}
            style={styles.button}
            textStyle={{ fontSize: 14 }}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center"
  },
  list: {
    width: "100%",
    overflow: "hidden",
    borderColor: "#eaeaea",
    borderBottomWidth: 1
  },
  listLessHeight: {
    maxHeight: 131
  },
  button: {
    marginTop: 16,
    width: 130,
    height: 36
  }
});

export default UpcomingServicesList;
