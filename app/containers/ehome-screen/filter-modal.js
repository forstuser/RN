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
    selectedCategoryIds: []
  };

  show = ({ selectedCategoryIds }) => {
    const { mainCategories } = this.props;
    console.log("mainCategories: ", mainCategories);
    this.setState({
      isModalVisible: true,
      selectedCategoryIds,
      selectedMainCategoryId: mainCategories[0].id
    });
  };

  hide = () => {
    this.setState({ isModalVisible: false });
  };

  toggleCategoryId = id => {
    let { selectedCategoryIds } = this.state;
    const idx = selectedCategoryIds.indexOf(id);
    if (idx > -1) {
      selectedCategoryIds.splice(idx, 1);
    } else {
      selectedCategoryIds.push(id);
    }
    this.setState({ selectedCategoryIds });
  };

  renderMainCategoryItem = ({ item, index }) => {
    const { selectedMainCategoryId, selectedCategoryIds } = this.state;
    let subCategoriesSelected = item.subCategories.some(category =>
      selectedCategoryIds.includes(category.id)
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
    const { selectedCategoryIds } = this.state;

    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          height: 45,
          padding: 5,
          alignItems: "center"
        }}
        onPress={() => {
          this.setState(() => this.toggleCategoryId(item.id));
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
        <Checkbox isChecked={selectedCategoryIds.includes(item.id)} />
      </TouchableOpacity>
    );
  };

  applyFilter = () => {
    const { applyFilter } = this.props;
    const { selectedCategoryIds } = this.state;
    this.hide();
    applyFilter(selectedCategoryIds);
  };

  render() {
    const { mainCategories } = this.props;
    const {
      isModalVisible,
      selectedMainCategoryId,
      selectedCategoryIds
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
            <View style={{ flex: 1, flexDirection: "row" }}>
              {/* <BlueGradientBG /> */}
              <TouchableOpacity
                style={{ paddingVertical: 10, paddingHorizontal: 15 }}
                onPress={this.hide}
              >
                <Icon name="md-arrow-back" color="#000" size={30} />
              </TouchableOpacity>
              <Text
                weight="Medium"
                style={{
                  color: colors.mainText,
                  fontSize: 20,
                  paddingVertical: 8
                }}
              >
                Category Filter
              </Text>
            </View>
            <TouchableOpacity onPress={this.resetAllFilters}>
              <Text
                weight="Medium"
                style={{
                  color: colors.mainText,
                  fontSize: 20,
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
      ios: { paddingTop: 20 },
      android: { paddingTop: 10 }
    })
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
