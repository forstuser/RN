import React from "react";
import {
  StyleSheet,
  View,
  BackHandler,
  Animated,
  Easing,
  Dimensions
} from "react-native";
import _ from "lodash";
import { createCalendarItem } from "../../api";

import { Text, ScreenContainer } from "../../elements";
import Analytics from "../../analytics";

import LoadingOverlay from "../../components/loading-overlay";
import { showSnackbar } from "../snackbar";

import SelectServiceStep from "./select-service-step";
import SelectStartingDateStep from "./select-starting-date-step";

import {
  SCREENS,
  EXPENSE_TYPES,
  MAIN_CATEGORY_IDS,
  CATEGORY_IDS
} from "../../constants";
import { defaultStyles, colors } from "../../theme";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

class AddCalendarServiceScreen extends React.Component {
  static navigatorStyle = {
    navBarHidden: true,
    tabBarHidden: true
    // disabledBackGesture: true
  };
  state = {
    activeStepIndex: 0,
    steps: [],
    numberOfStepsToShowInFooter: 0,
    serviceType: null,
    item: null,
    isLoading: false
  };

  stepsContainerPositionX = new Animated.Value(-SCREEN_WIDTH);

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  onNavigatorEvent = event => {
    switch (event.id) {
      case "backPress":
        this.previousStep();
      default:
        break;
    }
  };

  componentDidMount() {
    this.pushStep(
      <SelectServiceStep
        onBackPress={this.previousStep}
        onStepDone={this.onServiceTypeStepDone}
      />,
      false
    );
  }

  goToStep = step => {
    const steps = [...this.state.steps];
    steps.length = step + 1;
    let newState = { steps, activeStepIndex: step };
    if (step < 2) {
      newState = {
        ...newState,
        serviceType: null
      };
    }
    this.setState(() => newState);
  };

  close = () => {
    this.props.navigator.pop();
  };

  previousStep = () => {
    const { activeStepIndex, category } = this.state;

    if (activeStepIndex == 0) this.close();

    const newState = { activeStepIndex: activeStepIndex - 1 };
    this.setState(newState);

    this.stepsContainerPositionX.setValue(-SCREEN_WIDTH * 2);
    Animated.timing(this.stepsContainerPositionX, {
      toValue: -SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: true
    }).start();
    const steps = [...this.state.steps];
    steps.pop();
    this.setState(() => ({ steps }));

    console.log("current state: ", this.state);
  };

  nextStep = () => {
    this.setState({ activeStepIndex: this.state.activeStepIndex + 1 });
    this.stepsContainerPositionX.setValue(0);
    Animated.timing(this.stepsContainerPositionX, {
      toValue: -SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  pushStep(step, pushToNext = true) {
    const steps = [...this.state.steps];
    steps.push(step);
    this.setState({ steps }, () => {
      if (pushToNext) this.nextStep();
    });
  }

  onServiceTypeStepDone = serviceType => {
    this.setState(
      {
        serviceType
      },
      () => {
        this.pushStep(
          <SelectStartingDateStep onStepDone={this.onStartingDateStepDone} />
        );
      }
    );
  };

  onStartingDateStepDone = async date => {
    const { serviceType } = this.state;

    this.setState({
      isLoading: true
    });

    Analytics.logEvent(Analytics.EVENTS.ADD_ADD_ATTENDANCE_ITEM);
    try {
      const res = await createCalendarItem({
        serviceTypeId: serviceType.id,
        effectiveDate: date
      });
      console.log("res: ", res);
    } catch (e) {
      showSnackbar({
        text: e.message
      });
    }
    this.setState({
      isLoading: false
    });
  };

  createCalendarItem = async () => {
    const { serviceType } = this.state;

    if (!name) {
      return showSnackbar({
        text: "Please enter name"
      });
    }
    if (unitPrice && unitPrice < 0) {
      returnshowSnackbar({
        text: "Amount can't be less than zero"
      });
    }
    if (!startingDate) {
      return showSnackbar({
        text: "Please select a starting date"
      });
    }
    if (selectedDays.length == 0) {
      return showSnackbar({
        text: "Please select week days for this service"
      });
    }

    this.setState({
      isFetchingServiceTypes: true
    });

    let actualQuantity = quantity;
    if (
      (selectedUnitType.id == UNIT_TYPES.GRAM.id ||
        selectedUnitType.id == UNIT_TYPES.MILLILITRE.id) &&
      quantity
    ) {
      actualQuantity = quantity / 1000;
    }

    let quantityToSend = actualQuantity;
    if (
      !quantityToSend &&
      selectedServiceType.wages_type != CALENDAR_WAGES_TYPE.PRODUCT
    ) {
      quantityToSend = null;
    } else if (
      !quantityToSend &&
      selectedServiceType.wages_type == CALENDAR_WAGES_TYPE.PRODUCT
    ) {
      quantityToSend = 0;
    }
    Analytics.logEvent(Analytics.EVENTS.ADD_ADD_ATTENDANCE_ITEM);
    try {
      const res = await createCalendarItem({
        serviceTypeId: selectedServiceType.id,
        productName: name,
        providerName: providerName,
        wagesType: wagesType,
        unitType: actualSelectedUnitType.id,
        unitPrice: unitPrice,
        quantity: quantityToSend,
        effectiveDate: startingDate,
        selectedDays: selectedDays
      });
      this.props.navigator.pop();
    } catch (e) {
      showSnackbar({
        text: e.message
      });
      this.setState({
        isFetchingServiceTypes: false
      });
    }
  };

  onInsuranceEffectiveDateStepDone = () => {
    this.finishModal.show();
  };

  render() {
    const {
      serviceType,
      steps,
      activeStepIndex,
      isLoading,
      numberOfStepsToShowInFooter
    } = this.state;

    let nextStep = null;
    let currentStep = null;
    let previousStep = null;

    steps.forEach((step, index) => {
      if (index == activeStepIndex) {
        currentStep = step;
      } else if (index == activeStepIndex - 1) {
        previousStep = steps[activeStepIndex - 1];
      } else if (index == activeStepIndex + 1) {
        nextStep = steps[activeStepIndex + 1];
      }
    });

    return (
      <View style={styles.container}>
        <LoadingOverlay visible={isLoading} />
        <Animated.View
          style={[
            styles.stepsContainer,
            {
              transform: [
                {
                  translateX: this.stepsContainerPositionX
                }
              ]
            }
          ]}
        >
          <View style={styles.stepContainer}>{previousStep}</View>
          <View style={styles.stepContainer}>{currentStep}</View>
          <View style={styles.stepContainer}>{nextStep}</View>
        </Animated.View>
        {numberOfStepsToShowInFooter > 0 && (
          <View style={styles.stepIndicatorsAndText}>
            <View style={styles.stepIndicators}>
              {_.range(numberOfStepsToShowInFooter).map((item, index) => {
                activeStepIndicatorIndex =
                  activeStepIndex -
                  (category.id != CATEGORY_IDS.PERSONAL.VISITING_CARD ? 2 : 1);
                idDoneStep = index <= activeStepIndicatorIndex;
                isActiveStep = index == activeStepIndicatorIndex;
                return [
                  index > 0 && (
                    <View
                      style={[
                        styles.stepIndicatorLine,
                        idDoneStep ? styles.doneStepIndicatorLine : {}
                      ]}
                    />
                  ),
                  <View
                    style={[
                      styles.stepIndicatorDot,
                      idDoneStep ? styles.doneStepIndicatorDot : {},
                      isActiveStep ? styles.activeStepIndicatorDot : {}
                    ]}
                  >
                    {isActiveStep && (
                      <View style={styles.activeStepIndicatorDotInnerRing} />
                    )}
                  </View>
                ];
              })}
            </View>
          </View>
        )}
        {/* <FinishModal
          ref={ref => this.finishModal = ref}
          title="Product added to your eHome."
          mainCategoryId={mainCategoryId}
          category={category}
          productId={product ? product.id : null}
          navigator={this.props.navigator}
          goToStep={this.goToStep}
        /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flex: 1
  },
  stepsContainer: {
    flex: 1,
    flexDirection: "row",
    width: SCREEN_WIDTH * 3
  },
  stepContainer: {
    width: SCREEN_WIDTH
  },
  stepIndicatorsAndText: {
    height: 40,
    paddingHorizontal: 20,
    paddingVertical: 5
  },
  stepIndicators: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1
  },
  stepIndicatorLine: {
    height: 2,
    backgroundColor: "#eee",
    flex: 1
  },
  doneStepIndicatorLine: {
    backgroundColor: colors.mainBlue
  },
  stepIndicatorDot: {
    width: 15,
    height: 15,
    backgroundColor: "#eee",
    borderRadius: 10
  },
  activeStepIndicatorDot: {
    width: 20,
    height: 20,
    backgroundColor: colors.mainBlue,
    alignItems: "center",
    justifyContent: "center"
  },
  activeStepIndicatorDotInnerRing: {
    width: 15,
    height: 15,
    backgroundColor: colors.mainBlue,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fff"
  },
  doneStepIndicatorDot: {
    backgroundColor: colors.success
  }
});

export default AddCalendarServiceScreen;
