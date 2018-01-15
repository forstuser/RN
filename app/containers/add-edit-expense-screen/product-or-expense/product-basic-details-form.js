import React from "react";
import { StyleSheet, View, Image, Alert, TouchableOpacity } from "react-native";

import moment from "moment";

import { MAIN_CATEGORY_IDS } from "../../../constants";
import { getReferenceDataBrands, getReferenceDataModels } from "../../../api";

import Icon from "react-native-vector-icons/Entypo";

import UploadBillOptions from "../../../components/upload-bill-options";

import { Text } from "../../../elements";
import SelectModal from "../../../components/select-modal";
import { colors } from "../../../theme";

import ContactFields from "../form-elements/contact-fields";
import CustomTextInput from "../form-elements/text-input";
import CustomDatePicker from "../form-elements/date-picker";

const AttachmentIcon = () => (
  <Icon name="attachment" size={20} color={colors.pinkishOrange} />
);

class BasicDetailsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isBillUploaded: false,
      productName: "",
      brands: [],
      selectedBrand: null,
      brandName: "",
      categoryFormIdForModelName: null,
      models: [],
      selectedModel: null,
      modelName: "",
      purchaseDate: null,
      amount: "",
      sellerName: "",
      sellerContact: "",
      vinNo: "",
      registrationNo: "",
      imeiNo: "",
      serialNo: ""
    };
  }

  componentDidMount() {
    this.setState({
      brands: this.props.categoryReferenceData.brands
    });
  }

  getFilledData = () => {
    const {
      productName,
      selectedBrand,
      brandName,
      selectedModel,
      modelName,
      purchaseDate,
      amount,
      sellerName,
      vinNo,
      registrationNo,
      imeiNo,
      serialNo
    } = this.state;

    let metadata = [];
    if (this.props.mainCategoryId == MAIN_CATEGORY_IDS.AUTOMOBILE) {
      const categoryForms = this.props.categoryReferenceData.categoryForms;
      const modelNameCategoryForm = categoryForms.find(
        categoryForm => categoryForm.title == "Model"
      );
      metadata.push({
        categoryFormId: modelNameCategoryForm.id,
        value: selectedModel ? selectedModel.title : modelName,
        isNewValue: selectedModel ? false : true
      });
      const registrationNoCategoryForm = categoryForms.find(
        categoryForm => categoryForm.title == "Registration Number"
      );
      metadata.push({
        categoryFormId: registrationNoCategoryForm.id,
        value: registrationNo,
        isNewValue: false
      });
      const vinNoCategoryForm = categoryForms.find(
        categoryForm => categoryForm.title == "Vehicle Number"
      );
      metadata.push({
        categoryFormId: vinNoCategoryForm.id,
        value: vinNo,
        isNewValue: false
      });
    } else if (this.props.mainCategoryId == MAIN_CATEGORY_IDS.ELECTRONICS) {
      const categoryForms = this.props.categoryReferenceData.categoryForms;
      const modelNameCategoryForm = categoryForms.find(
        categoryForm => categoryForm.title == "Model"
      );
      metadata.push({
        categoryFormId: modelNameCategoryForm.id,
        value: selectedModel ? selectedModel.title : modelName,
        isNewValue: selectedModel ? false : true
      });
      if (this.props.categoryId == 327) {
        const imeiNoCategoryForm = categoryForms.find(
          categoryForm => categoryForm.title == "IMEI Number"
        );
        metadata.push({
          categoryFormId: imeiNoCategoryForm.id,
          value: imeiNo,
          isNewValue: false
        });
      } else {
        const serialNoCategoryForm = categoryForms.find(
          categoryForm => categoryForm.title == "Serial Number"
        );
        metadata.push({
          categoryFormId: serialNoCategoryForm.id,
          value: serialNo,
          isNewValue: false
        });
      }
    }

    let data = {
      productName: productName,
      purchaseDate: purchaseDate,
      sellerName: sellerName,
      selllerContact: this.sellerContactRef.getFilledData(),
      brandId: selectedBrand ? selectedBrand.id : undefined,
      brandName: brandName,
      purchaseCost: amount,
      metadata: metadata
    };

    return data;
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
    this.setState(
      {
        brandName: text,
        selectedBrand: null,
        models: [],
        modelName: "",
        selectedModel: null
      },
      () => Alert.alert(this.state.brandName)
    );
  };

  fetchModels = async () => {
    if (this.state.selectedBrand) {
      try {
        const models = await getReferenceDataModels(
          this.props.categoryId,
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

  render() {
    const { mainCategoryId, categoryId, product } = this.props;
    const {
      isBillUploaded,
      productName,
      brands,
      selectedBrand,
      brandName,
      models,
      selectedModel,
      modelName,
      purchaseDate,
      amount,
      sellerName,
      sellerContact,
      vinNo,
      registrationNo,
      imeiNo,
      serialNo
    } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text weight="Medium" style={styles.headerText}>
            Basic Details
          </Text>
          <TouchableOpacity
            onPress={() => this.uploadBillOptions.show(product.job_id, 1)}
            style={styles.uploadBillBtn}
          >
            {!isBillUploaded && (
              <View style={styles.uploadBillBtnTexts}>
                <Text
                  weight="Medium"
                  style={[
                    styles.uploadBillBtnText,
                    { color: colors.secondaryText }
                  ]}
                >
                  Upload Bill{" "}
                </Text>
                <Text
                  weight="Medium"
                  style={[styles.uploadBillBtnText, { color: colors.mainBlue }]}
                >
                  (Recommended){" "}
                </Text>
              </View>
            )}
            {isBillUploaded && (
              <Text
                weight="Medium"
                style={[
                  styles.uploadBillBtnText,
                  { color: colors.secondaryText }
                ]}
              >
                Bill Uploaded Successfully{" "}
              </Text>
            )}
            <AttachmentIcon />
            <UploadBillOptions
              ref={ref => (this.uploadBillOptions = ref)}
              navigator={this.props.navigator}
              uploadCallback={uploadResult => {
                console.log("product: ", product);
                console.log("upload result: ", uploadResult);
                this.setState({ isBillUploaded: true });
              }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.body}>
          <CustomTextInput
            placeholder="Product Name"
            style={styles.input}
            value={productName}
            onChangeText={productName => this.setState({ productName })}
          />

          <SelectModal
            style={styles.input}
            dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
            placeholder="Brand"
            textInputPlaceholder="Enter Brand Name"
            placeholderRenderer={({ placeholder }) => (
              <View style={{ flexDirection: "row" }}>
                <Text weight="Medium" style={{ color: colors.secondaryText }}>
                  {placeholder}
                </Text>
                <Text weight="Medium" style={{ color: colors.mainBlue }}>
                  *
                </Text>
              </View>
            )}
            selectedOption={selectedBrand}
            textInputValue={brandName}
            options={brands}
            onOptionSelect={value => {
              this.onBrandSelect(value);
            }}
            onTextInputChange={text => this.onBrandNameChange(text)}
          />

          {(mainCategoryId == MAIN_CATEGORY_IDS.AUTOMOBILE ||
            mainCategoryId == MAIN_CATEGORY_IDS.ELECTRONICS) && (
            <SelectModal
              style={styles.input}
              visibleKey="title"
              dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
              placeholder="Model"
              textInputPlaceholder="Enter Model Name"
              placeholderRenderer={({ placeholder }) => (
                <Text weight="Medium" style={{ color: colors.secondaryText }}>
                  {placeholder}
                </Text>
              )}
              options={models}
              beforeModalOpen={() => {
                if (selectedBrand || brandName) {
                  return true;
                }
                Alert.alert("Please select brand first");
                return false;
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
          )}

          {categoryId == 327 && (
            <CustomTextInput
              placeholder="IMEI No "
              placeholder2="(Recommended)"
              placeholder2Color={colors.mainBlue}
              style={styles.input}
              value={imeiNo}
              onChangeText={imeiNo => this.setState({ imeiNo })}
            />
          )}
          {mainCategoryId == MAIN_CATEGORY_IDS.ELECTRONICS &&
            categoryId != 327 && (
              <CustomTextInput
                placeholder="Serial No "
                placeholder2="(Recommended)"
                placeholder2Color={colors.mainBlue}
                style={styles.input}
                value={serialNo}
                onChangeText={serialNo => this.setState({ serialNo })}
              />
            )}

          {mainCategoryId == MAIN_CATEGORY_IDS.AUTOMOBILE && (
            <View>
              <CustomTextInput
                placeholder="VIN No."
                value={vinNo}
                onChangeText={vinNo => this.setState({ vinNo })}
              />
              <CustomTextInput
                placeholder="Registration No "
                placeholder2="(Recommended)"
                placeholder2Color={colors.mainBlue}
                style={styles.input}
                value={registrationNo}
                onChangeText={registrationNo =>
                  this.setState({ registrationNo })
                }
              />
            </View>
          )}
          <CustomDatePicker
            date={purchaseDate}
            placeholder="Purchase Date"
            placeholder2="*"
            placeholder2Color={colors.mainBlue}
            onDateChange={purchaseDate => {
              this.setState({ purchaseDate });
            }}
          />
          <CustomTextInput
            placeholder="Purchase Amount"
            style={styles.input}
            value={amount}
            onChangeText={amount => this.setState({ amount })}
          />
          <CustomTextInput
            placeholder="Seller Name"
            style={styles.input}
            value={sellerName}
            onChangeText={sellerName => this.setState({ sellerName })}
          />
          <ContactFields
            ref={ref => (this.sellerContactRef = ref)}
            value={sellerContact}
            placeholder="Seller Contact"
            style={styles.input}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderColor: "#eee",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  header: {
    flexDirection: "row",
    marginBottom: 20
  },
  headerText: {
    fontSize: 18,
    flex: 1
  },
  uploadBillBtn: {
    flexDirection: "row",
    alignItems: "center"
  },
  uploadBillBtnTexts: {
    flexDirection: "row",
    alignItems: "center"
  },
  uploadBillBtnText: {
    fontSize: 10
  },
  input: {
    fontSize: 14,
    paddingVertical: 10,
    borderColor: colors.lighterText,
    borderBottomWidth: 2,
    height: 40,
    marginBottom: 32
  }
});

export default BasicDetailsForm;