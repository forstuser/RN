import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import StarRating from "react-native-star-rating";

import { API_BASE_URL, getSellerAssistedServices, placeOrder } from "../../api";

import { Text, Button, Image } from "../../elements";

import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";
import { defaultStyles, colors } from "../../theme";
import { SCREENS, ORDER_TYPES } from "../../constants";
import { showSnackbar } from "../../utils/snackbar";

export default class MySellersAssistedServicesScreen extends React.Component {
  static navigationOptions = {
    title: "Assisted Services"
  };

  state = {
    services: [],
    isLoading: false,
    error: null
  };

  componentDidMount() {
    this.getSellerAssistedServices();
  }

  getSellerAssistedServices = async () => {
    const { navigation } = this.props;
    const seller = navigation.getParam("seller", {});
    this.setState({
      isLoading: true
    });
    try {
      const res = await getSellerAssistedServices({ sellerId: seller.id });
      this.setState({
        services: res.result
      });
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  selectAddressForOrder = (service) => {
    console.log("select adderss", service)
    const { navigation } = this.props;
    const seller = navigation.getParam("seller", {});
    this.props.navigation.navigate(SCREENS.ADDRESS_SCREEN, {
      sellerId: seller.id,
      orderType: ORDER_TYPES.ASSISTED_SERVICE,
      serviceTypeId: service.service_type_id,
      serviceName: service.service_name
    });
  };


  placeOrder = async service => {
    const { navigation } = this.props;
    const seller = navigation.getParam("seller", {});
    try {
      const res = await placeOrder({
        sellerId: seller.id,
        orderType: ORDER_TYPES.ASSISTED_SERVICE,
        serviceTypeId: service.service_type_id,
        serviceName: service.service_name
      });
      this.props.navigation.navigate(SCREENS.ORDER_SCREEN, {
        orderId: res.result.id
      });
    } catch (e) {
      showSnackbar({ text: e.message });
    }
  };

  render() {
    const { navigation } = this.props;
    const { services, isLoading } = this.state;

    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <FlatList
          contentContainerStyle={[
            { flexGrow: 1 },
            services.length ? null : { justifyContent: "center" }
          ]}
          data={services}
          refreshing={isLoading}
          onRefresh={this.getSellerDetails}
          ListEmptyComponent={() =>
            !isLoading ? (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 20
                }}
              >
                <Text style={{ textAlign: "center" }}>
                  No services for now.
                </Text>
              </View>
            ) : null
          }
          keyExtractor={(item, index) => item + "" + index}
          renderItem={({ item }) => (
            <View
              style={{
                ...defaultStyles.card,
                margin: 10,
                borderRadius: 10,
                overflow: "hidden",
                flexDirection: "row",
                padding: 10
              }}
            >
              <Image
                style={{
                  width: 60,
                  height: 60
                }}
                source={{
                  uri: API_BASE_URL + `/assisted/${item.service_type_id}/images`
                }}
                resizeMode="contain"
              />

              <View style={{ flex: 1, paddingHorizontal: 5, marginLeft: 10 }}>
                <Text weight="Medium" style={{ fontSize: 11 }}>
                  {item.service_name}
                </Text>
                <Text style={{ fontSize: 9 }}>{item.details}</Text>
                <Button
                  onPress={() => this.selectAddressForOrder(item)}
                  text="Request Service"
                  color="secondary"
                  style={{ height: 30, width: 115, marginTop: 10 }}
                  textStyle={{ fontSize: 11 }}
                />
              </View>
            </View>
          )}
        />
      </View>
    );
  }
}
