import React from "react";
import {
  View,
  TouchableOpacity,
  Image,
  AsyncStorage,
  Platform
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";
import SmsAndroid from "react-native-get-sms-android";

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
  CATEGORY_IDS,
  SCREENS
} from "../../constants";
import { showSnackbar } from "../../utils/snackbar";
import { requestSmsReadPermission } from "../../android-permissions";

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
    neverShowChecklistOverlay: false,
    isChecklistOverlayVisible: false,
    isChecklistModalVisible: false,
    copies: [],
    product: null,
    cashbackJob: null,
    purchaseDate: moment().format("YYYY-MM-DD"),
    amount: "",
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
        cashbackJob: res.cashback_jobs,
        copies: res.product.copies || [],
        wishlist: res.wishlist_items,
        pastItems: res.past_selections.map(pastItem => ({
          ...pastItem,
          sku_measurement: pastItem.sku_measurements[0],
          quantity: 1
        }))
      });

      try {
        const neverShowChecklistOverlay = Boolean(
          await AsyncStorage.getItem("neverShowChecklistOverlay")
        );
        if (!neverShowChecklistOverlay) {
          this.setState({ isChecklistOverlayVisible: true });
        } else {
          this.uploadDoc.onUploadDocPress();
        }
      } catch (e) {
        this.setState({ isChecklistOverlayVisible: true });
      }
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

  toggleNeverShowChecklistOverlay = async () => {
    this.setState({
      neverShowChecklistOverlay: !this.state.neverShowChecklistOverlay
    });
    try {
      await AsyncStorage.setItem(
        "neverShowChecklistOverlay",
        String(!this.state.neverShowChecklistOverlay)
      );
    } catch (e) {}
  };

  hideChecklistOverlay = async () => {
    this.setState({ isChecklistOverlayVisible: false });
    this.uploadDoc.onUploadDocPress();
  };

  onNextPress = async () => {
    const { amount } = this.state;
    let isDigitallyVerified = false;
    if (
      amount &&
      Platform.OS == "android" &&
      (await requestSmsReadPermission())
    ) {
      var filter = {
        box: "inbox" // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
      };

      SmsAndroid.list(
        JSON.stringify(filter),
        fail => {
          console.log("SMS read failed with this error: " + fail);
          this.proceedToNextStep();
        },
        (count, smsList) => {
          console.log("SMS Count: ", count);
          console.log("SMS List: ", smsList);
          var arr = JSON.parse(smsList);

          // this regex matches Rs. 200, Rs.200, Rs 200, Rs200, ₹ 200, ₹200
          var regExForAmount = new RegExp("(Rs.*|₹) *" + amount);

          isDigitallyVerified = arr.some(
            sms => sms.body.search(regExForAmount) > -1
          );

          this.proceedToNextStep(isDigitallyVerified);
        }
      );
    } else {
      this.proceedToNextStep();
    }
  };

  proceedToNextStep = isDigitallyVerified => {
    const {
      product,
      cashbackJob,
      copies,
      purchaseDate,
      amount,
      wishlist,
      pastItems
    } = this.state;

    if (copies.length == 0) {
      return showSnackbar({ text: "Please upload bill first" });
    } else if (!purchaseDate || moment().diff(purchaseDate, "days") != 0) {
      return showSnackbar({ text: "Please select only today's date" });
    } else if (!amount) {
      return showSnackbar({ text: "Please enter the bill amount" });
    }

    this.props.navigation.push(SCREENS.CLAIM_CASHBACK_SELECT_ITEMS_SCREEN, {
      product,
      cashbackJob,
      copies,
      purchaseDate,
      amount,
      wishlist,
      pastItems,
      isDigitallyVerified
    });
  };

  render() {
    const { navigation } = this.props;

    const {
      neverShowChecklistOverlay,
      isChecklistOverlayVisible,
      isChecklistModalVisible,
      copies,
      purchaseDate,
      amount,
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
              placeholder2="*"
              placeholder2Color={colors.mainBlue}
              onUpload={uploadResult => {
                console.log("upload result: ", uploadResult);
                this.setState({ copies: uploadResult.product.copies });
              }}
            />

            <DatePicker
              date={purchaseDate}
              onDateChange={purchaseDate => this.setState({ purchaseDate })}
              placeholder="Date of Purchase"
              placeholder2="*"
              placeholder2Color={colors.mainBlue}
              minDate={moment().format("YYYY-MM-DD")}
            />

            <TextInput
              placeholder="Total Amount of Bill"
              placeholder2="*"
              placeholder2Color={colors.mainBlue}
              keyboardType="numeric"
              value={String(amount)}
              onChangeText={amount => this.setState({ amount })}
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
              onPress={this.onNextPress}
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
            <TouchableOpacity
              onPress={this.toggleNeverShowChecklistOverlay}
              style={{ flexDirection: "row", padding: 10 }}
            >
              <CheckBox isChecked={neverShowChecklistOverlay} />
              <Text style={{ color: "#fff", marginLeft: 10 }}>
                Don’t show this message again
              </Text>
            </TouchableOpacity>
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
