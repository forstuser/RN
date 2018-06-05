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
      selectedOption: null,
      serviceTypes: [],
      testItems: [
        { id: 1, name: "test1", calendarServiceImageUrl: "3.jpg" },
        { id: 1, name: "test2", calendarServiceImageUrl: "3.jpg" },
        { id: 1, name: "test3", calendarServiceImageUrl: "3.jpg" },
        { id: 1, name: "test4", calendarServiceImageUrl: "3.jpg" },
        { id: 1, name: "test5", calendarServiceImageUrl: "3.jpg" },
        { id: 1, name: "test6", calendarServiceImageUrl: "3.jpg" }
      ]
    };
  }
  onOptionSelect = option => {
    console.log(option);
  };
  render() {
    const { items, moreItems, isSelectedOption } = this.props;
    const { testItems, serviceTypes, selectedOption } = this.state;
    return (
      <View collapsable={false} style={styles.container}>
        <SelectModal
          ref={ref => (this.otherOptionsModal = ref)}
          style={styles.select}
          options={serviceTypes}
          options={serviceTypes.map(option => ({
            ...option,
            image: API_BASE_URL + option.calendarServiceImageUrl
          }))}
          imageKey="image"
          selectedOption={selectedOption}
          onOptionSelect={value => {
            this.onOptionSelect(value);
          }}
          hideAddNew={true}
        />
        <ScrollView
          ref={ref => (this.scrollView = ref)}
          horizontal={true}
          alwaysBounceHorizontal={false}
          style={{}}
        >
          {testItems.map(option => {
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
          <TouchableWithoutFeedback
            onPress={() => this.otherOptionsModal.openModal()}
          >
            <View collapsable={false} style={styles.option}>
              <View collapsable={false} style={styles.optionIconContainer}>
                <Image
                  style={[styles.optionIcon, { width: 50, height: 30 }]}
                  resizeMode="contain"
                  source={require("../images/categories/others.png")}
                />
              </View>
              <Text weight="Medium" style={styles.optionName}>
                {"other"}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%"
  },
  option: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    width: 100
  },
  optionIconContainer: {
    width: 75,
    height: 75,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: 40
    // marginBottom: 12
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
  },
  select: {
    height: 0,
    overflow: "hidden",
    opacity: 0,
    padding: 0,
    margin: 0
  }
});

export default ItemSelector;
