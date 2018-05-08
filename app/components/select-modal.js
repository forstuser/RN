import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  Text,
  FlatList,
  Button,
  Platform
} from "react-native";
import I18n from "../i18n";
import { defaultStyles } from "../theme";
const dropdownIcon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfhDAkMGjg4AXstAAAAcklEQVRIx+3Tuw3AIAxF0avMxQAMwNKeiYIUUSSE+NimQ7zU9wQK4O6IBYTi/ITARl4oyLN/hUh2/z8TAZKTyKT/FB6iyj1Ek1uJTm4hBrmWmOQaYpGvCEU+I5T5iDDkPcKYt4QjrwlnDhAR5Htxd0fvBYOKNVDm/h2pAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTEyLTA5VDEyOjI2OjU2KzAxOjAw6KWTZgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0xMi0wOVQxMjoyNjo1NiswMTowMJn4K9oAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC`;
const crossIcon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfhDAsIDg3tHAgMAAAAkElEQVQ4y6WUuQ2AMBAER5BQAQWQUxsSTUBCSohETkZON26DI0Li8cOKy6zdkX2fc1oWSjaMeGR0zAAOw5jIEvYJw3DQY0nktBv99RBCXo444lXDSFDxC9G732Iyu7shXYwH8sF+Rz7Zn4g31Z8hPklMWiyr2DhxNMThE8dbXiB5RcVPIAdqRhr2KGCsFFQMB2e3sbEqrADlAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTEyLTExVDA4OjE0OjEzKzAxOjAw8CXXWwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0xMi0xMVQwODoxNDoxMyswMTowMIF4b+cAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC`;

class SelectModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isTextInputVisible: false,
      isModalVisible: false,
      searchInput: "",
      textInput: ""
    };
  }

  componentDidMount() {
    this._updateStateFromProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this._updateStateFromProps(nextProps);
  }

  _updateStateFromProps = props => {
    if (!props.textInputValue) {
      this.setState({
        textInput: "",
        isTextInputVisible: false
      });
    } else if (props.textInputValue != this.state.textInput) {
      this.setState({
        textInput: props.textInputValue,
        isTextInputVisible: true
      });
    }
  };

  _placeholderRenderer = ({ placeholder }) => {
    return <Text style={[styles.placeholder]}>{placeholder}</Text>;
  };

  _renderOption = ({ item, index }) => {
    const {
      selectedOption = null,
      valueKey = "id",
      imageKey,
      visibleKey = "name",
      onChange
    } = this.props;
    return (
      <TouchableOpacity
        onPress={() => this._onItemSelect(item)}
        style={styles.option}
      >
        {imageKey && (
          <Image
            resizeMode="contain"
            style={styles.optionImage}
            source={{ uri: item[imageKey] }}
          />
        )}
        <Text style={styles.optionText}>{item[visibleKey]}</Text>
      </TouchableOpacity>
    );
  };

  openModal = () => {
    this.setState({ isModalVisible: true });
  };

  _tryOpenModal = () => {
    if (typeof this.props.beforeModalOpen == "function") {
      if (this.props.beforeModalOpen() === true) {
        return this.setState({ isModalVisible: true });
      } else {
        return;
      }
    }
    return this.openModal();
  };

  _onItemSelect = item => {
    const { onOptionSelect } = this.props;

    if (typeof onOptionSelect == "function") {
      onOptionSelect(item);
    }
    this.setState({
      isModalVisible: false,
      isTextInputVisible: false
    });
  };

  _onTextInputChange = text => {
    const { onTextInputChange } = this.props;
    if (typeof onTextInputChange == "function") {
      onTextInputChange(text);
    }
    this.setState({
      textInput: text
    });
  };

  _onAddNewClick = () => {
    this.setState(
      {
        isModalVisible: false,
        isTextInputVisible: true
      },
      () => {
        this.textInput.focus();
      }
    );
  };

  render() {
    let {
      options = [],
      selectedOption = null,
      textInputValue = "",
      valueKey = "id",
      imageKey,
      visibleKey = "name",
      placeholder = I18n.t("component_items_select_value"),
      textInputPlaceholder = I18n.t("component_items_enter_value"),
      newValueOption = true,
      onNewValueOptionAdd,
      style = {},
      placeholderStyle = {},
      dropdownArrowStyle = {},
      placeholderRenderer = this._placeholderRenderer,
      hideAddNew = false,
      hideSearch = false,
      hint
    } = this.props;
    let {
      isTextInputVisible,
      isModalVisible,
      searchInput,
      textInput
    } = this.state;

    const searchText = searchInput.trim();
    let optionsAfterSearch = [];
    if (searchText) {
      optionsAfterSearch = options.filter(option => {
        return option[visibleKey]
          .toLowerCase()
          .includes(searchText.toLowerCase());
      });
    } else {
      optionsAfterSearch = options;
    }
    // if (!isModalVisible) return null;

    return (
      <View style={[styles.container, style]}>
        {!isTextInputVisible && (
          <TouchableOpacity onPress={this._tryOpenModal} style={styles.wrapper}>
            <View style={{ flex: 1 }}>
              {selectedOption == null && placeholderRenderer({ placeholder })}
              {selectedOption != null && (
                <Text>{selectedOption[visibleKey]}</Text>
              )}
            </View>
            <Image
              style={[styles.dropdownIcon, dropdownArrowStyle]}
              source={{ uri: dropdownIcon }}
            />
          </TouchableOpacity>
        )}
        {isTextInputVisible && (
          <View style={styles.wrapper}>
            <TextInput
              underlineColorAndroid="transparent"
              ref={ref => (this.textInput = ref)}
              placeholder={textInputPlaceholder}
              style={styles.textInput}
              value={textInput}
              onChangeText={text => this._onTextInputChange(text)}
            />
            <Text onPress={this._tryOpenModal} style={styles.textInputSelect}>
              Select
            </Text>
          </View>
        )}
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
        {isModalVisible && (
          <View>
            <Modal visible={true} animationType="slide">
              <View style={{ backgroundColor: "#fff" }}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalHeaderText}>{placeholder}</Text>
                  <TouchableOpacity
                    onPress={() => this.setState({ isModalVisible: false })}
                    style={styles.modalCloseBtn}
                  >
                    <Image
                      style={styles.modalCloseIcon}
                      source={{ uri: crossIcon }}
                    />
                  </TouchableOpacity>
                </View>
                {!hideSearch && (
                  <View style={styles.searchContainer}>
                    <TextInput
                      placeholder={I18n.t("component_items_search")}
                      underlineColorAndroid="transparent"
                      style={styles.searchInput}
                      value={searchInput}
                      onChangeText={text =>
                        this.setState({ searchInput: text })
                      }
                    />
                  </View>
                )}
              </View>
              {optionsAfterSearch.length > 0 && (
                <FlatList
                  style={style.optionsList}
                  data={optionsAfterSearch}
                  keyExtractor={(item, index) => index}
                  renderItem={this._renderOption}
                  ListFooterComponent={() => {
                    if (hideAddNew) {
                      return null;
                    }
                    return (
                      <TouchableOpacity
                        style={styles.option}
                        onPress={this._onAddNewClick}
                      >
                        <Text style={styles.addNewBtnText}>Add New</Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              )}
              {optionsAfterSearch.length == 0 && (
                <View style={styles.noResultContainer}>
                  <Text style={styles.noResultText}>No result found</Text>

                  {!hideAddNew && (
                    <TouchableOpacity
                      style={styles.addNewBtn}
                      onPress={this._onAddNewClick}
                    >
                      <Text style={styles.addNewBtnText}>Add New</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </Modal>
          </View>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    height: 45,
    padding: 8,
    marginBottom: 12,
    ...defaultStyles.card
  },
  wrapper: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center"
  },
  placeholder: {
    flex: 1
  },
  dropdownIcon: {
    width: 12,
    height: 12
  },
  textInput: {
    flex: 1,
    ...Platform.select({
      ios: {},
      android: {
        padding: 0
      }
    })
  },
  textInputSelect: {
    fontWeight: "bold",
    color: "#009ee5"
  },
  modalHeader: {
    backgroundColor: "#fff",
    borderColor: "#A9A9A9",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    ...Platform.select({
      ios: {
        height: 60,
        paddingTop: 20
      },
      android: {
        height: 50
      }
    })
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    paddingHorizontal: 16
  },
  modalCloseBtn: {
    padding: 16
  },
  modalCloseIcon: {
    width: 16,
    height: 16
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
  optionsList: {
    flex: 1
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderColor: "#efefef",
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  optionImage: {
    width: 40,
    height: 40,
    marginRight: 20
  },
  optionText: {
    flex: 1
  },
  addNewBtnText: {
    fontWeight: "bold",
    color: "#009ee5"
  },
  noResultContainer: {
    padding: 16,
    alignItems: "center"
  },
  noResultText: {
    fontSize: 18,
    color: "#bcbcbc"
  },
  addNewBtn: {
    width: 200,
    padding: 16,
    alignItems: "center",
    justifyContent: "center"
  }
});
export default SelectModal;
