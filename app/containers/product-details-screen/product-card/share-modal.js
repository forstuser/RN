import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  Image,
  Alert
} from "react-native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";
import StarRating from "react-native-star-rating";
import ViewShot, { captureRef } from "react-native-view-shot";
import Share from "react-native-share";
import RNFetchBlob from "react-native-fetch-blob";

import moment from "moment";

import { API_BASE_URL } from "../../../api";
import I18n from "../../../i18n";
import { Text, Button } from "../../../elements";
import { requestStoragePermission } from "../../../android-permissions";

import ProductReview from "../../../components/product-review";
import UploadProductImage from "../../../components/upload-product-image";
import { colors } from "../../../theme";
import LoadingOverlay from "../../../components/loading-overlay";

const uploadDocIllustration = require("../../../images/upload_doc_illustration.png");
const starIllustration = require("../../../images/star_illustration.png");
const binbillLogo = require("../../../images/binbill_logo_long.png");
const playStoreBadge = require("../../../images/playstore_badge.png");
const appStoreBadge = require("../../../images/appstore_badge.png");

class ShareModal extends React.Component {
  state = {
    isModalVisible: false,
    isProductImageAvailable: false,
    isProductImageStepDone: false,
    ratings: null,
    feedbackText: "",
    isImageLoaded: true
  };

  componentDidMount() {
    console.log("loggedInUser: ", this.props.loggedInUser);
  }

  show = () => {
    let newState = {
      isModalVisible: true
    };
    const { product } = this.props;
    const { productReviews } = product;
    if (productReviews.length > 0) {
      newState.ratings = productReviews[0].ratings;
      newState.feedbackText = productReviews[0].feedback;
    }
    if (product.file_type) {
      newState.isProductImageAvailable = true;
      newState.isProductImageStepDone = true;
    }
    this.setState(newState);
  };

  onImageStepDone = isProductImageAvailable => {
    this.setState({
      isProductImageAvailable,
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
  hideLoader = () => {
    this.setState({
      isImageLoaded: false
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
        console.log("Image saved to", uri);
        await Share.open({
          url: uri
        });
      }
    } catch (e) {
      Alert.alert("Some error occurred", e.message);
      console.error("Oops, snapshot failed", e);
    }
  };

  render() {
    const {
      isModalVisible,
      isProductImageAvailable,
      isProductImageStepDone,
      ratings,
      feedbackText,
      isImageLoaded
    } = this.state;
    const { product, loggedInUser } = this.props;
    const { brand } = product;

    let productImageUrl, productImageResizeMode;

    if (isProductImageAvailable) {
      productImageUrl =
        API_BASE_URL +
        `/consumer/products/${product.id}/images?t=${moment().format("X")}`;
      productImageResizeMode = "cover";
    } else if (
      !isProductImageAvailable &&
      brand &&
      brand.status_type == 1 &&
      brand.id > 0
    ) {
      productImageUrl = API_BASE_URL + "/" + brand.imageUrl;
      productImageResizeMode = "contain";
    }

    let userImageSource = require("../../../images/ic_more_no_profile_pic.png");
    if (loggedInUser.imageName) {
      userImageSource = {
        uri: API_BASE_URL + `/consumer/${loggedInUser.id}/images`,
        headers: { Authorization: loggedInUser.authToken }
      };
    }

    return (
      <Modal
        isVisible={isModalVisible}
        useNativeDriver={true}
        onBackButtonPress={this.hide}
        onBackdropPress={this.hide}
        avoidKeyboard={Platform.OS == "ios"}
      >
        <View style={styles.modal}>
          <LoadingOverlay visible={isImageLoaded} />
          {(!isProductImageStepDone || ratings == null) && (
            <View
              style={{ alignItems: "center", marginTop: 40, marginBottom: 20 }}
            >
              <Image
                style={styles.illustration}
                source={
                  isProductImageStepDone
                    ? starIllustration
                    : uploadDocIllustration
                }
              />
              <View style={styles.steps}>
                <View style={[styles.step]}>
                  {!isProductImageStepDone && (
                    <Text weight="Bold" style={styles.stepText}>
                      1
                    </Text>
                  )}
                  {isProductImageStepDone && (
                    <View style={styles.tick}>
                      <Icon name="md-checkmark" size={20} color="#fff" />
                    </View>
                  )}
                </View>
                <View style={styles.stepLine} />
                <View style={[styles.step]}>
                  <Text weight="Bold" style={styles.stepText}>
                    2
                  </Text>
                </View>
              </View>
              <Text
                weight="Bold"
                style={{ marginTop: 20, color: colors.mainBlue, fontSize: 16 }}
              >
                {isProductImageStepDone
                  ? I18n.t("add_product_review")
                  : I18n.t("add_product_image")}
              </Text>
            </View>
          )}

          {!isProductImageStepDone && (
            <View style={{ padding: 30 }}>
              <Button
                onPress={() => this.uploadProductImage.showOptions()}
                text={I18n.t("upload_product_image")}
                color="secondary"
              />
              <TouchableOpacity onPress={() => this.onImageStepDone(false)}>
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

          {isProductImageStepDone &&
            ratings == null && (
              <View>
                <ProductReview
                  product={product}
                  onReviewSubmit={review => this.onReviewStepDone(review)}
                />
              </View>
            )}
          {isProductImageStepDone &&
            ratings != null && (
              <View style={styles.shareViewContainer}>
                <View
                  collapsable={false}
                  style={styles.shareView}
                  ref={ref => (this.shareView = ref)}
                >
                  {productImageUrl ? (
                    <Image
                      onLoad={this.hideLoader}
                      resizeMode={productImageResizeMode}
                      style={styles.productImage}
                      source={{ uri: productImageUrl }}
                    />
                  ) : null}
                  <Text weight="Bold" style={styles.productName}>
                    {product.productName}
                  </Text>
                  <Text weight="Medium" style={styles.productModel}>
                    {product.model}
                  </Text>
                  <View style={styles.userImageView}>
                    <View style={styles.userImageLine} />
                    <Image
                      style={styles.userImage}
                      source={userImageSource}
                      resize="cover"
                    />
                  </View>
                  <Text style={styles.userName} weight="Bold">
                    {loggedInUser.name}
                  </Text>
                  <Text
                    numberOfLines={4}
                    weight="Bold"
                    style={styles.reviewQuotesText}
                  >{`"${I18n.t("review_quotes")}"`}</Text>
                  <StarRating
                    starColor="#f8e71c"
                    disabled={true}
                    maxStars={5}
                    rating={ratings}
                    halfStarEnabled={true}
                    starSize={18}
                    starStyle={{ marginHorizontal: 2 }}
                  />
                  <Text
                    numberOfLines={4}
                    style={styles.feedbackText}
                  >{`"${feedbackText}"`}</Text>
                  <View style={styles.badges}>
                    <View style={styles.binbillLogoWrapper}>
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
            onImageUpload={() => this.onImageStepDone(true)}
          />
          <TouchableOpacity style={styles.closeIcon} onPress={this.hide}>
            <Icon name="md-close" size={30} color={colors.mainText} />
          </TouchableOpacity>
        </View>
      </Modal>
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
    marginTop: 7
  },
  productModel: {
    fontSize: 10,
    color: colors.secondaryText,
    marginTop: 7
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
    overflow: "hidden"
  },
  userName: {
    marginVertical: 7
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
    color: colors.success,
    textAlign: 'center',
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
