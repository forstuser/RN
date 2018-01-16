import React from "react";
import { StyleSheet, View, Image, Alert, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Icon from "react-native-vector-icons/Entypo";
import { API_BASE_URL, initProduct, updateProduct } from "../../api";
import { ScreenContainer, Text, Button } from "../../elements";

import LoadingOverlay from "../../components/loading-overlay";
import { colors } from "../../theme";
import { MAIN_CATEGORY_IDS } from "../../constants";
import UploadBillOptions from "../../components/upload-bill-options";
import SelectModal from "../../components/select-modal";

import CustomTextInput from "./form-elements/text-input";

import FinishModal from "./finish-modal";

const AttachmentIcon = () => (
  <Icon name="attachment" size={20} color={colors.pinkishOrange} />
);

const categoryIcon = require("../../images/main-categories/ic_personal_doc.png");

class PersonalDoc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mainCategoryId: MAIN_CATEGORY_IDS.PERSONAL,
      product: null,
      isDocUploaded: false,
      docTypes: [
        {
          id: 120,
          name: "Rent Agreement"
        },
        {
          id: 111,
          name: "Other Personal Doc"
        }
      ],
      selectedDocType: null,
      docName: "",
      isLoading: false,
      isFinishModalVisible: false
    };
  }

  onUploadDocPress = () => {
    const product = this.state.product;
    if (!product) {
      return Alert.alert("Please select 'Type of doc' first");
    }
    this.uploadBillOptions.show(product.job_id, 1);
  };

  onDocSelect = option => {
    if (
      this.state.selectedDocType &&
      this.state.selectedDocType.id == option.id
    ) {
      return;
    }
    this.setState(
      {
        selectedDocType: option
      },
      () => {
        this.initProduct();
      }
    );
  };

  initProduct = async () => {
    this.setState({ isLoading: true, product: null });
    const { mainCategoryId } = this.state;
    const categoryId = this.state.selectedDocType.id;
    try {
      const res = await initProduct(mainCategoryId, categoryId);
      this.setState({
        product: res.product,
        isLoading: false
      });
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  saveDoc = async () => {
    try {
      this.setState({
        isLoading: true
      });
      const {
        mainCategoryId,
        product,
        isDocUploaded,
        selectedDocType,
        docName
      } = this.state;

      if (!product) {
        return Alert.alert("Please select 'Type of doc' first");
      }

      if (!isDocUploaded) {
        return Alert.alert("Please upload the document first");
      }

      const data = {
        productId: product.id,
        mainCategoryId,
        categoryId: selectedDocType.id,
        productName: docName
      };
      await updateProduct(data);
      this.setState({
        isLoading: false,
        isFinishModalVisible: true
      });
    } catch (e) {
      Alert.alert(e.message);
      this.setState({
        isLoading: false
      });
    }
  };
  render() {
    const {
      mainCategoryId,
      isDocUploaded,
      docTypes,
      selectedDocType,
      docName,
      isLoading,
      isFinishModalVisible
    } = this.state;
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        resetScrollToCoords={{ x: 0, y: 0 }}
      >
        <LoadingOverlay visible={isLoading} />
        <View style={styles.imageHeader}>
          <Image style={styles.headerImage} source={categoryIcon} />
        </View>
        <View style={styles.form}>
          <View style={styles.header}>
            <Text weight="Medium" style={styles.headerText}>
              Add Document Details
            </Text>
            <TouchableOpacity
              onPress={this.onUploadDocPress}
              style={styles.uploadBillBtn}
            >
              {!isDocUploaded && (
                <View style={styles.uploadBillBtnTexts}>
                  <Text
                    weight="Medium"
                    style={[
                      styles.uploadBillBtnText,
                      { color: colors.secondaryText }
                    ]}
                  >
                    Upload Doc{" "}
                  </Text>
                  <Text
                    weight="Medium"
                    style={[
                      styles.uploadBillBtnText,
                      { color: colors.mainBlue }
                    ]}
                  >
                    *
                  </Text>
                </View>
              )}
              {isDocUploaded && (
                <Text
                  weight="Medium"
                  style={[
                    styles.uploadBillBtnText,
                    { color: colors.secondaryText }
                  ]}
                >
                  Doc Uploaded Successfully{" "}
                </Text>
              )}
              <AttachmentIcon />
              <UploadBillOptions
                ref={ref => (this.uploadBillOptions = ref)}
                navigator={this.props.navigator}
                uploadCallback={uploadResult => {
                  console.log("upload result: ", uploadResult);
                  this.setState({ isDocUploaded: true });
                }}
              />
            </TouchableOpacity>
          </View>
          <SelectModal
            style={styles.input}
            dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
            placeholder="Type of doc"
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
            selectedOption={selectedDocType}
            options={docTypes}
            onOptionSelect={value => {
              this.onDocSelect(value);
            }}
            hideAddNew={true}
          />
          <CustomTextInput
            style={{ marginBottom: 10 }}
            placeholder="Name"
            value={docName}
            onChangeText={docName => this.setState({ docName })}
          />
        </View>
        <Button
          style={styles.saveBtn}
          onPress={this.saveDoc}
          text="ADD DOC"
          borderRadius={0}
          color="secondary"
        />
        <FinishModal
          title="Doc added to your eHome."
          visible={isFinishModalVisible}
          mainCategoryId={mainCategoryId}
          navigator={this.props.navigator}
        />
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: "#FAFAFA",
    flex: 1
  },
  imageHeader: {
    backgroundColor: "#fff",
    borderColor: "#eee",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
    padding: 40
  },
  headerImage: {
    width: 80,
    height: 90
  },
  form: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderColor: "#eee",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
    padding: 20
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
    paddingVertical: 10,
    borderColor: colors.lighterText,
    borderBottomWidth: 2,
    height: 40,
    marginBottom: 32
  },
  saveBtn: {
    position: "absolute",
    bottom: 0,
    width: "100%"
  }
});

export default PersonalDoc;
