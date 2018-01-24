import React from "react";
import { StyleSheet, View, Image, Alert, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Icon from "react-native-vector-icons/Entypo";
import { API_BASE_URL, updateProduct } from "../api";
import { ScreenContainer, Text, Button } from "../elements";

import LoadingOverlay from "../components/loading-overlay";
import { colors } from "../theme";
import { MAIN_CATEGORY_IDS } from "../constants";
import UploadBillOptions from "../components/upload-bill-options";
import SelectModal from "../components/select-modal";

import MedicalDocForm from "../components/expense-forms/medical-doc-form";

import CustomTextInput from "../components/form-elements/text-input";
import ContactFields from "../components/form-elements/contact-fields";
import HeaderWithUploadOption from "../components/form-elements/header-with-upload-option";

import FinishModal from "./add-edit-expense-screen/finish-modal";

const AttachmentIcon = () => (
  <Icon name="attachment" size={20} color={colors.pinkishOrange} />
);

class MedicalDoc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mainCategoryId: MAIN_CATEGORY_IDS.HEALTHCARE,
      categoryId: 86,
      isLoading: false,
      isFinishModalVisible: false
    };
  }

  componentDidMount() {}

  saveDoc = async () => {
    const { mainCategoryId, categoryId, navigator } = this.props;
    let data = {
      mainCategoryId,
      categoryId,
      ...this.medicalDocForm.getFilledData()
    };

    console.log("data: ", data);

    if (data.copies.length == 0) {
      return Alert.alert("Please upload doc");
    }

    try {
      this.setState({ isLoading: true });
      await updateProduct(data);
      this.setState({ isLoading: false });
      navigator.pop();
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  render() {
    const {
      productId,
      jobId,
      reportTitle,
      typeId,
      date,
      doctorName,
      doctorContact,
      copies,
      navigator
    } = this.props;
    const {
      mainCategoryId,
      categoryId,
      isLoading,
      isFinishModalVisible
    } = this.state;
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
          <LoadingOverlay visible={isLoading} />
          <MedicalDocForm
            ref={ref => (this.medicalDocForm = ref)}
            {...{
              productId,
              jobId,
              reportTitle,
              typeId,
              date,
              doctorName,
              doctorContact,
              copies,
              navigator
            }}
          />
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

export default MedicalDoc;
