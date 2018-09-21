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
import { API_BASE_URL, getMySellers } from "../../api";

import { colors } from "../../theme";

class FilterModalScreen extends Component {
    state = {
        isVisible: false,
        isLoadingMySellers: false,
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
        selectedMainCategory: 'Filter by Brands'
    };

    // componentDidMount() {
    //     this.getMySellers();
    // } 

    

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
            onPress={() => this.props.toggleBrandSelection(item)}
            style={{
            flexDirection: "row",
            padding: 8,
            alignItems: "center"
            }}
        >
            <Text style={{ flex: 1, fontSize: 10 }}>
                {this.state.selectedMainCategory === 'Filter by Brands' ? (item.title) : (item.name)}
            </Text>
            <Checkbox isChecked={this.props.checkedBrandIds.includes(item.id)} />
        </TouchableOpacity>
        );
      };

    render() {
        console.log('Props: ', this.props);
        let source = null;
        //console.log(this.state.selectedMainCategory);
        if(this.state.selectedMainCategory === 'Filter by Sellers') {
            source = this.props.sellers;
        }
        else if(this.state.selectedMainCategory === 'Filter by Brands') {
            source = this.props.brands;
        }
        return (
            <Modal
                style={{ flex: 1, backgroundColor: '#fff', padding: 5, margin: 0 }}
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
                    <TouchableOpacity onPress={this.props.resetBrandsFilter}>
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
                            data={source}
                            extraData={source}
                            renderItem={this.renderCategoryItem}
                            extraData={this.props.wishList}
                            keyExtractor={(item, index) => item.id}
                            ItemSeparatorComponent={() => (
                            <View style={{ backgroundColor: "#efefef", height: 1 }} />
                            )}
                        />
                        </View>
                    </View>
                    <Button
                        onPress={this.props.applyBrandsFilter}
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
