import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  FlatList
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";

import { Text, Button } from "../../elements";
import Checkbox from "../../components/checkbox";
import SmallDot from "../../components/small-dot";

import { colors } from "../../theme";

export default class filters extends React.Component {
  state = {
    isModalVisible: false,
    selectedMainCategoryId: null,
    selectedCategories: []
  };

  show = ({ selectedCategories }) => {
    let { mainCategories } = this.props;
    mainCategories = mainCategories.filter(
      mainCategory => mainCategory.subCategories.length > 0
    );

    this.setState({
      isModalVisible: true,
      selectedCategories,
      selectedMainCategoryId:
        mainCategories.length > 0 ? mainCategories[0].id : null
    });
  };

  hide = () => {
    this.setState({ isModalVisible: false });
  };

  resetAllFilters = () => {
    this.setState({ selectedCategories: [] }, () => {
      this.applyFilter();
    });
  };

  toggleCategory = category => {
    let { selectedCategories } = this.state;
    const idx = selectedCategories.findIndex(
      categoryItem => categoryItem.id == category.id
    );
    if (idx > -1) {
      selectedCategories.splice(idx, 1);
    } else {
      selectedCategories.push(category);
    }
    this.setState({ selectedCategories });
  };

  toggleCategoryAndApplyFilter = category => {
    let { selectedCategories } = this.state;
    const idx = selectedCategories.findIndex(
      categoryItem => categoryItem.id == category.id
    );
    if (idx > -1) {
      selectedCategories.splice(idx, 1);
    } else {
      selectedCategories.push(category);
    }
    this.setState(() => ({ selectedCategories }));
    this.applyFilter();
  };

  renderMainCategoryItem = ({ item, index }) => {
    const { selectedMainCategoryId, selectedCategories } = this.state;
    let subCategoriesSelected = item.subCategories.some(category =>
      selectedCategories.includes(category.id)
    );

    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({ selectedMainCategoryId: item.id });
        }}
        style={[
          {
            height: 45,
            padding: 5,
            justifyContent: "center"
          },
          item.id == selectedMainCategoryId ? styles.selectedMainCategory : {}
        ]}
      >
        <Text weight="Medium" numberOfLines={1}>
          {item.name}
        </Text>
        <SmallDot style={{ top: 15 }} visible={subCategoriesSelected} />
      </TouchableOpacity>
    );
  };

  renderCategoryItem = ({ item, index }) => {
    const { selectedCategories } = this.state;

    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          height: 45,
          padding: 5,
          alignItems: "center"
        }}
        onPress={() => {
          this.setState(() => this.toggleCategory(item));
        }}
      >
        <Text
          weight="Medium"
          style={{
            flex: 1,
            fontSize: 12
          }}
        >
          {item.name}
        </Text>
        <Checkbox
          isChecked={selectedCategories
            .map(selectedCategory => selectedCategory.id)
            .includes(item.id)}
        />
      </TouchableOpacity>
    );
  };

  applyFilter = () => {
    const { applyFilter } = this.props;
    const { selectedCategories } = this.state;
    this.hide();
    applyFilter(selectedCategories);
  };

  render() {
    const { mainCategories } = this.props;
    const {
      isModalVisible,
      selectedMainCategoryId,
      selectedCategories
    } = this.state;

    let subCategories = [];
    const selectedMainCategory = mainCategories.find(
      mainCategory => mainCategory.id == selectedMainCategoryId
    );
    if (selectedMainCategory) {
      subCategories = selectedMainCategory.subCategories;
    }

    return (
      <Modal
        style={{ margin: 0 }}
        isVisible={isModalVisible}
        useNativeDriver={true}
        onBackButtonPress={this.hide}
      >
        <View style={{ backgroundColor: "#fff", flex: 1 }}>
          <View style={styles.header}>
            <View style={{ flex: 1, flexDirection: "row", alignItems: 'center' }}>
              {/* <BlueGradientBG /> */}
              <TouchableOpacity
                style={{ paddingVertical: 10, paddingHorizontal: 15 }}
                onPress={this.hide}
              >
                <Icon name="md-arrow-back" color="#000" size={24} />
              </TouchableOpacity>
              <Text
                weight="Bold"
                style={{
                  color: colors.mainText,
                  fontSize: 20,
                  marginLeft: 15,
                  paddingVertical: 8
                }}
              >
                Category Filter
              </Text>
            </View>
            <TouchableOpacity onPress={this.resetAllFilters}>
              <Text
                weight="Bold"
                style={{
                  color: colors.pinkishOrange,
                  fontSize: 18,
                  paddingVertical: 8,
                  paddingRight: 10
                }}
              >
                Reset
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.body}>
            <View
              style={{
                flex: 1,
                flexDirection: "row"
              }}
            >
              <View style={{ flex: 1 }}>
                <FlatList
                  contentContainerStyle={{
                    backgroundColor: "#F4F4F4",
                    height: "100%"
                  }}
                  data={mainCategories.filter(
                    mainCategory => mainCategory.subCategories.length > 0
                  )}
                  renderItem={this.renderMainCategoryItem}
                  keyExtractor={item => item.id}
                />
              </View>
              <View style={{ flex: 2, paddingLeft: 10 }}>
                <FlatList
                  data={subCategories}
                  renderItem={this.renderCategoryItem}
                  keyExtractor={item => item.id}
                  ItemSeparatorComponent={() => (
                    <View style={{ height: 1, backgroundColor: "#eee" }} />
                  )}
                />
              </View>
            </View>
            <Button
              onPress={() => {
                this.applyFilter();
              }}
              text="Apply Filter"
              borderRadius={0}
              color="secondary"
            />
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
    flexDirection: "row",
    alignItems: "center",
    ...Platform.select({
      ios: { height: 70, paddingTop: 20 },
      android: { height: 50, paddingTop: 0 }
    }),
    borderColor: "#efefef",
    borderBottomWidth: 1
  },
  body: {
    flex: 1
  },

  filterType: {
    paddingVertical: 15,
    paddingLeft: 10,
    paddingRight: 50
  },
  selectedMainCategory: {
    backgroundColor: "#fff"
  },
  filterValues: {
    flex: 1,
    backgroundColor: "#fafafa"
  },
  offerTypes: {
    paddingLeft: 10
  },
  offerTypeTitle: {
    color: colors.mainBlue,
    paddingVertical: 10
  },
  filterItem: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center"
  },
  filterItemText: {
    flex: 1
  }
});
