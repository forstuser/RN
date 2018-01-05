import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  TextInput
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import DeviceInfo from "react-native-device-info";
import moment from "moment";
import LinearGradient from "react-native-linear-gradient";
import { Text, Button } from "../../elements";
import I18n from "../../i18n";
import { colors } from "../../theme";
import {
  API_BASE_URL,
  getReferenceDataBrands,
  getReferenceDataModels,
  addProduct
} from "../../api";
import { openBillsPopUp } from "../../navigation";
import SelectModal from "../../components/select-modal";
import DatePicker from "react-native-datepicker";
import UploadBillOptions from "../../components/upload-bill-options";

class AddProductItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mainCategoryId: 2,
      categoryId: 327,
      categoryFormId: 2,
      text: "Now let’s add your Mobile to Your eHome",
      icon: require("../../images/ic_mobile.png"),
      showDetectDeviceBtn: false,
      brands: [],
      selectedBrand: null,
      brandName: "",
      models: [],
      selectedModel: null,
      modelName: "",
      purchaseDate: null,
      productName: null,
      isBillUploaded: false
    };
  }

  componentDidMount() {
    const productType = this.props.productType;
    let productSpecificState = {};
    switch (productType) {
      case "Mobile":
        productSpecificState = {
          mainCategoryId: 2,
          categoryId: 327,
          categoryFormId: 2,
          text: I18n.t("add_products_screen_slide_mobile"),
          icon: require("../../images/ic_mobile.png"),
          showDetectDeviceBtn: false
        };
        break;
      case "Car":
        productSpecificState = {
          mainCategoryId: 3,
          categoryId: 139,
          categoryFormId: 1073,
          text: I18n.t("add_products_screen_slide_car"),
          icon: require("../../images/ic_car.png")
        };
        break;
      case "Bike":
        productSpecificState = {
          mainCategoryId: 3,
          categoryId: 138,
          categoryFormId: 1080,
          text: I18n.t("add_products_screen_slide_bike"),
          icon: require("../../images/ic_bike.png")
        };
        break;
      case "Fridge":
        productSpecificState = {
          mainCategoryId: 2,
          categoryId: 491,
          categoryFormId: 26,
          text: I18n.t("add_products_screen_slide_fridge"),
          icon: require("../../images/ic_fridge.png")
        };
        break;
      case "Television":
        productSpecificState = {
          mainCategoryId: 2,
          categoryId: 581,
          categoryFormId: 33,
          text: I18n.t("add_products_screen_slide_television"),
          icon: require("../../images/ic_tv.png")
        };
        break;
      case "Washing Machine":
        productSpecificState = {
          mainCategoryId: 2,
          categoryId: 541,
          categoryFormId: 1044,
          text: I18n.t("add_products_screen_slide_washing_machine"),
          icon: require("../../images/ic_washing_machine.png")
        };
        break;
    }
    this.setState(
      {
        ...productSpecificState,
        brands: [],
        selectedBrand: null,
        brandName: "",
        models: [],
        selectedModel: null,
        modelName: ""
      },
      () => {
        this.fetchBrands();
      }
    );
  }

  fetchBrands = async () => {
    try {
      const brands = await getReferenceDataBrands(this.state.categoryId);
      this.setState({ brands });
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  onBrandSelect = brand => {
    if (this.state.selectedBrand && this.state.selectedBrand.id == brand.id) {
      return;
    }
    this.setState(
      {
        selectedBrand: brand,
        brandName: "",
        models: [],
        modelName: "",
        selectedModel: null
      },
      () => this.fetchModels()
    );
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

  fetchModels = async () => {
    if (this.state.selectedBrand) {
      try {
        const models = await getReferenceDataModels(
          this.state.categoryId,
          this.state.selectedBrand.id
        );
        this.setState({ models });
      } catch (e) {
        Alert.alert(e.message);
      }
    }
  };

  onModelNameChange = text => {
    this.setState({
      modelName: text,
      selectedModel: null
    });
  };

  onDetectDeviceClick = () => {
    try {
      const brandName = DeviceInfo.getBrand();
      const modelName = DeviceInfo.getModel();
      this.setState(
        {
          brandName
        },
        () => {
          this.setState({ modelName });
        }
      );
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  onAddProductBtnClick = async () => {
    try {
      const {
        mainCategoryId,
        categoryId,
        selectedBrand,
        brandName,
        selectedModel,
        modelName,
        categoryFormId,
        productName,
        purchaseDate
      } = this.state;
      let tempProductName = "";
      if (!selectedBrand && !brandName.trim()) {
        return Alert.alert("Please select or enter brand name");
      } else if (selectedBrand) {
        tempProductName = selectedBrand.name;
      } else {
        tempProductName = brandName;
      }

      if (!selectedModel && !modelName.trim()) {
        return Alert.alert("Please select or enter model name");
      } else if (selectedModel) {
        tempProductName = tempProductName + " " + selectedModel.title;
      } else {
        tempProductName = tempProductName + " " + modelName;
      }

      if (!productName) {
        productName = tempProductName;
      }

      if (!purchaseDate) {
        return Alert.alert(
          I18n.t("add_product_screen_alert_select_purchase_date")
        );
      }

      await addProduct({
        productName,
        mainCategoryId,
        categoryId,
        brandId: selectedBrand ? selectedBrand.id : undefined,
        brandName: brandName,
        purchaseDate,
        metadata: [
          {
            categoryFormId,
            value: selectedModel ? selectedModel.title : modelName,
            isNewValue: selectedModel ? false : true
          }
        ]
      });
      this.props.onProductAdded();
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  render() {
    const {
      text,
      icon,
      brands,
      selectedBrand,
      brandName,
      models,
      selectedModel,
      modelName,
      showDetectDeviceBtn,
      purchaseDate,
      productName,
      isBillUploaded
    } = this.state;

    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.outerContainer}>
        <LinearGradient
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 0.0, y: 1 }}
          colors={["#01c8ff", "#0ae2f1"]}
          style={styles.container}
        >
          <Text weight="Bold" style={styles.title}>
            {this.state.text}
          </Text>
          <Image style={styles.icon} source={icon} resizeMode="contain" />
          <View style={styles.detectDeviceWrapper}>
            {showDetectDeviceBtn && (
              <TouchableOpacity
                onPress={this.onDetectDeviceClick}
                style={styles.detectDevice}
              >
                <Image
                  style={styles.detectDeviceIcon}
                  source={require("../../images/ic_detect_device.png")}
                />
                <Text style={styles.detectDeviceText}>
                  {I18n.t("add_products_screen_detect_device")}
                </Text>
              </TouchableOpacity>
            )}
          </View>

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

          <SelectModal
            style={styles.select}
            visibleKey="title"
            dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
            placeholder={I18n.t("add_products_screen_slide_select_model")}
            textInputPlaceholder={I18n.t(
              "add_products_screen_slide_enter_model"
            )}
            placeholderRenderer={({ placeholder }) => (
              <Text weight="Bold" style={{ color: colors.secondaryText }}>
                {placeholder}
              </Text>
            )}
            options={models}
            beforeModalOpen={() => {
              if (!selectedBrand) {
                Alert.alert("Please select brand first");
                return false;
              }
              return true;
            }}
            selectedOption={selectedModel}
            textInputValue={modelName}
            onOptionSelect={value => {
              this.setState({
                selectedModel: value
              });
            }}
            onTextInputChange={text => this.setState({ modelName: text })}
          />

          <View style={[styles.select]}>
            <DatePicker
              style={{
                position: "absolute",
                top: 0,
                width: 320,
                left: 0,
                bottom: 0
              }}
              date={purchaseDate}
              mode="date"
              placeholder={I18n.t(
                "add_product_screen_placeholder_purchase_date"
              )}
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

          <TextInput
            style={[styles.select]}
            underlineColorAndroid="transparent"
            placeholder={I18n.t("add_product_screen_placeholder")}
            value={productName}
            onChangeText={productName => this.setState({ productName })}
          />

          <TouchableOpacity
            onPress={() => this.uploadBillOptions.show()}
            style={[styles.select, { flexDirection: "row", marginBottom: 35 }]}
          >
            <Text
              weight="Bold"
              style={{ color: colors.secondaryText, flex: 1 }}
            >
              {!isBillUploaded &&
                I18n.t("add_products_screen_slide_upload_bill")}
              {isBillUploaded &&
                I18n.t("add_products_screen_slide_bill_uploaded")}
            </Text>
            {!isBillUploaded && (
              <Image
                style={{ width: 24, height: 24 }}
                source={require("../../images/ic_upload_new_pic_orange.png")}
              />
            )}
          </TouchableOpacity>
          <Button
            onPress={this.onAddProductBtnClick}
            text={I18n.t("add_products_screen_slide_add_product_btn")}
            color="secondary"
            style={{ width: 300 }}
          />
        </LinearGradient>
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
  outerContainer: {
    width: Dimensions.get("window").width
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    width: Dimensions.get("window").width,
    minHeight: Dimensions.get("window").height
  },
  title: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 15
  },
  icon: {
    width: 130,
    height: 68
  },
  detectDeviceWrapper: {
    height: 20
  },
  detectDevice: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    marginBottom: 5
  },
  detectDeviceIcon: {
    width: 12,
    height: 12,
    marginRight: 10
  },
  detectDeviceText: {
    fontSize: 14,
    color: "#fff"
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
  }
});
export default AddProductItem;
