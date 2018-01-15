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
    switch (this.props.mainCategoryId) {
      case MAIN_CATEGORY_IDS.AUTOMOBILE:
        this.setState(() => ({
          title: "Select Automobile Type",
          genericIcon: require("../../images/categories/generic_automobile.png"),
          visibleOptions: [
            {
              id: 139,
              name: "Car",
              icon: require("../../images/categories/car.png")
            },
            {
              id: 138,
              name: "Bike",
              icon: require("../../images/categories/bike.png")
            },
            {
              id: 150,
              name: "Scooter",
              icon: require("../../images/categories/scooter.png")
            },
            {
              id: 154,
              name: "Cycle",
              icon: require("../../images/categories/bicycle.png")
            },
            {
              id: 153,
              name: "Van",
              icon: require("../../images/categories/van.png")
            }
          ]
        }));
        if (typeof this.props.onCategorySelect == "function") {
          this.fetchCategories();
        }
        break;
      case MAIN_CATEGORY_IDS.ELECTRONICS:
        this.setState(() => ({
          title: "Select Electronics & Electricals Type",
          genericIcon: require("../../images/categories/generic_electronic.png"),
          visibleOptions: [
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
          ]
        }));
        if (typeof this.props.onCategorySelect == "function") {
          this.fetchCategories();
        }
        break;
      case MAIN_CATEGORY_IDS.FURNITURE:
        this.setState(() => ({
          title: "Select Furniture & Hardware Type",
          visibleOptions: [
            {
              id: 20,
              name: "Furniture",
              icon: require("../../images/categories/furniture.png")
            },
            {
              id: 73,
              name: "Bathroom Fittings",
              icon: require("../../images/categories/bathroom_fittings.png")
            },
            {
              id: 72,
              name: "Hardware",
              icon: require("../../images/categories/hardware.png")
            }
          ]
        }));
        break;
      case MAIN_CATEGORY_IDS.SERVICES:
        this.setState(() => ({
          title: "Select Services Expense Category",
          visibleOptions: [
            {
              id: 24,
              name: "House Helps",
              icon: require("../../images/categories/house_helps.png")
            },
            {
              id: 122,
              name: "Professional",
              icon: require("../../images/categories/professional.png")
            },
            {
              id: 123,
              name: "Lessons & Hobbies",
              icon: require("../../images/categories/hobbies.png")
            }
          ]
        }));
        break;
      case MAIN_CATEGORY_IDS.TRAVEL:
        this.setState(() => ({
          title: "Select Travel & Dinning Category",
          visibleOptions: [
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
          ]
        }));
        break;
      case MAIN_CATEGORY_IDS.HEALTHCARE:
        this.setState(() => ({
          title: "Select Healthcare Expense Category",
          visibleOptions: [
            {
              id: 23,
              name: "Expenses(to be changed)",
              icon: require("../../images/categories/medical_bill.png")
            },
            {
              id: 86,
              name: "Prescription and  Reports(to be changed)",
              icon: require("../../images/categories/hospital.png")
            }
          ]
        }));
        break;
      case MAIN_CATEGORY_IDS.FASHION:
        this.setState(() => ({
          title: "Select Fashion Expense Category",
          visibleOptions: [
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
            }
          ]
        }));
        break;
      case MAIN_CATEGORY_IDS.HOUSEHOLD:
        this.setState(() => ({
          title: "Select Home Expense Category",
          visibleOptions: [
            {
              id: 26,
              name: "Household Expense",
              icon: require("../../images/categories/household.png")
            },
            {
              id: 634,
              name: "Utility",
              icon: require("../../images/categories/utility_bill.png")
            },
            {
              id: 635,
              name: "Education",
              icon: require("../../images/categories/education.png")
            }
          ]
        }));
        break;
    }

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
    if (typeof this.props.onCategorySelect != "function") {
      return;
    }

    //if clicked on already selected option
    if (
      this.state.selectedOption &&
      this.state.selectedOption.id == option.id
    ) {
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
    overflow: "hidden"
  }
});

export default SelectCategoryHeader;
