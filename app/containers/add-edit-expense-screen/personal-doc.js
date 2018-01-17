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
import ContactFields from "./form-elements/contact-fields";
import HeaderWithUploadOption from "./form-elements/header-with-upload-option";

import FinishModal from "./finish-modal";

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
          name: "Rent Agreement"
        },
        {
          id: 111,
          name: "Other Personal Doc"
        }
      ],
      selectedDocType: null,
      name: "",
      businessName: "",
      phone: "",
      email: "",
      address: "",
      isLoading: false,
      isFinishModalVisible: false
    };
  }

  componentDidMount() {
    if (this.props.formType == "visiting_card") {
      this.setState(
        {
          selectedDocType: { id: 27 }
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
      Alert.alert("Please select 'Type of doc' first");
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
      Alert.alert(e.message);
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
        return Alert.alert("Please select 'Type of doc' first");
      }

      if (!isDocUploaded) {
        return Alert.alert("Please upload the document first");
      }
      const data = {
        productId: product.id,
        mainCategoryId,
        categoryId: selectedDocType.id,
        productName: name
      };

      if (this.props.formType == "visiting_card") {
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
    const { formType } = this.props;
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
      isFinishModalVisible
    } = this.state;
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
          <LoadingOverlay visible={isLoading} />
          <View style={styles.imageHeader}>
            <Image
              style={styles.headerImage}
              source={
                formType == "visiting_card" ? visitingCardIcon : personalDocIcon
              }
            />
          </View>

          <View style={styles.form}>
            <HeaderWithUploadOption
              title={
                formType == "visiting_card"
                  ? "Add Card Details"
                  : "Add Document Details"
              }
              textBeforeUpload={
                formType == "visiting_card" ? "Upload Image" : "Upload Doc"
              }
              textBeforeUpload2="*"
              textBeforeUpload2Color={colors.mainBlue}
              jobId={product ? product.job_id : null}
              type={1}
              beforeUpload={this.beforeUpload}
              onUpload={uploadResult => {
                console.log("upload result: ", uploadResult);
                this.setState({ isDocUploaded: true });
              }}
              navigator={this.props.navigator}
            />
            {formType != "visiting_card" && (
              <SelectModal
                style={styles.input}
                dropdownArrowStyle={{ tintColor: colors.pinkishOrange }}
                placeholder="Type of doc"
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
            {formType == "visiting_card" && (
              <View style={{ width: "100%", marginBottom: 10 }}>
                <CustomTextInput
                  placeholder="Business Name"
                  value={businessName}
                  onChangeText={businessName => this.setState({ businessName })}
                />
                <ContactFields
                  ref={ref => (this.phoneRef = ref)}
                  value={phone}
                  placeholder="Phone Number"
                  style={styles.input}
                />
                <ContactFields
                  ref={ref => (this.emailRef = ref)}
                  value={email}
                  placeholder="Email"
                  style={styles.input}
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
          </View>
        </KeyboardAwareScrollView>
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
  saveBtn: {}
});

export default PersonalDoc;
