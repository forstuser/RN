import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions
} from "react-native";
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
      modelName: ""
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
          text: "Now let’s add your Mobile to Your eHome",
          icon: require("../../images/ic_mobile.png"),
          showDetectDeviceBtn: true
        };
        break;
      case "Car":
        productSpecificState = {
          mainCategoryId: 3,
          categoryId: 139,
          categoryFormId: 1073,
          text: "Gotta a Car! Why not add it to Your eHome",
          icon: require("../../images/ic_car.png")
        };
        break;
      case "Bike":
        productSpecificState = {
          mainCategoryId: 3,
          categoryId: 138,
          categoryFormId: 1080,
          text: "If you have a bike too, add it to Your eHome",
          icon: require("../../images/ic_bike.png")
        };
        break;
      case "Fridge":
        productSpecificState = {
          mainCategoryId: 2,
          categoryId: 491,
          categoryFormId: 26,
          text: "Do you like it so far, let’s add more products : Fridge",
          icon: require("../../images/ic_fridge.png")
        };
        break;
      case "Television":
        productSpecificState = {
          mainCategoryId: 2,
          categoryId: 581,
          categoryFormId: 33,
          text: "Do you like it so far, let’s add more products : Television",
          icon: require("../../images/ic_tv.png")
        };
        break;
      case "Washing Machine":
        productSpecificState = {
          mainCategoryId: 2,
          categoryId: 541,
          categoryFormId: 1044,
          text:
            "Do you like it so far, let’s add more products : Washing Machine",
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
        categoryFormId
      } = this.state;
      let productName = "";
      if (!selectedBrand && !brandName.trim()) {
        return Alert.alert("Please select or enter brand name");
      } else if (selectedBrand) {
        productName = selectedBrand.name;
      } else {
        productName = brandName;
      }

      if (!selectedModel && !modelName.trim()) {
        return Alert.alert("Please select or enter model name");
      } else if (selectedModel) {
        productName = productName + " " + selectedModel.name;
      } else {
        productName = productName + " " + modelName;
      }

      await addProduct({
        productName,
        mainCategoryId,
        categoryId,
        brandId: selectedBrand ? selectedBrand.id : undefined,
        brandName: brandName,
        metadata: [
          {
            categoryFormId,
            value: selectedModel ? selectedModel.name : modelName,
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
    const onUploadBillPress = this.props.onUploadBillPress;
    const {
      text,
      icon,
      brands,
      selectedBrand,
      brandName,
      models,
      selectedModel,
      modelName,
      showDetectDeviceBtn
    } = this.state;

    return (
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
              <Text style={styles.detectDeviceText}>DETECT THIS DEVICE</Text>
            </TouchableOpacity>
          )}
        </View>

        <SelectModal
          style={styles.select}
          dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
          placeholder="Select a brand"
          textInputPlaceholder="Enter your brand"
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
          placeholder="Select Model Name"
          textInputPlaceholder="Enter your model"
          placeholderRenderer={({ placeholder }) => (
            <Text weight="Bold" style={{ color: colors.secondaryText }}>
              {placeholder}
            </Text>
          )}
          options={models}
          selectedOption={selectedModel}
          textInputValue={modelName}
          onOptionSelect={value => {
            this.setState({
              selectedModel: value
            });
          }}
          onTextInputChange={text => this.setState({ modelName: text })}
        />
        <TouchableOpacity
          onPress={onUploadBillPress}
          style={[styles.select, { flexDirection: "row", marginBottom: 35 }]}
        >
          <Text weight="Bold" style={{ color: colors.secondaryText, flex: 1 }}>
            Upload Bill (Optional)
          </Text>
          <Image
            style={{ width: 24, height: 24 }}
            source={require("../../images/ic_upload_new_pic_orange.png")}
          />
        </TouchableOpacity>
        <Button
          onPress={this.onAddProductBtnClick}
          text="Add Product"
          color="secondary"
          style={{ width: 320 }}
        />
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    width: Dimensions.get("window").width
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
    height: 50
  },
  detectDevice: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    marginBottom: 25
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
    width: 320,
    borderRadius: 4,
    padding: 14,
    marginBottom: 20
  }
});
export default AddProductItem;
