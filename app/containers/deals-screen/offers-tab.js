import React from "react";
import { View, ScrollView, FlatList } from "react-native";
import Snackbar from "react-native-snackbar";
import { Text } from "../../elements";
import LoadingOverlay from "../../components/loading-overlay";
import ItemSelector from "../../components/item-selector";
import {
  API_BASE_URL,
  fetchOfferCategories,
  fetchCategoryOffers
} from "../../api";
import { colors } from "../../theme";
import OfferCategory from "./offer-category";
import OfferDetailedItem from "./offer-detailed-item";
import OffersModal from "./offers-modal";

export default class OffersTab extends React.Component {
  state = {
    categories: [],
    selectedCategory: null,
    isLoading: false,
    offerCategories: []
  };
  componentDidMount() {
    this.fetchCategories();
  }

  fetchCategories = async () => {
    this.setState({ isLoading: true });
    try {
      const res = await fetchOfferCategories();
      this.setState({
        categories: res.categories.map(category => ({
          ...category,
          name: category.category_name,
          imageUrl: category.image_url
        }))
      });
    } catch (e) {
      this.setState({ isLoading: false });
      Snackbar.show({
        title: e.message,
        duration: Snackbar.LENGTH_SHORT
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  fetchOffers = async () => {
    this.setState({ isLoading: true });
    try {
      const res = await fetchCategoryOffers(this.state.selectedCategory.id);
      this.setState({
        offerCategories: res.result || []
      });
    } catch (e) {
      this.setState({ isLoading: false });
      Snackbar.show({
        title: e.message,
        duration: Snackbar.LENGTH_SHORT
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  onCategorySelect = category => {
    console.log("category: ", category);
    const { selectedCategory } = this.state;
    if (selectedCategory && selectedCategory.id == category.id) {
      return;
    }

    this.setState(
      {
        selectedCategory: category
      },
      () => {
        this.fetchOffers();
      }
    );
  };

  render() {
    const {
      categories,
      selectedCategory,
      isLoading,
      offerCategories
    } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <ItemSelector
          items={categories.slice(0, 4)}
          moreItems={categories.slice(4)}
          selectedItem={selectedCategory}
          onItemSelect={this.onCategorySelect}
          startOthersAfterCount={4}
        />

        {!selectedCategory ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text
              weight="Medium"
              style={{
                fontSize: 20,
                textAlign: "center",
                color: colors.lighterText,
                padding: 20
              }}
            >
              Please select a category to view offers
            </Text>
          </View>
        ) : (
          <View />
        )}
        {offerCategories.length > 1 ? (
          <FlatList
            style={{ flex: 1, backgroundColor: "#f7f7f7" }}
            data={offerCategories}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View>
                <OfferCategory
                  onViewAllPress={() => {
                    this.offersModal.show(item);
                  }}
                  offerCategory={item}
                />
              </View>
            )}
            onRefresh={this.fetchCategoryOffers}
            refreshing={isLoading}
          />
        ) : (
          <View />
        )}
        {offerCategories.length == 1 ? (
          <View style={{ flex: 1, backgroundColor: "#f7f7f7", padding: 10 }}>
            <FlatList
              data={offerCategories[0].offers}
              renderItem={({ item }) => <OfferDetailedItem item={item} />}
              keyExtractor={item => item.id}
            />
          </View>
        ) : (
          <View />
        )}
        <LoadingOverlay visible={isLoading} />
        <OffersModal
          ref={node => (this.offersModal = node)}
          offerCategories={offerCategories}
        />
      </View>
    );
  }
}
