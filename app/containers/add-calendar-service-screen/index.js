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
import {
  createCalendarItem,
  addCalendarItemCalculationDetail
} from "../../api";

import { Text, ScreenContainer } from "../../elements";
import Analytics from "../../analytics";

import LoadingOverlay from "../../components/loading-overlay";
import { showSnackbar } from "../snackbar";

import SelectServiceStep from "./select-service-step";
import SelectStartingDateStep from "./select-starting-date-step";
import QuantityStep from "./quantity-step";
import UnitPriceStep from "./unit-price-step";
import SelectWeekdaysStep from "./select-weekdays-step";
import WagesCycleStep from "./wages-cycle-step";

import { SCREENS, WAGES_CYCLE, CALENDAR_WAGES_TYPE } from "../../constants";
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
    wagesCycle: WAGES_CYCLE.DAILY,
    effectiveDate: null,
    quantity: "",
    unitType: null,
    unitPrice: "",
    selectedDays: [1, 2, 3, 4, 5, 6, 7],
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
          <SelectStartingDateStep
            onBackPress={this.previousStep}
            onStepDone={this.onStartingDateStepDone}
          />
        );
      }
    );
  };

  pushQuantityStep = () => {
    this.pushStep(
      <QuantityStep
        onBackPress={this.previousStep}
        skippable={true}
        serviceType={this.state.serviceType}
        onStepDone={this.onQuantityStepDone}
        onSkipPress={() =>
          this.onQuantityStepDone({ quantity: "", unitType: null })
        }
      />
    );
  };

  createItem = async () => {
    this.setState({
      isLoading: true
    });

    const { serviceType, effectiveDate, wagesCycle } = this.state;
    try {
      const res = await createCalendarItem({
        productName: serviceType.name,
        serviceTypeId: serviceType.id,
        effectiveDate: effectiveDate,
        wagesType: wagesCycle
      });
      this.setState(
        {
          item: res.calendar_item
        },
        () => {
          if (serviceType.wages_type == CALENDAR_WAGES_TYPE.PRODUCT) {
            this.pushQuantityStep();
          } else {
            this.pushUnitPriceStep();
          }
        }
      );
    } catch (e) {
      showSnackbar({
        text: e.message
      });
    }
    this.setState({
      isLoading: false
    });
  };

  onStartingDateStepDone = date => {
    const { serviceType } = this.state;
    this.setState(
      {
        effectiveDate: date
      },
      () => {
        if (serviceType.wages_type == CALENDAR_WAGES_TYPE.PRODUCT) {
          this.createItem();
        } else {
          setTimeout(() => {
            this.pushStep(
              <WagesCycleStep
                onBackPress={this.previousStep}
                serviceType={serviceType}
                onStepDone={this.onWagesCycleStepDone}
              />
            );
          }, 200);
        }
      }
    );
  };

  onWagesCycleStepDone = wagesCycle => {
    this.setState(
      {
        wagesCycle
      },
      () => {
        this.createItem();
      }
    );
  };

  editCalculationDetails = async () => {
    const {
      item,
      effectiveDate,
      quantity,
      unitType,
      unitPrice,
      selectedDays
    } = this.state;

    this.setState({
      isLoading: true
    });

    try {
      await addCalendarItemCalculationDetail({
        itemId: item.id,
        effectiveDate: effectiveDate,
        unitType: unitType ? unitType.id : null,
        quantity: quantity || undefined,
        unitPrice: unitPrice,
        selectedDays: selectedDays
      });
      console.log("calculation details saved");
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({
        isLoading: false
      });
    }
  };

  pushUnitPriceStep = () => {
    this.pushStep(
      <UnitPriceStep
        onBackPress={this.previousStep}
        serviceType={this.state.serviceType}
        unitType={this.state.unitType}
        skippable={true}
        onStepDone={this.onUnitPriceStepDone}
        onSkipPress={this.onUnitPriceStepDone}
      />
    );
  };

  onQuantityStepDone = ({ quantity, unitType }) => {
    this.setState(
      {
        quantity,
        unitType
      },
      async () => {
        await this.editCalculationDetails();
        this.pushUnitPriceStep();
      }
    );
  };

  onUnitPriceStepDone = unitPrice => {
    this.setState({ unitPrice }, async () => {
      await this.editCalculationDetails();
      this.pushStep(
        <SelectWeekdaysStep
          onBackPress={this.previousStep}
          selectedDays={this.state.selectedDays}
          onStepDone={this.onSelectedDaysStepDone}
          skippable={true}
          onSkipPress={this.onSelectedDaysStepDone}
        />
      );
    });
  };

  onSelectedDaysStepDone = selectedDays => {
    this.setState({ selectedDays }, async () => {
      await this.editCalculationDetails();
      this.props.navigator.pop();
    });
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
      <View collapsable={false} style={styles.container}>
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
          <View collapsable={false} style={styles.stepContainer}>{previousStep}</View>
          <View collapsable={false} style={styles.stepContainer}>{currentStep}</View>
          <View collapsable={false} style={styles.stepContainer}>{nextStep}</View>
        </Animated.View>
        {numberOfStepsToShowInFooter > 0 ? (
          <View collapsable={false} style={styles.stepIndicatorsAndText}>
            <View collapsable={false} style={styles.stepIndicators}>
              {_.range(numberOfStepsToShowInFooter).map((item, index) => {
                activeStepIndicatorIndex =
                  activeStepIndex -
                  (category.id != CATEGORY_IDS.PERSONAL.VISITING_CARD ? 2 : 1);
                idDoneStep = index <= activeStepIndicatorIndex;
                isActiveStep = index == activeStepIndicatorIndex;
                return [
                  index > 0 && (
                    <View collapsable={false}
                      style={[
                        styles.stepIndicatorLine,
                        idDoneStep ? styles.doneStepIndicatorLine : {}
                      ]}
                    />
                  ),
                  <View collapsable={false}
                    style={[
                      styles.stepIndicatorDot,
                      idDoneStep ? styles.doneStepIndicatorDot : {},
                      isActiveStep ? styles.activeStepIndicatorDot : {}
                    ]}
                  >
                    {isActiveStep ? (
                      <View collapsable={false} style={styles.activeStepIndicatorDotInnerRing} />
                    ) : (
                        <View collapsable={false} />
                      )}
                  </View>
                ];
              })}
            </View>
          </View>
        ) : (
            <View collapsable={false} />
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
