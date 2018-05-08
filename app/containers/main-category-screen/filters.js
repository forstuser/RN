import React, { Component } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView
} from "react-native";
import Modal from "react-native-modal";
import CheckBox from "react-native-check-box";
import LinearGradient from "react-native-linear-gradient";

import I18n from "../../i18n";

import { Text, Button, ScreenContainer } from "../../elements";
import { colors } from "../../theme";

import Collapsible from "../../components/collapsible";

const filterIcon = require("../../images/ic_list_filter.png");

class Filters extends Component {
  static defaultProps = {
    categories: [],
    brands: [],
    offlineSellers: [],
    onlineSellers: []
  };
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      choosenCategoryIds: [],
      choosenCategoryIdsTemp: [],
      choosenBrandIds: [],
      choosenBrandIdsTemp: [],
      choosenOnlineSellerIds: [],
      choosenOnlineSellerIdsTemp: [],
      choosenOfflineSellerIds: [],
      choosenOfflineSellerIdsTemp: []
    };
  }
  showModal = () => {
    this.setState({
      choosenCategoryIdsTemp: [...this.state.choosenCategoryIds],
      choosenBrandIdsTemp: [...this.state.choosenBrandIds],
      choosenOnlineSellerIdsTemp: [...this.state.choosenOnlineSellerIds],
      choosenOfflineSellerIdsTemp: [...this.state.choosenOfflineSellerIds],
      isModalVisible: true
    });
  };
  onCancelPress = () => {
    this.setState({
      isModalVisible: false
    });
  };

  onApplyPress = () => {
    this.setState(
      {
        choosenCategoryIds: [...this.state.choosenCategoryIdsTemp],
        choosenBrandIds: [...this.state.choosenBrandIdsTemp],
        choosenOfflineSellerIds: [...this.state.choosenOfflineSellerIdsTemp],
        choosenOnlineSellerIds: [...this.state.choosenOnlineSellerIdsTemp],
        isModalVisible: false
      },
      async () => await this.applyFilters()
    );
  };

  applyFilters = async () => {
    await this.props.applyFilters({
      pageNo: 1,
      categoryIds: this.state.choosenCategoryIds,
      brandIds: this.state.choosenBrandIds,
      offlineSellerIds: this.state.choosenOfflineSellerIds,
      onlineSellerIds: this.state.choosenOnlineSellerIds
    });
  };

  onCategoryClick = id => {
    let { choosenCategoryIdsTemp } = this.state;
    const idx = choosenCategoryIdsTemp.indexOf(id);
    if (idx > -1) {
      choosenCategoryIdsTemp.splice(idx, 1);
    } else {
      choosenCategoryIdsTemp.push(id);
    }
    this.setState({
      choosenCategoryIdsTemp
    });
  };

  onBrandClick = id => {
    let { choosenBrandIdsTemp } = this.state;
    const idx = choosenBrandIdsTemp.indexOf(id);
    if (idx > -1) {
      choosenBrandIdsTemp.splice(idx, 1);
    } else {
      choosenBrandIdsTemp.push(id);
    }
    this.setState({
      choosenBrandIdsTemp
    });
  };

  onSellerClick = typeAndId => {
    const separated = typeAndId.split("-");
    const type = separated[0];
    const id = +separated[1];
    if (type == "offline") {
      let { choosenOfflineSellerIdsTemp } = this.state;
      const idx = choosenOfflineSellerIdsTemp.indexOf(id);
      if (idx > -1) {
        choosenOfflineSellerIdsTemp.splice(idx, 1);
      } else {
        choosenOfflineSellerIdsTemp.push(id);
      }
      this.setState({
        choosenOfflineSellerIdsTemp
      });
    } else if (type == "online") {
      let { choosenOnlineSellerIdsTemp } = this.state;
      const idx = choosenOnlineSellerIdsTemp.indexOf(id);
      if (idx > -1) {
        choosenOnlineSellerIdsTemp.splice(idx, 1);
      } else {
        choosenOnlineSellerIdsTemp.push(id);
      }
      this.setState({
        choosenOnlineSellerIdsTemp
      });
    }
  };

  renderCategoryItem = ({ item }) => {
    return (
      <CheckBox
        style={{ paddingVertical: 10, paddingHorizontal: 16 }}
        onClick={() => this.onCategoryClick(item.id)}
        isChecked={this.state.choosenCategoryIds.indexOf(item.id) > -1}
        leftTextView={
          <Text weight="Medium" style={{ flex: 1 }}>
            {item.name}
          </Text>
        }
        checkBoxColor={colors.mainBlue}
      />
    );
  };

  renderBrandItem = ({ item }) => {
    return (
      <CheckBox
        style={{ paddingVertical: 10, paddingHorizontal: 16 }}
        onClick={() => this.onBrandClick(item.brandId)}
        isChecked={this.state.choosenBrandIds.indexOf(item.brandId) > -1}
        leftTextView={
          <Text weight="Medium" style={{ flex: 1 }}>
            {item.name}
          </Text>
        }
        checkBoxColor={colors.mainBlue}
      />
    );
  };

  renderSellerItem = ({ item }) => {
    return (
      <CheckBox
        style={{ paddingVertical: 10, paddingHorizontal: 16 }}
        onClick={() => this.onSellerClick(item.typeAndId)}
        isChecked={this.isSelectedSeller(item.typeAndId)}
        leftTextView={
          <Text weight="Medium" style={{ flex: 1 }}>
            {item.name}
          </Text>
        }
        checkBoxColor={colors.mainBlue}
      />
    );
  };

  isSelectedSeller = typeAndId => {
    const separated = typeAndId.split("-");
    const type = separated[0];
    const id = +separated[1];
    if (type == "offline") {
      return this.state.choosenOfflineSellerIds.indexOf(id) > -1;
    }
    return this.state.choosenOnlineSellerIds.indexOf(id) > -1;
  };

  removeAppliedFilter = (type, id) => {
    let idx = -1;
    switch (type) {
      case "category":
        let { choosenCategoryIds } = this.state;
        idx = choosenCategoryIds.indexOf(id);
        if (idx > -1) {
          choosenCategoryIds.splice(idx, 1);
        }
        this.setState(
          {
            choosenCategoryIds
          },
          async () => await this.applyFilters()
        );
        break;
      case "brand":
        let { choosenBrandIds } = this.state;
        idx = choosenBrandIds.indexOf(id);
        if (idx > -1) {
          choosenBrandIds.splice(idx, 1);
        }
        this.setState(
          {
            choosenBrandIds
          },
          async () => await this.applyFilters()
        );
        break;
      case "online-seller":
        let { choosenOnlineSellerIds } = this.state;
        idx = choosenOnlineSellerIds.indexOf(id);
        if (idx > -1) {
          choosenOnlineSellerIds.splice(idx, 1);
        }
        this.setState(
          {
            choosenOnlineSellerIds
          },
          async () => await this.applyFilters()
        );
        break;
      case "offline-seller":
        let { choosenOfflineSellerIds } = this.state;
        idx = choosenOfflineSellerIds.indexOf(id);
        if (idx > -1) {
          choosenOfflineSellerIds.splice(idx, 1);
        }
        this.setState(
          {
            choosenOfflineSellerIds
          },
          async () => await this.applyFilters()
        );
        break;
    }
  };

  render() {
    const { categories, brands, onlineSellers, offlineSellers } = this.props;
    const sellers = [
      ...onlineSellers.map(seller => {
        return { typeAndId: "online-" + seller.id, name: seller.name };
      }),
      ...offlineSellers.map(seller => {
        return { typeAndId: "offline-" + seller.id, name: seller.name };
      })
    ];
    const {
      choosenCategoryIds,
      choosenBrandIds,
      choosenOnlineSellerIds,
      choosenOfflineSellerIds
    } = this.state;
    const AppliedFilterItem = ({ type, id, text }) => (
      <LinearGradient
        start={{ x: 0.0, y: 0.1 }}
        end={{ x: 0.9, y: 0.9 }}
        colors={[colors.pinkishOrange, colors.tomato]}
        style={styles.appliedFilterItem}
      >
        <Text style={styles.appliedFilterText}>{text}</Text>
        <Text
          weight="Bold"
          style={styles.appliedFilterCross}
          onPress={() => this.removeAppliedFilter(type, id)}
        >
          X
        </Text>
      </LinearGradient>
    );

    return (
      <View>
        <TouchableOpacity onPress={this.showModal} style={styles.alwaysVisible}>
          <Image style={styles.filterIcon} source={filterIcon} />
          <Text weight="Medium" style={styles.filterText}>
            {I18n.t("main_category_screen_filters_title")}
          </Text>
        </TouchableOpacity>
        <ScrollView horizontal style={styles.appliedFiltersContainer}>
          {categories.map(category => {
            if (choosenCategoryIds.indexOf(category.id) > -1) {
              return (
                <AppliedFilterItem
                  key={category.id}
                  type="category"
                  id={category.id}
                  text={category.name}
                />
              );
            }
          })}

          {brands.map(brand => {
            if (choosenBrandIds.indexOf(brand.brandId) > -1) {
              return (
                <AppliedFilterItem
                  key={brand.brandId}
                  type="brand"
                  id={brand.brandId}
                  text={brand.name}
                />
              );
            }
          })}

          {onlineSellers.map((seller, index) => {
            if (choosenOnlineSellerIds.indexOf(seller.id) > -1) {
              return (
                <AppliedFilterItem
                  key={index}
                  type="online-seller"
                  id={seller.id}
                  text={seller.sellerName}
                />
              );
            }
          })}

          {offlineSellers.map((seller, index) => {
            if (choosenOfflineSellerIds.indexOf(seller.id) > -1) {
              return (
                <AppliedFilterItem
                  key={index}
                  type="offline-seller"
                  id={seller.id}
                  text={seller.sellerName}
                />
              );
            }
          })}
        </ScrollView>
        {this.state.isModalVisible && (
          <View>
            <Modal isVisible={true}>
              <View style={styles.modal}>
                <View style={styles.modalHeader}>
                  <Text
                    weight="Medium"
                    style={{ color: "red" }}
                    onPress={this.onCancelPress}
                  >
                    {I18n.t("main_category_screen_filters_cancel")}
                  </Text>
                  <Text
                    weight="Medium"
                    style={[styles.filterText, { flex: 1 }]}
                  >
                    {I18n.t("main_category_screen_filters_title")}
                  </Text>
                  <Text
                    weight="Medium"
                    style={{ color: colors.mainBlue }}
                    onPress={this.onApplyPress}
                  >
                    {I18n.t("main_category_screen_filters_apply")}
                  </Text>
                </View>
                <View>
                  <Collapsible
                    headerText={I18n.t(
                      "main_category_screen_filters_title_categories"
                    )}
                  >
                    <FlatList
                      style={{ height: 150 }}
                      data={categories}
                      keyExtractor={(item, index) => index}
                      renderItem={this.renderCategoryItem}
                    />
                  </Collapsible>
                  <Collapsible
                    headerText={I18n.t(
                      "main_category_screen_filters_title_brands"
                    )}
                  >
                    <FlatList
                      style={{ maxHeight: 150 }}
                      data={brands}
                      keyExtractor={(item, index) => index}
                      renderItem={this.renderBrandItem}
                    />
                  </Collapsible>
                  <Collapsible
                    headerText={I18n.t(
                      "main_category_screen_filters_title_sellers"
                    )}
                  >
                    <FlatList
                      style={{ maxHeight: 150 }}
                      data={sellers}
                      keyExtractor={(item, index) => index}
                      renderItem={this.renderSellerItem}
                    />
                  </Collapsible>
                </View>
              </View>
            </Modal>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  alwaysVisible: {
    flexDirection: "row",
    padding: 13,
    alignItems: "center",
    justifyContent: "center"
  },
  filterIcon: {
    width: 24,
    height: 24,
    marginRight: 10
  },
  filterText: {
    fontSize: 16,
    textAlign: "center"
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 5,
    flex: 1,
    margin: 0
  },
  modalHeader: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    borderColor: "#eee",
    borderBottomWidth: 1
  },
  appliedFiltersContainer: {
    borderColor: "#eee",
    borderBottomWidth: 1,
    borderTopWidth: 1
  },
  appliedFilterItem: {
    flexDirection: "row",
    paddingLeft: 12,
    paddingRight: 8,
    paddingTop: 5,
    paddingBottom: 6,
    borderRadius: 15,
    alignItems: "center",
    marginHorizontal: 5,
    marginVertical: 10
  },
  appliedFilterText: {
    color: "#fff"
  },
  appliedFilterCross: {
    color: "#fff",
    marginLeft: 10
  }
});

export default Filters;
