import React, { Component } from 'react';
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

class FilterModalScreen extends Component {
    state = {
        isVisible: false,
        mainCategories: [
            {
                'id': 1,
                'title': 'Filter by Brands'
            },
            {
                'id': 2,
                'title': 'Filter by Sellers'
            }
        ],
        brands: [
            {
                'id': 1,
                'title': 'Dabur'
            },
            {
                'id': 2,
                'title': 'Nestle'
            },
            {
                'id': 3,
                'title': 'Colgate'
            }
        ],
        selectedMainCategory: 'Filter by Brands'
    };

    show = () => {
        this.setState({ isVisible: true });
    };

    hide = () => {
        this.setState({ isVisible: false });
    };

    renderMainCategoryItem = ({ item, index }) => {
        return (
          <TouchableOpacity
            onPress={() => {
              this.setState({ selectedMainCategory: item.title });
            }}
            style={[
              {
                height: 45,
                padding: 5,
                justifyContent: "center"
              }
            ]}
          >
            <Text weight="Medium" numberOfLines={1}>
              {item.title}
            </Text>
            {/* <SmallDot style={{ top: 15 }} visible={subCategoriesSelected} />  */}
          </TouchableOpacity>
        );
      };

      renderCategoryItem = ({ item, index }) => {
        return (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              height: 45,
              padding: 5,
              alignItems: "center"
            }}
            // onPress={() => {
            //   this.setState(() => this.toggleCategory(item));
            // }}
            onPress={() => {}}
          >
            <Text
              weight="Medium"
              style={{
                flex: 1,
                fontSize: 12
              }}
            >
              {item.title}
            </Text>
            <Checkbox
              isChecked={false}
            />
            {/* <Checkbox
              isChecked={selectedCategories
                .map(selectedCategory => selectedCategory.id)
                .includes(item.id)}
            /> */}
          </TouchableOpacity>
        );
      };

    render() {
        //console.log(this.state.selectedMainCategory);
        return (
            <Modal
                style={{ flex: 1, backgroundColor: '#fff', padding: 5 }}
                isVisible={this.state.isVisible}
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
                                data={this.state.mainCategories}
                                renderItem={this.renderMainCategoryItem}
                                keyExtractor={item => item.id}
                            />
                        </View>
                        <View style={{ flex: 2, paddingLeft: 10 }}>
                            <FlatList
                                data={this.state.brands}
                                renderItem={this.renderCategoryItem}
                                keyExtractor={item => item.id}
                                ItemSeparatorComponent={() => (
                                    <View style={{ height: 1, backgroundColor: "#eee" }} />
                                )}
                                />
                        </View>
                    {/* <View style={{ flex: 1 }}>
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
                    </View> */}
                    </View>
                    <Button
                    onPress={() => {}}
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

export default FilterModalScreen;