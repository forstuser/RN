import React from "react";
import { StyleSheet, View, Image, TouchableOpacity, Alert } from "react-native";
import RNFetchBlob from "react-native-fetch-blob";
import Icon from "react-native-vector-icons/dist/Ionicons";
import Modal from "react-native-modal";
import I18n from "../i18n";

import {
  API_BASE_URL,
  initProduct,
  getReferenceData,
  updateProduct,
  uploadDocuments
} from "../api";

import { Text, Button, ScreenContainer } from "../elements";
import { GLOBAL_VARIABLES, SCREENS } from "../constants";
import { colors } from "../theme";

import SelectModal from "../components/select-modal";
import LoadingOverlay from "../components/loading-overlay";

const uploadDocIllustration = require("../images/upload-doc-illustration.png");

class DirectUploadDocumentScreen extends React.Component {
  static navigatorStyle = {
    navBarHidden: true,
    tabBarHidden: true
  };

  constructor(props) {
    super(props);
    this.state = {
      mainCategories: [],
      categories: [],
      selectedMainCategory: null,
      selectedCategory: null,
      isLoading: true,
      isFetchingCategories: true,
      productId: null,
      jobId: null,
      isFinishModalVisible: false
    };
  }

  componentDidMount() {
    this.initProduct();
    this.fetchCategories();
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

      this.setState({
        isLoading: false
      });
    } catch (e) {
      console.log("ee: ", e);
    }
  };

  fetchCategories = async () => {
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
      selectedCategory: null
    });
  };

  onCategorySelect = category => {
    if (
      this.state.selectedCategory &&
      this.state.selectedCategory.id == category.id
    ) {
      return;
    }
    this.setState({
      selectedCategory: category
    });
  };

  updateProduct = async () => {
    const { selectedMainCategory, selectedCategory, productId } = this.state;

    if (!selectedMainCategory || !selectedCategory) {
      return Alert.alert("Please select category and sub-category both.");
    }

    this.setState({
      isLoading: true
    });

    await updateProduct({
      productId,
      productName: selectedCategory.name,
      mainCategoryId: selectedMainCategory.id,
      categoryId: selectedCategory.id
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
        setTimeout(() => {
          this.props.showAddProductOptionsScreenOnAppear();
          this.props.navigator.pop();
        }, 500);
      }
    );
  };

  onDoItLaterClick = () => {
    this.setState(
      {
        isFinishModalVisible: false
      },
      () => {
        setTimeout(() => {
          this.props.navigator.pop({
            animationType: "fade"
          });
          this.props.navigator.push({
            screen: SCREENS.PRODUCT_DETAILS_SCREEN,
            passProps: {
              productId: this.state.productId
            }
          });
        }, 200);
      }
    );
  };

  onCrossPress = () => {
    this.props.navigator.pop();
  };

  render() {
    const {
      mainCategories,
      categories,
      selectedMainCategory,
      selectedCategory,
      isFetchingCategories,
      isLoading,
      isFinishModalVisible
    } = this.state;
    return (
      <ScreenContainer style={styles.container}>
        <LoadingOverlay visible={isFetchingCategories || isLoading} />
        <TouchableOpacity onPress={this.onCrossPress} style={styles.closeBtn}>
          <Icon name="md-close" size={30} color={colors.mainText} />
        </TouchableOpacity>
        <Image style={styles.illustration} source={uploadDocIllustration} />
        <View style={styles.steps}>
          <View style={[styles.step, styles.firstStep]}>
            <View weight="Bold" style={styles.tick}>
              <Icon name="md-checkmark" size={20} color="#fff" />
            </View>
          </View>
          <View style={styles.stepLine} />
          <View style={[styles.step, styles.firstStep]}>
            <Text weight="Bold" style={styles.stepText}>
              2
            </Text>
          </View>
        </View>
        <Text weight="Bold" style={styles.mainText}>
          {I18n.t("add_edit_direct_upload_docs")}
        </Text>
        <SelectModal
          style={styles.input}
          dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
          placeholder={I18n.t(" add_edit_direct_category")}
          placeholderRenderer={({ placeholder }) => (
            <View style={{ flexDirection: "row" }}>
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
          style={styles.input}
          dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
          placeholder={I18n.t("add_edit_direct_subcategory")}
          placeholderRenderer={({ placeholder }) => (
            <View style={{ flexDirection: "row" }}>
              <Text weight="Medium" style={{ color: colors.secondaryText }}>
                {placeholder}
              </Text>
            </View>
          )}
          selectedOption={selectedCategory}
          options={categories}
          onOptionSelect={value => {
            this.onCategorySelect(value);
          }}
          hideAddNew={true}
        />
        <Button
          onPress={this.updateProduct}
          text={I18n.t("add_edit_direct_add_docs")}
          color="secondary"
          style={{ width: 300, marginTop: 35 }}
        />
        <Modal useNativeDriver={true} isVisible={isFinishModalVisible}>
          <View style={styles.finishModal}>
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
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center"
  },
  closeBtn: {
    position: "absolute",
    top: 40,
    right: 20,
    height: 30,
    width: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  illustration: {
    width: 140,
    height: 140
  },
  steps: {
    flexDirection: "row",
    width: 170,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 35
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
    fontSize: 16,
    color: colors.mainBlue,
    textAlign: "center",
    marginTop: 25,
    marginBottom: 25
  },
  input: {
    paddingVertical: 10,
    borderColor: colors.lighterText,
    borderBottomWidth: 2,
    paddingTop: 20,
    height: 50,
    marginBottom: 25
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
