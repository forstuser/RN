import React from "react";
import {
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback
} from "react-native";
import { Text, ScreenContainer, Image } from "../elements";
import { colors } from "../theme";
import SelectModal from "../components/select-modal";
import { API_BASE_URL, fetchCalendarReferenceData } from "../api";

class ItemSelector extends React.Component {
  render() {
    const { items, moreItems } = this.props;
    return (
      <View collapsable={false} style={styles.container}>
        <Text>Test</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex:
  }
});

export default ItemSelector;
