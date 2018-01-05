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
import {
  API_BASE_URL,
  getReferenceDataCategories,
  getReferenceDataBrands,
  addProduct
} from "../api";
import { openAppScreen } from "../navigation";
import SelectModal from "../components/select-modal";
import UploadBillOptions from "../components/upload-bill-options";
import { MAIN_CATEGORY_IDS } from "../constants";

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
      expensePlaceholderText: I18n.t(
        "add_product_screen_placeholder_expense_type"
      ),
      categories: [],
      selectedCategory: null,
      isBrandSelectVisible: false,
      brands: [],
      selectedBrand: null,
      brandName: "",
      amount: null,
      productName: null,
      purchaseDate: null,
      isFinishModalVisible: false,
      finishImageSource: ehomeImage,
      isBillUploaded: false
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

  fetchBrands = async () => {
    try {
      const brands = await getReferenceDataBrands(this.state.categoryId);
      this.setState({ brands });
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

    let expensePlaceholderText = I18n.t(
      "add_product_screen_placeholder_expense_type"
    );
    let isBrandSelectVisible = false;

    if (mainCategory.id == 2 || mainCategory.id == 3) {
      expensePlaceholderText = I18n.t(
        "add_product_screen_placeholder_product_type"
      );
    }

    this.setState(
      {
        selectedMainCategory: mainCategory,
        expensePlaceholderText: expensePlaceholderText,
        categories: [],
        selectedCategory: null,
        isBrandSelectVisible,
        finishImageSource: {
          uri: API_BASE_URL + `/categories/${mainCategory.id}/images/1`
        }
      },
      () => this.fetchCategories()
    );
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

  onCategorySelect = category => {
    if (
      this.state.selectedCategory &&
      this.state.selectedCategory.id == category.id
    ) {
      return;
    }

    let isBrandSelectVisible = false;
    const mainCategoryId = this.state.selectedMainCategory.id;
    if (mainCategoryId == 2 || mainCategoryId == 3) {
      isBrandSelectVisible = true;
    }

    this.setState(
      {
        selectedCategory: category,
        isBrandSelectVisible: isBrandSelectVisible,
        brands: [],
        selectedBrand: null
      },
      () => this.fetchBrands()
    );
  };

  fetchBrands = async () => {
    try {
      const brands = await getReferenceDataBrands(
        this.state.selectedCategory.id
      );
      this.setState({ brands });
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  onBrandSelect = brand => {
    if (this.state.selectedBrand && this.state.selectedBrand.id == brand.id) {
      return;
    }
    this.setState({
      selectedBrand: brand,
      brandName: ""
    });
  };

  onBrandNameChange = text => {
    this.setState({
      brandName: text,
      selectedBrand: null,
      models: [],
      modelName: "",
      selectedModel: null
    });
  };

  onAddProductBtnClick = async () => {
    try {
      const {
        mainCategories,
        selectedMainCategory,
        categories,
        selectedCategory,
        selectedBrand,
        brandName,
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
        if (
          selectedMainCategory.id == MAIN_CATEGORY_IDS.AUTOMOBILE ||
          selectedMainCategory.id == MAIN_CATEGORY_IDS.ELECTRONICS
        ) {
          return Alert.alert(I18n.t("add_product_screen_alert_select_product"));
        } else {
          return Alert.alert(I18n.t("add_product_screen_alert_select_expense"));
        }
      } else {
        tempProductName = tempProductName + " " + selectedCategory.name;
      }

      if (!productName) {
        productName = tempProductName;
      }

      if (
        (selectedMainCategory.id == MAIN_CATEGORY_IDS.AUTOMOBILE ||
          selectedMainCategory.id == MAIN_CATEGORY_IDS.ELECTRONICS) &&
        !selectedBrand &&
        !brandName.trim()
      ) {
        return Alert.alert("Please select or enter brand name");
      }

      if (!purchaseDate) {
        return Alert.alert(
          I18n.t("add_product_screen_alert_select_purchase_date")
        );
      }

      await addProduct({
        productName,
        mainCategoryId: selectedMainCategory.id,
        categoryId: selectedCategory.id,
        brandId: selectedBrand ? selectedBrand.id : undefined,
        brandName: brandName || undefined,
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
      expensePlaceholderText,
      categories,
      selectedCategory,
      isBrandSelectVisible,
      brands,
      selectedBrand,
      brandName,
      amount,
      productName,
      purchaseDate,
      isFinishModalVisible,
      finishImageSource,
      isBillUploaded
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
          placeholder={expensePlaceholderText}
          placeholderRenderer={({ placeholder }) => (
            <Text weight="Bold" style={{ color: colors.secondaryText }}>
              {placeholder}
            </Text>
          )}
          options={categories}
          beforeModalOpen={() => {
            if (!selectedMainCategory) {
              Alert.alert("Please select category first");
              return false;
            }
            return true;
          }}
          selectedOption={selectedCategory}
          onOptionSelect={value => {
            this.onCategorySelect(value);
          }}
          hideAddNew={true}
        />

        {isBrandSelectVisible && (
          <SelectModal
            style={styles.select}
            dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
            placeholder={I18n.t("add_products_screen_slide_select_brand")}
            textInputPlaceholder={I18n.t(
              "add_products_screen_slide_enter_brand"
            )}
            placeholderRenderer={({ placeholder }) => (
              <Text weight="Bold" style={{ color: colors.secondaryText }}>
                {placeholder}
              </Text>
            )}
            selectedOption={selectedBrand}
            textInputValue={brandName}
            options={brands}
            onOptionSelect={value => {
              this.onBrandSelect(value);
            }}
            onTextInputChange={text => this.onBrandNameChange}
          />
        )}

        <View style={[styles.select]}>
          <DatePicker
            style={{
              position: "absolute",
              top: 0,
              width: 300,
              left: 0,
              bottom: 0
            }}
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
                borderColor: "transparent",
                padding: 10,
                height: 48,
                position: "absolute",
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
                justifyContent: "center",
                alignItems: "flex-start"
              }
            }}
            onDateChange={purchaseDate => {
              this.setState({ purchaseDate });
            }}
          />
        </View>
        {isBrandSelectVisible && (
          <Text style={styles.hint}>
            {I18n.t("add_product_screen_purchase_date_hint")}
          </Text>
        )}

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

        <TouchableOpacity
          onPress={() => this.uploadBillOptions.show()}
          style={[styles.select, { flexDirection: "row", marginBottom: 35 }]}
        >
          <Text weight="Bold" style={{ color: colors.secondaryText, flex: 1 }}>
            {!isBillUploaded && I18n.t("add_products_screen_slide_upload_bill")}
            {isBillUploaded &&
              I18n.t("add_products_screen_slide_bill_uploaded")}
          </Text>
          {!isBillUploaded && (
            <Image
              style={{ width: 24, height: 24 }}
              source={require("../images/ic_upload_new_pic_orange.png")}
            />
          )}
        </TouchableOpacity>
        <Button
          onPress={this.onAddProductBtnClick}
          text={I18n.t("add_product_screen_add_product_btn")}
          color="secondary"
          style={{ width: 300 }}
        />
        <Modal useNativeDriver={true} isVisible={isFinishModalVisible}>
          <View style={styles.finishModal}>
            <Image
              style={styles.finishImage}
              source={{
                uri:
                  API_BASE_URL +
                  `/categories/${
                    selectedMainCategory ? selectedMainCategory.id : "2"
                  }/images/1`
              }}
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
          uploadCallback={() => {
            this.setState({ isBillUploaded: true });
          }}
        />
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
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
    width: 300,
    borderRadius: 4,
    padding: 14,
    marginBottom: 20
    // underlineColorAndroid: "transparent"
  },
  hint: {
    width: 300,
    color: colors.mainBlue,
    fontSize: 12,
    marginTop: -15,
    marginBottom: 20
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
