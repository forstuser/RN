import React from "react";
import {
  StyleSheet,
  View,
  Image,
  Alert,
  TouchableOpacity,
  Platform
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Icon from "react-native-vector-icons/Entypo";
import { API_BASE_URL, initProduct, updateProduct } from "../api";
import { ScreenContainer, Text, Button } from "../elements";
import I18n from "../i18n";
import LoadingOverlay from "../components/loading-overlay";
import { colors } from "../theme";
import { MAIN_CATEGORY_IDS } from "../constants";
import UploadBillOptions from "../components/upload-bill-options";
import SelectModal from "../components/select-modal";

import CustomTextInput from "../components/form-elements/text-input";
import ContactFields from "../components/form-elements/contact-fields";
import HeaderWithUploadOption from "../components/form-elements/header-with-upload-option";

import FinishModal from "./add-edit-expense-screen/finish-modal";
import ChangesSavedModal from "../components/changes-saved-modal";

const AttachmentIcon = () => (
  <Icon name="attachment" size={20} color={colors.pinkishOrange} />
);

const visitingCardIcon = require("../images/main-categories/ic_visiting_card.png");
const personalDocIcon = require("../images/main-categories/ic_personal_doc.png");

class PersonalDoc extends React.Component {
  static navigatorStyle = {
    tabBarHidden: true,
    disabledBackGesture: true
  };

  static navigatorButtons = {
    ...Platform.select({
      ios: {
        leftButtons: [
          {
            id: "backPress",
            icon: require("../images/ic_back_ios.png")
          }
        ]
      }
    })
  };

  constructor(props) {
    super(props);
    this.state = {
      mainCategoryId: MAIN_CATEGORY_IDS.PERSONAL,
      productId: null,
      jobId: null,
      copies: [],
      categories: [
        {
          id: 120,
          name: "Rent Agreement"
        },
        {
          id: 111,
          name: "Other Personal Doc"
        }
      ],
      selectedCategory: null,
      name: "",
      businessName: "",
      phone: "",
      email: "",
      address: "",
      isLoading: false,
      isFinishModalVisible: false
    };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  onNavigatorEvent = event => {
    switch (event.id) {
      case "backPress":
        Alert.alert(
          I18n.t("add_edit_personal_doc_are_you_sure"),
          I18n.t("add_edit_personal_doc_unsaved_info"),
          [
            {
              text: I18n.t("add_edit_amc_go_back"),
              onPress: () => this.props.navigator.pop()
            },
            {
              text: I18n.t("add_edit_amc_stay"),
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            }
          ]
        );

        break;
    }
  };

  componentDidMount() {
    let selectedCategory = null;

    // if visiting card
    if (this.props.categoryId == 27) {
      selectedCategory = { id: 27, name: "Visiting Card" };
    } else if (this.props.categoryId) {
      const { categories } = this.state;
      selectedCategory = categories.find(
        category => category.id == this.props.categoryId
      );
    }

    const {
      productId = null,
      jobId = null,
      name = "",
      businessName = "",
      phone = "",
      email = "",
      address = "",
      copies = []
    } = this.props;

    this.setState(
      {
        productId,
        jobId,
        selectedCategory,
        name,
        businessName,
        phone,
        email,
        address,
        copies
      },
      () => this.initProduct()
    );

    let title = "Add Document";
    if (productId) {
      title = "Edit Document";
    }

    this.props.navigator.setTitle({ title });
  }

  beforeUpload = () => {
    const productId = this.state.productId;
    if (!productId) {
      Alert.alert(I18n.t("add_edit_personal_doc_first"));
      return false;
    }
    return true;
  };

  onCategorySelect = option => {
    if (
      this.state.selectedCategory &&
      this.state.selectedCategory.id == option.id
    ) {
      return;
    }
    this.setState(
      {
        selectedCategory: option
      },
      () => {
        this.initProduct();
      }
    );
  };

  initProduct = async () => {
    if (this.state.productId) {
      return;
    }
    this.setState({ isLoading: true });
    const { mainCategoryId } = this.state;
    const categoryId = this.state.selectedCategory.id;
    try {
      const res = await initProduct(mainCategoryId, categoryId);
      this.setState({
        productId: res.product.id,
        jobId: res.product.job_id,
        isLoading: false
      });
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  saveDoc = async () => {
    try {
      const {
        mainCategoryId,
        productId,
        jobId,
        selectedCategory,
        name,
        businessName,
        address,
        copies
      } = this.state;

      if (!productId) {
        return Alert.alert(I18n.t("add_edit_personal_doc_first"));
      }

      if (copies.length == 0) {
        return Alert.alert(I18n.t("add_edit_personal_doc_upload_first"));
      }
      const data = {
        productId: productId,
        mainCategoryId,
        categoryId: selectedCategory.id,
        productName: name || selectedCategory.name
      };

      if (this.props.categoryId == 27) {
        data = {
          ...data,
          sellerName: businessName,
          sellerContact: this.phoneRef.getFilledData(),
          sellerEmail: this.emailRef.getFilledData(),
          sellerAddress: address
        };
      }

      this.setState({
        isLoading: true
      });
      await updateProduct(data);
      this.setState({
        isLoading: false
      });
      this.changesSavedModal.show();
    } catch (e) {
      Alert.alert(e.message);
      this.setState({
        isLoading: false
      });
    }
  };
  render() {
    const { categoryId } = this.props;
    const {
      productId,
      jobId,
      mainCategoryId,
      copies,
      categories,
      selectedCategory,
      name,
      businessName,
      phone,
      email,
      address,
      isLoading,
      isFinishModalVisible
    } = this.state;
    return (
      <View style={styles.container}>
        <ChangesSavedModal
          ref={ref => (this.changesSavedModal = ref)}
          navigator={this.props.navigator}
        />
        <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
          <LoadingOverlay visible={isLoading} />
          <View style={styles.imageHeader}>
            <Image
              style={styles.headerImage}
              source={categoryId == 27 ? visitingCardIcon : personalDocIcon}
            />
          </View>

          <View style={styles.form}>
            <HeaderWithUploadOption
              title={
                categoryId == 27 ? "Add Card Details" : "Add Document Details"
              }
              textBeforeUpload={
                categoryId == 27 ? "Upload Image" : "Upload Doc"
              }
              textBeforeUpload2="*"
              textBeforeUpload2Color={colors.mainBlue}
              productId={productId}
              itemId={productId}
              jobId={jobId ? jobId : null}
              type={1}
              copies={copies}
              beforeUpload={this.beforeUpload}
              onUpload={uploadResult => {
                console.log("upload result: ", uploadResult);
                this.setState({ copies: uploadResult.product.copies });
              }}
              navigator={this.props.navigator}
            />
            {categoryId != 27 && (
              <SelectModal
                style={styles.input}
                dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
                placeholder={I18n.t("add_edit_personal_doc_type_of_doc")}
                placeholderRenderer={({ placeholder }) => (
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      weight="Medium"
                      style={{ color: colors.secondaryText }}
                    >
                      {placeholder}
                    </Text>
                    <Text weight="Medium" style={{ color: colors.mainBlue }}>
                      *
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
            )}
            <CustomTextInput
              placeholder={I18n.t("add_edit_personal_doc_name")}
              underlineColorAndroid="transparent"
              value={name}
              onChangeText={name => this.setState({ name })}
            />
            {categoryId == 27 && (
              <View style={{ width: "100%", marginBottom: 10 }}>
                <CustomTextInput
                  placeholder={I18n.t("add_edit_personal_doc_business_name")}
                  underlineColorAndroid="transparent"
                  value={businessName}
                  onChangeText={businessName => this.setState({ businessName })}
                />
                <ContactFields
                  underlineColorAndroid="transparent"
                  ref={ref => (this.phoneRef = ref)}
                  value={phone}
                  placeholder={I18n.t("add_edit_personal_doc_phone_number")}
                />
                <ContactFields
                  underlineColorAndroid="transparent"
                  ref={ref => (this.emailRef = ref)}
                  value={email}
                  placeholder={I18n.t("add_edit_personal_doc_email")}
                  keyboardType="email-address"
                />
                <CustomTextInput
                  underlineColorAndroid="transparent"
                  style={{ marginBottom: 10 }}
                  placeholder={I18n.t("add_edit_personal_doc_address")}
                  value={address}
                  onChangeText={address => this.setState({ address })}
                />
              </View>
            )}
          </View>
        </KeyboardAwareScrollView>
        <Button
          style={styles.saveBtn}
          onPress={this.saveDoc}
          text={I18n.t("add_edit_personal_doc_add_doc")}
          borderRadius={0}
          color="secondary"
        />
        <FinishModal
          title={I18n.t("add_edit_personal_doc_doc_added")}
          visible={isFinishModalVisible}
          mainCategoryId={mainCategoryId}
          navigator={this.props.navigator}
          productId={productId}
        />
      </View>
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
    marginBottom: 10,
    backgroundColor: "#fff",
    borderColor: "#eee",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  input: {
    paddingVertical: 10,
    borderColor: colors.lighterText,
    borderBottomWidth: 2,
    paddingTop: 20,
    height: 50,
    marginBottom: 25
  },
  saveBtn: {}
});

export default PersonalDoc;
