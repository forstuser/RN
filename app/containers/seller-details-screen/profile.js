import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import StarRating from "react-native-star-rating";
import call from "react-native-phone-call";
import getDirections from "react-native-google-maps-directions";
import { connect } from "react-redux";
import moment from "moment";
import { loginToApplozic, openChatWithSeller } from "../../applozic";

import { API_BASE_URL } from "../../api";
//import defaultPic from '../../images/default_seller_img.png';

import { Text, Button } from "../../elements";
import Checkbox from "../../components/checkbox";

import { colors, defaultStyles } from "../../theme";
import { showSnackbar } from "../../utils/snackbar";

import ReviewModal from "./review-modal";

import Reviews from "../../components/reviews";
const windowWidth = Dimensions.get("window").width;
const KeyValue = ({ keyText, valueText, ValueComponent }) => (
  <View style={{ flexDirection: "row", marginVertical: 3 }}>
    <View
      style={{
        flexDirection: "row",
        width: 100,
        justifyContent: "space-between"
      }}
    >
      <Text style={{ fontSize: 14 }}>{keyText}</Text>
      <Text style={{ fontSize: 14, marginLeft: 1 }}>:</Text>
    </View>
    {ValueComponent ? (
      <ValueComponent />
    ) : (
      <Text weight="Medium" style={{ fontSize: 12, marginLeft: 20 }}>
        {valueText}
      </Text>
    )}
  </View>
);

const PaymentMode = ({ isAvailable, name }) => (
  <View
    style={{
      flexDirection: "row",
      marginVertical: 3,
      alignItems: "center",
      marginLeft: 20,
      width: 70
    }}
  >
    <Checkbox isChecked={isAvailable} style={{ height: 16, width: 16 }} />
    <Text style={{ fontSize: 12, marginLeft: 5 }}>{name}</Text>
  </View>
);

class SellerProfileTab extends React.Component {
  call = () => {
    const { seller } = this.props;
    if (seller.contact_no) {
      call({ number: seller.contact_no }).catch(e =>
        showSnackbar({
          text: e.message
        })
      );
    } else {
      showSnackbar({ text: "Phone number not available" });
    }
  };

  startChatWithSeller = async seller => {
    this.setState({ isMySellersModalVisible: false });
    const { user } = this.props;
    try {
      await loginToApplozic({ id: user.id, name: user.name });
      openChatWithSeller({ id: seller.id });
    } catch (e) {
      showSnackbar({ text: e.message });
    }
  };

  openNavigation = () => {
    const { seller } = this.props;
    const data = {
      params: [
        {
          key: "daddr",
          value: seller.address
        }
      ]
    };

    getDirections(data);
  };

  render() {
    const { seller, paymentModes, reloadSellerDetails } = this.props;
    console.log("seller is :", seller);
    const sellerDetails = seller.seller_details || {};
    const basicDetails = sellerDetails.basic_details || {};

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const availablePaymentModesIds = basicDetails.payment_modes
      ? basicDetails.payment_modes.split(",")
      : [];

    let homeDeliveryInfo = basicDetails.home_delivery ? "Yes" : "No";
    homeDeliveryInfo =
      homeDeliveryInfo +
      "\n" +
      (basicDetails.home_delivery_remarks
        ? "(" + basicDetails.home_delivery_remarks + ")"
        : "");

    let coverImageUri =
      API_BASE_URL + `/consumer/sellers/${seller.id}/upload/1/images/0`;

    console.log("coverImageUri: ", coverImageUri);

    const thisUserReview = seller.reviews.find(
      review => this.props.userId == review.user.id
    );

    return (
      <ScrollView contentContainerStyle={{ alignItems: "center" }}>
        <Image
          style={{
            zIndex: 2,
            width: 110,
            height: 120,
            position: "absolute",
            top: 50,
            left: 20,
            borderRadius: 20,
            borderWidth: 1
          }}
          source={{
            uri: coverImageUri
          }}
        />
        <View
          style={{
            width: windowWidth,
            height: 150,
            backgroundColor: "#1a2036",
            borderBottomColor: "#eee",
            borderBottomWidth: 1
          }}
        >
          {/* <Image
            style={{
              width: 120,
              height: 120,
              position: 'absolute',
              top: 30,
              left: 20
            }}
            source={{
              uri: coverImageUri
            }}
          /> */}
          <View style={{ position: "absolute", top: 35, left: 150 }}>
            <View style={{ flexDirection: "row" }}>
              <Text weight="Medium" style={{ fontSize: 15.5, color: "#fff" }}>
                {seller.name}
              </Text>
              <View
                style={{
                  marginTop: 5,
                  marginLeft: 5,
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: seller.is_onboarded
                    ? colors.success
                    : colors.danger,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Icon
                  name={seller.is_onboarded ? "md-checkmark" : "md-remove"}
                  color="#fff"
                  size={12}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                marginTop: 5
              }}
            >
              <StarRating
                starColor={colors.yellow}
                disabled={true}
                maxStars={5}
                rating={Number(seller.ratings)}
                halfStarEnabled={true}
                starSize={13}
                starStyle={{ marginHorizontal: 0 }}
              />
              <Text
                weight="Medium"
                style={{
                  fontSize: 10,
                  marginLeft: 2,
                  color: colors.secondaryText
                }}
              >
                ({seller.ratings.toFixed(2)})
              </Text>
            </View>
            <View style={{ flex: 1, width: windowWidth - 150 }}>
              <Text
                style={{
                  fontSize: 13,
                  marginTop: 5,
                  color: "#fff"
                }}
              >
                {seller.address}
              </Text>
            </View>
          </View>
        </View>

        {/* <View
          style={{
            flexDirection: "row",
            alignItems: "baseline",
            marginTop: 8
          }}
        >
          <StarRating
            starColor={colors.yellow}
            disabled={true}
            maxStars={5}
            rating={Number(3.5)}
            halfStarEnabled={true}
            starSize={11}
            starStyle={{ marginHorizontal: 0 }}
          />
          <Text
            weight="Medium"
            style={{
              fontSize: 10,
              marginLeft: 2,
              color: colors.secondaryText
            }}
          >
            ({seller.ratings})
          </Text>
        </View> */}
        {/* <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 4
          }}
        >
          <Text weight="Medium" style={{ fontSize: 13.5 }}>
            {seller.name}
          </Text>
          <View
            style={{
              marginTop: 5,
              marginLeft: 3,
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: seller.is_onboarded
                ? colors.success
                : colors.danger,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Icon
              name={seller.is_onboarded ? "md-checkmark" : "md-remove"}
              color="#fff"
              size={12}
            />
          </View>
        </View> */}
        {/* <Text style={{ fontSize: 9, marginTop: 5, textAlign: "center" }}>
          {seller.address}
        </Text> */}
        {/* <View
          style={{
            width: 200,
            borderColor: "#d9d9d9",
            borderTopWidth: 1,
            borderBottomWidth: 1,
            height: 28,
            justifyContent: "center",
            marginTop: 10
          }}
        >
          <Text style={{ fontSize: 9, textAlign: "center", marginTop: -2 }}>
            {seller.owner_name}
          </Text>
        </View> */}
        {/* {basicDetails.shop_open_day && (
          <View
            style={{
              width: 200,
              borderColor: "#d9d9d9",
              borderBottomWidth: 1,
              height: 28,
              justifyContent: "center"
            }}
          >
            <Text style={{ fontSize: 9, textAlign: "center", marginTop: -2 }}>
              {basicDetails.shop_open_day
                .split(",")
                .map(day => weekDays[day])
                .join(" ") +
                `        ` +
                basicDetails.start_time + ' - ' + basicDetails.close_time}
            </Text>
          </View>
        )} */}
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "#eee",
            width: "100%",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <View
            style={{
              flexDirection: "row",
              width: 185,
              height: 60,
              paddingTop: 10,
              marginTop: -10,
              marginLeft: 25
            }}
          >
            <TouchableOpacity onPress={this.call} style={[styles.button]}>
              <Icon
                name="ios-call"
                style={styles.buttonIcon}
                color={colors.pinkishOrange}
              />
              <Text weight="Medium" style={styles.buttonText}>
                Call
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.openNavigation}
              style={[styles.button, { marginHorizontal: 1 }]}
            >
              <Icon
                name="ios-navigate"
                style={styles.buttonIcon}
                color={colors.pinkishOrange}
              />
              <Text weight="Medium" style={styles.buttonText}>
                Directions
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ width: "100%" }}>
          <View
            style={{
              ...defaultStyles.card,
              margin: 10,
              marginTop: 20,
              borderRadius: 10,
              paddingVertical: 5,
              paddingHorizontal: 20
            }}
          >
            <KeyValue
              keyText="Open Days"
              valueText={basicDetails.shop_open_day
                .split(",")
                .map(day => weekDays[day])
                .join(" ")}
            />
            <KeyValue
              keyText="Open Hours"
              valueText={
                basicDetails.start_time + " - " + basicDetails.close_time
              }
            />
          </View>
        </View>

        <View style={{ width: "100%" }}>
          <View
            style={{
              ...defaultStyles.card,
              margin: 10,
              borderRadius: 10,
              paddingVertical: 5,
              paddingHorizontal: 20
            }}
          >
            <KeyValue
              keyText="No. of Transactions"
              valueText={seller.transaction_counts}
            />
            <KeyValue keyText="Credit" valueText={seller.credit_total} />
            <KeyValue keyText="Points" valueText={seller.loyalty_total} />
          </View>
        </View>

        <View style={{ width: "100%" }}>
          <View
            style={{
              ...defaultStyles.card,
              margin: 10,
              borderRadius: 10,
              paddingVertical: 5,
              paddingHorizontal: 20
            }}
          >
            <KeyValue
              keyText="Connected Since"
              valueText={moment(seller.created_at).format("MMM YYYY")}
            />
            <KeyValue
              keyText="Store Contact No"
              valueText={seller.contact_no}
            />
            <KeyValue keyText="Home Delivery" valueText={homeDeliveryInfo} />
            <KeyValue
              keyText="Payment Mode"
              ValueComponent={() => (
                <View
                  style={{ flexDirection: "row", flexWrap: "wrap", flex: 1 }}
                >
                  {paymentModes.map(paymentMode => (
                    <PaymentMode
                      key={paymentMode.title}
                      isAvailable={availablePaymentModesIds.includes(
                        paymentMode.id
                      )}
                      name={paymentMode.title}
                    />
                  ))}
                </View>
              )}
            />
          </View>
        </View>
        <Button
          onPress={() => {
            this.reviewModal.show({
              starCount: thisUserReview ? thisUserReview.review_ratings : 0,
              reviewText: thisUserReview ? thisUserReview.review_feedback : ""
            });
          }}
          text={thisUserReview ? "Update Review" : "Write a Review"}
          color="secondary"
          style={{
            width: 120,
            height: 28,
            alignSelf: "flex-end",
            marginRight: 10,
            marginTop: 5
          }}
          textStyle={{ fontSize: 12.5 }}
        />
        <ReviewModal
          ref={node => {
            this.reviewModal = node;
          }}
          seller={seller}
          reloadSellerDetails={reloadSellerDetails}
        />
        <View style={{ width: "100%" }}>
          <View
            style={{
              ...defaultStyles.card,
              margin: 10,
              borderRadius: 10,
              paddingVertical: 5,
              paddingHorizontal: 15
            }}
          >
            <Text weight="Medium" style={{ fontSize: 14 }}>
              Reviews
            </Text>
            <Reviews reviews={seller.reviews} />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#fff"
  },
  buttonIcon: {
    fontSize: 24,
    marginRight: 5
  },
  buttonText: {
    fontSize: 14,
    color: colors.pinkishOrange
  },
  chat: {
    marginLeft: -15
  }
});

const mapStateToProps = state => {
  return {
    userId: state.loggedInUser.id
  };
};

export default connect(mapStateToProps)(SellerProfileTab);
