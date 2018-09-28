import React from "react";
import { StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import RNFetchBlob from "react-native-fetch-blob";
import moment from "moment";
import Icon from "react-native-vector-icons/dist/Ionicons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Modal from "react-native-modal";
import I18n from "../i18n";
import { showSnackbar } from "../utils/snackbar";

import {
  API_BASE_URL,
  initProduct,
  getReferenceData,
  getReferenceDataForCategory,
  getReferenceDataModels,
  updateProduct,
  uploadDocuments
} from "../api";

import Analytics from "../analytics";
import { Text, Button, ScreenContainer, Image } from "../elements";
import {
  GLOBAL_VARIABLES,
  SCREENS,
  MAIN_CATEGORY_IDS,
  CATEGORY_IDS
} from "../constants";
import { colors } from "../theme";

import SelectModal from "../components/select-modal";
import LoadingOverlay from "../components/loading-overlay";

const uploadDocIllustration = require("../images/upload_doc_illustration.png");

class DirectUploadDocumentScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      mainCategories: [],
      categories: [],
      subCategories: [],
      insuranceProviders: [],
      brands: [],
      models: [],
      selectedMainCategory: null,
      selectedCategory: null,
      selectedSubCategory: null,
      selectedBrand: null,
      selectedModel: null,
      brandName: "",
      modelName: "",
      selectedInsuranceProvider: null,
      providerName: "",
      isLoading: true,
      isFetchingCategories: true,
      productId: null,
      jobId: null,
      isFinishModalVisible: false
    };
  }

  componentDidMount() {
    Analytics.logEvent(Analytics.EVENTS.SHARE_VIA);
    this.initProduct();
    this.fetchMainCategories();
  }

  initProduct = async () => {
    try {
      const res = await initProduct(9, 656);
      this.setState(
        {
          isLoading: false,
          productId: res.product.id,
          jobId: res.product.job_id
        },
        () => {
          this.uploadDocuments();
        }
      );
    } catch (e) {}
  };

  uploadDocuments = async () => {
    try {
      const { productId, jobId } = this.state;
      const res = await uploadDocuments({
        productId: productId,
        jobId: jobId,
        type: 1,
        files: [
          {
            filename: "image.jpeg",
            uri: global[GLOBAL_VARIABLES.FILES_FOR_DIRECT_UPLOAD][0],
            mimeType: "image/jpeg"
          }
        ]
      });
      global[GLOBAL_VARIABLES.FILES_FOR_DIRECT_UPLOAD] = null;
    } catch (e) {
      console.log("ee: ", e);
    } finally {
      this.setState({
        isLoading: false
      });
    }
  };

  fetchMainCategories = async () => {
    try {
      const res = await getReferenceData();
      this.setState({
        isFetchingCategories: false,
        mainCategories: res.categories
      });
    } catch (e) {
      console.log("e: ", e);
    }
  };

  onMainCategorySelect = mainCategory => {
    if (
      this.state.selectedMainCategory &&
      this.state.selectedMainCategory.id == mainCategory.id
    ) {
      return;
    }
    this.setState({
      selectedMainCategory: mainCategory,
      categories: mainCategory.subCategories,
      selectedCategory: null,
      brands: [],
      models: [],
      selectedBrand: null,
      selectedModel: null,
      brandName: "",
      modelName: "",
      selectedInsuranceProvider: null,
      providerName: ""
    });
  };

  onCategorySelect = category => {
    if (
      this.state.selectedCategory &&
      this.state.selectedCategory.id == category.id
    ) {
      return;
    }
    this.setState(
      {
        selectedCategory: category,
        subCategories: [],
        brands: [],
        models: [],
        selectedSubCategory: null,
        selectedBrand: null,
        selectedModel: null,
        brandName: "",
        modelName: "",
        selectedInsuranceProvider: null,
        providerName: ""
      },
      () => {
        this.fetchBrandsAndSubCategories();
      }
    );
  };

  fetchBrandsAndSubCategories = async () => {
    if (this.state.selectedCategory) {
      try {
        const res = await getReferenceDataForCategory(
          this.state.selectedCategory.id
        );
        this.setState({
          subCategories: res.categories[0].subCategories,
          insuranceProviders: res.categories[0].insuranceProviders,
          brands: res.categories[0].brands
        });
      } catch (e) {
        showSnackbar({
          text: e.message
        });
      }
    }
  };

  onSubCategorySelect = subCategory => {
    if (
      this.state.selectedSubCategory &&
      this.state.selectedSubCategory.id == subCategory.id
    ) {
      return;
    }
    this.setState({
      selectedSubCategory: subCategory
    });
  };

  onInsuranceProviderSelect = insuranceProvider => {
    if (
      this.state.selectedInsuranceProvider &&
      this.state.insuranceProvider.id == insuranceProvider.id
    ) {
      return;
    }
    this.setState({
      selectedInsuranceProvider: insuranceProvider
    });
  };

  onProviderNameChange = text => {
    this.setState({
      providerName: text,
      selectedInsuranceProvider: null
    });
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
          this.state.selectedCategory.id,
          this.state.selectedBrand.id
        );
        this.setState({ models });
      } catch (e) {
        showSnackbar({
          text: e.message
        });
      }
    }
  };

  onModelSelect = model => {
    if (this.state.selectedModel && this.state.selectedModel.id == model.id) {
      return;
    }

    this.setState({
      selectedModel: model,
      modelName: ""
    });
  };

  onModelNameChange = text => {
    this.setState({
      modelName: text,
      selectedModel: null
    });
  };

  updateProduct = async () => {
    const {
      selectedMainCategory,
      selectedCategory,
      selectedSubCategory,
      selectedBrand,
      selectedModel,
      selectedInsuranceProvider,
      brandName,
      modelName,
      providerName,
      productId
    } = this.state;

    if (!selectedMainCategory || !selectedCategory) {
      return showSnackbar({
        text: "Please select category and sub-category both."
      });
    }

    if (
      [
        MAIN_CATEGORY_IDS.AUTOMOBILE,
        MAIN_CATEGORY_IDS.ELECTRONICS,
        MAIN_CATEGORY_IDS.FASHION
      ].indexOf(selectedMainCategory.id) > -1 &&
      !selectedBrand &&
      !brandName
    ) {
      return showSnackbar({
        text: "Please select brand"
      });
    }

    if (
      selectedCategory.id == CATEGORY_IDS.FURNITURE.FURNITURE &&
      !selectedSubCategory
    ) {
      return showSnackbar({
        text: "Please select type"
      });
    }

    let insurance;
    if (selectedCategory.id == CATEGORY_IDS.HEALTHCARE.INSURANCE) {
      if (!selectedInsuranceProvider && !providerName) {
        return showSnackbar({
          text: "Please select or add insurance provider"
        });
      }
      insurance = {
        effectiveDate: moment().format("YYYY-MM-DD"),
        providerId: selectedInsuranceProvider
          ? selectedInsuranceProvider.id
          : null,
        providerName: providerName
      };
    }

    this.setState({
      isLoading: true
    });

    await updateProduct({
      productId,
      productName: selectedCategory.name,
      mainCategoryId: selectedMainCategory.id,
      categoryId: selectedCategory.id,
      subCategoryId: selectedSubCategory ? selectedSubCategory.id : undefined,
      brandId: selectedBrand ? selectedBrand.id : undefined,
      brandName: brandName,
      model: selectedModel ? selectedModel.title : modelName,
      isNewModel: selectedModel ? false : true,
      insurance
    });

    this.setState({
      isFinishModalVisible: true
    });
  };

  onAddMoreProductsClick = () => {
    this.setState(
      {
        isFinishModalVisible: false
      },
      () => {
        this.props.navigation.replace(SCREENS.EHOME_SCREEN);
      }
    );
  };

  onDoItLaterClick = () => {
    this.setState(
      {
        isFinishModalVisible: false
      },
      () => {
        this.props.navigation.replace(SCREENS.PRODUCT_DETAILS_SCREEN, {
          productId: this.state.productId
        });
      }
    );
  };

  onCrossPress = () => {
    global[GLOBAL_VARIABLES.FILES_FOR_DIRECT_UPLOAD] = null;
    this.props.navigation.goBack();
  };

  render() {
    const {
      mainCategories,
      categories,
      subCategories,
      insuranceProviders,
      brands,
      models,
      selectedSubCategory,
      selectedMainCategory,
      selectedCategory,
      selectedBrand,
      selectedModel,
      selectedInsuranceProvider,
      providerName,
      brandName,
      modelName,
      isFetchingCategories,
      isLoading,
      isFinishModalVisible
    } = this.state;
    // if (!isFinishModalVisible) return null;
    return (
      <ScreenContainer style={styles.container}>
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          contentContainerStyle={styles.innerContainer}
        >
          <Image style={styles.illustration} source={uploadDocIllustration} />
          <View collapsable={false} style={styles.steps}>
            <View collapsable={false} style={[styles.step, styles.firstStep]}>
              <View collapsable={false} weight="Bold" style={styles.tick}>
                <Icon name="md-checkmark" size={20} color="#fff" />
              </View>
            </View>
            <View collapsable={false} style={styles.stepLine} />
            <View collapsable={false} style={[styles.step, styles.firstStep]}>
              <Text weight="Bold" style={styles.stepText}>
                2
              </Text>
            </View>
          </View>
          <Text weight="Bold" style={styles.mainText}>
            {I18n.t("add_edit_direct_upload_docs")}
          </Text>
          <SelectModal
            // style={styles.input}
            dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
            placeholder={I18n.t("add_edit_direct_category")}
            placeholderRenderer={({ placeholder }) => (
              <View collapsable={false} style={{ flexDirection: "row" }}>
                <Text weight="Medium" style={{ color: colors.secondaryText }}>
                  {placeholder}
                </Text>
              </View>
            )}
            selectedOption={selectedMainCategory}
            options={mainCategories}
            onOptionSelect={value => {
              this.onMainCategorySelect(value);
            }}
            hideAddNew={true}
          />
          <SelectModal
            // style={styles.input}
            dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
            placeholder={I18n.t("add_edit_direct_subcategory")}
            placeholderRenderer={({ placeholder }) => (
              <View collapsable={false} style={{ flexDirection: "row" }}>
                <Text weight="Medium" style={{ color: colors.secondaryText }}>
                  {placeholder}
                </Text>
              </View>
            )}
            selectedOption={selectedCategory}
            options={categories}
            beforeModalOpen={() => {
              if (selectedMainCategory) {
                return true;
              }
              showSnackbar({
                text: I18n.t("add_edit_direct_select_main_category_first")
              });
              return false;
            }}
            onOptionSelect={value => {
              this.onCategorySelect(value);
            }}
            hideAddNew={true}
          />

          {selectedCategory &&
            selectedCategory.id == CATEGORY_IDS.FURNITURE.FURNITURE && (
              <SelectModal
                // style={styles.input}
                dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
                placeholder={I18n.t("add_edit_direct_type")}
                placeholderRenderer={({ placeholder }) => (
                  <View collapsable={false} style={{ flexDirection: "row" }}>
                    <Text
                      weight="Medium"
                      style={{ color: colors.secondaryText }}
                    >
                      {placeholder}
                    </Text>
                  </View>
                )}
                selectedOption={selectedSubCategory}
                options={subCategories}
                onOptionSelect={value => {
                  this.onSubCategorySelect(value);
                }}
                hideAddNew={true}
              />
            )}

          {selectedMainCategory &&
            [
              MAIN_CATEGORY_IDS.AUTOMOBILE,
              MAIN_CATEGORY_IDS.ELECTRONICS,
              MAIN_CATEGORY_IDS.FURNITURE,
              MAIN_CATEGORY_IDS.FASHION
            ].indexOf(selectedMainCategory.id) > -1 && (
              <SelectModal
                // style={styles.input}
                dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
                placeholder={I18n.t("add_edit_direct_brand")}
                placeholderRenderer={({ placeholder }) => (
                  <View collapsable={false} style={{ flexDirection: "row" }}>
                    <Text
                      weight="Medium"
                      style={{ color: colors.secondaryText }}
                    >
                      {placeholder}
                    </Text>
                  </View>
                )}
                selectedOption={selectedBrand}
                textInputValue={brandName}
                options={brands}
                beforeModalOpen={() => {
                  if (selectedCategory) {
                    return true;
                  }
                  showSnackbar({
                    text: I18n.t("add_edit_direct_select_category_first")
                  });
                  return false;
                }}
                onOptionSelect={value => {
                  this.onBrandSelect(value);
                }}
                onTextInputChange={text => this.onBrandNameChange(text)}
              />
            )}
          {selectedMainCategory &&
            [
              MAIN_CATEGORY_IDS.AUTOMOBILE,
              MAIN_CATEGORY_IDS.ELECTRONICS
            ].indexOf(selectedMainCategory.id) > -1 && (
              <SelectModal
                // style={styles.input}
                visibleKey="title"
                dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
                placeholder={I18n.t("add_edit_direct_model")}
                placeholderRenderer={({ placeholder }) => (
                  <View collapsable={false} style={{ flexDirection: "row" }}>
                    <Text
                      weight="Medium"
                      style={{ color: colors.secondaryText }}
                    >
                      {placeholder}
                    </Text>
                  </View>
                )}
                options={models}
                beforeModalOpen={() => {
                  if (selectedBrand || brandName) {
                    return true;
                  }
                  showSnackbar({
                    text: I18n.t("add_edit_direct_select_brand_first")
                  });
                  return false;
                }}
                selectedOption={selectedModel}
                textInputValue={modelName}
                onOptionSelect={value => {
                  this.onModelSelect(value);
                }}
                onTextInputChange={text => this.setState({ modelName: text })}
              />
            )}

          {selectedCategory &&
            selectedCategory.id == CATEGORY_IDS.HEALTHCARE.INSURANCE && (
              <SelectModal
                // style={styles.input}
                dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
                placeholder={I18n.t("add_edit_direct_insurance_provider")}
                placeholderRenderer={({ placeholder }) => (
                  <View collapsable={false} style={{ flexDirection: "row" }}>
                    <Text
                      weight="Medium"
                      style={{ color: colors.secondaryText }}
                    >
                      {placeholder}
                    </Text>
                  </View>
                )}
                selectedOption={selectedInsuranceProvider}
                textInputValue={providerName}
                options={insuranceProviders}
                onOptionSelect={value => {
                  this.onInsuranceProviderSelect(value);
                }}
                onTextInputChange={text => this.onProviderNameChange(text)}
              />
            )}
          <Button
            onPress={this.updateProduct}
            text={I18n.t("add_edit_direct_add_docs")}
            color="secondary"
            style={{ width: 300, marginTop: 20 }}
          />
        </KeyboardAwareScrollView>
        <LoadingOverlay visible={isFetchingCategories || isLoading} />
        <TouchableOpacity onPress={this.onCrossPress} style={styles.closeBtn}>
          <Icon name="md-close" size={30} color={colors.mainText} />
        </TouchableOpacity>
        {isFinishModalVisible ? (
          <View collapsable={false}>
            <Modal useNativeDriver={true} isVisible={true}>
              <View collapsable={false} style={styles.finishModal}>
                <Image
                  style={styles.finishImage}
                  source={{
                    uri:
                      API_BASE_URL +
                      `/categories/${
                        selectedMainCategory ? selectedMainCategory.id : 2
                      }/images/1`
                  }}
                  resizeMode="contain"
                />
                <Text weight="Bold" style={styles.finishMsg}>
                  {I18n.t("add_edit_direct_doc_successfully")}
                </Text>
                <Button
                  onPress={this.onAddMoreProductsClick}
                  style={styles.finishBtn}
                  text={I18n.t("add_edit_direct_add_eHome")}
                  color="secondary"
                />
                <Text
                  onPress={this.onDoItLaterClick}
                  weight="Bold"
                  style={styles.doItLaterText}
                >
                  {I18n.t("add_edit_direct_later")}
                </Text>
              </View>
            </Modal>
          </View>
        ) : (
          <View collapsable={false} />
        )}
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    alignItems: "center",
    justifyContent: "center"
  },
  innerContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    flex: 1
  },
  closeBtn: {
    position: "absolute",
    top: 30,
    right: 20,
    height: 30,
    width: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  illustration: {
    width: 80,
    height: 80
  },
  steps: {
    flexDirection: "row",
    width: 170,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15
  },
  step: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.mainBlue
  },
  tick: {
    width: 30,
    height: 30,
    backgroundColor: colors.mainBlue,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    overflow: "hidden"
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.mainBlue
  },
  stepText: {
    color: colors.mainBlue
  },
  mainText: {
    fontSize: 14,
    color: colors.mainBlue,
    textAlign: "center",
    marginTop: 15,
    marginBottom: 25
  },
  input: {
    paddingVertical: 10,
    borderColor: colors.lighterText,
    borderBottomWidth: 2,
    paddingTop: 20,
    height: 50,
    marginBottom: 15
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
    width: 300,
    marginTop: 20
  },
  doItLaterText: {
    color: colors.pinkishOrange,
    fontSize: 16,
    marginTop: 20
  }
});

export default DirectUploadDocumentScreen;
