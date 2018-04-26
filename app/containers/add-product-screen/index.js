import React from "react";
import {
  StyleSheet,
  View,
  BackHandler,
  Animated,
  Easing,
  Dimensions
} from "react-native";
import _ from 'lodash';
import { initProduct, updateProduct } from "../../api";

import { Text, ScreenContainer } from "../../elements";

import LoadingOverlay from "../../components/loading-overlay";
import { showSnackbar } from "../snackbar";

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
  static navigatorStyle = {
    navBarHidden: true,
    tabBarHidden: true
    // disabledBackGesture: true
  };
  state = {
    activeStepIndex: 0,
    steps: [],
    numberOfStepsToShowInFooter: 0,
    expenseType: null,
    mainCategoryId: null,
    category: null,
    product: null,
    insuranceProviders: [],
    subCategories: [],
    isLoading: false,
  };

  stepsContainerPositionX = new Animated.Value(-SCREEN_WIDTH);

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  onNavigatorEvent = (event) => {
    switch (event.id) {
      case "willAppear":
        // this.backHandler = BackHandler.addEventListener(
        //   "hardwareBackPress",
        //   this.handleBackPress
        // );
        break;
      case "backPress":
        this.previousStep();
      default:
        break;
    }
  }

  componentDidMount() {
    this.pushStep(
      <SelectExpenseTypeStep
        onBackPress={this.previousStep}
        onExpenseTypePress={this.chooseExpenseType}
      />, false
    );

    const { expenseType } = this.props;

    if (expenseType) {
      this.chooseExpenseType(expenseType);
    }
  }

  goToStep = (step) => {
    const steps = [...this.state.steps];
    steps.length = step + 1;
    let newState = { steps, activeStepIndex: step };
    if (step < 2) {
      newState = {
        ...newState,
        category: null,
        product: null,
        insuranceProviders: [],
        subCategories: [],
        numberOfStepsToShowInFooter: 0
      }
    }
    this.setState(() => (newState));
  }

  close = () => {
    this.props.navigator.pop();
  };

  previousStep = () => {
    const { activeStepIndex, category } = this.state;

    if (activeStepIndex == 0) this.close();

    const newState = { activeStepIndex: activeStepIndex - 1 };
    if (activeStepIndex <= (category && category.id == CATEGORY_IDS.PERSONAL.VISITING_CARD ? 1 : 2)) {
      newState.numberOfStepsToShowInFooter = 0;
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

    console.log('current state: ', this.state);
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

  pushCategoryStep = () => {
    const { expenseType, mainCategoryId, category, product } = this.state;
    this.pushStep(
      <SelectCategoryStep
        mainCategoryId={mainCategoryId}
        category={category}
        onBackPress={this.previousStep}
        onCategorySelect={this.onCategorySelect}
        expenseType={expenseType}
      />)
  }

  pushPurchaseDateStep = () => {
    const { mainCategoryId, category, product } = this.state;
    this.pushStep(
      <SelectPurchaseDateStep
        product={product}
        mainCategoryId={mainCategoryId}
        category={category}
        onPurchaseDateStepDone={this.onPurchaseDateStepDone}
        skippable={true}
        onBackPress={this.previousStep}
        onSkipPress={this.onPurchaseDateStepDone}
      />)
  }

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
  }

  pushAmountStep = (skippable = false) => {
    const { mainCategoryId, category, product } = this.state;
    this.pushStep(
      <AddAmountStep
        product={product}
        mainCategoryId={mainCategoryId}
        category={category}
        onStepDone={this.onAmountStepDone}
        onBackPress={this.previousStep}
        skippable={skippable}
      />
    );
  }

  pushUploadBillStep = (skippable = false) => {
    const { mainCategoryId, category, product } = this.state;
    this.pushStep(
      <UploadBillStep
        product={product}
        mainCategoryId={mainCategoryId}
        category={category}
        onUploadBillStepDone={this.onUploadBillStepDone}
        navigator={this.props.navigator}
        onBackPress={this.previousStep}
        skippable={skippable}
        onSkipPress={() => this.finishModal.show()}
      />
    );
  }

  pushSubCategoryStep = (skippable = false) => {
    const { mainCategoryId, category, product, subCategories } = this.state;
    this.pushStep(
      <SelectSubCategoryStep
        product={product}
        mainCategoryId={mainCategoryId}
        category={category}
        subCategories={subCategories}
        onSubCategoryStepDone={this.onSubCategoryStepDone}
        onSkipPress={this.onSubCategoryStepDone}
        onBackPress={this.previousStep}
        skippable={skippable}
      />
    )
  }

  pushInsuranceProviderStep = (skippable = false) => {
    const { mainCategoryId, category, product, insuranceProviders } = this.state;
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
  }

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
  }

  initProduct = async () => {
    this.setState({ isLoading: true, product: null });
    const { mainCategoryId, category } = this.state;
    try {
      const res = await initProduct(mainCategoryId, category.id);
      this.setState({
        product: res.product,
        isLoading: false
      }, () => {
        if (category.id == CATEGORY_IDS.PERSONAL.VISITING_CARD) {
          this.pushUploadBillStep();
          this.setState({
            numberOfStepsToShowInFooter: 2
          })
        }
      });
    } catch (e) {
      this.setState({
        isLoading: false
      });
      showSnackbar({
        text: e.message
      });
    }
  };

  chooseExpenseType = type => {
    const { category = null } = this.props;
    this.setState({
      expenseType: type,
      mainCategoryId: null,
      category: category,
      product: null,
      insuranceProviders: [],
      subCategories: [],
    }, () => {
      switch (type) {
        case EXPENSE_TYPES.AUTOMOBILE:
          this.setState({
            mainCategoryId: MAIN_CATEGORY_IDS.AUTOMOBILE
          }, () => {
            this.pushCategoryStep();
          });
          break;
        case EXPENSE_TYPES.ELECTRONICS:
          this.setState({
            mainCategoryId: MAIN_CATEGORY_IDS.ELECTRONICS
          }, () => {
            this.pushCategoryStep();
          });
          break;
        case EXPENSE_TYPES.FURNITURE:
          this.setState({
            mainCategoryId: MAIN_CATEGORY_IDS.FURNITURE
          }, () => {
            this.pushCategoryStep();
          });
          break;
        case EXPENSE_TYPES.MEDICAL_DOCS:
        case EXPENSE_TYPES.HEALTHCARE:
          this.setState({
            mainCategoryId: MAIN_CATEGORY_IDS.HEALTHCARE
          }, () => {
            this.pushCategoryStep();
          });
          break;
        case EXPENSE_TYPES.TRAVEL:
          this.setState({
            mainCategoryId: MAIN_CATEGORY_IDS.TRAVEL
          }, () => {
            this.pushCategoryStep();
          });
          break;
        case EXPENSE_TYPES.FASHION:
          this.setState({
            mainCategoryId: MAIN_CATEGORY_IDS.FASHION
          }, () => {
            this.pushCategoryStep();
          });
          break;
        case EXPENSE_TYPES.SERVICES:
          this.setState({
            mainCategoryId: MAIN_CATEGORY_IDS.SERVICES
          }, () => {
            this.pushCategoryStep();
          });
          break;
        case EXPENSE_TYPES.HOME:
          this.setState({
            mainCategoryId: MAIN_CATEGORY_IDS.HOUSEHOLD
          }, () => {
            this.pushCategoryStep();
          });
          break;
        case EXPENSE_TYPES.PERSONAL:
          this.setState({
            mainCategoryId: MAIN_CATEGORY_IDS.PERSONAL
          }, () => {
            this.pushCategoryStep();
          });
          break;
        case EXPENSE_TYPES.VISITING_CARD:
          this.setState({
            mainCategoryId: MAIN_CATEGORY_IDS.PERSONAL,
            category: {
              id: CATEGORY_IDS.PERSONAL.VISITING_CARD,
              name: 'Visiting Card'
            }
          }, () => {
            this.initProduct();
          });
          break;
        case EXPENSE_TYPES.REPAIR:
          this.pushStep(
            <RepairStep
              onBackPress={this.previousStep}
              onStepDone={() => this.finishModal.show()}
            />
          );
          break;
      }
    })
  };

  onCategorySelect = ({ product,
    category,
    categoryReferenceData,
    renewalTypes,
    warrantyProviders,
    insuranceProviders,
    brands,
    categoryForms,
    subCategories }) => {

    const { mainCategoryId, expenseType } = this.state;
    this.setState({ product, category, subCategories, insuranceProviders }, () => {
      switch (mainCategoryId) {
        case MAIN_CATEGORY_IDS.AUTOMOBILE:
          if (category.id != CATEGORY_IDS.AUTOMOBILE.CYCLE) {
            this.setState({
              numberOfStepsToShowInFooter: 5
            })
          } else {
            this.setState({
              numberOfStepsToShowInFooter: 4
            })
          }
          this.pushBrandStep();
          break;
        case MAIN_CATEGORY_IDS.ELECTRONICS:
          this.setState({
            numberOfStepsToShowInFooter: 4
          })
          this.pushBrandStep();
          break;
        case MAIN_CATEGORY_IDS.FASHION:
          this.setState({
            numberOfStepsToShowInFooter: 4
          })
          this.pushBrandStep();
          break;
        case MAIN_CATEGORY_IDS.FURNITURE:
          if (category.id == CATEGORY_IDS.FURNITURE.FURNITURE) {
            this.setState({
              numberOfStepsToShowInFooter: 4
            })
            this.pushSubCategoryStep();
          } else {
            this.setState({
              numberOfStepsToShowInFooter: 3
            })
            this.pushBrandStep();
          }
          break;
        case MAIN_CATEGORY_IDS.TRAVEL:
        case MAIN_CATEGORY_IDS.SERVICES:
          this.setState({
            numberOfStepsToShowInFooter: 3
          })
          this.pushAmountStep();
          break;
        case MAIN_CATEGORY_IDS.HOUSEHOLD:
          this.setState({
            numberOfStepsToShowInFooter: 4
          })
          this.pushAmountStep();
          break;
        case MAIN_CATEGORY_IDS.HEALTHCARE:
          if (category.id == CATEGORY_IDS.HEALTHCARE.MEDICAL_DOC) {
            this.setState({
              numberOfStepsToShowInFooter: 3
            })
            this.pushUploadBillStep();
          } else if (category.id == CATEGORY_IDS.HEALTHCARE.INSURANCE) {
            this.setState({
              numberOfStepsToShowInFooter: 3
            })
            this.pushSubCategoryStep();
          } else {
            this.setState({
              numberOfStepsToShowInFooter: 3
            })
            this.pushAmountStep();
          }
          break;
        case MAIN_CATEGORY_IDS.PERSONAL:
          this.setState({
            numberOfStepsToShowInFooter: 2
          })
          this.pushUploadBillStep();
      }
    })
  };


  onAmountStepDone = product => {
    const { mainCategoryId, category } = this.state;
    this.setState({ product }, () => {
      showSnackbar({ text: 'Expense card has been created' });
      if (mainCategoryId == MAIN_CATEGORY_IDS.HOUSEHOLD) {
        this.pushSubCategoryStep(true);
      } else {
        this.pushPurchaseDateStep();
      }
    })
  }

  onSubCategoryStepDone = product => {
    const { mainCategoryId, category, expenseType } = this.state;
    let newState = {};
    if (product) newState.product = product;

    this.setState(newState, () => {
      switch (mainCategoryId) {
        case MAIN_CATEGORY_IDS.FURNITURE:
          showSnackbar({ text: 'Product card has been created' });
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
          this.pushPurchaseDateStep();
          break;
      }
    });
  }

  onBrandStepDone = product => {
    const { mainCategoryId, category } = this.state;
    let newState = {};
    if (product) newState.product = product;
    this.setState({ newState }, () => {
      switch (mainCategoryId) {
        case MAIN_CATEGORY_IDS.AUTOMOBILE:
        case MAIN_CATEGORY_IDS.ELECTRONICS:
          showSnackbar({ text: 'Product card has been created' });
          this.pushStep(
            <SelectModelStep
              product={product}
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
          showSnackbar({ text: 'Product card has been created' });
          this.pushAmountStep(true)
          break;
        default:
          this.pushPurchaseDateStep();
      }
    });
  };

  onModelStepDone = product => {
    product && this.setState({ product });
    const { mainCategoryId, category } = this.state;
    this.pushPurchaseDateStep();
  };

  onPurchaseDateStepDone = product => {
    product && this.setState({ product });
    const { mainCategoryId, category } = this.state;
    switch (mainCategoryId) {
      case MAIN_CATEGORY_IDS.AUTOMOBILE:
        if (category.id != CATEGORY_IDS.AUTOMOBILE.CYCLE) {
          this.pushInsuranceProviderStep(true);
        }
        else {
          this.pushUploadBillStep(true)
        }
        break;
      case MAIN_CATEGORY_IDS.HEALTHCARE:
        if (category.id == CATEGORY_IDS.HEALTHCARE.MEDICAL_DOC) {
          this.finishModal.show();
          break;
        }
      default:
        this.pushUploadBillStep(true)
    }
  };

  onInsuranceProviderStepDone = ({ insurance }) => {
    const { mainCategoryId, category, product } = this.state;
    if (category.id == CATEGORY_IDS.HEALTHCARE.INSURANCE) {
      showSnackbar({ text: 'Insurance card has been created' });
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
  }

  onUploadBillStepDone = () => {
    const { mainCategoryId, category, product, expenseType } = this.state;
    if (mainCategoryId == MAIN_CATEGORY_IDS.PERSONAL) {
      showSnackbar({ text: 'Document card has been created' });
      this.pushNameStep(true);
    } else if (expenseType == EXPENSE_TYPES.MEDICAL_DOCS) {
      showSnackbar({ text: 'Document card has been created' });
      this.pushSubCategoryStep(true);
    } else {
      this.finishModal.show();
    }
  }

  onNameStepDone = (product) => {
    const { mainCategoryId, category } = this.state;
    this.setState({ product }, () => {
      this.finishModal.show();
    })
  }

  render() {
    const { mainCategoryId, category, product, steps, activeStepIndex, isLoading, numberOfStepsToShowInFooter } = this.state;

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

    console.log('activeStepIndex: ', activeStepIndex);

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
        {numberOfStepsToShowInFooter > 0 && <View style={styles.stepIndicatorsAndText}>
          <View style={styles.stepIndicators}>
            {_.range(numberOfStepsToShowInFooter).map((item, index) => {
              activeStepIndicatorIndex = activeStepIndex - (category.id != CATEGORY_IDS.PERSONAL.VISITING_CARD ? 2 : 1);
              idDoneStep = index <= activeStepIndicatorIndex;
              isActiveStep = index == activeStepIndicatorIndex;
              return [index > 0 && <View style={[styles.stepIndicatorLine, idDoneStep ? styles.doneStepIndicatorLine : {}]} />,
              <View style={[styles.stepIndicatorDot, idDoneStep ? styles.doneStepIndicatorDot : {}, isActiveStep ? styles.activeStepIndicatorDot : {}]} >
                {isActiveStep && <View style={styles.activeStepIndicatorDotInnerRing}>
                </View>}
              </View>]
            })}
          </View>
          {/* <Text weight='Bold' style={{ fontSize: 12, marginTop: 10, color: colors.secondaryText }}>Purchase date helps in warranty, service and other details</Text> */}
        </View>
        }
        <FinishModal
          ref={ref => this.finishModal = ref}
          title="Product added to your eHome."
          mainCategoryId={mainCategoryId}
          category={category}
          productId={product ? product.id : null}
          navigator={this.props.navigator}
          goToStep={this.goToStep}
        />
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
    paddingVertical: 5,
  },
  stepIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stepIndicatorLine: {
    height: 2,
    backgroundColor: '#eee',
    flex: 1
  },
  doneStepIndicatorLine: {
    backgroundColor: colors.mainBlue
  },
  stepIndicatorDot: {
    width: 15,
    height: 15,
    backgroundColor: '#eee',
    borderRadius: 10
  },
  activeStepIndicatorDot: {
    width: 20,
    height: 20,
    backgroundColor: colors.mainBlue,
    alignItems: 'center',
    justifyContent: 'center'
  },
  activeStepIndicatorDotInnerRing: {
    width: 15,
    height: 15,
    backgroundColor: colors.mainBlue,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fff'
  },
  doneStepIndicatorDot: {
    backgroundColor: colors.success
  }
});

export default AddProductScreen;