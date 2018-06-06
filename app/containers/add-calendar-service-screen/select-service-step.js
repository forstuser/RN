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

import { API_BASE_URL, fetchCalendarReferenceData } from "../../api";

import SelectModal from "../../components/select-modal";
import Step from "../../components/step";
import Analytics from "../../analytics";

class SelectServiceTypeStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceTypes: [],
      visibleServiceTypeIds: [],
      selectedOption: null,
      visibleOptions: [],
      showOtherOption: false,
      isLoading: false
    };
  }

  componentDidMount() {
    this.fetchReferenceData();
  }

  fetchReferenceData = async () => {
    this.setState({
      isLoading: true,
      error: null
    });
    try {
      const res = await fetchCalendarReferenceData();
      this.setState(
        {
          serviceTypes: res.items,
          visibleServiceTypeIds: res.default_ids
        },
        () => {
          this.setVisibleOptions();
        }
      );
    } catch (error) {
      this.setState({
        error
      });
    }
    this.setState({
      isLoading: false
    });
  };

  setVisibleOptions = () => {
    const { serviceTypes, visibleServiceTypeIds } = this.state;
    this.setState({
      visibleOptions: visibleServiceTypeIds.map(serviceTypeId => {
        return serviceTypes.find(
          serviceType => serviceType.id == serviceTypeId
        );
      })
    });
  };

  onOptionSelect = option => {
    Analytics.logEvent(Analytics.EVENTS.SELECT_SERVICE_TYPE, {
      type: option.name
    });

    const { selectedOption } = this.state;
    //if clicked on already selected options
    if (selectedOption && selectedOption.id == option.id) {
      return;
    } else {
      this.changeOption(option);
    }
  };

  changeOption = option => {
    if (typeof this.props.onStepDone != "function") {
      return;
    }
    this.props.onStepDone(option);
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
    const {
      serviceTypes,
      visibleOptions,
      selectedOption,
      showOtherOption,
      isLoading
    } = this.state;
    return (
      <Step title="Select Service Type" showLoader={isLoading} {...this.props}>
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
        </View>
        <View collapsable={false} style={styles.selectServiceMsgContainer}>
          <Text weight="Medium" style={styles.selectServiceMsg}>
            Please Select a Type Above
          </Text>
          <View collapsable={false} style={styles.reason}>
            <Text style={styles.reasons} weight="Medium">
              - Mark present and absent days -
            </Text>
            <Text style={styles.reasons} weight="Medium">
              - Know your monthly payouts -
            </Text>
            <Text style={styles.reasons} weight="Medium">
              - Your total outstanding payments -
            </Text>
            <Text style={styles.reasons} weight="Medium">
              - Track your daily household expenses -
            </Text>
          </View>
        </View>
      </Step>
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
    opacity: 0,
    padding: 0,
    margin: 0
  },
  selectServiceMsgContainer: {
    flex: 1,
    marginTop: 30
  },
  selectServiceMsg: {
    fontSize: 20,
    fontWeight: "normal",
    color: colors.mainBlue,
    textAlign: "center",
    marginBottom: 6
  },
  reason: {
    alignSelf: "center"
  },
  reasons: {
    color: colors.secondaryText,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 5
  }
});

export default SelectServiceTypeStep;
