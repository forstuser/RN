import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from "react-native";
import moment from "moment";
import { Text, Button } from "../../elements";
import I18n from "../../i18n";
import { colors } from "../../theme";
import ProductListItem from "../product-list-item";
import ErrorOverlay from "../../components/error-overlay";
import EmptyProductListPlaceholder from "./empty-product-list-placeholder";
const uploadFabIcon = require("../../images/ic_upload_fabs.png");
import Analytics from "../../analytics";
import { PRODUCT_TYPES,SCREENS } from "../../constants";

// destructuring not working for some reasons
const ProductsList = props => {
  const {
    type,
    navigation,
    products = [],
    isLoadingFirstPage = false,
    isLoading = false,
    onEndReached,
    onEndReachedThreshold = 50,
    onRefresh,
    mainCategoryId,
    category,
    error = null,
    endHasReached = false,
    onListScroll = () => { },
    showEndReachedMsg = true
  } = props;
  if (error) {
    return <ErrorOverlay error={error} onRetryPress={onRefresh} />;
  }

  const renderProductItem = ({ item }) => (
    <View
      collapsable={false}
      style={{
        marginHorizontal: 10,
        marginTop: 2
      }}
    >
      <ProductListItem navigation={navigation} product={item} />
    </View>
  );
  showAddProductOptionsScreen = () => {
    Analytics.logEvent(Analytics.EVENTS.CLICK_PLUS_ICON);
    navigation.push(SCREENS.ADD_PRODUCT_SCREEN,{'screenType':type});
  };

  return (
    <View
      collapsable={false}
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 0,
        marginTop: 10,
      }}
    >
      <FlatList
        onScroll={onListScroll}
        data={products}
        extraData={products}
        keyExtractor={(item, index) => item.id + "" + index}
        renderItem={renderProductItem}
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        onRefresh={onRefresh}
        refreshing={isLoadingFirstPage}
        contentContainerStyle={[
          { flexGrow: 1 },
          products.length ? null : { justifyContent: "center" }
        ]}
        ListEmptyComponent={
          !isLoading && products.length == 0 ? (
            <EmptyProductListPlaceholder
              type={type}
              mainCategoryId={mainCategoryId}
              category={category}
              navigation={navigation}
            />
          ) : null
        }
        ListFooterComponent={
          products.length > 0 ? (
            <View
              style={{
                height: 60,
                justifyContent: "center"
              }}
            >
              {endHasReached ? (
                <Text
                  style={{ textAlign: "center", color: colors.secondaryText }}
                >
                  {showEndReachedMsg ? "No More Results" : ""}
                </Text>
              ) : (
                  <ActivityIndicator color={colors.mainBlue} animating={true} />
                )}
            </View>
          ) : null
        }
      />
      { products.length > 0 ? <TouchableOpacity
        style={styles.fab}
        onPress={()=>this.showAddProductOptionsScreen()}
      >
        <Image style={styles.uploadFabIcon} source={uploadFabIcon} />
      </TouchableOpacity>:null}
    </View>
  );
};
const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    zIndex: 2,
    backgroundColor: colors.tomato,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  uploadFabIcon: {
    width: 25,
    height: 25
  }
});
export default ProductsList;
