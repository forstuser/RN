import React from "react";
import {
  StyleSheet,
  View,
  BackHandler,
  Animated,
  Easing,
  Dimensions
} from "react-native";

import { initProduct, updateProduct } from "../../api";

import { Text, ScreenContainer } from "../../elements";

import LoadingOverlay from "../../components/loading-overlay";
import { showSnackbar } from "../snackbar";

import SelectExpenseTypeStep from "./steps/select-expense-type-step";
import SelectCategoryStep from "./steps/select-category-step";
import SelectBrandStep from "./steps/select-brand-step";
import SelectPurchaseDateStep from "./steps/select-purchase-date-step";

import {
  SCREENS,
  EXPENSE_TYPES,
  MAIN_CATEGORY_IDS,
  CATEGORY_IDS
} from "../../constants";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

class AddProductScreen extends React.Component {
  static navigatorStyle = {
    navBarHidden: true,
    tabBarHidden: true
    // disabledBackGesture: true
  };
  state = {
    activeStepIndex: 0,
    steps: [],
    mainCategoryId: null,
    category: null,
    product: null,
    isLoading: false,
    categoryReferenceData: null,
    renewalTypes: [],
    warrantyProviders: [],
    insuranceProviders: [],
    brands: [],
    categoryForms: [],
    subCategories: []
  };

  stepsContainerPositionX = new Animated.Value(-SCREEN_WIDTH);

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case "willAppear":
        this.backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          this.handleBackPress
        );
        break;
      default:
        break;
    }
  }

  handleBackPress = () => {
    // to be implemented
    return false;
    return true;
  };

  componentDidMount() {
    this.pushStep(
      <SelectExpenseTypeStep
        onBackPress={this.close}
        onExpenseTypePress={this.chooseExpenseType}
      />
    );
  }

  pushStep(step) {
    const steps = [...this.state.steps];
    steps.push(step);
    this.setState(() => ({ steps }));
  }

  close = () => {
    this.props.navigator.pop();
  };

  nextStep = () => {
    this.setState({ activeStepIndex: this.state.activeStepIndex + 1 });
    this.stepsContainerPositionX.setValue(0);
    Animated.timing(this.stepsContainerPositionX, {
      toValue: -SCREEN_WIDTH,
      duration: 200,
      useNativeDriver: true
    }).start();
  };

  previousStep = () => {
    this.setState({ activeStepIndex: this.state.activeStepIndex - 1 });
    this.stepsContainerPositionX.setValue(-SCREEN_WIDTH * 2);
    Animated.timing(this.stepsContainerPositionX, {
      toValue: -SCREEN_WIDTH,
      duration: 200,
      useNativeDriver: true
    }).start();
  };

  chooseExpenseType = type => {
    switch (type) {
      case EXPENSE_TYPES.AUTOMOBILE:
        this.setState({ mainCategoryId: MAIN_CATEGORY_IDS.AUTOMOBILE });
        this.pushStep(
          <SelectCategoryStep
            mainCategoryId={MAIN_CATEGORY_IDS.AUTOMOBILE}
            onBackPress={this.previousStep}
            onCategorySelect={this.onCategorySelect}
          />
        );
    }
    this.nextStep();
  };

  onCategorySelect = category => {
    const healthcareFormType = this.props.healthcareFormType;
    if (healthcareFormType == "medical_docs") {
      if (category.id == CATEGORY_IDS.HEALTHCARE.INSURANCE) {
        this.setState({
          visibleModules: {
            healthcareInsuranceForm: true
          }
        });
      } else {
        this.setState({
          visibleModules: {
            healthcareMedicalDocuments: true
          }
        });
      }
    }
    if (healthcareFormType == "healthcare_expense") {
      this.setState(
        {
          category: { id: CATEGORY_IDS.HEALTHCARE.EXPENSE, name: "Expenses" },
          subCategoryId: category.id
        },
        () => {
          this.initProduct();
        }
      );
    } else {
      this.setState({ category }, () => {
        this.initProduct();
      });
    }
  };

  initProduct = async () => {
    this.setState({ isLoading: true, product: null });
    const { mainCategoryId, category } = this.state;
    try {
      const res = await initProduct(mainCategoryId, category.id);
      this.setState(
        {
          product: res.product,
          isLoading: false,
          categoryReferenceData: res.categories[0],
          renewalTypes: res.renewalTypes || [],
          warrantyProviders: res.categories[0].warrantyProviders,
          insuranceProviders: res.categories[0].insuranceProviders,
          brands: res.categories[0].brands,
          categoryForms: res.categories[0].categoryForms,
          subCategories: res.categories[0].subCategories
        },
        () => {
          switch (mainCategoryId) {
            case MAIN_CATEGORY_IDS.AUTOMOBILE:
            case MAIN_CATEGORY_IDS.ELECTRONICS:
            case MAIN_CATEGORY_IDS.FASHION:
              this.pushStep(
                <SelectBrandStep
                  product={this.state.product}
                  mainCategoryId={mainCategoryId}
                  category={category}
                  brands={this.state.brands}
                  onBrandStepDone={this.onBrandStepDone}
                  onBackPress={this.previousStep}
                />
              );
          }
          this.nextStep();
        }
      );
    } catch (e) {
      console.log("error: ", e);
      this.setState({
        isLoading: false
      });
      showSnackbar({
        text: e.message
      });
    }
  };

  onBrandStepDone = product => {
    this.setState({ product });
    const { mainCategoryId, category } = this.state;
    this.pushStep(
      <SelectPurchaseDateStep
        product={this.state.product}
        mainCategoryId={mainCategoryId}
        category={category}
        onBrandStepDone={this.onBrandStepDone}
        onBackPress={this.previousStep}
      />
    );
    this.nextStep();
  };

  render() {
    const { steps, activeStepIndex, isLoading } = this.state;

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
      <ScreenContainer style={styles.container}>
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
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0
  },
  stepsContainer: {
    flex: 1,
    flexDirection: "row"
  },
  stepContainer: {
    width: SCREEN_WIDTH
  }
});

export default AddProductScreen;
