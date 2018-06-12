import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  FlatList,
  Platform,
  TouchableOpacity
} from "react-native";
import Snackbar from "react-native-snackbar";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";

import { Text } from "../../elements";
import LoadingOverlay from "../../components/loading-overlay";
import ItemSelector from "../../components/item-selector";

import { colors } from "../../theme";
import { API_BASE_URL } from "../../api";

import OfferDetailedItem from "./offer-detailed-item";

export default class OffersModal extends React.Component {
  state = {
    isModalVisible: false,
    selectedCategory: null
  };

  show = category => {
    this.setState({ isModalVisible: true, selectedCategory: category });
  };

  

  render() {
    const { offerCategories } = this.props;
    const { isModalVisible, selectedCategory } = this.state;

    return (
      <Modal
        style={{ margin: 0 }}
        isVisible={isModalVisible}
        useNativeDriver={true}
        onBackButtonPress={() => this.setState({ isModalVisible: false })}
      >
        <View style={{ backgroundColor: "#fff", flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity
              style={{ paddingVertical: 10, paddingHorizontal: 15 }}
              onPress={() => this.setState({ isModalVisible: false })}
            >
              <Icon name="md-arrow-round-back" color="#fff" size={30} />
            </TouchableOpacity>
            <Text weight="Bold" style={{ color: "#fff", fontSize: 20 }}>
              Offers
            </Text>
          </View>
          <View style={styles.body}>
            <ItemSelector
              items={offerCategories.map(category => ({
                name: category.category_name,
                imageUrl: category.image_url,
                ...category
              }))}
              selectedItem={selectedCategory}
              onItemSelect={this.selectedCategory}
            />
            {selectedCategory ? (
              <View style={{ backgroundColor: "#f7f7f7", flex: 1 }}>
                <FlatList
                  data={selectedCategory.offers}
                  renderItem={({ item }) => (
                    <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
                      <OfferDetailedItem item={item} />
                    </View>
                  )}
                  keyExtractor={item => item.id}
                />
              </View>
            ) : (
              <View />
            )}
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: 0,
    width: "100%",
    height: 70,
    backgroundColor: colors.pinkishOrange,
    flexDirection: "row",
    alignItems: "center",
    ...Platform.select({
      ios: { paddingTop: 20 },
      android: { paddingTop: 10 }
    })
  },
  body: {
    flex: 1
  }
});
