import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { connect } from "react-redux";

import { Text, Button, Image } from "../../elements";
import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";

import { API_BASE_URL, getSellerDetails } from "../../api";

import ScrollableTabView, {
  DefaultTabBar
} from "react-native-scrollable-tab-view";
import { colors } from "../../theme";

import Profile from "./profile";
import CreditTransactions from "./credit-transactions";
import Offers from "./offers";
import { SCREENS } from "../../constants";

class SellerDetailsScreen extends React.Component {
  static navigationOptions = {
    title: "Seller Details"
  };

  constructor(props) {
    super(props);

    this.state = {
      seller: null,
      paymentModes: [],
      isLoading: true,
      error: null
    };
  }

  componentDidMount() {
    this.getSellerDetails();
  }

  getSellerDetails = async () => {
    const { navigation } = this.props;
    const seller = navigation.getParam("seller", {});
    const openOffersTabOnStart = navigation.getParam(
      "openOffersTabOnStart",
      false
    );
    this.setState({
      isLoading: true,
      error: null
    });
    try {
      const res = await getSellerDetails(seller.id);
      this.setState(
        {
          seller: res.result,
          paymentModes: res.payment_modes
        },
        () => {
          if (openOffersTabOnStart) {
            setTimeout(() => {
              this.scrollableTabView.goToPage(2);
            }, 200);
          }
        }
      );
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { seller, isLoading, error, paymentModes } = this.state;

    if (error) {
      return (
        <ErrorOverlay error={error} onRetryPress={this.getSellerDetails} />
      );
    }

    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {seller && (
          <ScrollableTabView
            renderTabBar={() => <DefaultTabBar style={{ height: 35 }} />}
            tabBarUnderlineStyle={{
              backgroundColor: colors.mainBlue,
              height: 2
            }}
            ref={node => {
              this.scrollableTabView = node;
            }}
            tabBarBackgroundColor="transparent"
            tabBarTextStyle={{
              fontSize: 14,
              fontFamily: `Roboto-Bold`,
              color: colors.mainBlue,
              marginTop: 8
            }}
          >
            <View tabLabel="Profile" style={{ flex: 1 }}>
              <Profile
                user={this.props.user}
                seller={seller}
                paymentModes={paymentModes}
                reloadSellerDetails={this.getSellerDetails}
              />
            </View>
            <View tabLabel="Transactions">
              <CreditTransactions
                sellerID={seller.id}
                isLoading={isLoading}
                navigation={this.props.navigation}
              />
            </View>
            {/* <View tabLabel="Offers">
              <Offers
                offers={seller.seller_offers || []}
                isLoading={isLoading}
              />
            </View> */}
          </ScrollableTabView>
        )}
        <LoadingOverlay visible={isLoading} />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.loggedInUser
  };
};

export default connect(mapStateToProps)(SellerDetailsScreen);
