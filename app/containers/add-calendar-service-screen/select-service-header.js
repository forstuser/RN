import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert
} from "react-native";
import I18n from "../../i18n";
import { MAIN_CATEGORY_IDS } from "../../constants";
import { Text, Image } from "../../elements";
import { colors } from "../../theme";

import { getReferenceDataCategories, API_BASE_URL } from "../../api";

import SelectModal from "../../components/select-modal";
import Analytics from "../../analytics";

class SelectCategoryHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: null,
      visibleOptions: [],
      showOtherOption: false
    };
  }

  componentDidMount() {
    this.setVisibleOptionsFromProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setVisibleOptionsFromProps(nextProps);
  }

  setVisibleOptionsFromProps = props => {
    const { serviceTypes, visibleServiceTypeIds } = props;
    this.setState({
      visibleOptions: visibleServiceTypeIds.map(serviceTypeId => {
        return serviceTypes.find(
          serviceType => serviceType.id == serviceTypeId
        );
      })
    });
  };

  onOptionSelect = option => {
    Analytics.logEvent(
      Analytics.EVENTS.CLICK_CALENDAR_SERVICE_TYPE_ +
        option.name.replace(/\s/g, "")
    );
    const selectedOption = this.props.selectedOption;
    //if clicked on already selected options
    if (selectedOption && selectedOption.id == option.id) {
      return;
    } else {
      this.changeOption(option);
    }
  };

  changeOption = option => {
    if (typeof this.props.onServiceTypeSelect != "function") {
      return;
    }
    this.props.onServiceTypeSelect(option);
    this.setState(
      {
        selectedOption: option
      },
      () => {
        const visibleIds = this.state.visibleOptions.map(option => option.id);
        const idx = visibleIds.indexOf(option.id);
        if (idx > -1) {
          this.scrollView.scrollTo({ x: idx * 70, animated: true });
          this.setState({
            showOtherOption: false
          });
        } else {
          this.setState(
            {
              showOtherOption: true
            },
            () => this.scrollView.scrollToEnd()
          );
        }
      }
    );
  };

  render() {
    const { serviceTypes } = this.props;
    const { visibleOptions, selectedOption, showOtherOption } = this.state;

    return (
      <View collapsable={false} style={styles.container}>
        <Text weight="Medium" style={styles.title}>
          {I18n.t("add_edit_calendar_service_screen_title_slider")}
        </Text>
        <ScrollView
          ref={ref => (this.scrollView = ref)}
          horizontal={true}           showsHorizontalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          alwaysBounceHorizontal={false}
        >
          {visibleOptions.map(option => {
            const isSelectedOption =
              selectedOption && selectedOption.id == option.id;
            return (
              <TouchableWithoutFeedback
                onPress={() => this.onOptionSelect(option)}
              >
                <View collapsable={false} style={styles.option}>
                  <View
                    collapsable={false}
                    style={[
                      styles.optionIconContainer,
                      isSelectedOption ? styles.selectedOptionIconContainer : {}
                    ]}
                  >
                    <Image
                      style={[
                        styles.optionIcon,
                        isSelectedOption ? styles.selectedOptionIcon : {}
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
                      isSelectedOption ? styles.selectedOptionName : {}
                    ]}
                  >
                    {option.name}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            );
          })}
          {selectedOption && showOtherOption ? (
            <View collapsable={false} style={styles.option}>
              <View
                collapsable={false}
                style={[
                  styles.optionIconContainer,
                  styles.selectedOptionIconContainer
                ]}
              >
                <Image
                  style={[styles.optionIconForOther]}
                  resizeMode="contain"
                  source={{
                    uri: API_BASE_URL + selectedOption.calendarServiceImageUrl
                  }}
                />
              </View>
              <Text
                weight="Medium"
                style={[styles.optionName, styles.selectedOptionName]}
              >
                {selectedOption.name}
              </Text>
            </View>
          ) : (
            <View collapsable={false} />
          )}

          <TouchableWithoutFeedback
            onPress={() => this.otherOptionsModal.openModal()}
          >
            <View collapsable={false} style={styles.option}>
              <View collapsable={false} style={styles.optionIconContainer}>
                <Image
                  style={[styles.optionIcon, { width: 50, height: 30 }]}
                  resizeMode="contain"
                  source={require("../../images/categories/others.png")}
                />
              </View>
              <Text weight="Medium" style={styles.optionName}>
                {I18n.t("other")}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    minWidth: "100%",
    alignItems: "center",
    paddingTop: 16,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
    borderColor: "#eee",
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  title: {
    fontSize: 14,
    color: colors.mainText,
    marginBottom: 16
  },
  option: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
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
  optionIconForOther: {
    width: 50,
    height: 30,
    opacity: 1
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
    opacity: 0
  }
});

export default SelectCategoryHeader;
