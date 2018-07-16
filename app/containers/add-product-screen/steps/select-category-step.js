import React from "react";
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  Platform
} from "react-native";
import I18n from "../../../i18n";
import {
  MAIN_CATEGORY_IDS,
  CATEGORY_IDS,
  EXPENSE_TYPES,
  SUB_CATEGORY_IDS
} from "../../../constants";
import { Text } from "../../../elements";
import { colors } from "../../../theme";
import { showSnackbar } from "../../../utils/snackbar";

import {
  API_BASE_URL,
  getReferenceDataCategories,
  initProduct
} from "../../../api";

import SelectModal from "../../../components/select-modal";
import Modal from "react-native-modal";
import Step from "../../../components/step";
import Icon from "react-native-vector-icons/Ionicons";

class SelectCategoryStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "Select Type",
      selectedOption: null,
      visibleOptions: [],
      otherOptions: [],
      genericIcon: null,
      showOtherOption: false,
      isModalVisible: false,
      userProducts: [],
      reasons: [],
      selectedCategory: null,
      addAnotherTxt: '',
    };
  }
  componentDidMount() {
    console.log("this.props: ", this.props);

    let title = "Select Type";
    let genericIcon = null;
    let visibleOptions = [];
    let reasons = [];

    switch (this.props.mainCategoryId) {
      case MAIN_CATEGORY_IDS.AUTOMOBILE:
        title = I18n.t("add_edit_expense_screen_title_select_automobile");
        genericIcon = require("../../../images/categories/generic_automobile.png");
        reasons = [
          "Connect with brands",
          "Receive insurance & warranty reminders",
          "Connect with nearest service centres",
          "Receive service schedule",
          "Retrieve a product bill/invoice",
          "Track lifetime expenses",
          "Share personalised reviews",
          "And much more"
        ];
        visibleOptions = [
          {
            id: CATEGORY_IDS.AUTOMOBILE.CAR,
            name: "Four Wheeler",
            icon: require("../../../images/categories/car.png")
          },
          {
            id: CATEGORY_IDS.AUTOMOBILE.BIKE,
            name: "Two Wheeler",
            icon: require("../../../images/categories/bike.png")
          },
          {
            id: CATEGORY_IDS.AUTOMOBILE.CYCLE,
            name: "Cycle",
            icon: require("../../../images/categories/bicycle.png")
          },
          {
            id: CATEGORY_IDS.AUTOMOBILE.PASSENGER_CARRIER,
            name: "Passenger Carrier",
            icon: require("../../../images/categories/passenger_carrier.png")
          }
        ];
        if (typeof this.props.onCategorySelect == "function") {
          this.fetchCategories();
        }
        break;
      case MAIN_CATEGORY_IDS.ELECTRONICS:
        title = I18n.t("add_edit_expense_screen_title_select_electronics");
        genericIcon = require("../../../images/categories/generic_electronic.png");
        reasons = [
          "Connect with brands",
          "Receive warranty & insurance reminders",
          "Connect with nearest service centres",
          "Retrieve a product bill/invoice",
          "Track lifetime expenses",
          "Share personalised reviews",
          "And much more"
        ];
        visibleOptions = [
          {
            id: CATEGORY_IDS.ELECTRONICS.MOBILE,
            name: "Mobile",
            icon: require("../../../images/categories/mobile.png")
          },
          {
            id: CATEGORY_IDS.ELECTRONICS.TV,
            name: "T.V.",
            icon: require("../../../images/categories/television.png")
          },
          {
            id: CATEGORY_IDS.ELECTRONICS.LAPTOP,
            name: "Laptop",
            icon: require("../../../images/categories/laptop.png")
          },
          {
            id: CATEGORY_IDS.ELECTRONICS.AC,
            name: "A.C.",
            icon: require("../../../images/categories/air_conditioner.png")
          },
          {
            id: CATEGORY_IDS.ELECTRONICS.WATER_PURIFIER,
            name: "Water Purifier",
            icon: require("../../../images/categories/water_purifier.png")
          },
          {
            id: CATEGORY_IDS.ELECTRONICS.REFRIGERATOR,
            name: "Refrigerator",
            icon: require("../../../images/categories/fridge.png")
          },
          {
            id: CATEGORY_IDS.ELECTRONICS.WASHING_MACHINE,
            name: "Washing Machine",
            icon: require("../../../images/categories/washing_machine.png")
          }
        ];
        if (typeof this.props.onCategorySelect == "function") {
          this.fetchCategories();
        }
        break;
      case MAIN_CATEGORY_IDS.FURNITURE:
        title = I18n.t("add_edit_expense_screen_title_select_furniture");
        reasons = [
          "Connect with brands",
          "Receive warranty reminders",
          "Connect with nearest service centres",
          "Retrieve a product bill/invoice",
          "Track lifetime expenses",
          "Share personalised reviews",
          "And much more"
        ];
        visibleOptions = [
          {
            id: CATEGORY_IDS.FURNITURE.FURNITURE,
            name: "Furniture",
            icon: require("../../../images/categories/furniture.png")
          },
          {
            id: CATEGORY_IDS.FURNITURE.HARDWARE,
            name: "Hardware",
            icon: require("../../../images/categories/hardware.png")
          },
          {
            id: CATEGORY_IDS.FURNITURE.KITCHEN_UTENSILS,
            name: "Kitchen Utensils",
            icon: require("../../../images/categories/kitchen.png")
          },
          {
            id: CATEGORY_IDS.FURNITURE.OTHER_FURNITURE_HARDWARE,
            name: "Other Furniture/Hardware",
            icon: require("../../../images/categories/bathroom_fittings.png")
          }
        ];
        break;
      case MAIN_CATEGORY_IDS.SERVICES:
        title = I18n.t("add_edit_expense_screen_title_select_service_expense");
        reasons = [
          "Retrieve a bill anytime, anywhere",
          "Get expense insights",
          "And much more"
        ];
        visibleOptions = [
          {
            id: CATEGORY_IDS.SERVICES.BEAUTY_AND_SALON,
            name: "Beauty & Salon",
            icon: require("../../../images/categories/beauty_and_salon.png")
          },
          {
            id: CATEGORY_IDS.SERVICES.LESSIONS_HOBBIES,
            name: "Lessons & Hobbies",
            icon: require("../../../images/categories/hobbies.png")
          },
          {
            id: CATEGORY_IDS.SERVICES.OTHER_SERVICES,
            name: "Other Services",
            icon: require("../../../images/categories/house_helps.png")
          }
        ];
        break;
      case MAIN_CATEGORY_IDS.TRAVEL:
        title = I18n.t("add_edit_expense_screen_title_select_travel");
        reasons = [
          "Personalise your expenses",
          "Retrieve a bill anytime, anywhere",
          "Get expense insights",
          "And much more"
        ];
        visibleOptions = [
          {
            id: CATEGORY_IDS.TRAVEL.TRAVEL,
            name: "Travel",
            icon: require("../../../images/categories/travel.png")
          },
          {
            id: CATEGORY_IDS.TRAVEL.DINING,
            name: "Dining",
            icon: require("../../../images/categories/dining.png")
          },
          {
            id: CATEGORY_IDS.TRAVEL.HOTEL_STAY,
            name: "Hotel Stay",
            icon: require("../../../images/categories/hotel.png")
          }
        ];
        break;

      case MAIN_CATEGORY_IDS.FASHION:
        title = I18n.t("add_edit_expense_screen_title_select_fashion_expense");
        reasons = [
          "Personalise your expenses",
          "Retrieve a bill anytime, anywhere",
          "Get expense insights",
          "Share personalised review",
          "And much more"
        ];
        visibleOptions = [
          {
            id: CATEGORY_IDS.FASHION.FOOTWEAR,
            name: "Footwear",
            icon: require("../../../images/categories/shoes.png")
          },
          {
            id: CATEGORY_IDS.FASHION.SHADES,
            name: "Shades",
            icon: require("../../../images/categories/shades.png")
          },
          {
            id: CATEGORY_IDS.FASHION.WATCHES,
            name: "Watches",
            icon: require("../../../images/categories/watches.png")
          },
          {
            id: CATEGORY_IDS.FASHION.CLOTHS,
            name: "Clothes",
            icon: require("../../../images/categories/clothes.png")
          },
          {
            id: CATEGORY_IDS.FASHION.BAGS,
            name: "Bags",
            icon: require("../../../images/categories/bags.png")
          },
          {
            id: CATEGORY_IDS.FASHION.JEWELLERY,
            name: "Jewellery & Accessories",
            icon: require("../../../images/categories/jewellary.png")
          },
          {
            id: CATEGORY_IDS.FASHION.MAKEUP,
            name: "Make-Up",
            icon: require("../../../images/categories/make_up.png")
          }
        ];
        break;
      case MAIN_CATEGORY_IDS.HOUSEHOLD:
        title = I18n.t("add_edit_expense_screen_title_select_home_expense");
        reasons = [
          "Retrieve a bill anytime, anywhere",
          "Get expense insights",
          "And much more"
        ];
        visibleOptions = [
          {
            id: CATEGORY_IDS.HOUSEHOLD.HOUSEHOLD_EXPENSE,
            name: "Household Expenses",
            icon: require("../../../images/categories/household.png")
          },
          {
            id: CATEGORY_IDS.HOUSEHOLD.EDUCATION,
            name: "Education",
            icon: require("../../../images/categories/education.png")
          },
          {
            id: CATEGORY_IDS.HOUSEHOLD.UTILITY_BILLS,
            name: "Utility Bills",
            icon: require("../../../images/categories/utility_bill.png")
          },
          {
            id: CATEGORY_IDS.HOUSEHOLD.HOME_DECOR,
            name: "Home Décor & Furnishing",
            icon: require("../../../images/categories/home_decor.png")
          },
          {
            id: CATEGORY_IDS.HOUSEHOLD.OTHER_HOUSEHOLD_EXPENSE,
            name: "Other Household Expenses",
            icon: require("../../../images/categories/kitchen_utensils.png")
          }
        ];
        break;
      case MAIN_CATEGORY_IDS.HEALTHCARE:
        if (this.props.expenseType == EXPENSE_TYPES.MEDICAL_DOCS) {
          title = I18n.t(
            "add_edit_expense_screen_title_select_medical_document"
          );
          reasons = [
            "Retrieve an insurance policy/record",
            "Connect with insurance providers",
            "Receive insurance reminders",
            "Share personalised reviews",
            "And much more"
          ];
          visibleOptions = [
            {
              id: CATEGORY_IDS.HEALTHCARE.MEDICAL_DOC,
              name: "Medical Docs",
              icon: require("../../../images/categories/medical_docs.png")
            },
            {
              id: CATEGORY_IDS.HEALTHCARE.INSURANCE,
              name: "Insurance",
              icon: require("../../../images/categories/insurance.png")
            }
          ];
        } else {
          title = I18n.t("add_edit_expense_screen_title_select_health_expense");
          reasons = [
            "Retrieve a bill/record/prescription",
            "Get expense insights",
            "And much more"
          ];
          visibleOptions = [
            {
              id: SUB_CATEGORY_IDS.MEDICAL_BILL,
              name: "Medical Bills",
              icon: require("../../../images/categories/medical_bill.png")
            },
            {
              id: SUB_CATEGORY_IDS.HOSPITAL_BILL,
              name: "Hospital Bills",
              icon: require("../../../images/categories/hospital.png")
            }
          ];
        }
        break;
      case MAIN_CATEGORY_IDS.PERSONAL:
        title = I18n.t("add_edit_expense_screen_title_select_personal_doc");
        reasons = ["To retrieve your document anytime, anywhere"];
        visibleOptions = [
          {
            id: CATEGORY_IDS.PERSONAL.RENT_AGREEMENT,
            name: "Rent Agreement",
            icon: require("../../../images/categories/rent_agreement.png")
          },
          {
            id: CATEGORY_IDS.PERSONAL.OTHER_PERSONAL_DOC,
            name: "Other Personal Docs",
            icon: require("../../../images/main-categories/ic_personal_doc.png")
          },
          {
            id: CATEGORY_IDS.PERSONAL.VISITING_CARD,
            name: "Visiting Cards",
            icon: require("../../../images/main-categories/ic_visiting_card.png")
          }
        ];
        break;
    }

    this.setState(
      {
        title,
        genericIcon,
        visibleOptions,
        reasons
      },
      () => {
        //if category is already selected
        if (this.props.category) {
          console.log("this.props.category: ", this.props.category);
          console.log("this.state.visibleOptions: ", this.state.visibleOptions);
          const category = this.state.visibleOptions.find(
            option => option.id == this.props.category.id
          );
          if (category) this.changeOption(category);
        }
      }
    );

    if (this.props.preSelectCategory) {
      this.setState(
        {
          selectedOption: this.props.preSelectCategory,
          showOtherOption: true
        },
        () => {
          setTimeout(() => this.scrollView.scrollToEnd(), 0);
        }
      );
    }
  }

  fetchCategories = async () => {
    try {
      const categories = await getReferenceDataCategories(
        this.props.mainCategoryId
      );
      this.setState({ otherOptions: categories });
    } catch (e) {
      showSnackbar({
        text: e.message
      });
    }
  };

  selectOption = category => {
    if (this.props.expenseType == EXPENSE_TYPES.HEALTHCARE) {
      category = { id: CATEGORY_IDS.HEALTHCARE.EXPENSE, name: "Expenses" };
    }
    this.setState(
      {
        selectedOption: category
      },
      () => {
        const visibleIds = this.state.visibleOptions.map(option => category.id);
        const idx = visibleIds.indexOf(category.id);
        if (idx > -1) {
          if (
            this.props.mainCategoryId == MAIN_CATEGORY_IDS.AUTOMOBILE ||
            this.props.mainCategoryId == MAIN_CATEGORY_IDS.ELECTRONICS
          ) {
            this.scrollView.scrollTo({ x: idx * 70, animated: false });
          }
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

  show = () => {
    this.setState({
      isModalVisible: true
    });
  };

  hide = () => {
    this.setState({
      isModalVisible: false
    });
  };
  changeOption = category => {
    console.log("props check", category)
    this.setState({
      addAnotherTxt: category.name
    })
    let { otherOptions } = this.state;
    console.log("other options", otherOptions)
    console.log("Main cat id", this.props.mainCategoryId);
    if (otherOptions.length > 0) {
      otherOptions.map((item, index) => {
        if (item.id == category.id) {
          if (this.props.expenseType == EXPENSE_TYPES.AUTO_INSURANCE) {
            // open modal
            this.setState({
              isModalVisible: true,
              selectedCategory: category,
              userProducts: otherOptions[index].products
            })
          }
          else {
            this.freshProduct(category);
          }
        }
      })
    } else {
      this.freshProduct(category);
    }


  };
  freshProduct = category => {
    let subCategoryId = null;
    if (this.props.expenseType == EXPENSE_TYPES.HEALTHCARE) {
      subCategoryId = category.id;
      category = {
        id: CATEGORY_IDS.HEALTHCARE.EXPENSE,
        name: "Expenses"
      };
    }

    if (typeof this.props.onCategorySelect != "function") {
      return;
    }
    this.props.onCategorySelect({
      category: category,
      subCategoryId
    });
    this.selectOption(category);
  }
  existingProduct = item => {
    this.props.onCategorySelect({
      category: this.state.selectedCategory,
      product: item
    });
  }

  render() {
    const {
      title,
      visibleOptions,
      selectedOption,
      otherOptions,
      showOtherOption,
      genericIcon,
      isLoading,
      reasons,
      isModalVisible,
      userProducts,
      selectedCategory,
      addAnotherTxt
    } = this.state;
    return (
      <Step
        title={title}
        skippable={false}
        showLoader={isLoading}
        {...this.props}
      >
        <View collapsable={false} style={styles.container}>
          <View collapsable={false} style={styles.header}>
            <SelectModal
              ref={ref => (this.otherOptionsModal = ref)}
              style={styles.select}
              dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
              options={otherOptions.map(option => ({
                ...option,
                image: API_BASE_URL + option.categoryImageUrl
              }))}
              imageKey="image"
              selectedOption={selectedOption}
              onOptionSelect={value => {
                this.changeOption(value);
              }}
              hideAddNew={true}
            />
            <ScrollView
              ref={ref => (this.scrollView = ref)}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              alwaysBounceHorizontal={false}
              style={{ paddingBottom: 5 }}
            >
              {visibleOptions.map(option => {
                const isSelectedOption =
                  selectedOption && selectedOption.id == option.id;
                return (
                  <TouchableWithoutFeedback
                    onPress={() => this.changeOption(option)}
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
                          source={option.icon}
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
                      style={[styles.optionIcon]}
                      resizeMode="contain"
                      source={genericIcon}
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
              {otherOptions.length > 0 && (
                <TouchableWithoutFeedback
                  onPress={() => this.otherOptionsModal.openModal()}
                >
                  <View collapsable={false} style={styles.option}>
                    <View
                      collapsable={false}
                      style={styles.optionIconContainer}
                    >
                      <Image
                        style={[styles.optionIcon]}
                        resizeMode="contain"
                        source={require("../../../images/categories/others.png")}
                      />
                    </View>
                    <Text weight="Medium" style={styles.optionName}>
                      Others
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              )}
            </ScrollView>
          </View>
          <View collapsable={false} style={styles.body}>
            <View collapsable={false} style={styles.selectCategoryMsgContainer}>
              <Text weight="Medium" style={styles.selectCategoryMsg}>
                Select a type above to
              </Text>
              {reasons.map((reason, index) => {
                return (
                  <Text key={index} style={styles.reason}>
                    - {reason} -
                  </Text>
                );
              })}
            </View>
            <View collapsable={false} />
          </View>
        </View>
        {isModalVisible && (
          <View>
            <Modal
              isVisible={true}
              useNativeDriver={true}
              onBackButtonPress={this.hide}
              onBackdropPress={this.hide}
              avoidKeyboard={Platform.OS == "ios"}
            >
              <View style={styles.modal}>
                <View style={{ backgroundColor: colors.pinkishOrange, padding: 10, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                  <Text weight="Bold" style={{ color: '#fff', fontSize: 17 }}>Select Vehicle to Add Insurance</Text>
                </View>
                {userProducts.map((item, index) => (
                  <TouchableWithoutFeedback
                    onPress={() => this.existingProduct(item)}
                  >
                    <View key={index} style={styles.optionPosition}>
                      <View style={styles.optionIconContainer}>
                        <Image
                          style={
                            styles.optionIcon
                          }
                          resizeMode="contain"
                          source={selectedCategory.icon}
                        />
                      </View>
                      <Text weight="Medium" style={{ alignSelf: "center", marginLeft: 5 }}>{item.product_name}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                ))}
                <TouchableWithoutFeedback
                  onPress={() => this.freshProduct(selectedCategory)}
                >
                  <View style={styles.optionPosition}>
                    <View style={styles.optionIconContainer}>
                      <Image
                        style={
                          styles.optionIcon
                        }
                        resizeMode="contain"
                        source={selectedCategory.icon}
                      />
                    </View>
                    <Text weight="Medium" style={{ alignSelf: "center", marginLeft: 5 }}>Add Another {addAnotherTxt}</Text>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableOpacity style={styles.closeIcon} onPress={this.hide}>
                  <Icon name="md-close" size={30} color={'#fff'} />
                </TouchableOpacity>
              </View>
            </Modal></View>
        )}
      </Step>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "#fff",
    borderRadius: 10
  },
  closeIcon: {
    position: "absolute",
    right: 10,
    top: 10,
    paddingHorizontal: 10
  },
  body: {
    backgroundColor: "red",
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7"
  },
  header: {
    width: "100%",
    alignItems: "center",
    paddingTop: 8,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
    borderColor: "#eee",
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  option: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    width: 100
  },
  optionIconContainer: {
    width: 75,
    height: 75,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: 40,
    // marginBottom: 12
  },
  optionPosition: {
    flexDirection: 'row',
    marginTop: 5,
    marginLeft: 5
  },
  selectedOptionIconContainer: {
    backgroundColor: "#FFF",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.3,
    shadowRadius: 2
  },
  optionIcon: {
    width: 50,
    height: 50,
    // opacity: 0.3
  },
  selectedOptionIcon: {
    // opacity: 1
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
    width: 0,
    height: 0,
    overflow: "hidden",
    padding: 0,
    margin: 0
  },
  selectCategoryMsgContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
    borderColor: "#eee",
    borderTopWidth: StyleSheet.hairlineWidth
  },
  selectCategoryMsg: {
    fontSize: 20,
    width: 300,
    textAlign: "center",
    color: colors.mainBlue,
    marginBottom: 10,
    marginTop: -150
  },
  reason: {
    color: "#4a4a4a",
    fontSize: 14,
    lineHeight: 22,
    // marginLeft: 100,
    alignSelf: "center"
  }
});

export default SelectCategoryStep;
