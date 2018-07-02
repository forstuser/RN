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
import { initProduct, updateProduct } from "../../api";

import { Text, ScreenContainer } from "../../elements";

import LoadingOverlay from "../../components/loading-overlay";
import { showSnackbar } from "../../utils/snackbar";

import SelectExpenseTypeStep from "./steps/select-expense-type-step";
import SelectCategoryStep from "./steps/select-category-step";
import SelectBrandStep from "./steps/select-brand-step";
import SelectSubCategoryStep from "./steps/select-sub-category-step";
import SelectModelStep from "./steps/select-model-step";
import SelectPurchaseDateStep from "./steps/select-purchase-date-step";
import SelectInsuranceProviderStep from "./steps/select-insurance-provider-step";
import SelectInsuranceEffectiveDateStep from "./steps/select-insurance-effective-date-step";
import UploadBillStep from "./steps/upload-bill-step";
import AddAmountStep from "./steps/add-amount-step";
import AddNameStep from "./steps/add-name-step";
import RepairStep from "./steps/repair-step";
import FinishModal from "./finish-modal";

import {
  SCREENS,
  EXPENSE_TYPES,
  MAIN_CATEGORY_IDS,
  CATEGORY_IDS
} from "../../constants";
import { defaultStyles, colors } from "../../theme";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

class AddProductScreen extends React.Component {
  static navigationOptions = {
    header: null
  };
  state = {
    activeStepIndex: 0,
    steps: [],
    numberOfStepsToShowInFooter: 0,
    expenseType: null,
    mainCategoryId: null,
    category: null,
    subCategoryId: null,
    brand: null,
    product: null,
    insuranceProviders: [],
    subCategories: [],
    isLoading: false,
    popOnDoItLater: false
  };

  stepsContainerPositionX = new Animated.Value(-SCREEN_WIDTH);

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.previousStep);
    const expenseType = this.props.navigation.getParam("expenseType", null);
    if (expenseType) {
      this.setState({ popOnDoItLater: true });
      this.chooseExpenseType(expenseType, false);
    } else {
      this.pushStep(
        <SelectExpenseTypeStep
          onBackPress={this.previousStep}
          onExpenseTypePress={this.chooseExpenseType}
        />,
        false
      );
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.previousStep);
  }

  startOver = () => {
    this.setState({
      steps: [
        <SelectExpenseTypeStep
          onBackPress={this.previousStep}
          onExpenseTypePress={this.chooseExpenseType}
        />
      ],
      activeStepIndex: 0,
      category: null,
      subCategoryId: null,
      brand: null,
      product: null,
      insuranceProviders: [],
      subCategories: [],
      numberOfStepsToShowInFooter: 0
    });
  };

  goToStep = step => {
    const steps = [...this.state.steps];
    steps.length = step + 1;
    let newState = { steps, activeStepIndex: step };
    if (step < 2) {
      newState = {
        ...newState,
        category: null,
        subCategoryId: null,
        brand: null,
        product: null,
        insuranceProviders: [],
        subCategories: [],
        numberOfStepsToShowInFooter: 0
      };
    }
    this.setState(() => newState);
  };

  previousStep = () => {
    const { activeStepIndex, category } = this.state;

    if (activeStepIndex == 0) {
      this.props.navigation.goBack();
      return true;
    }

    const newState = { activeStepIndex: activeStepIndex - 1 };
    if (
      activeStepIndex <=
      (category && category.id == CATEGORY_IDS.PERSONAL.VISITING_CARD ? 1 : 2)
    ) {
      newState.numberOfStepsToShowInFooter = 0;
      newState.category = null;
      newState.product = null;
    }
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
    return true;
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
      if (pushToNext && steps.length > 1) this.nextStep();
    });
  }

  pushCategoryStep = (pushToNext = true) => {
    const category = this.props.navigation.getParam("category", null);

    if (category) {
      this.onCategorySelect({ category, pushToNext });
    } else {
      const { expenseType, mainCategoryId, product } = this.state;
      this.pushStep(
        <SelectCategoryStep
          mainCategoryId={mainCategoryId}
          product={product}
          onBackPress={this.previousStep}
          onCategorySelect={this.onCategorySelect}
          expenseType={expenseType}
        />,
        pushToNext
      );
    }
  };

  pushPurchaseDateStep = () => {
    const { mainCategoryId, category, product, subCategoryId } = this.state;
    this.pushStep(
      <SelectPurchaseDateStep
        product={product}
        mainCategoryId={mainCategoryId}
        category={category}
        subCategoryId={subCategoryId}
        onPurchaseDateStepDone={this.onPurchaseDateStepDone}
        skippable={true}
        onBackPress={this.previousStep}
        onSkipPress={this.onPurchaseDateStepDone}
      />
    );
  };

  pushBrandStep = (skippable = false) => {
    const { mainCategoryId, category, product } = this.state;
    this.pushStep(
      <SelectBrandStep
        product={product}
        mainCategoryId={mainCategoryId}
        category={category}
        onBrandStepDone={this.onBrandStepDone}
        onSkipPress={this.onBrandStepDone}
        onBackPress={this.previousStep}
        skippable={skippable}
      />
    );
  };

  pushAmountStep = (skippable = false) => {
    const { mainCategoryId, category, product, subCategoryId } = this.state;
    this.pushStep(
      <AddAmountStep
        product={product}
        mainCategoryId={mainCategoryId}
        category={category}
        subCategoryId={subCategoryId}
        onStepDone={this.onAmountStepDone}
        onSkipPress={this.onAmountStepDone}
        onBackPress={this.previousStep}
        skippable={skippable}
      />
    );
  };

  pushUploadBillStep = (skippable = false, pushToNextStep = true) => {
    const { mainCategoryId, category, product } = this.state;

    this.pushStep(
      <UploadBillStep
        product={product}
        mainCategoryId={mainCategoryId}
        category={category}
        onUploadBillStepDone={this.onUploadBillStepDone}
        navigation={this.props.navigation}
        onBackPress={this.previousStep}
        skippable={skippable}
        onSkipPress={() => this.finishModal.show()}
      />,
      pushToNextStep
    );
  };

  pushSubCategoryStep = (skippable = false) => {
    const {
      mainCategoryId,
      category,
      product,
      subCategories,
      subCategoryId
    } = this.state;
    this.pushStep(
      <SelectSubCategoryStep
        product={product}
        mainCategoryId={mainCategoryId}
        category={category}
        subCategories={subCategories}
        subCategoryId={subCategoryId}
        onSubCategoryStepDone={this.onSubCategoryStepDone}
        onSkipPress={this.onSubCategoryStepDone}
        onBackPress={this.previousStep}
        skippable={skippable}
      />
    );
  };

  pushInsuranceProviderStep = (skippable = false) => {
    const {
      mainCategoryId,
      category,
      product,
      insuranceProviders
    } = this.state;
    this.pushStep(
      <SelectInsuranceProviderStep
        product={product}
        mainCategoryId={mainCategoryId}
        category={category}
        providers={insuranceProviders}
        onInsuranceProviderStepDone={this.onInsuranceProviderStepDone}
        onBackPress={this.previousStep}
        skippable={skippable}
        onSkipPress={() => this.finishModal.show()}
      />
    );
  };

  pushNameStep = (skippable = false) => {
    const { mainCategoryId, category, product } = this.state;
    this.pushStep(
      <AddNameStep
        product={product}
        mainCategoryId={mainCategoryId}
        category={category}
        onStepDone={this.onNameStepDone}
        onBackPress={this.previousStep}
        skippable={skippable}
        onSkipPress={this.onNameStepDone}
      />
    );
  };

  initProduct = async pushToNextStep => {
    this.setState({ isLoading: true, product: null });
    const {
      mainCategoryId,
      category,
      subCategoryId,
      subCategories
    } = this.state;
    try {
      const res = await initProduct(mainCategoryId, category.id);
      this.setState(
        {
          product: res.product,
          // categoryReferenceData: res.categories[0],
          // renewalTypes: res.renewalTypes || [],
          // warrantyProviders: res.categories[0].warrantyProviders,
          insuranceProviders: res.categories[0].insuranceProviders,
          // brands: res.categories[0].brands,
          // categoryForms: res.categories[0].categoryForms,
          subCategories: res.categories[0].subCategories,
          isLoading: false
        },
        () => {
          switch (mainCategoryId) {
            case MAIN_CATEGORY_IDS.AUTOMOBILE:
              if (category.id != CATEGORY_IDS.AUTOMOBILE.CYCLE) {
                this.setState({
                  numberOfStepsToShowInFooter: 5
                });
              } else {
                this.setState({
                  numberOfStepsToShowInFooter: 4
                });
              }
              this.pushBrandStep();
              break;
            case MAIN_CATEGORY_IDS.ELECTRONICS:
              this.setState({
                numberOfStepsToShowInFooter: 4
              });
              this.pushBrandStep();
              break;
            case MAIN_CATEGORY_IDS.FASHION:
              this.setState({
                numberOfStepsToShowInFooter: 4
              });
              this.pushBrandStep();
              break;
            case MAIN_CATEGORY_IDS.FURNITURE:
              if (
                category.id == CATEGORY_IDS.FURNITURE.FURNITURE ||
                category.id == CATEGORY_IDS.FURNITURE.KITCHEN_UTENSILS
              ) {
                this.setState({
                  numberOfStepsToShowInFooter: 4
                });
                this.pushSubCategoryStep();
              } else {
                this.setState({
                  numberOfStepsToShowInFooter: 3
                });
                this.pushBrandStep();
              }
              break;
            case MAIN_CATEGORY_IDS.TRAVEL:
            case MAIN_CATEGORY_IDS.SERVICES:
              this.setState({
                numberOfStepsToShowInFooter: 3
              });
              this.pushAmountStep();
              break;
            case MAIN_CATEGORY_IDS.HOUSEHOLD:
              if (subCategories.length > 0) {
                this.setState({
                  numberOfStepsToShowInFooter: 4
                });
                this.pushSubCategoryStep(true);
              } else {
                this.setState({
                  numberOfStepsToShowInFooter: 3
                });
                this.onSubCategoryStepDone();
              }
              break;
            case MAIN_CATEGORY_IDS.HEALTHCARE:
              if (category.id == CATEGORY_IDS.HEALTHCARE.MEDICAL_DOC) {
                this.setState({
                  numberOfStepsToShowInFooter: 3
                });
                this.pushUploadBillStep();
              } else if (category.id == CATEGORY_IDS.HEALTHCARE.INSURANCE) {
                this.setState({
                  numberOfStepsToShowInFooter: 3
                });
                this.pushSubCategoryStep();
              } else {
                this.setState({
                  numberOfStepsToShowInFooter: 3
                });
                this.pushAmountStep();
              }
              break;
            case MAIN_CATEGORY_IDS.PERSONAL:
              if (category.id == CATEGORY_IDS.PERSONAL.VISITING_CARD) {
                this.pushUploadBillStep(false, pushToNextStep);
                this.setState({
                  numberOfStepsToShowInFooter: 2
                });
              } else {
                this.setState({
                  numberOfStepsToShowInFooter: 2
                });
                this.pushUploadBillStep();
              }
          }
        }
      );
    } catch (e) {
      this.setState({
        isLoading: false
      });
      showSnackbar({
        text: e.message
      });
    }
  };

  chooseExpenseType = (type, pushToNextStep = true) => {
    this.setState(
      {
        expenseType: type,
        mainCategoryId: null,
        category: null,
        subCategoryId: null,
        brand: null,
        product: null,
        insuranceProviders: [],
        subCategories: []
      },
      () => {
        switch (type) {
          case EXPENSE_TYPES.AUTOMOBILE:
            this.setState(
              {
                mainCategoryId: MAIN_CATEGORY_IDS.AUTOMOBILE
              },
              () => {
                this.pushCategoryStep(pushToNextStep);
              }
            );
            break;
          case EXPENSE_TYPES.ELECTRONICS:
            this.setState(
              {
                mainCategoryId: MAIN_CATEGORY_IDS.ELECTRONICS
              },
              () => {
                this.pushCategoryStep(pushToNextStep);
              }
            );
            break;
          case EXPENSE_TYPES.FURNITURE:
            this.setState(
              {
                mainCategoryId: MAIN_CATEGORY_IDS.FURNITURE
              },
              () => {
                this.pushCategoryStep(pushToNextStep);
              }
            );
            break;
          case EXPENSE_TYPES.MEDICAL_DOCS:
          case EXPENSE_TYPES.HEALTHCARE:
            this.setState(
              {
                mainCategoryId: MAIN_CATEGORY_IDS.HEALTHCARE
              },
              () => {
                this.pushCategoryStep(pushToNextStep);
              }
            );
            break;
          case EXPENSE_TYPES.TRAVEL:
            this.setState(
              {
                mainCategoryId: MAIN_CATEGORY_IDS.TRAVEL
              },
              () => {
                this.pushCategoryStep(pushToNextStep);
              }
            );
            break;
          case EXPENSE_TYPES.FASHION:
            this.setState(
              {
                mainCategoryId: MAIN_CATEGORY_IDS.FASHION
              },
              () => {
                this.pushCategoryStep(pushToNextStep);
              }
            );
            break;
          case EXPENSE_TYPES.SERVICES:
            this.setState(
              {
                mainCategoryId: MAIN_CATEGORY_IDS.SERVICES
              },
              () => {
                this.pushCategoryStep(pushToNextStep);
              }
            );
            break;
          case EXPENSE_TYPES.HOME:
            this.setState(
              {
                mainCategoryId: MAIN_CATEGORY_IDS.HOUSEHOLD
              },
              () => {
                this.pushCategoryStep(pushToNextStep);
              }
            );
            break;
          case EXPENSE_TYPES.PERSONAL:
            this.setState(
              {
                mainCategoryId: MAIN_CATEGORY_IDS.PERSONAL
              },
              () => {
                this.pushCategoryStep(pushToNextStep);
              }
            );
            break;
          case EXPENSE_TYPES.VISITING_CARD:
            this.setState(
              {
                mainCategoryId: MAIN_CATEGORY_IDS.PERSONAL,
                category: {
                  id: CATEGORY_IDS.PERSONAL.VISITING_CARD,
                  name: "Visiting Card"
                }
              },
              () => {
                this.initProduct(pushToNextStep);
              }
            );
            break;
          case EXPENSE_TYPES.REPAIR:
            this.pushStep(
              <RepairStep
                navigation={this.props.navigation}
                onBackPress={this.previousStep}
                onStepDone={this.onRepairStepDone}
              />
            );
            break;
        }
      }
    );
  };

  onRepairStepDone = product => {
    this.setState({ product }, () => {
      this.finishModal.show();
    });
  };

  onCategorySelect = ({ category, subCategoryId, pushToNext }) => {
    this.setState({ category, subCategoryId }, () => {
      this.initProduct(pushToNext);
    });
  };

  onAmountStepDone = product => {
    const { mainCategoryId, category, subCategories } = this.state;
    let newState = {};
    if (product) newState.product = product;

    this.setState(newState, () => {
      if (mainCategoryId != MAIN_CATEGORY_IDS.FASHION) {
        showSnackbar({ text: "Expense card has been created in your eHome" });
      }
      if (
        (mainCategoryId == MAIN_CATEGORY_IDS.HOUSEHOLD ||
          mainCategoryId == MAIN_CATEGORY_IDS.SERVICES) &&
        subCategories.length > 0
      ) {
        this.pushPurchaseDateStep(true);
      } else {
        this.pushPurchaseDateStep();
      }
    });
  };

  onSubCategoryStepDone = (product, subCategoryId) => {
    const { mainCategoryId, category, expenseType } = this.state;
    let newState = {};
    if (product) newState.product = product;
    if (subCategoryId) newState.subCategoryId = subCategoryId;

    this.setState(newState, () => {
      switch (mainCategoryId) {
        case MAIN_CATEGORY_IDS.FURNITURE:
          showSnackbar({ text: "Product card has been created in your eHome" });
          this.pushBrandStep(true);
          break;
        case MAIN_CATEGORY_IDS.HEALTHCARE:
          if (category.id == CATEGORY_IDS.HEALTHCARE.MEDICAL_DOC) {
            this.pushNameStep(true);
          } else if (category.id == CATEGORY_IDS.HEALTHCARE.INSURANCE) {
            this.pushInsuranceProviderStep();
          }
          break;
        case MAIN_CATEGORY_IDS.HOUSEHOLD:
          this.pushAmountStep();
          break;
        case MAIN_CATEGORY_IDS.SERVICES:
          this.pushPurchaseDateStep();
          break;
      }
    });
  };

  onBrandStepDone = (product, brand) => {
    const { mainCategoryId, category } = this.state;
    let newState = { brand };
    if (product) newState.product = product;
    this.setState({ newState }, () => {
      switch (mainCategoryId) {
        case MAIN_CATEGORY_IDS.AUTOMOBILE:
        case MAIN_CATEGORY_IDS.ELECTRONICS:
          showSnackbar({ text: "Product card has been created in your eHome" });
          this.pushStep(
            <SelectModelStep
              product={product}
              brand={brand}
              mainCategoryId={mainCategoryId}
              category={category}
              onModelStepDone={this.onModelStepDone}
              skippable={true}
              onBackPress={this.previousStep}
              onSkipPress={this.onModelStepDone}
            />
          );
          break;
        case MAIN_CATEGORY_IDS.FASHION:
          showSnackbar({ text: "Product card has been created in your eHome" });
          this.pushAmountStep(true);
          break;
        default:
          this.pushPurchaseDateStep();
      }
    });
  };

  onModelStepDone = product => {
    let newState = {};
    if (product) newState.product = product;
    this.setState(newState, () => {
      this.pushPurchaseDateStep();
    });
  };

  onPurchaseDateStepDone = product => {
    let newState = {};
    if (product) newState.product = product;
    this.setState(newState, () => {
      const { mainCategoryId, category } = this.state;
      switch (mainCategoryId) {
        case MAIN_CATEGORY_IDS.AUTOMOBILE:
          if (category.id != CATEGORY_IDS.AUTOMOBILE.CYCLE) {
            this.pushInsuranceProviderStep(true);
          } else {
            this.pushUploadBillStep(true);
          }
          break;
        case MAIN_CATEGORY_IDS.HEALTHCARE:
          if (category.id == CATEGORY_IDS.HEALTHCARE.MEDICAL_DOC) {
            this.finishModal.show();
            break;
          }
        default:
          this.pushUploadBillStep(true);
      }
    });
  };

  onInsuranceProviderStepDone = ({ insurance }) => {
    const { mainCategoryId, category, product } = this.state;
    if (category.id == CATEGORY_IDS.HEALTHCARE.INSURANCE) {
      showSnackbar({ text: "Insurance card has been created in your eHome" });
    }
    this.pushStep(
      <SelectInsuranceEffectiveDateStep
        product={this.state.product}
        mainCategoryId={mainCategoryId}
        category={category}
        product={product}
        insurance={insurance}
        onInsuranceEffectiveDateStepDone={this.onInsuranceEffectiveDateStepDone}
        onBackPress={this.previousStep}
        onSkipPress={this.onInsuranceEffectiveDateStepDone}
      />
    );
  };

  onInsuranceEffectiveDateStepDone = () => {
    this.finishModal.show();
  };

  onUploadBillStepDone = product => {
    let newState = {};
    if (product) newState.product = product;
    this.setState(newState, () => {
      const { mainCategoryId, expenseType } = this.state;

      if (mainCategoryId == MAIN_CATEGORY_IDS.PERSONAL) {
        showSnackbar({ text: "Document card has been created in your eHome" });
        this.pushNameStep(true);
      } else if (expenseType == EXPENSE_TYPES.MEDICAL_DOCS) {
        showSnackbar({ text: "Document card has been created in your eHome" });
        this.pushSubCategoryStep(true);
      } else {
        this.finishModal.show();
      }
    });
  };

  onNameStepDone = product => {
    let newState = {};
    if (product) newState.product = product;
    this.setState(newState, () => {
      this.finishModal.show();
    });
  };

  render() {
    const {
      mainCategoryId,
      category,
      product,
      steps,
      activeStepIndex,
      isLoading,
      numberOfStepsToShowInFooter,
      popOnDoItLater
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

    console.log("activeStepIndex: ", activeStepIndex);

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
          <View collapsable={false} style={styles.stepContainer}>
            {previousStep}
          </View>
          <View collapsable={false} style={styles.stepContainer}>
            {currentStep}
          </View>
          <View collapsable={false} style={styles.stepContainer}>
            {nextStep}
          </View>
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
                    <View
                      collapsable={false}
                      style={[
                        styles.stepIndicatorLine,
                        idDoneStep ? styles.doneStepIndicatorLine : {}
                      ]}
                    />
                  ),
                  <View
                    collapsable={false}
                    style={[
                      styles.stepIndicatorDot,
                      idDoneStep ? styles.doneStepIndicatorDot : {},
                      isActiveStep ? styles.activeStepIndicatorDot : {}
                    ]}
                  >
                    {isActiveStep ? (
                      <View
                        collapsable={false}
                        style={styles.activeStepIndicatorDotInnerRing}
                      />
                    ) : (
                      <View collapsable={false} />
                    )}
                  </View>
                ];
              })}
            </View>
            {/* <Text weight='Bold' style={{ fontSize: 12, marginTop: 10, color: colors.secondaryText }}>Purchase date helps in warranty, service and other details</Text> */}
          </View>
        ) : (
          <View collapsable={false} />
        )}
        <FinishModal
          ref={ref => (this.finishModal = ref)}
          title="Product added to your eHome."
          mainCategoryId={mainCategoryId}
          category={category}
          productId={product ? product.id : null}
          popOnDoItLater={popOnDoItLater}
          navigation={this.props.navigation}
          startOver={this.startOver}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flex: 1,
    backgroundColor: "#fff"
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

export default AddProductScreen;
