import React from "react";
import { View, ScrollView } from "react-native";
import { Text } from "../../elements";
import SelectOrCreateItem from "../../components/select-or-create-item";
import { getAccessories } from "../../api";

import AccessoryCategory from "./accessory-category";

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
    accessoryCategories: []
  };

  componentDidMount() {
    this.getAccessories();
  }

  onSelectBrand = brand => {
    this.setState({
      selectedBrand: brand,
      showSelectBrand: false,
      showSelectModel: true
    });
  };

  getAccessories = async () => {
    try {
      const res = await getAccessories();
      this.setState({
        accessoryCategories: res.result[0].accessories
      });
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({ isLoading: false });
    }
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
      accessoryCategories
    } = this.state;

    return (
      <ScrollView style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
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

        {accessoryCategories.map(accessoryCategory => (
          <AccessoryCategory
            key={accessoryCategory.id}
            accessoryCategory={accessoryCategory}
          />
        ))}
      </ScrollView>
    );
  }
}
