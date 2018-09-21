import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  Platform
} from "react-native";
import Modal from "react-native-modal";
import FastImage from "react-native-fast-image";
import Icon from "react-native-vector-icons/Ionicons";

import I18n from "../i18n";
import { defaultStyles, colors } from "../theme";

import { Text, Button } from "../elements";

class SelectOrCreateItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddNewVisible: false,
      searchInput: "",
      textInput: "",
      isSearchInputVisible: false
    };
  }

  componentDidMount() {
    this.updateStateFromProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateStateFromProps(nextProps);
  }

  updateStateFromProps = props => {
    if (!props.textInputValue) {
      this.setState({
        textInput: "",
        isAddNewVisible: false
      });
    } else if (props.textInputValue != this.state.textInput) {
      this.setState({
        textInput: props.textInputValue,
        isAddNewVisible: true
      });
    }
  };

  renderItem = ({ item, index }) => {
    const {
      selectedItem = null,
      valueKey = "id",
      imageKey,
      visibleKey = "name",
      onChange
    } = this.props;
    return (
      <TouchableOpacity
        onPress={() => this.onSelectItem(item)}
        style={styles.item}
      >
        {imageKey && item[imageKey] && (
          <FastImage
            resizeMode="contain"
            style={styles.itemImage}
            source={{ uri: item[imageKey] }}
          />
        )}
        <Text style={styles.itemText}>{item[visibleKey]}</Text>
      </TouchableOpacity>
    );
  };

  onSelectItem = item => {
    const { onSelectItem } = this.props;

    if (typeof onSelectItem == "function") {
      onSelectItem(item);
    }
    this.setState({
      isAddNewVisible: false
    });
  };

  onTextInputChange = text => {
    const { onTextInputChange } = this.props;
    if (typeof onTextInputChange == "function") {
      onTextInputChange(text);
    }
    this.setState({
      textInput: text
    });
  };

  showAddNew = () => {
    this.setState(
      {
        isAddNewVisible: true
      },
      () => {
        this.textInput.focus();
      }
    );
  };

  hideAddNew = () => {
    this.setState({
      isAddNewVisible: false
    });
  };

  onAddItem = () => {
    const { onAddItem } = this.props;
    if (typeof onAddItem == "function") {
      onAddItem(this.state.textInput);
    }
  };

  render() {
    let {
      title = "",
      items = [],
      selectedItem = null,
      textInputValue = "",
      valueKey = "id",
      imageKey,
      visibleKey = "name",
      textInputPlaceholder = I18n.t("component_items_enter_value"),
      onNewValueItemAdd,
      style = {},
      hideAddNew = false,
      disableSearch = false,
      searchPlaceholder = "Search",
      showBackBtn = false,
      onBackBtnPress = () => { },
      skippable = false,
      onSkipPress = () => { }
    } = this.props;
    let {
      isAddNewVisible,
      isModalVisible,
      searchInput,
      isSearchInputVisible,
      textInput
    } = this.state;

    const searchText = searchInput.trim();
    let itemsAfterSearch = [];
    if (searchText) {
      itemsAfterSearch = items.filter(item => {
        return item[visibleKey]
          .toLowerCase()
          .includes(searchText.toLowerCase());
      });
    } else {
      itemsAfterSearch = items;
    }

    return (
      <View collapsable={false} style={[styles.container, style]}>
        {!isAddNewVisible ? (
          <View collapsable={false} style={{ flex: 1 }}>
            {title || (!disableSearch && items.length > 15) ? (
              <View style={styles.header}>
                {title && !isSearchInputVisible ? (
                  <View style={[styles.headerInner, styles.titleHeader]}>
                    {showBackBtn ? (
                      <TouchableOpacity
                        style={{
                          width: 30
                        }}
                        onPress={onBackBtnPress}
                      >
                        <Icon name="ios-arrow-back" size={25} />
                      </TouchableOpacity>
                    ) : (
                        <View />
                      )}
                    <Text weight="Bold" style={{ flex: 1 }}>
                      {title}
                    </Text>
                    <TouchableOpacity
                      style={{ padding: 7 }}
                      onPress={() =>
                        this.setState({ isSearchInputVisible: true }, () =>
                          this.searchInputRef.focus()
                        )
                      }
                    >
                      <Icon
                        name="ios-search"
                        size={24}
                        color={colors.mainText}
                      />
                    </TouchableOpacity>
                    {skippable ? (
                      <TouchableOpacity
                        style={{
                          marginLeft: 5
                        }}
                        onPress={onSkipPress}
                      >
                        <Text
                          weight="Bold"
                          style={{ color: colors.pinkishOrange }}
                        >
                          SKIP
                        </Text>
                      </TouchableOpacity>
                    ) : (
                        <View />
                      )}
                  </View>
                ) : (
                    <View />
                  )}
                {!title || isSearchInputVisible ? (
                  <View style={[styles.headerInner, styles.searchHeader]}>
                    <Icon name="ios-search" size={24} color={colors.mainText} />
                    <TextInput
                      ref={ref => (this.searchInputRef = ref)}
                      placeholder={searchPlaceholder}
                      underlineColorAndroid="transparent"
                      style={styles.searchInput}
                      value={searchInput}
                      onChangeText={text =>
                        this.setState({ searchInput: text })
                      }
                    />
                    <TouchableOpacity
                      style={{ padding: 8 }}
                      onPress={() =>
                        this.setState({
                          isSearchInputVisible: false,
                          searchInput: ""
                        })
                      }
                    >
                      {title ? (
                        <Icon
                          name="md-close"
                          size={20}
                          color={colors.secondaryText}
                        />
                      ) : (
                          <View />
                        )}
                    </TouchableOpacity>
                  </View>
                ) : (
                    <View />
                  )}
              </View>
            ) : (
                <View />
              )}

            <FlatList
              style={style.itemsList}
              data={itemsAfterSearch}
              keyExtractor={(item, index) => String(item.id)}
              renderItem={this.renderItem}
              ListFooterComponent={() => {
                if (hideAddNew) {
                  return null;
                }
                return (
                  <View>
                    <Text style={styles.noResultText}>No result found</Text>
                    <TouchableOpacity
                      style={styles.item}
                      onPress={this.showAddNew}
                    >
                      <Text style={styles.addNewBtnText}>Add New</Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>
        ) : (
            <View collapsable={false} style={styles.addNewContainer}>
              <Text
                weight="Bold"
                style={{ alignSelf: "flex-start", marginBottom: 10 }}
              >
                Add New
            </Text>
              <TextInput
                underlineColorAndroid="transparent"
                ref={ref => (this.textInput = ref)}
                placeholder={textInputPlaceholder}
                style={styles.textInput}
                value={textInput}
                onChangeText={text => this.onTextInputChange(text)}
              />
              <Button
                style={styles.addNewBtn}
                text="Add"
                onPress={this.onAddItem}
              />
              <Text weight="Medium" style={styles.orText}>
                OR
            </Text>
              <Text
                weight="Bold"
                style={styles.selectFromList}
                onPress={this.hideAddNew}
              >
                Select from list
            </Text>
            </View>
          )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  noResultText: {
    fontSize: 18,
    color: "#bcbcbc",
    alignSelf: 'center',
  },
  addNewBtnText: {
    fontWeight: "bold",
    color: "#009ee5"
  },
  header: {
    height: 40,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E9E9E9"
  },
  headerInner: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    flex: 1
  },
  titleHeader: {
    paddingHorizontal: 16,
    backgroundColor: "#E9E9E9"
  },
  searchHeader: {
    height: "100%",
    paddingHorizontal: 16,
    backgroundColor: "#FFF"
  },
  addNewContainer: {
    width: "100%",
    padding: 16,
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 5
  },
  textInput: {
    width: "100%",
    height: 50,
    borderColor: colors.lighterText,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15
  },
  orText: {
    margin: 30,
    color: colors.secondaryText
  },
  selectFromList: {
    color: colors.mainBlue,
    fontSize: 16
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    backgroundColor: "#f7f7f7",
    borderColor: "#ddd",
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    height: "100%",
    ...Platform.select({
      android: {
        padding: 0
      }
    }),
    paddingHorizontal: 12
  },
  itemsList: {
    flex: 1
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderColor: "#efefef",
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  itemImage: {
    width: 40,
    height: 40,
    marginRight: 20
  },
  itemText: {
    flex: 1
  },
  addNewBtn: {
    width: 150,
    height: 40
  }
});
export default SelectOrCreateItem;
