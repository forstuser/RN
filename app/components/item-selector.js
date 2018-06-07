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
      selectedOption: null
    };
  }
  onItemSelect = item => {
    this.props.onItemSelect(item);
  };
  render() {
    const { items, moreItems, selectedItem } = this.props;
    return (
      <View collapsable={false} style={styles.container}>
        <SelectModal
          ref={ref => (this.otherOptionsModal = ref)}
          style={styles.select}
          options={moreItems}
          selectedOption={selectedItem}
          onOptionSelect={value => {
            this.onItemSelect(value);
          }}
          hideAddNew={true}
        />
        <ScrollView
          ref={ref => (this.scrollView = ref)}
          horizontal={true}
          alwaysBounceHorizontal={false}
          style={{}}
        >
          {items.map((option, index) => {
            const isSelectedItem =
              selectedItem &&
              selectedItem.type == option.type &&
              selectedItem.id == option.id;

            return (
              <TouchableWithoutFeedback
                onPress={() => this.onItemSelect(option)}
                key={index}
              >
                <View collapsable={false} style={styles.option}>
                  <View
                    collapsable={false}
                    style={[
                      styles.optionIconContainer,
                      isSelectedItem ? styles.selectedOptionIconContainer : {}
                    ]}
                  >
                    <Image
                      style={[
                        styles.optionIcon,
                        isSelectedItem ? styles.selectedOptionIcon : {}
                      ]}
                      resizeMode="contain"
                      source={{
                        uri: API_BASE_URL + option.imageUrl
                      }}
                    />
                  </View>
                  <Text
                    weight="Medium"
                    style={[
                      styles.optionName,
                      isSelectedItem ? styles.selectedOptionName : {}
                    ]}
                    numberOfLines={1}
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
                  style={[styles.optionIcon]}
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
    width: "100%",
    height: 100,
    alignItems: "center",
    borderBottomColor: colors.lighterText,
    borderBottomWidth: 1
  },
  option: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    width: 100
  },
  optionIconContainer: {
    width: 57,
    height: 57,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 40,
    borderWidth: 1,
    borderColor: colors.lighterText
  },
  selectedOptionIconContainer: {
    borderColor: colors.mainBlue
  },
  optionIcon: {
    width: 50,
    height: 38,
    opacity: 1,
    borderRadius: 25,
    overflow: "hidden"
  },
  selectedOptionIcon: {
    opacity: 1
  },
  optionName: {
    color: "#000",
    fontSize: 10,
    opacity: 1,
    textAlign: "center",
    marginVertical: 7
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
