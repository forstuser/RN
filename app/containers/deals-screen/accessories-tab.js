import React from "react";
import { View, ScrollView, FlatList } from "react-native";
import Snackbar from "react-native-snackbar";
import { Text } from "../../elements";
import LoadingOverlay from "../../components/loading-overlay";
import SelectOrCreateItem from "../../components/select-or-create-item";
import ItemSelector from "../../components/item-selector";

import {
  API_BASE_URL,
  getAccessoriesCategory,
  getAccessories,
  getReferenceDataBrands,
  getReferenceDataModels,
  initProduct,
  updateProduct
} from "../../api";
import AccessoryCategory from "./accessory-category";
import { colors } from "../../theme";

export default class AccessoriesTab extends React.Component {
  state = {
    products: [],
    categories: [],
    showSelectBrand: false,
    brands: [],
    showSelectModel: false,
    models: [],
    isLoading: false,
    selectedItem: null,
    items: [],
    accessoryCategories: [],
    product: null,
    selectedBrand: null
  };
  componentDidMount() {
    this.fetchAccessoriesData();
    // this.getAccessories();
  }

  fetchAccessoriesData = async () => {
    this.setState({
      isLoading: true,
      error: null
    });
    try {
      let itemsArray = [];
      const res = await getAccessoriesCategory();
      res.default_ids.forEach(defaultId => {
        console.log();
        for (let i = 0; i < res.result.length; i++) {
          const category = res.result[i];
          if (category.category_id == defaultId) {
            if (category.products.length == 0) {
              itemsArray.push({
                type: "category",
                id: category.category_id,
                name: category.category_name,
                imageUrl: category.image_url,
                ...category
              });
            } else {
              for (let j = 0; j < category.products.length; j++) {
                const product = category.products[j];
                itemsArray.push({
                  type: "product",
                  name: product.product_name,
                  imageUrl: res.result[i].image_url,
                  ...product
                });
              }
            }
          }
        }
      });

      console.log(itemsArray);
      this.setState({
        items: itemsArray
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

  fetchBrands = async () => {
    this.setState({ isLoading: true });
    try {
      const brands = await getReferenceDataBrands(this.state.selectedItem.id);
      this.setState({
        brands,
        showSelectBrand: true
      });
    } catch (e) {
      this.setState({ isLoading: false, selectedItem: null });
      Snackbar.show({
        title: e.message,
        duration: Snackbar.LENGTH_SHORT
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  replaceCategoryItemByProduct = () => {
    const { product, selectedItem, items } = this.state;
    const index = items.findIndex(
      item => item.id == selectedItem.id && item.type == selectedItem.type
    );
    const newItems = [...items];
    newItems[index] = {
      ...product,
      type: "product",
      name: product.product_name,
      imageUrl: selectedItem.imageUrl
    };
    this.setState({ items: newItems, selectedItem: newItems[index] });
  };

  onSelectBrand = async (brand, brandName) => {
    const { product, selectedItem } = this.state;
    this.setState({ isLoading: true });
    try {
      const res = await updateProduct({
        productId: product.id,
        brandId: brand ? brand.id : undefined,
        brandName: brandName,
        productName: (brand ? brand.name : brandName) + " " + selectedItem.name
      });

      this.setState(
        {
          product: res.product,
          selectedBrand: brand || { name: brandName },
          showSelectBrand: false
        },
        () => {
          this.replaceCategoryItemByProduct();
          this.fetchModels();
        }
      );
    } catch (e) {
      Snackbar.show({
        title: e.message,
        duration: Snackbar.LENGTH_SHORT
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  fetchModels = async () => {
    if (!this.state.selectedBrand.id) {
      return this.setState({ showSelectModel: true });
    }
    this.setState({ isLoading: true });
    try {
      const models = await getReferenceDataModels(
        this.state.selectedItem.id,
        this.state.product.brand_id
      );
      this.setState({
        models
      });
    } catch (e) {
      Snackbar.show({
        title: e.message,
        duration: Snackbar.LENGTH_SHORT
      });
    } finally {
      this.setState({ isLoading: false, showSelectModel: true });
    }
  };

  onSkipModel = async () => {
    this.setState({
      showSelectModel: false
    });
    this.getAccessories();
  };

  onSelectModel = async (model, modelName) => {
    this.setState({ isLoading: true });
    const { product, selectedBrand } = this.state;
    try {
      const res = await updateProduct({
        productId: product.id,
        model: model ? model.title : modelName,
        productName:
          selectedBrand.name + " " + (model ? model.title : modelName)
      });

      this.setState(
        {
          product: res.product,
          showSelectModel: false
        },
        () => {
          this.getAccessories();
          this.replaceCategoryItemByProduct();
        }
      );
    } catch (e) {
      this.setState({ isLoading: false });
      Snackbar.show({
        title: e.message,
        duration: Snackbar.LENGTH_SHORT
      });
    }
  };

  initProduct = async () => {
    const category = this.state.selectedItem;
    this.setState({ isLoading: true });
    try {
      const res = await initProduct(category.main_category_id, category.id);
      this.setState({ product: res.product }, () => {
        this.fetchBrands();
      });
    } catch (e) {
      this.setState({ isLoading: false, selectedItem: null });
      Snackbar.show({
        title: e.message,
        duration: Snackbar.LENGTH_SHORT
      });
    }
  };

  onItemSelect = item => {
    console.log("item: ", item);
    const { selectedItem } = this.state;
    if (
      selectedItem &&
      selectedItem.id == item.id &&
      selectedItem.type == item.type
    ) {
      return;
    }

    this.setState(
      {
        selectedItem: item,
        accessoryCategories: [],
        brands: [],
        models: [],
        selectedBrand: null,
        showSelectBrand: false,
        showSelectModel: false
      },
      () => {
        if (item.type == "category") {
          this.initProduct();
        } else {
          this.setState(
            {
              product: item
            },
            () => {
              this.getAccessories();
            }
          );
        }
      }
    );
  };

  getAccessories = async () => {
    const { setAccessoryCategories } = this.props;
    this.setState({ isLoading: true });
    try {
      const res = await getAccessories({
        categoryId: this.state.product.category_id
      });
      this.setState({
        accessoryCategories: res.result[0].accessories
      });
      setAccessoryCategories(res.result[0].accessories);
    } catch (e) {
      Snackbar.show({
        title: e.message,
        duration: Snackbar.LENGTH_SHORT
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { selectedAccessoryCategoryIds } = this.props;
    const {
      products,
      categories,
      showSelectBrand,
      brands,
      showSelectModel,
      models,
      isLoading,
      selectedItem,
      items,
      accessoryCategories,
      product,
      brandName,
      modelName
    } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <ItemSelector
          items={items.slice(0, 4)}
          moreItems={items.slice(4)}
          selectedItem={selectedItem}
          onItemSelect={this.onItemSelect}
          startOthersAfterCount={4}
        />

        {!showSelectBrand && !showSelectModel && !product ? (
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
              Please select a category to view accessories
            </Text>
          </View>
        ) : (
          <View />
        )}

        {showSelectBrand ? (
          <SelectOrCreateItem
            items={brands.map(brand => ({
              ...brand,
              image: `${API_BASE_URL}/brands/${brand.id}/images/thumbnails`
            }))}
            onSelectItem={this.onSelectBrand}
            title="Select a Brand"
            searchPlaceholder="Search for a Brand"
            onAddItem={value => this.onSelectBrand(null, value)}
            imageKey="image"
            textInputPlaceholder="Enter Brand Name"
          />
        ) : (
          <View />
        )}
        {showSelectModel ? (
          <SelectOrCreateItem
            items={models}
            visibleKey="title"
            onSelectItem={this.onSelectModel}
            title="Select a Model"
            searchPlaceholder="Search for a Model"
            showBackBtn={true}
            skippable={true}
            onSkipPress={this.onSkipModel}
            onBackBtnPress={() =>
              this.setState({ showSelectBrand: true, showSelectModel: false })
            }
            onAddItem={value => this.onSelectModel(null, value)}
            textInputPlaceholder="Enter Model Name"
          />
        ) : (
          <View />
        )}

        {accessoryCategories.length > 0 ? (
          <FlatList
            style={{ flex: 1, backgroundColor: "#f7f7f7" }}
            data={
              selectedAccessoryCategoryIds.length > 0
                ? accessoryCategories.filter(category =>
                    selectedAccessoryCategoryIds.includes(category.id)
                  )
                : accessoryCategories
            }
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <AccessoryCategory
                productId={product ? product.id : null}
                accessoryCategory={item}
              />
            )}
          />
        ) : (
          <View />
        )}
        <LoadingOverlay visible={isLoading} />
      </View>
    );
  }
}
