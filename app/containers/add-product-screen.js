import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  TextInput,
  ScrollView
} from "react-native";

import Modal from "react-native-modal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DatePicker from "react-native-datepicker";
import moment from "moment";
import LinearGradient from "react-native-linear-gradient";
import { Text, Button, ScreenContainer } from "../elements";
import I18n from "../i18n";
import { colors } from "../theme";
import { API_BASE_URL, getReferenceDataCategories, addProduct } from "../api";
import { openAppScreen } from "../navigation";
import SelectModal from "../components/select-modal";
import UploadBillOptions from "../components/upload-bill-options";

const ehomeImage = require("../images/ehome_circle_with_category_icons.png");

class AddProductScreen extends React.Component {
  static navigatorStyle = {
    tabBarHidden: true
  };
  static navigatorButtons = {
    rightButtons: [
      {
        title: I18n.t("add_product_screen_cancel"),
        id: "cancel",
        buttonColor: colors.pinkishOrange,
        buttonFontWeight: "600"
      }
    ]
  };
  constructor(props) {
    super(props);
    this.state = {
      mainCategories: [
        {
          id: 2,
          name: "Electrical and Electronics"
        },
        {
          id: 3,
          name: "Automobiles"
        },
        {
          id: 7,
          name: "Fashion and Fashion Accessories"
        },
        {
          id: 5,
          name: "Healthcare"
        },
        {
          id: 1,
          name: "Home Furnishing and Utensils"
        },
        {
          id: 8,
          name: "Household and Utility Bills"
        },
        {
          id: 6,
          name: "Home and Professional Services"
        },
        {
          id: 4,
          name: "Travel and Dining"
        },
        {
          id: 9,
          name: "Others"
        }
      ],
      selectedMainCategory: null,
      categories: [],
      selectedCategory: null,
      amount: null,
      productName: null,
      purchaseDate: null,
      isFinishModalVisible: false,
      finishImageSource: ehomeImage
    };
  }

  componentDidMount() {
    this.props.navigator.setTitle({
      title: I18n.t("add_product_screen_title")
    });
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  onNavigatorEvent = event => {
    if (event.type == "NavBarButtonPress") {
      if (event.id == "cancel") {
        if (this.props.withCancelButton) {
          openAppScreen();
        } else {
          this.props.navigator.pop();
        }
      }
    }
  };

  fetchCategories = async () => {
    try {
      const categories = await getReferenceDataCategories(
        this.state.selectedMainCategory.id
      );
      this.setState({ categories });
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  onMainCategorySelect = mainCategory => {
    if (
      this.state.selectedMainCategory &&
      this.state.selectedMainCategory == mainCategory.id
    ) {
      return;
    }
    this.setState(
      {
        selectedMainCategory: mainCategory,
        categories: [],
        selectedCategory: null,
        finishImageSource: {
          uri: API_BASE_URL + `/categories/${mainCategory.id}/images/1`
        }
      },
      () => this.fetchCategories()
    );
  };

  onAddProductBtnClick = async () => {
    try {
      const {
        mainCategories,
        selectedMainCategory,
        categories,
        selectedCategory,
        amount,
        productName,
        purchaseDate
      } = this.state;

      let tempProductName = "";

      if (!selectedMainCategory) {
        return Alert.alert(
          I18n.t("add_product_screen_alert_select_main_category")
        );
      } else {
        tempProductName = selectedMainCategory.name;
      }

      if (!selectedCategory) {
        return Alert.alert(I18n.t("add_product_screen_alert_select_category"));
      } else {
        tempProductName = tempProductName + " " + selectedCategory.name;
      }

      if (!productName) {
        productName = tempProductName;
      }

      await addProduct({
        productName,
        mainCategoryId: selectedMainCategory.id,
        categoryId: selectedCategory.id,
        purchaseCost: amount,
        purchaseDate
      });
      this.setState({
        isFinishModalVisible: true
      });
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  addAnotherProduct = () => {
    this.setState({
      selectedMainCategory: null,
      categories: [],
      selectedCategory: null,
      amount: null,
      productName: "",
      purchaseDate: null,
      isFinishModalVisible: false,
      finishImageSource: ehomeImage
    });
  };

  render() {
    const {
      mainCategories,
      selectedMainCategory,
      categories,
      selectedCategory,
      amount,
      productName,
      purchaseDate,
      isFinishModalVisible,
      finishImageSource
    } = this.state;

    return (
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        resetScrollToCoords={{ x: 0, y: 0 }}
      >
        <Image
          style={styles.ehomeImage}
          source={ehomeImage}
          resizeMode="contain"
        />
        <SelectModal
          style={styles.select}
          dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
          placeholder={I18n.t("add_product_screen_placeholder_main_category")}
          placeholderRenderer={({ placeholder }) => (
            <Text weight="Bold" style={{ color: colors.secondaryText }}>
              {placeholder}
            </Text>
          )}
          selectedOption={selectedMainCategory}
          options={mainCategories}
          onOptionSelect={value => {
            this.onMainCategorySelect(value);
          }}
          hideAddNew={true}
        />
        <SelectModal
          style={styles.select}
          dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
          placeholder={I18n.t("add_product_screen_placeholder_category")}
          placeholderRenderer={({ placeholder }) => (
            <Text weight="Bold" style={{ color: colors.secondaryText }}>
              {placeholder}
            </Text>
          )}
          options={categories}
          selectedOption={selectedCategory}
          onOptionSelect={value => {
            this.setState({
              selectedCategory: value
            });
          }}
          hideAddNew={true}
        />
        <TextInput
          style={[styles.select]}
          underlineColorAndroid="transparent"
          placeholder={I18n.t("add_product_screen_placeholder")}
          value={productName}
          onChangeText={productName => this.setState({ productName })}
        />
        <TextInput
          style={[styles.select]}
          placeholder={I18n.t("add_product_screen_placeholder_amount")}
          value={amount}
          keyboardType="numeric"
          onChangeText={amount => this.setState({ amount })}
        />
        <View style={[styles.select]}>
          <DatePicker
            style={{ width: 320 }}
            date={purchaseDate}
            mode="date"
            placeholder={I18n.t("add_product_screen_placeholder_purchase_date")}
            format="DD MMM YY"
            minDate="01 Jan 90"
            maxDate={moment().format("DD MMM YY")}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: "absolute",
                left: 0,
                top: 0,
                width: 0,
                height: 0
              },
              dateInput: {
                // backgroundColor: "#fff",
                borderColor: colors.secondaryText,
                borderWidth: 1,
                height: 50,
                borderRadius: 4,
                padding: 5,
                justifyContent: "flex-start",
                alignItems: "flex-start"
              }
            }}
            onDateChange={purchaseDate => {
              this.setState({ purchaseDate });
            }}
          />
        </View>
        <TouchableOpacity
          onPress={() => this.uploadBillOptions.show()}
          style={[styles.select, { flexDirection: "row", marginBottom: 35 }]}
        >
          <Text weight="Bold" style={{ color: colors.secondaryText, flex: 1 }}>
            {I18n.t("add_product_screen_placeholder_upload_bill")}
          </Text>
          <Image
            style={{ width: 24, height: 24 }}
            source={require("../images/ic_upload_new_pic_orange.png")}
          />
        </TouchableOpacity>
        <Button
          onPress={this.onAddProductBtnClick}
          text={I18n.t("add_product_screen_add_product_btn")}
          color="secondary"
          style={{ width: 320 }}
        />
        <Modal useNativeDriver={true} isVisible={isFinishModalVisible}>
          <View style={styles.finishModal}>
            <Image
              style={styles.finishImage}
              source={{ uri: API_BASE_URL + `/categories/2/images/1` }}
              resizeMode="contain"
            />
            <Text weight="Bold" style={styles.finishMsg}>
              {I18n.t("add_product_screen_finish_msg", {
                mainCategoryName:
                  selectedMainCategory != null && selectedMainCategory.name
              })}
            </Text>
            <Button
              onPress={this.addAnotherProduct}
              style={styles.finishBtn}
              text={I18n.t("add_product_screen_finish_btn")}
              color="secondary"
            />
            <Text
              onPress={() => {
                openAppScreen();
              }}
              weight="Bold"
              style={styles.doItLaterText}
            >
              {I18n.t("add_product_screen_finish_do_it_later")}
            </Text>
          </View>
        </Modal>
        <UploadBillOptions
          ref={ref => (this.uploadBillOptions = ref)}
          navigator={this.props.navigator}
        />
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 16
  },
  ehomeImage: {
    width: 150,
    height: 150,
    marginBottom: 20
  },
  select: {
    backgroundColor: "#fff",
    borderColor: colors.secondaryText,
    borderWidth: 1,
    height: 50,
    width: 320,
    borderRadius: 4,
    padding: 14,
    marginBottom: 20
    // underlineColorAndroid: "transparent"
  },
  finishModal: {
    backgroundColor: "#fff",
    height: 500,
    borderRadius: 10,
    padding: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  finishImage: {
    width: 200,
    height: 200
  },
  finishMsg: {
    color: colors.mainBlue,
    fontSize: 24,
    textAlign: "center",
    marginTop: 25
  },
  finishBtn: {
    width: 250,
    marginTop: 20
  },
  doItLaterText: {
    color: colors.pinkishOrange,
    fontSize: 16,
    marginTop: 20
  }
});
export default AddProductScreen;