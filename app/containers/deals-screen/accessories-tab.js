import React from "react";
import {
  View,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Animated
} from "react-native";
import Snackbar from "react-native-snackbar";
import { Text } from "../../elements";
import ErrorOverlay from "../../components/error-overlay";
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

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const ITEM_SELECTOR_HEIGHT = 120;

export default class AccessoriesTab extends React.Component {
  topPaddingElement = new Animated.Value(0);
  state = {
    products: [],
    categories: [],
    showSelectBrand: false,
    brands: [],
    showSelectModel: false,
    models: [],
    isLoading: false,
    isLoadingAccessories: false,
    selectedItem: null,
    items: [],
    accessoryCategories: [],
    product: null,
    selectedBrand: null,
    error: null
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
      let categoriesArray = [];
      let productsArray = [];
      const res = await getAccessoriesCategory();
      res.default_ids.forEach(defaultId => {
        for (let i = 0; i < res.result.length; i++) {
          const category = res.result[i];
          if (category.category_id == defaultId) {
            if (category.products.length == 0) {
              categoriesArray.push({
                type: "category",
                id: category.category_id,
                name: category.category_name,
                imageUrl: category.image_url,
                accessoryCategories: category.accessories,
                ...category
              });
            } else {
              for (let j = 0; j < category.products.length; j++) {
                const product = category.products[j];
                productsArray.push({
                  type: "product",
                  name: product.product_name,
                  imageUrl: res.result[i].image_url,
                  accessoryCategories: category.accessories,
                  ...product
                });
              }
            }
          }
        }
      });

      this.setState({
        items: [...productsArray, ...categoriesArray]
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
      showSelectModel: false,
      isLoading: false
    });
    this.getAccessoriesFirstPage();
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
          this.getAccessoriesFirstPage();
          this.replaceCategoryItemByProduct();
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
    const { selectedItem } = this.state;
    const { setAccessoryCategories } = this.props;
    setAccessoryCategories(item.accessoryCategories);
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
              this.getAccessoriesFirstPage();
            }
          );
        }
      }
    );
  };

  getAccessoriesFirstPage = () => {
    this.setState({ accessoryCategories: [] }, () => {
      this.getAccessories();
    });
  };

  getAccessories = async () => {
    if (this.state.isLoadingAccessories) return;
    this.topPaddingElement.setValue(0);
    const { selectedAccessoryCategoryIds } = this.props;
    const { accessoryCategories, product } = this.state;

    console.log("isLoadingAccessories: true");
    this.setState({ isLoadingAccessories: true });
    try {
      const res = await getAccessories({
        categoryId: product.category_id,
        offset: accessoryCategories.length,
        accessoryIds: selectedAccessoryCategoryIds,
        brandId: product.brand_id,
        model: product.model
      });
      if (res.result.length > 0) {
        this.setState({
          accessoryCategories: [
            ...accessoryCategories,
            ...res.result[0].accessories
          ]
        });
      }
    } catch (e) {
      Snackbar.show({
        title: e.message,
        duration: Snackbar.LENGTH_SHORT
      });
    } finally {
      console.log("isLoadingAccessories: false");
      this.setState({ isLoadingAccessories: false });
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
      isLoadingAccessories,
      selectedItem,
      items,
      accessoryCategories,
      product,
      brandName,
      modelName,
      error
    } = this.state;

    if (error) {
      return (
        <ErrorOverlay error={error} onRetryPress={this.fetchAccessoriesData} />
      );
    }

    return (
      <View style={{ flex: 1 }}>
        {!showSelectBrand && !showSelectModel && !product ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingTop: ITEM_SELECTOR_HEIGHT
            }}
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
            style={{ marginTop: ITEM_SELECTOR_HEIGHT }}
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
            style={{ marginTop: ITEM_SELECTOR_HEIGHT }}
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
          <AnimatedFlatList
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: { y: this.topPaddingElement }
                  }
                }
              ],
              { useNativeDriver: true }
            )}
            contentContainerStyle={{
              paddingTop: ITEM_SELECTOR_HEIGHT
            }}
            style={{
              flex: 1,
              backgroundColor: "#f7f7f7"
            }}
            data={accessoryCategories.filter(
              accessoryCategory => accessoryCategory.accessory_items.length > 0
            )}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => (
              <AccessoryCategory
                productId={product ? product.id : null}
                accessoryCategory={item}
              />
            )}
            onEndReached={this.getAccessories}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              <View
                style={{
                  height: 60,
                  justifyContent: "center"
                }}
              >
                <ActivityIndicator
                  color={colors.mainBlue}
                  animating={isLoadingAccessories}
                />
              </View>
            }
          />
        ) : (
          <View />
        )}
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: ITEM_SELECTOR_HEIGHT,
              backgroundColor: "#fff"
            },
            {
              transform: [
                {
                  translateY: this.topPaddingElement.interpolate({
                    inputRange: [0, ITEM_SELECTOR_HEIGHT],
                    outputRange: [0, -ITEM_SELECTOR_HEIGHT],
                    extrapolate: "clamp"
                  })
                }
              ]
            }
          ]}
        >
          <ItemSelector
            selectModalTitle="Select a Category"
            items={items.slice(0, 4)}
            moreItems={items.slice(4)}
            selectedItem={selectedItem}
            onItemSelect={this.onItemSelect}
            startOthersAfterCount={4}
          />
        </Animated.View>
        <LoadingOverlay
          visible={
            isLoading ||
            (isLoadingAccessories && accessoryCategories.length == 0)
          }
        />
      </View>
    );
  }
}
