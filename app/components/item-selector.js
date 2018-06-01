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
  constructor(props) {
    super(props);
    this.state = {
      testItems: { id: 1, name: "test2" }
    };
  }
  render() {
    const { items, moreItems } = this.props;
    const { testItem } = this.state;
    return (
      <View collapsable={false} style={styles.container}>
        <ScrollView
          ref={ref => (this.scrollView = ref)}
          horizontal={true}
          alwaysBounceHorizontal={false}
        >
          {items.map(option => {
            return (
              <TouchableWithoutFeedback
                onPress={() => this.onOptionSelect(option)}
              >
                <View collapsable={false} style={styles.option}>
                  <View
                    collapsable={false}
                    style={[
                      styles.optionIconContainer,
                      isSelectedOption
                        ? styles.selectedOptionIconContainer
                        : styles.selectedOptionIconContainer
                    ]}
                  >
                    <Image
                      style={[
                        styles.optionIcon,
                        isSelectedOption
                          ? styles.selectedOptionIcon
                          : styles.selectedOptionIcon
                      ]}
                      resizeMode="contain"
                      source={{
                        uri: API_BASE_URL + option.calendarServiceImageUrl
                      }}
                    />
                  </View>
                  <Text
                    weight="Medium"
                    style={[
                      styles.optionName,
                      isSelectedOption
                        ? styles.selectedOptionName
                        : styles.selectedOptionName
                    ]}
                  >
                    {option.name}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex:
  },
  option: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 100
  },
  optionIconContainer: {
    width: 75,
    height: 75,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: 40,
    marginBottom: 12
  },
  selectedOptionIconContainer: {
    backgroundColor: "#FFF",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2
  },
  optionIcon: {
    width: 50,
    height: 30,
    opacity: 0.3
  },
  selectedOptionIcon: {
    opacity: 1
  },
  optionName: {
    color: "#000",
    fontSize: 10,
    opacity: 0.4,
    textAlign: "center"
  },
  selectedOptionName: {
    opacity: 1
  }
});

export default ItemSelector;
