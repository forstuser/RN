import React from "react";
import { View, ScrollView } from "react-native";
import { Text } from "../../elements";
import SelectOrCreateItem from "../../components/select-or-create-item";
import ItemSelector from "../../components/item-selector";
import { API_BASE_URL, getAccessoriesCategory } from "../../api";
export default class AccessoriesTab extends React.Component {
  state = {
    products: [],
    categories: [],
    showSelectBrand: false,
    brands: [
      { id: 1, name: "Brand 1" },
      { id: 2, name: "Brand 1" },
      { id: 3, name: "Brand 1" },
      { id: 4, name: "Brand 1" },
      { id: 5, name: "Brand 1" },
      { id: 6, name: "Brand 1" },
      { id: 7, name: "Brand 1" },
      { id: 8, name: "Brand 1" },
      { id: 9, name: "Brand 1" },
      { id: 10, name: "Brand 1" },
      { id: 11, name: "Brand 1" },
      { id: 12, name: "Brand 1" },
      { id: 13, name: "Brand 1" },
      { id: 14, name: "Brand 1" },
      { id: 15, name: "Brand 1" },
      { id: 16, name: "Brand 1" }
    ],
    showSelectModel: false,
    models: [],
    isLoading: false,
    itemsArrayForSelector: []
  };
  componentDidMount() {
    this.fetchAccessoriesData();
  }

  fetchAccessoriesData = async () => {
    this.setState({
      isLoading: true,
      error: null
    });
    try {
      let itemsArray = [];
      const res = await getAccessoriesCategory();
      for (let i = 0; i < res.result.length; i++) {
        for (let j = 0; j < res.result[i].products.length; j++) {
          const product = res.result[i].products[j];
          itemsArray.push({
            type: "product",
            name: product.product_name,
            imageUrl: res.result[i].image_url,
            ...product
          });
        }
      }
      for (let k = 0; k < res.result.length; k++) {
        const category = res.result[k];
        if (category.products.length == 0) {
          itemsArray.push({
            type: "category",
            name: category.category_name,
            imageUrl: category.image_url,
            ...category
          });
        }
      }
      console.log(itemsArray);
      this.setState({
        itemsArrayForSelector: itemsArray
      });
    } catch (error) {
      this.setState({
        error
      });
    }
    this.setState({
      isLoading: false
    });
  };

  onSelectBrand = brand => {
    this.setState({
      selectedBrand: brand,
      showSelectBrand: false,
      showSelectModel: true
    });
  };
  render() {
    const {
      products,
      categories,
      showSelectBrand,
      brands,
      showSelectModel,
      models,
      isLoading,
      itemsArrayForSelector
    } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <View>
          <ItemSelector items={itemsArrayForSelector} />
        </View>
        {showSelectBrand ? (
          <SelectOrCreateItem
            items={brands}
            onSelectItem={this.onSelectBrand}
            title="Select a Brand"
            searchPlaceholder="Search for a Brand"
          />
        ) : (
          <View />
        )}
        {showSelectModel ? (
          <SelectOrCreateItem
            items={brands}
            onSelectItem={this.onSelectModel}
            title="Select a Model"
            searchPlaceholder="Search for a Model"
            showBackBtn={true}
            skippable={true}
            onBackBtnPress={() =>
              this.setState({ showSelectBrand: true, showSelectModel: false })
            }
          />
        ) : (
          <View />
        )}
      </View>
    );
  }
}
