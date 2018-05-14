import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  Alert
} from "react-native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";
import StarRating from "react-native-star-rating";
import ViewShot, { captureRef } from "react-native-view-shot";
import Share from "react-native-share";
import RNFetchBlob from "react-native-fetch-blob";

import moment from "moment";

import { API_BASE_URL, updateProfile } from "../../../api";
import I18n from "../../../i18n";

import { Text, Button, Image } from "../../../elements";
import { requestStoragePermission } from "../../../android-permissions";

import ProductReview from "../../../components/product-review";
import UploadProductImage from "../../../components/upload-product-image";
import { colors } from "../../../theme";
import LoadingOverlay from "../../../components/loading-overlay";
import CustomTextInput from "../../../components/form-elements/text-input";
import Analytics from "../../../analytics";

const uploadDocIllustration = require("../../../images/upload_doc_illustration.png");
const starIllustration = require("../../../images/star_illustration.png");
const binbillLogo = require("../../../images/binbill_logo_long.png");
const playStoreBadge = require("../../../images/playstore_badge.png");
const appStoreBadge = require("../../../images/appstore_badge.png");
const userImagePlaceholder = require("../../../images/ic_more_no_profile_pic.png");

class ShareModal extends React.Component {
  state = {
    isModalVisible: false,
    isProductImageAvailable: false,
    isProductImageStepDone: false,
    nameInput: "",
    ratings: null,
    feedbackText: "",
    isSavingName: false,
    localfileUri: null
  };

  componentDidMount() {
    console.log("loggedInUser: ", this.props.loggedInUser);
  }

  show = () => {
    Analytics.logEvent(Analytics.EVENTS.CLICK_ON_SHARE_PRODUCT_CARD);
    let newState = {
      isModalVisible: true
    };
    const { product, review } = this.props;
    const { productReviews } = product;
    if (review) {
      newState.ratings = review.ratings;
      newState.feedbackText = review.feedback;
    }
    if (product.file_type) {
      newState.isProductImageAvailable = true;
      newState.isProductImageStepDone = true;
      localfileUri: null;
    }
    this.setState(newState);
  };

  onImageStepDone = localfileUri => {
    this.props.fetchProductDetails();
    this.setState({
      localfileUri,
      isProductImageStepDone: true
    });
  };

  onReviewStepDone = review => {
    this.setState({
      ratings: review.ratings,
      feedbackText: review.feedback
    });
  };

  hide = () => {
    this.setState({
      isModalVisible: false
    });
  };

  onSharePress = async () => {
    try {
      if (await requestStoragePermission()) {
        // const filePath = RNFetchBlob.fs.dirs.DCIMDir + `/fact.jpg`;

        let uri = await captureRef(this.shareView, {
          format: "jpg",
          quality: 0.8
        });
        if (Platform.OS == "android") {
          let filePath = RNFetchBlob.fs.dirs.DCIMDir + `/product-share.jpg`;
          await RNFetchBlob.fs.cp(uri, filePath);
          uri = `file://${filePath}`;
        }

        const shareContent = {
          url: uri
        };

        if (Platform.OS == "android") {
          shareContent.message = "Powered by BinBill - http://bit.ly/2rIabk0";
        }
        Analytics.logEvent(Analytics.EVENTS.COMPLETE_SHARE_PRODUCT);
        await Share.open(shareContent);
      }
    } catch (e) {
      showSnackbar({
        text: e.message
      });
      console.error("Oops, snapshot failed", e);
    }
  };

  saveUserName = async () => {
    const { nameInput } = this.state;
    if (!nameInput) {
      return showSnackbar({ text: "Please enter your name" });
    }
    this.setState({
      isSavingName: true
    });
    try {
      await updateProfile({
        name: nameInput
      });
      this.props.setLoggedInUserName(nameInput);
    } catch (e) {
      showSnackbar({
        text: e.message
      });
    } finally {
      this.setState({
        isSavingName: false
      });
    }
  };

  render() {
    let {
      isModalVisible,
      isProductImageAvailable,
      isProductImageStepDone,
      localfileUri,
      ratings,
      feedbackText,
      isSavingName
    } = this.state;
    const { product, loggedInUser, onNewReview } = this.props;
    const { brand } = product;

    let productImageUrl, productImageResizeMode;

    if (localfileUri) {
      productImageUrl = localfileUri;
    } else if (isProductImageAvailable) {
      productImageUrl = API_BASE_URL + product.cImageURL;
      productImageResizeMode = "cover";
    } else if (brand && brand.status_type == 1 && brand.id > 0) {
      productImageUrl = API_BASE_URL + "/" + brand.imageUrl;
      productImageResizeMode = "contain";
    }

    let userImageSource = userImagePlaceholder;
    if (loggedInUser.imageUrl) {
      userImageSource = {
        uri: API_BASE_URL + loggedInUser.imageUrl
      };
    }

    let step = 1;
    let stepImage = uploadDocIllustration;
    let stepText = I18n.t("add_product_image");
    if (!isProductImageStepDone) {
      step = 1;
    } else if (!loggedInUser.name) {
      step = 2;
      stepText = I18n.t("add_your_name");
      stepImage = userImagePlaceholder;
    } else if (!ratings) {
      step = 3;
      stepText = I18n.t("add_product_review");
      stepImage = starIllustration;
    } else {
      step = 4;
    }
    if (!isModalVisible) return null;

    return (
      <View collapsable={false} >
        {isModalVisible && (
          <View collapsable={false} >
            <Modal
              isVisible={true}
              useNativeDriver={true}
              onBackButtonPress={this.hide}
              onBackdropPress={this.hide}
              avoidKeyboard={Platform.OS == "ios"}
            >
              <View collapsable={false}  style={styles.modal}>
                <LoadingOverlay visible={isSavingName} />
                {step < 4 && (
                  <View collapsable={false} 
                    style={{
                      alignItems: "center",
                      marginTop: 40,
                      marginBottom: 20
                    }}
                  >
                    <Image
                      style={[
                        styles.illustration,
                        step == 2 ? styles.userImageIllustration : {}
                      ]}
                      source={stepImage}
                    />
                    <View collapsable={false}  style={styles.stepsContainer}>
                      <View collapsable={false}  style={styles.stepLine} />
                      <View collapsable={false}  style={styles.steps}>
                        {[1, 2, 3].map((s, index) => (
                          <View collapsable={false}  key={index} style={[styles.step]}>
                            {s >= step && (
                              <Text weight="Bold" style={styles.stepText}>
                                {s}
                              </Text>
                            )}
                            {s < step && (
                              <View collapsable={false}  style={styles.tick}>
                                <Icon
                                  name="md-checkmark"
                                  size={20}
                                  color="#fff"
                                />
                              </View>
                            )}
                          </View>
                        ))}
                      </View>
                    </View>
                    <Text
                      weight="Bold"
                      style={{
                        marginTop: 20,
                        color: colors.mainBlue,
                        fontSize: 16
                      }}
                    >
                      {stepText}
                    </Text>
                  </View>
                )}

                {step == 1 && (
                  <View collapsable={false}  style={{ padding: 30 }}>
                    <Button
                      onPress={() => this.uploadProductImage.showOptions()}
                      text={I18n.t("upload_product_image")}
                      color="secondary"
                    />
                    <TouchableOpacity
                      onPress={() => this.onImageStepDone(false)}
                    >
                      <Text
                        weight="Bold"
                        style={{
                          marginTop: 20,
                          color: colors.pinkishOrange,
                          textAlign: "center",
                          fontSize: 16
                        }}
                      >
                        {I18n.t("i_will_do_it_later")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                {step == 2 && (
                  <View collapsable={false}  style={{ padding: 20 }}>
                    <CustomTextInput
                      placeholder={I18n.t("profile_screen_label_name")}
                      onChangeText={nameInput => this.setState({ nameInput })}
                    />
                    <Button
                      onPress={this.saveUserName}
                      style={{ marginTop: 10 }}
                      text={I18n.t("save")}
                      color="secondary"
                    />
                  </View>
                )}
                {step == 3 && (
                  <View collapsable={false} >
                    <ProductReview
                      product={product}
                      onReviewSubmit={review => {
                        this.onReviewStepDone(review);
                        onNewReview(review);
                      }}
                    />
                  </View>
                )}
                {step == 4 && (
                  <View collapsable={false}  style={styles.shareViewContainer}>
                    <View collapsable={false} 
                      collapsable={false}
                      style={styles.shareView}
                      ref={ref => (this.shareView = ref)}
                    >
                      {productImageUrl ? (
                        <Image
                          resizeMode={productImageResizeMode}
                          style={[
                            styles.productImage,
                            productImageResizeMode == "contain"
                              ? { padding: 20 }
                              : {}
                          ]}
                          source={{ uri: productImageUrl }}
                        />
                      ) : null}
                      <View collapsable={false}  style={styles.userImageView}>
                        {/* <View collapsable={false}  style={styles.userImageLine} /> */}
                        <Image
                          style={styles.userImage}
                          source={userImageSource}
                          resize="cover"
                        />
                      </View>
                      <View collapsable={false} 
                        style={{
                          flexDirection: "row",
                          height: "auto",
                          marginBottom: 10
                        }}
                      >
                        <Text style={styles.userName} weight="Bold">
                          {loggedInUser.name}
                        </Text>
                        <Text> has rated</Text>
                      </View>
                      <Text weight="Bold" style={styles.productName}>
                        {product.productName}
                      </Text>
                      <Text weight="Medium" style={styles.productModel}>
                        {product.model}
                      </Text>
                      <StarRating
                        starColor={colors.pinkishOrange}
                        disabled={true}
                        maxStars={5}
                        rating={ratings}
                        halfStarEnabled={true}
                        starSize={18}
                        starStyle={{ marginHorizontal: 2, marginVertical: 5 }}
                      />
                      <Text numberOfLines={4} style={styles.feedbackText}>
                        {feedbackText ? `"${feedbackText}"` : ""}
                      </Text>
                      <Text
                        numberOfLines={4}
                        weight="Bold"
                        style={styles.reviewQuotesText}
                      >{`"${I18n.t("review_quotes")}"`}</Text>
                      <View collapsable={false}  style={styles.badges}>
                        <View collapsable={false}  style={styles.binbillLogoWrapper}>
                          <Image
                            resizeMode="contain"
                            style={styles.binbillLogo}
                            source={binbillLogo}
                          />
                        </View>
                        <Image
                          resizeMode="contain"
                          style={styles.storeBadge}
                          source={appStoreBadge}
                        />
                        <Image
                          resizeMode="contain"
                          style={styles.storeBadge}
                          source={playStoreBadge}
                        />
                      </View>
                    </View>
                    <Button
                      style={styles.shareBtn}
                      onPress={this.onSharePress}
                      text={I18n.t("share")}
                      color="secondary"
                    />
                  </View>
                )}
                <UploadProductImage
                  ref={ref => (this.uploadProductImage = ref)}
                  productId={product.id}
                  onImageUpload={localfileUri =>
                    this.onImageStepDone(localfileUri)
                  }
                />
                <TouchableOpacity style={styles.closeIcon} onPress={this.hide}>
                  <Icon name="md-close" size={30} color={colors.mainText} />
                </TouchableOpacity>
              </View>
            </Modal>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "#fff",
    borderRadius: 5,
    overflow: "hidden"
  },
  closeIcon: {
    position: "absolute",
    right: 15,
    top: 10,
    backgroundColor: "transparent"
  },
  illustration: {
    width: 80,
    height: 80
  },
  userImageIllustration: {
    backgroundColor: "#eee",
    borderRadius: 40
  },
  stepsContainer: {
    flexDirection: "row",
    width: 170,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15
  },
  stepLine: {
    position: "absolute",
    width: "100%",
    height: 2,
    backgroundColor: colors.mainBlue
  },
  steps: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  step: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.mainBlue,
    backgroundColor: "#fff"
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

  stepText: {
    color: colors.mainBlue
  },
  shareView: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#ececec",
    borderBottomWidth: 1
  },
  productImage: {
    width: "100%",
    height: 210,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    overflow: "hidden"
  },
  productName: {
    color: colors.mainBlue,
    marginTop: -15,
    fontSize: 18
  },
  productModel: {
    fontSize: 10,
    color: colors.secondaryText
    // marginTop: 10
  },
  userImageView: {
    marginTop: 7,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 10
  },
  userImageLine: {
    position: "absolute",
    top: 18,
    width: "100%",
    height: 1,
    backgroundColor: "#ececec"
  },
  userImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#eee"
  },
  userName: {
    // marginVertical: 7
  },
  feedbackText: {
    margin: 10,
    fontSize: 10
  },
  reviewQuotesText: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
    fontSize: 9,
    color: colors.mainBlue,
    textAlign: "center"
    // justifyContent: 'center',
    // alignItems: 'center'
  },
  badges: {
    flexDirection: "row",
    borderColor: "#eee",
    borderTopWidth: 1,
    alignItems: "center",
    height: 40,
    paddingLeft: 10,
    paddingRight: 7
  },
  binbillLogoWrapper: {
    flex: 1
  },
  binbillLogo: {
    height: 20,
    width: 70
  },
  storeBadge: {
    height: 20,
    width: 70,
    marginLeft: 5
  },
  shareBtn: {
    margin: 5,
    width: 160,
    height: 35,
    alignSelf: "center"
  }
});

export default ShareModal;
