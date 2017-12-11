import React from "react";
import { StyleSheet, View, Image, TouchableOpacity, Alert } from "react-native";
import moment from "moment";
import LinearGradient from "react-native-linear-gradient";
import { Text, Button } from "../../elements";
import I18n from "../../i18n";
import { colors } from "../../theme";
import { API_BASE_URL, getReferenceDataBrands, addProduct } from "../../api";
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
      brands: [],
      selectedBrand: null,
      brandName: "",
      models: [],
      selectedModel: null,
      modelName: ""
    };
  }

  componentDidMount() {
    this.fetchBrands();
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
    this.setState(
      {
        selectedBrand: brand
      }
      // () => this.fetchModels()
    );
  };

  fetchModels = async () => {
    try {
      const models = await getReferenceDataModels(this.state.selectedBrand.id);
      this.setState({ models });
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
            isNewValue: selectedModel ? false.name : true
          }
        ]
      });
      Alert.alert("Product Added");
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  render() {
    const productType = this.props.productType;
    const {
      text,
      icon,
      brands,
      selectedBrand,
      models,
      selectedModel
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
        <TouchableOpacity style={styles.detectDevice}>
          <Image
            style={styles.detectDeviceIcon}
            source={require("../../images/ic_detect_device.png")}
          />
          <Text style={styles.detectDeviceText}>DETECT THIS DEVICE</Text>
        </TouchableOpacity>

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
          selectedValue={selectedBrand}
          options={brands}
          onOptionSelect={value => {
            this.onBrandSelect(value);
          }}
          onTextInputChange={text => this.setState({ brandName: text })}
        />
        <SelectModal
          style={styles.select}
          dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
          placeholder="Select Model Name"
          textInputPlaceholder="Enter your model"
          placeholderRenderer={({ placeholder }) => (
            <Text weight="Bold" style={{ color: colors.secondaryText }}>
              {placeholder}
            </Text>
          )}
          options={models}
          selectedValue={selectedModel}
          onOptionSelect={value => {
            this.setState({
              selectedModel: value
            });
          }}
          onTextInputChange={text => this.setState({ modelName: text })}
        />
        <TouchableOpacity
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
    padding: 20
  },
  title: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 15
  },
  icon: {
    width: 68,
    height: 68
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
