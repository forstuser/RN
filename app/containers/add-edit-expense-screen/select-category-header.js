import React from "react";
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert
} from "react-native";
import I18n from "../../i18n";
import { MAIN_CATEGORY_IDS } from "../../constants";
import { Text } from "../../elements";
import { colors } from "../../theme";

import { getReferenceDataCategories } from "../../api";

import SelectModal from "../../components/select-modal";

class SelectCategoryHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "Select Type",
      selectedOption: null,
      visibleOptions: [],
      otherOptions: [],
      genericIcon: null,
      showOtherOption: false
    };
  }
  componentDidMount() {
    let title = "Select Type";
    let genericIcon = null;
    let visibleOptions = [];

    switch (this.props.mainCategoryId) {
      case MAIN_CATEGORY_IDS.AUTOMOBILE:
        title = I18n.t("add_edit_expense_screen_title_select_automobile");
        genericIcon = require("../../images/categories/generic_automobile.png");
        visibleOptions = [
          {
            id: 139,
            name: "Four Wheeler",
            icon: require("../../images/categories/car.png")
          },
          {
            id: 138,
            name: "Two Wheeler",
            icon: require("../../images/categories/bike.png")
          },
          {
            id: 154,
            name: "Cycle",
            icon: require("../../images/categories/bicycle.png")
          },
          {
            id: 152,
            name: "Passenger Carrier",
            icon: require("../../images/categories/bicycle.png")
          }
        ];
        if (typeof this.props.onCategorySelect == "function") {
          this.fetchCategories();
        }
        break;
      case MAIN_CATEGORY_IDS.ELECTRONICS:
        title = I18n.t("add_edit_expense_screen_title_select_electronics");
        genericIcon = require("../../images/categories/generic_electronic.png");
        visibleOptions = [
          {
            id: 327,
            name: "Mobile",
            icon: require("../../images/categories/mobile.png")
          },
          {
            id: 581,
            name: "T.V.",
            icon: require("../../images/categories/television.png")
          },
          {
            id: 487,
            name: "Laptop",
            icon: require("../../images/categories/laptop.png")
          },
          {
            id: 162,
            name: "A.C.",
            icon: require("../../images/categories/air_conditioner.png")
          },
          {
            id: 530,
            name: "Water Purifier",
            icon: require("../../images/categories/water_purifier.png")
          },
          {
            id: 491,
            name: "Refrigerator",
            icon: require("../../images/categories/fridge.png")
          },
          {
            id: 541,
            name: "Washing Machine",
            icon: require("../../images/categories/washing_machine.png")
          }
        ];
        if (typeof this.props.onCategorySelect == "function") {
          this.fetchCategories();
        }
        break;
      case MAIN_CATEGORY_IDS.FURNITURE:
        title = I18n.t("add_edit_expense_screen_title_select_furniture");
        visibleOptions = [
          {
            id: 20,
            name: "Furniture",
            icon: require("../../images/categories/furniture.png")
          },
          {
            id: 72,
            name: "Hardware",
            icon: require("../../images/categories/hardware.png")
          },
          {
            id: 73,
            name: "Other Furniture/Hardware",
            icon: require("../../images/categories/bathroom_fittings.png")
          }
        ];
        break;
      case MAIN_CATEGORY_IDS.SERVICES:
        title = I18n.t("add_edit_expense_screen_title_select_service_expense");
        visibleOptions = [
          {
            id: 122,
            name: "Professional",
            icon: require("../../images/categories/professional.png")
          },
          {
            id: 123,
            name: "Lessons & Hobbies",
            icon: require("../../images/categories/hobbies.png")
          },
          {
            id: 24,
            name: "Other Services",
            icon: require("../../images/categories/house_helps.png")
          }
        ];
        break;
      case MAIN_CATEGORY_IDS.TRAVEL:
        title = I18n.t("add_edit_expense_screen_title_select_travel");
        visibleOptions = [
          {
            id: 22,
            name: "Travel",
            icon: require("../../images/categories/travel.png")
          },
          {
            id: 85,
            name: "Dining",
            icon: require("../../images/categories/dining.png")
          },
          {
            id: 84,
            name: "Hotel Stay",
            icon: require("../../images/categories/hotel.png")
          }
        ];
        break;

      case MAIN_CATEGORY_IDS.FASHION:
        title = I18n.t("add_edit_expense_screen_title_select_fashion_expense");
        visibleOptions = [
          {
            id: 644,
            name: "Footwear",
            icon: require("../../images/categories/shoes.png")
          },
          {
            id: 645,
            name: "Shades",
            icon: require("../../images/categories/shades.png")
          },
          {
            id: 646,
            name: "Watches",
            icon: require("../../images/categories/watches.png")
          },
          {
            id: 647,
            name: "Clothes",
            icon: require("../../images/categories/clothes.png")
          },
          {
            id: 648,
            name: "Bags",
            icon: require("../../images/categories/bags.png")
          },
          {
            id: 649,
            name: "Jewellary & Accessories",
            icon: require("../../images/categories/jewellary.png")
          },
          {
            id: 729,
            name: "Make-Up",
            icon: require("../../images/categories/make_up.png")
          }
        ];
        break;
      case MAIN_CATEGORY_IDS.HOUSEHOLD:
        title = I18n.t("add_edit_expense_screen_title_select_home_expense");
        visibleOptions = [
          {
            id: 26,
            name: "Household Expense",
            icon: require("../../images/categories/household.png")
          },
          {
            id: 635,
            name: "Education",
            icon: require("../../images/categories/education.png")
          },
          {
            id: 634,
            name: "Utility Bills",
            icon: require("../../images/categories/utility_bill.png")
          },
          {
            id: 697,
            name: "Home Decor",
            icon: require("../../images/categories/home_decor.png")
          },
          {
            id: 698,
            name: "Other Household Expenses",
            icon: require("../../images/categories/kitchen_utensils.png")
          }
        ];
        break;
      case MAIN_CATEGORY_IDS.HEALTHCARE:
        if (this.props.healthcareFormType == "medical_docs") {
          title = I18n.t(
            "add_edit_expense_screen_title_select_medical_document"
          );
          visibleOptions = [
            {
              id: 86,
              name: "Medical Docs",
              icon: require("../../images/categories/medical_docs.png")
            },
            {
              id: 664,
              name: "Insurance",
              icon: require("../../images/categories/insurance.png")
            }
          ];
        } else {
          title = I18n.t("add_edit_expense_screen_title_select_health_expense");
          visibleOptions = [
            {
              id: 704,
              name: "Medical Bills",
              icon: require("../../images/categories/medical_bill.png")
            },
            {
              id: 705,
              name: "Hospital Bills",
              icon: require("../../images/categories/hospital.png")
            }
          ];
          break;
        }
        break;
    }

    this.setState(
      {
        title,
        genericIcon,
        visibleOptions
      },
      () => {
        //if category is already selected
        if (this.props.categoryId) {
          console.log("this.props.categoryId: ", this.props.categoryId);
          console.log("this.state.visibleOptions: ", this.state.visibleOptions);
          const category = this.state.visibleOptions.find(
            option => option.id == this.props.categoryId
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
      Alert.alert(e.message);
    }
  };

  onOptionSelect = option => {
    const selectedOption = this.state.selectedOption;
    //if clicked on already selected option
    if (selectedOption && selectedOption.id == option.id) {
      return;
    } else {
      // else if (selectedOption && selectedOption.id != option.id) {
      //   return setTimeout(() => {
      //     Alert.alert(
      //       "Change category type?",
      //       "All your filled data will be lost?",
      //       [
      //         {
      //           text: "Yes, Change",
      //           onPress: () => this.changeOption(option)
      //         },
      //         {
      //           text: "No, Don't change",
      //           onPress: () => {},
      //           style: "cancel"
      //         }
      //       ]
      //     );
      //   }, 100);
      // }
      this.changeOption(option);
    }
  };

  changeOption = option => {
    if (typeof this.props.onCategorySelect != "function") {
      return;
    }
    this.props.onCategorySelect(option);
    this.setState(
      {
        selectedOption: option
      },
      () => {
        const visibleIds = this.state.visibleOptions.map(option => option.id);
        const idx = visibleIds.indexOf(option.id);
        if (idx > -1) {
          if (
            this.props.mainCategoryId == MAIN_CATEGORY_IDS.AUTOMOBILE ||
            this.props.mainCategoryId == MAIN_CATEGORY_IDS.ELECTRONICS
          ) {
            this.scrollView.scrollTo({ x: idx * 70, animated: true });
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

  render() {
    const {
      title,
      visibleOptions,
      selectedOption,
      otherOptions,
      showOtherOption,
      genericIcon
    } = this.state;
    return (
      <View style={styles.container}>
        <Text weight="Medium" style={styles.title}>
          {title}
        </Text>
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
                <View style={styles.option}>
                  <View
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
                      source={option.icon}
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
          {selectedOption &&
            showOtherOption && (
              <View style={styles.option}>
                <View
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
            )}
          {otherOptions.length > 0 && (
            <TouchableWithoutFeedback
              onPress={() => this.otherOptionsModal.openModal()}
            >
              <View style={styles.option}>
                <View style={styles.optionIconContainer}>
                  <Image
                    style={[styles.optionIcon]}
                    resizeMode="contain"
                    source={require("../../images/categories/others.png")}
                  />
                </View>
                <Text weight="Medium" style={styles.optionName}>
                  Others
                </Text>
              </View>
            </TouchableWithoutFeedback>
          )}
        </ScrollView>
        <SelectModal
          ref={ref => (this.otherOptionsModal = ref)}
          style={styles.select}
          dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
          options={otherOptions}
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
    padding: 0
  }
});

export default SelectCategoryHeader;
