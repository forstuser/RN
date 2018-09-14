import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

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

export default class SellerDetailsScreen extends React.Component {
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
    this.setState({
      isLoading: true,
      error: null
    });
    try {
      const res = await getSellerDetails(seller.id);
      this.setState({
        seller: res.result,
        paymentModes: res.payment_modes
      });
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
            tabBarBackgroundColor="transparent"
            tabBarTextStyle={{
              fontSize: 14,
              fontFamily: `Quicksand-Bold`,
              color: colors.mainBlue,
              marginTop: 8
            }}
          >
            <View tabLabel="Profile" style={{ flex: 1 }}>
              <Profile
                seller={seller}
                paymentModes={paymentModes}
                reloadSellerDetails={this.getSellerDetails}
              />
            </View>
            <View tabLabel="Transactions">
              <CreditTransactions
                transactions={seller.seller_credits || []}
                isLoading={isLoading}
              />
            </View>
            <View tabLabel="Offers">
              <Offers offers={seller.seller_offers || []} isLoading={isLoading} />
            </View>
          </ScrollableTabView>
        )}
        <LoadingOverlay visible={isLoading} />
      </View>
    );
  }
}
