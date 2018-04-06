import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  FlatList
} from "react-native";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";
import { Text, Button } from "../elements";
import I18n from "../i18n";
import { colors, defaultStyles } from "../theme";
import UpcomingServiceItem from "./upcoming-service-item";
import ViewMoreBtn from "./view-more-btn";

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
            defaultStyles.card,
            listHeight == "less" ? styles.listLessHeight : {}
          ]}
        >
          {upcomingServices.map((item, index) => {
            if (listHeight == "less" && index > 1) return null;
            return (
              <UpcomingServiceItem
                key={index}
                item={item}
                navigator={this.props.navigator}
              />
            );
          })}
        </View>
        {upcomingServices.length > 2 && (
          <ViewMoreBtn height={listHeight} onPress={this.toggleListHeight} />
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
    width: "100%"
  },
  viewBtn: {
    alignItems: "center",
    marginTop: -20,
    elevation: 3
  }
});

export default UpcomingServicesList;
