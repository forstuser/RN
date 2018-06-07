import React from "react";
import { View, ScrollView } from "react-native";
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
    itemsArrayForSelector: [],
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
            id: category.category_id,
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

  onSelectBrand = async brand => {
    const { product } = this.state;
    this.setState({ isLoading: true });
    try {
      const res = await updateProduct({
        productId: product.id,
        brandId: brand.id
      });

      this.setState(
        {
          product: res.product,
          showSelectBrand: false
        },
        () => {
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
  };

  onSelectModel = async model => {
    const { product } = this.state;
    try {
      const res = await updateProduct({
        productId: product.id,
        model: model.title
      });

      this.setState(
        {
          product: res.product,
          showSelectModel: false
        },
        () => {
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
    this.setState({ isLoading: true });
    try {
      const res = await getAccessories({
        categoryId: this.state.product.category_id
      });
      this.setState({
        accessoryCategories: res.result[0].accessories
      });
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
    const {
      products,
      categories,
      showSelectBrand,
      brands,
      showSelectModel,
      models,
      isLoading,
      selectedItem,
      itemsArrayForSelector,
      accessoryCategories,
      product
    } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <ItemSelector
          items={itemsArrayForSelector}
          selectedItem={selectedItem}
          onItemSelect={this.onItemSelect}
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
                color: colors.lighterText
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
            items={models}
            visibleKey="title"
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

        {accessoryCategories.length > 0 ? (
          <ScrollView style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
            {accessoryCategories.map(accessoryCategory => (
              <AccessoryCategory
                productId={product ? product.id : null}
                key={accessoryCategory.id}
                accessoryCategory={accessoryCategory}
              />
            ))}
          </ScrollView>
        ) : (
          <View />
        )}
        <LoadingOverlay visible={isLoading} />
      </View>
    );
  }
}
