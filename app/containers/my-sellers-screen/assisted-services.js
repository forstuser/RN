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

import { API_BASE_URL, getSellerDetails } from "../../api";

import { Text, Image, Button } from "../../elements";

import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";
import { defaultStyles, colors } from "../../theme";
import { SCREENS } from "../../constants";

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
    this.getSellerDetails();
  }

  getSellerDetails = async () => {
    const { navigation } = this.props;
    const seller = navigation.getParam("seller", {});
    this.setState({
      isLoading: true
    });
    try {
      const res = await getSellerDetails(seller.id);
      this.setState({
        services: res.result.assisted_services
      });
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
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
                <Text style={{ marginTop: 40, textAlign: "center" }}>
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
                  width: 68,
                  height: 68,
                  borderRadius: 35,
                  backgroundColor: "#eee"
                }}
                source={{ uri: API_BASE_URL + item.document_details.file_name }}
              />

              <View style={{ flex: 1, paddingHorizontal: 5 }}>
                <Text weight="Medium" style={{ fontSize: 11 }}>
                  {item.name}
                </Text>
                <Text style={{ fontSize: 9 }}>{item.details}</Text>
                <Button
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
