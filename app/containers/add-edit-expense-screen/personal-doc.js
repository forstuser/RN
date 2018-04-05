import React from "react";
import { StyleSheet, View, Image, Alert, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Icon from "react-native-vector-icons/Entypo";

import Analytics from "../../analytics";

import { API_BASE_URL, initProduct, updateProduct } from "../../api";
import { ScreenContainer, Text, Button } from "../../elements";
import I18n from "../../i18n";
import { showSnackbar } from "../snackbar";

import LoadingOverlay from "../../components/loading-overlay";
import { colors } from "../../theme";
import { MAIN_CATEGORY_IDS } from "../../constants";
import UploadBillOptions from "../../components/upload-bill-options";
import SelectModal from "../../components/select-modal";

import CustomTextInput from "../../components/form-elements/text-input";
import ContactFields from "../../components/form-elements/contact-fields";
import FinishModal from "./finish-modal";
import UploadDoc from "../../components/form-elements/upload-doc";

const AttachmentIcon = () => (
  <Icon name="attachment" size={20} color={colors.pinkishOrange} />
);

const visitingCardIcon = require("../../images/main-categories/ic_visiting_card.png");
const personalDocIcon = require("../../images/main-categories/ic_personal_doc.png");

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
          name: I18n.t("add_edit_expense_screen_title_add_rent_agreement")
        },
        {
          id: 111,
          name: I18n.t("add_edit_expense_screen_title_add_personal_doc")
        }
      ],
      selectedDocType: null,
      name: "",
      businessName: "",
      phone: "",
      email: "",
      address: "",
      isLoading: false,
      isFinishModalVisible: false,
      copies: []
    };
  }

  componentDidMount() {
    if (this.props.formType == "visiting_card") {
      this.setState(
        {
          selectedDocType: {
            id: 27,
            name: I18n.t("add_edit_expense_screen_title_add_visit_card")
          }
        },
        () => {
          this.initProduct();
        }
      );
    }
  }

  beforeUpload = () => {
    const product = this.state.product;
    if (!product) {
      showSnackbar({
        text: I18n.t("add_edit_expense_screen_title_add_select_doc")
      });
      return false;
    }
    return true;
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
      showSnackbar({
        text: e.message
      });
    }
  };

  saveDoc = async () => {
    try {
      const {
        mainCategoryId,
        product,
        isDocUploaded,
        selectedDocType,
        name,
        businessName,
        address
      } = this.state;

      if (!product) {
        return showSnackbar({
          text: I18n.t("add_edit_expense_screen_title_add_select_doc")
        });
      }

      if (!isDocUploaded) {
        return showSnackbar({
          text: I18n.t("add_edit_expense_screen_title_add_upload_doc")
        });
      }
      const data = {
        productId: product.id,
        mainCategoryId,
        categoryId: selectedDocType.id,
        productName: name || selectedDocType.name
      };

      if (this.props.formType == "visiting_card") {
        data = {
          ...data,
          sellerName: businessName,
          sellerContact: this.phoneRef
            ? this.phoneRef.getFilledData()
            : undefined,
          sellerEmail: this.emailRef
            ? this.emailRef.getFilledData()
            : undefined,
          sellerAddress: address
        };
      }

      this.setState({
        isLoading: true
      });
      await updateProduct(data);

      Analytics.logEvent(Analytics.EVENTS.ADD_PRODUCT_COMPLETED, {
        maincategory: 10,
        category: selectedDocType.name
      });

      this.setState({
        isLoading: false,
        isFinishModalVisible: true
      });
    } catch (e) {
      showSnackbar({
        text: e.message
      });
      this.setState({
        isLoading: false
      });
    }
  };
  render() {
    const { formType, showFullForm = false } = this.props;
    const {
      product,
      mainCategoryId,
      isDocUploaded,
      docTypes,
      selectedDocType,
      name,
      businessName,
      phone,
      email,
      address,
      isLoading,
      isFinishModalVisible,
      copies
    } = this.state;
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
          <View style={styles.imageHeader}>
            <Image
              style={styles.headerImage}
              source={
                formType == "visiting_card" ? visitingCardIcon : personalDocIcon
              }
            />
          </View>
          <View style={styles.form}>
            <Text weight="Medium" style={styles.headerText}>
              {formType == "visiting_card"
                ? "Add Card Details"
                : "Add Document Details"}
            </Text>
            {formType != "visiting_card" && (
              <SelectModal
                // style={styles.input}
                dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
                placeholder="Type of Doc"
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
                selectedOption={selectedDocType}
                options={docTypes}
                onOptionSelect={value => {
                  this.onDocSelect(value);
                }}
                hideAddNew={true}
              />
            )}
            <CustomTextInput
              placeholder="Name"
              value={name}
              onChangeText={name => this.setState({ name })}
            />
            {formType == "visiting_card" &&
              showFullForm && (
                <View style={{ width: "100%", marginBottom: 10 }}>
                  <CustomTextInput
                    placeholder="Business Name"
                    value={businessName}
                    onChangeText={businessName =>
                      this.setState({ businessName })
                    }
                  />
                  <ContactFields
                    ref={ref => (this.phoneRef = ref)}
                    value={phone}
                    placeholder="Phone Number"
                  />
                  <ContactFields
                    ref={ref => (this.emailRef = ref)}
                    value={email}
                    placeholder="Email"
                    keyboardType="email-address"
                  />
                  <CustomTextInput
                    style={{ marginBottom: 10 }}
                    placeholder="Address"
                    value={address}
                    onChangeText={address => this.setState({ address })}
                  />
                </View>
              )}
            <UploadDoc
              placeholder={
                formType == "visiting_card" ? "Upload Image" : "Upload Doc"
              }
              placeholder2="*"
              placeholder2Color={colors.mainBlue}
              productId={product ? product.id : null}
              jobId={product ? product.job_id : null}
              type={1}
              copies={copies}
              beforeUpload={this.beforeUpload}
              onUpload={uploadResult => {
                console.log("uploadResult", uploadResult);
                this.setState({
                  isDocUploaded: true,
                  copies: uploadResult.product.copies
                });
              }}
              navigator={this.props.navigator}
            />
          </View>
        </KeyboardAwareScrollView>
        <Button
          style={styles.saveBtn}
          onPress={this.saveDoc}
          text={I18n.t("add_edit_expense_screen_title_add_doc")}
          borderRadius={0}
          color="secondary"
        />
        <LoadingOverlay visible={isLoading} />
        <FinishModal
          title={I18n.t("add_edit_expense_screen_title_add_doc_added")}
          visible={isFinishModalVisible}
          mainCategoryId={mainCategoryId}
          productId={product ? product.id : null}
          navigator={this.props.navigator}
          isPreviousScreenOfAddOptions={this.props.isPreviousScreenOfAddOptions}
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
    height: 40,
    marginBottom: 32
  },
  saveBtn: {},
  headerText: {
    fontSize: 18,
    flex: 1,
    marginBottom: 10,
    alignSelf: "flex-start"
  }
});

export default PersonalDoc;
