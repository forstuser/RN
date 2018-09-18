import React, { Component } from "react";
import { View, FlatList } from "react-native";

import { Text, Button } from "../../elements";
import LoadingOverlay from "../../components/loading-overlay";
import SelectSellerHeader from "./select-seller-header";
import SingleSeller from "./single-seller";
import { getSellersBBCashWallet, redeemCashbackToSeller } from "../../api";
import { showSnackbar } from "../../utils/snackbar";

class SelectSellerScreen extends Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      selectedSeller: null,
      error: null,
      isFetchingData: true,
      sellers: [],
      isLoading: false
    };
  }

  componentDidMount() {
    this.fetchSellers();
  }

  fetchSellers = async () => {
    this.setState({
      error: null
    });
    try {
      const sellerData = await getSellersBBCashWallet();
      console.log("Seller Data: ", sellerData.result);
      //console.log('Seller Data: ', sellerData.result[0].name);
      //console.log('Seller Data: ', sellerData.result[0].cashback_total);
      this.setState({
        sellers: sellerData.result,
        isFetchingData: false
      });
    } catch (error) {
      console.log("error: ", error);
      this.setState({
        error,
        isFetchingData: false
      });
    }
  };

  onSellerPressedHandler = seller => {
    this.setState({
      selectedSeller: seller
    });
  };

  redeemPoints = async () => {
    const { selectedSeller } = this.state;

    this.setState({ isLoading: true });
    try {
      await redeemCashbackToSeller({
        sellerId: selectedSeller.id,
        cashbackIds: selectedSeller.cashback_ids
      });
      showSnackbar({ text: "Redeem Successful!" });
      this.props.navigation.goBack();
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  renderSellers = ({ item: seller, index }) => {
    return (
      <SingleSeller
        seller={seller}
        selectedSeller={this.state.selectedSeller}
        onSellerPressed={this.onSellerPressedHandler}
      />
    );
  };

  render() {
    const { isLoading, selectedSeller, sellers } = this.state;

    const filteredSellers = sellers.filter(seller => seller.cashback_total > 0);

    return (
      <View style={{ backgroundColor: "#fff", flex: 1 }}>
        <SelectSellerHeader navigation={this.props.navigation} />
        <FlatList
          contentContainerStyle={[
            { flexGrow: 1 },
            filteredSellers.length ? null : { justifyContent: "center" }
          ]}
          ListEmptyComponent={() => (
            <View
              style={{
                flex: 1,
                padding: 20,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text style={{ textAlign: "center" }}>
                You don't have any cashback avialable with any of your sellers.
              </Text>
            </View>
          )}
          data={filteredSellers}
          renderItem={this.renderSellers}
          extraData={this.state.selectedSeller}
          keyExtractor={item => item.id}
        />
        {selectedSeller && (
          <Button
            onPress={this.redeemPoints}
            text="Redeem"
            color="secondary"
            borderRadius={0}
          />
        )}
        <LoadingOverlay visible={isLoading} />
      </View>
    );
  }
}

export default SelectSellerScreen;
