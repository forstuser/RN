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

import I18n from "../i18n";
import { defaultStyles, colors } from "../theme";

import { Text, Button } from "../elements";

class SelectModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddNewVisible: false,
      searchInput: "",
      textInput: ""
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
        {imageKey && (
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
      hideSearch = false
    } = this.props;
    let {
      isAddNewVisible,
      isModalVisible,
      searchInput,
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
      <View style={[styles.container, style]}>
        {!isAddNewVisible && (
          <View style={{ flex: 1 }}>
            {!hideSearch && (
              <View style={styles.searchContainer}>
                <TextInput
                  placeholder={I18n.t("component_items_search")}
                  underlineColorAndroid="transparent"
                  style={styles.searchInput}
                  value={searchInput}
                  onChangeText={text => this.setState({ searchInput: text })}
                />
              </View>
            )}
            <FlatList
              style={style.itemsList}
              data={itemsAfterSearch}
              keyExtractor={(item, index) => index}
              renderItem={this.renderItem}
              ListFooterComponent={() => {
                if (hideAddNew) {
                  return null;
                }
                return (
                  <TouchableOpacity
                    style={styles.item}
                    onPress={this.showAddNew}
                  >
                    <Text style={styles.addNewBtnText}>Add New</Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}
        {isAddNewVisible && (
          <View style={styles.addNewContainer}>
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
    backgroundColor: "#fff",
    borderRadius: 15,
    ...Platform.select({
      ios: {
        height: 30
      },
      android: {
        height: 30,
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
export default SelectModal;
