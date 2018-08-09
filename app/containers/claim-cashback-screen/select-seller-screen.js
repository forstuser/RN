import React from "react";
import { View, TouchableOpacity, FlatList } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { getMySellers } from "../../api";
import { Text, Button } from "../../elements";
import { defaultStyles, colors } from "../../theme";
import { SCREENS } from "../../constants";

export default class SelectSellerScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { onSkipPress } = navigation.state.params;
    return {
      title: "Select Sellers",
      headerRight: (
        <TouchableOpacity
          style={{ paddingHorizontal: 10 }}
          onPress={onSkipPress}
        >
          <Text>SKIP</Text>
        </TouchableOpacity>
      )
    };
  };

  state = {
    sellers: [],
    isLoading: false,
    error: null,
    selectedSeller: null
  };

  componentDidMount() {
    this.props.navigation.setParams({ onSkipPress: this.onSkipPress });
    this.getMySellers();
  }

  onSkipPress = () => {};

  getMySellers = async () => {
    this.setState({ isLoading: true });
    try {
      const res = await getMySellers();
      this.setState({ sellers: res.result });
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  selectSeller = seller => {
    this.setState({ selectedSeller: seller });
  };

  proceedToNextStep = () => {
    const { navigation } = this.props;
    const copies = navigation.getParam("copies", []);
    const purchaseDate = navigation.getParam("purchaseDate", null);
    const amount = navigation.getParam("amount", null);
    const selectedItems = navigation.getParam("selectedItems", []);
    const { selectedSeller } = this.state;

    this.props.navigation.navigate(SCREENS.CLAIM_CASHBACK_FINAL_SCREEN, {
      copies,
      purchaseDate,
      amount,
      selectedItems,
      selectedSeller
    });
  };

  render() {
    const { sellers, isLoading, error, selectedSeller } = this.state;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff"
        }}
      >
        <FlatList
          data={sellers}
          refreshing={isLoading}
          onRefresh={this.getMySellers}
          ListEmptyComponent={() => (
            <View
              style={{
                maxWidth: 300,
                alignSelf: "center",
                alignItems: "center",
                marginTop: 35
              }}
            >
              <Text style={{ textAlign: "center" }}>
                You have not added any Sellers. Please add your Seller in My
                Seller section to avail additional Seller benefits in future.
              </Text>
              <Button
                onPress={this.proceedToNextStep}
                text="Next"
                color="secondary"
                style={{ height: 40, width: 140, marginTop: 30 }}
              />
            </View>
          )}
          renderItem={({ item }) => {
            const isSelected =
              selectedSeller && selectedSeller.id == item.id ? true : false;

            return (
              <TouchableOpacity
                onPress={() => this.selectSeller(item)}
                style={{
                  height: 90,
                  ...defaultStyles.card,
                  margin: 10,
                  borderRadius: 10,
                  padding: 15,
                  flexDirection: "row",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    borderColor: "#efefef",
                    borderWidth: 1,
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 10
                  }}
                >
                  <Icon
                    name="md-checkmark"
                    size={35}
                    color={isSelected ? colors.success : "#efefef"}
                  />
                </View>
                <Text weight="Bold">{item.name}</Text>
              </TouchableOpacity>
            );
          }}
        />
        <Button
          onPress={this.proceedToNextStep}
          text="Send for Seller Approval & Proceed"
          color="secondary"
          borderRadius={0}
        />
      </View>
    );
  }
}
