import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import {
  Text,
  Button,
  ScreenContainer,
  DatePicker,
  TextInput,
  UploadDoc
} from "../../elements";
import { initExpense } from "../../api";
import { colors } from "../../theme";
import CheckBox from "../../components/checkbox";
import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";

import Camera from "./camera";
import ChecklistModal from "./checklist-modal";
import {
  MAIN_CATEGORIES,
  MAIN_CATEGORY_IDS,
  CATEGORY_IDS
} from "../../constants";

export default class ClaimCashback extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const isCameraOpen = navigation.getParam("isCameraOpen", false);
    return {
      title: isCameraOpen ? "Take Your Bill Picture" : "Claim Cashback"
    };
  };

  state = {
    isLoading: false,
    error: null,
    isCameraOpen: true,
    isChecklistOverlayVisible: false,
    isChecklistModalVisible: false,
    copies: [],
    product: null,
    wishlist: [],
    pastItems: []
  };

  componentDidMount() {
    this.initExpense();
    this.props.navigation.setParams({ isCameraOpen: true });
  }

  initExpense = async () => {
    try {
      this.setState({ isLoading: true });
      const res = await initExpense(
        MAIN_CATEGORY_IDS.HOUSEHOLD,
        CATEGORY_IDS.HOUSEHOLD.HOUSEHOLD_EXPENSE
      );
      this.setState({
        product: res.product,
        copies: res.product.copies || [],
        wishlist: res.wishlist_items,
        pastItems: res.past_selections,
        isChecklistOverlayVisible: true
      });
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  openCamera = () => {
    this.setState({ isCameraOpen: true });
    this.props.navigation.setParams({ isCameraOpen: true });
  };

  hideChecklistModal = () => {
    this.setState({ isChecklistModalVisible: false });
  };

  hideChecklistOverlay = () => {
    this.setState({ isChecklistOverlayVisible: false });
    this.uploadDoc.onUploadDocPress();
  };

  render() {
    const { navigation } = this.props;

    const {
      isChecklistOverlayVisible,
      isChecklistModalVisible,
      copies,
      isLoading,
      error,
      product
    } = this.state;

    const checklistPoints = [
      "Printed Bill only",
      "Bill should be clear & readable",
      "One Bill in one Click",
      "Use + Sign to capture a longer Bill",
      "Capture Bill inside Red Box"
    ];

    if (error) {
      <ErrorOverlay error={error} onRetryPress={this.initExpense} />;
    }

    return (
      <ScreenContainer style={{ padding: 0, backgroundColor: "#fff" }}>
        {product ? (
          <View style={{ padding: 16 }}>
            <UploadDoc
              ref={node => {
                this.uploadDoc = node;
              }}
              navigation={navigation}
              copies={copies}
              productId={product.id}
              itemId={product.id}
              jobId={product.job_id}
              type={1}
              canUseCameraOnly={true}
              placeholder="Upload Bill"
              onUpload={uploadResult => {
                console.log("upload result: ", uploadResult);
                this.setState({ copies: uploadResult.product.copies });
              }}
            />
            <DatePicker placeholder="Date of Purchase" placeholder2="*" />
            <TextInput
              placeholder="Total Amount of Bill"
              keyboardType="numeric"
            />

            <TouchableOpacity
              onPress={() => this.setState({ isChecklistModalVisible: true })}
              style={{ alignSelf: "center", alignItems: "center" }}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: "#f1f1f1",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Image
                  style={{ width: 20, height: 26 }}
                  source={require("../../images/checklist_icon.png")}
                />
              </View>
              <Text
                style={{ marginTop: 7, color: colors.mainBlue, fontSize: 10 }}
              >
                View Checklist
              </Text>
            </TouchableOpacity>

            <Button
              text="Next"
              color="secondary"
              style={{
                height: 40,
                width: 140,
                alignSelf: "center",
                marginTop: 20
              }}
            />
          </View>
        ) : (
          <View />
        )}
        {isChecklistOverlayVisible ? (
          <View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "rgba(0,0,0,0.8)",
              flex: 1
            }}
          >
            <View style={{ flex: 1, padding: 10 }}>
              {checklistPoints.map((checklistPoint, index) => (
                <View key={checklistPoint} style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      backgroundColor: colors.success,
                      height: 20,
                      width: 20,
                      borderRadius: 10,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 10,
                      marginBottom: 8
                    }}
                  >
                    <Text style={{ color: "#fff" }}>{index + 1}</Text>
                  </View>
                  <Text style={{ color: "#fff" }}>{checklistPoint}</Text>
                </View>
              ))}
            </View>
            <View style={{ flexDirection: "row", padding: 10 }}>
              <CheckBox />
              <Text style={{ color: "#fff", marginLeft: 10 }}>
                Don’t show this message again
              </Text>
            </View>
            <Button
              onPress={this.hideChecklistOverlay}
              style={{ width: "100%" }}
              borderRadius={0}
              color="secondary"
              text="Ok"
            />
          </View>
        ) : (
          <View />
        )}
        <ChecklistModal
          isChecklistModalVisible={isChecklistModalVisible}
          hideChecklistModal={this.hideChecklistModal}
        />
        <LoadingOverlay visible={isLoading} />
      </ScreenContainer>
    );
  }
}
