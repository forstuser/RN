import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  FlatList,
  Alert,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView
} from "react-native";
import I18n from "../../i18n";
import {
  fetchStates,
  fetchStateMeals,
  saveMealList,
  saveTodoList,
  removeMealById,
  fetchAllTodos,
  removeTodoById,
  removeClothById
} from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";
import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";
import Analytics from "../../analytics";
import { SCREENS, EASY_LIFE_TYPES } from "../../constants";
import { colors, defaultStyles } from "../../theme";
import AddNewBtn from "../../components/add-new-btn";
import WhatToListModal from "../../components/what-to-list-modal";
import CloathesImageUploader from "../../components/easy-life-items/cloathes-image-uploader";
import EasyLifeItem from "../../components/easy-life-item";
import SelectModal from "../../components/select-modal";
import Icon from "react-native-vector-icons/Ionicons";
import { showSnackbar } from "../snackbar";

const cooking = require("../../images/cooking.png");
const todo = require("../../images/to_do.png");
const whatToWear = require("../../images/whatToWear.png");
const headerBg = require("../../images/product_card_header_bg.png");

class WhatToListScreen extends Component {
  static navigatorStyle = {
    tabBarHidden: true,
    drawUnderNavBar: false,
    navBarTranslucent: false,
    navBarTransparent: false,
    navBarBackgroundColor: "#fff"
  };
  state = {
    text: "",
    btnText: "",
    image: cooking,
    items: [],
    selectedItemIds: [],
    states: [],
    isVeg: false,
    selectedState: null,
    isLoading: false
  };

  componentDidMount() {
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    const { type } = this.props;
    let title = "What to Cook";
    let text = "Select Dishes that you like";
    let image = cooking;
    let btnText = "Add New Dish";
    switch (type) {
      case EASY_LIFE_TYPES.WHAT_TO_DO:
        title = "What to Do";
        text = "Select items that you would like to do";
        image = todo;
        btnText = "Add a New To Do Item";
        break;
      case EASY_LIFE_TYPES.WHAT_TO_WEAR:
        title = "What to Wear Today";
        text = "Select items that you would like to wear";
        image = whatToWear;
        btnText = "Add New Cloathing Item";
        break;
    }
    this.setState({
      image,
      text,
      btnText
    });
    this.props.navigator.setTitle({
      title
    });

    if (this.props.type == EASY_LIFE_TYPES.WHAT_TO_COOK) {
      this.loadStates();
    } else {
      this.fetchItems();
    }
  }

  loadStates = async () => {
    this.setState({
      isLoading: true
    });
    try {
      const res = await fetchStates();
      this.setState({
        states: res.states
      });
      if (this.props.stateId) {
        const state = this.state.states.find(
          state => state.id == this.props.stateId
        );
        this.onSelectState(state);
      }
    } catch (e) {
    } finally {
      this.setState({
        isLoading: false
      });
    }
  };
  onSelectState = async value => {
    this.setState(
      {
        selectedState: value,
        isLoading: true
      },
      () => {
        this.fetchItems();
      }
    );
  };

  fetchItems = async () => {
    this.setState({
      isLoading: true
    });
    try {
      let res;
      let items = [];
      switch (this.props.type) {
        case EASY_LIFE_TYPES.WHAT_TO_COOK:
          res = await fetchStateMeals({
            stateId: this.state.selectedState.id,
            isVeg: this.state.isVeg
          });
          items = res.mealList;
          break;
        case EASY_LIFE_TYPES.WHAT_TO_DO:
          res = await fetchAllTodos();
          items = res.todoList;
          break;
        case EASY_LIFE_TYPES.WHAT_TO_WEAR:
          res = await fetchStateMeals({
            stateId: this.state.selectedState.id,
            isVeg: this.state.isVeg
          });
          newState = {
            items: res.mealList,
            selectedItemIds: res.mealList.map(meal => meal.id)
          };
          break;
      }

      this.setState({
        items,
        selectedItemIds: items
          .filter(item => item.isSelected)
          .map(item => item.id)
      });
    } catch (e) {
    } finally {
      this.setState({
        isLoading: false
      });
    }
  };
  // to wear case
  addItem = item => {
    this.setState({ items: [...this.state.items, item] }, () => {
      console.log(this.state.items);
    });
  };

  onAddNewPress = () => {
    const { type } = this.props;
    switch (type) {
      case EASY_LIFE_TYPES.WHAT_TO_COOK:
        this.WhatToListModal.show();
        break;
      case EASY_LIFE_TYPES.WHAT_TO_DO:
        this.WhatToListModal.show();
        break;
      case EASY_LIFE_TYPES.WHAT_TO_WEAR:
        this.clothesImageUploader.showActionSheet();
        break;
    }
  };
  // cook and to do
  addItems = items => {
    console.log("index", items);
    this.setState(
      {
        items: [...this.state.items, ...items],
        selectedItemIds: [
          ...this.state.selectedItemIds,
          ...items.map(item => item.id)
        ]
      },
      () => {
        console.log("user", this.state.items);
      }
    );
  };

  removeItem = async item => {
    try {
      switch (this.props.type) {
        case EASY_LIFE_TYPES.WHAT_TO_COOK:
          await removeMealById({ mealId: item.id });
          break;
        case EASY_LIFE_TYPES.WHAT_TO_DO:
          await removeTodoById({ todoId: item.id });
          break;
        case EASY_LIFE_TYPES.WHAT_TO_COOK:
          await removeClothById({ clothId: item.id });
          break;
      }

      let newItems = [...this.state.items];
      const idx = newItems.indexOf(item);
      if (idx > -1) {
        newItems.splice(idx, 1);
      }

      let newSelectedItemIds = [...this.state.selectedItemIds];
      const idxId = newItems.indexOf(item);
      if (idxId > -1) {
        newSelectedItemIds.splice(idxId, 1);
      }
      this.setState({
        items: newItems,
        selectedItemIds: newSelectedItemIds
      });
    } catch (e) {
      showSnackbar({
        text: e.message
      });
    }
  };

  toggleVegOrNonveg = () => {
    this.setState(
      {
        isVeg: !this.state.isVeg
      },
      () => {
        this.fetchItems();
      }
    );
  };

  toggleSystemItemSelect = id => {
    let newSelectedSystemItemIds = [...this.state.selectedItemIds];
    const idx = newSelectedSystemItemIds.indexOf(id);
    if (idx > -1) {
      newSelectedSystemItemIds.splice(idx, 1);
    } else {
      newSelectedSystemItemIds.push(id);
    }
    this.setState({
      selectedItemIds: newSelectedSystemItemIds
    });
  };

  addItemsToMyList = async () => {
    console.log("selectedItemIds", this.state.selectedItemIds);
    try {
      if (this.props.type == EASY_LIFE_TYPES.WHAT_TO_COOK) {
        await saveMealList({
          selectedItemIds: this.state.selectedItemIds,
          selectedState: this.state.selectedState.id
        });
      } else if (this.props.type == EASY_LIFE_TYPES.WHAT_TO_DO) {
        await saveTodoList({
          selectedItemIds: this.state.selectedItemIds
        });
      }
      this.props.navigator.pop();
    } catch (e) {
      showSnackbar({
        text: e.message
      });
    }
  };

  render() {
    const { type } = this.props;
    const {
      image,
      text,
      items,
      selectedItemIds,
      btnText,
      isVeg,
      selectedState,
      isLoading
    } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <ScreenContainer>
          {type == EASY_LIFE_TYPES.WHAT_TO_COOK && (
            <View style={{ padding: 5 }}>
              <SelectModal
                placeholder={"Select State"}
                placeholderRenderer={({ placeholder }) => (
                  <Text>{placeholder}</Text>
                )}
                options={this.state.states}
                selectedOption={selectedState}
                valueKey="id"
                visibleKey="state_name"
                hideAddNew={true}
                onOptionSelect={value => {
                  this.onSelectState(value);
                }}
              />
              {selectedState && (
                <TouchableOpacity
                  style={styles.checkboxWrapper}
                  onPress={this.toggleVegOrNonveg}
                >
                  <View style={styles.box}>
                    {isVeg && (
                      <Icon
                        name="md-checkmark"
                        color={colors.pinkishOrange}
                        size={15}
                      />
                    )}
                  </View>
                  <Text> Veg Only</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          {items.length == 0 && (
            <View style={styles.container}>
              <Image style={styles.blankPageImage} source={image} />
              <Text weight="Medium" style={styles.blankPageText}>
                {text}
              </Text>
            </View>
          )}
          <ScrollView style={styles.body}>
            {items.length > 0 &&
              items.map((item, index) => {
                return (
                  <View key={index}>
                    {item.status_type == 1 && (
                      <EasyLifeItem
                        showCheckbox={true}
                        text={item.name}
                        imageUri={item.url}
                        showRemoveBtn={false}
                        isChecked={selectedItemIds.includes(item.id)}
                        onPress={() => this.toggleSystemItemSelect(item.id)}
                      />
                    )}
                  </View>
                );
              })}
            {items.filter(item => item.status_type == 11).length > 0 && (
              <Text>User Created</Text>
            )}
            {items.map((item, index) => {
              return (
                <View key={index}>
                  {item.status_type == 11 && (
                    <EasyLifeItem
                      showCheckbox={true}
                      text={item.name}
                      imageUri={item.url}
                      showRemoveBtn={true}
                      isChecked={selectedItemIds.includes(item.id)}
                      onPress={() => this.toggleSystemItemSelect(item.id)}
                      onRemoveBtnPress={() => this.removeItem(item)}
                    />
                  )}
                </View>
              );
            })}
          </ScrollView>
          <View style={styles.addNewBtn}>
            <AddNewBtn text={btnText} onPress={this.onAddNewPress} />
          </View>
          <CloathesImageUploader
            ref={ref => (this.clothesImageUploader = ref)}
            navigator={this.props.navigator}
            addImageDetails={this.addItem}
          />
          <WhatToListModal
            ref={ref => (this.WhatToListModal = ref)}
            navigator={this.props.navigator}
            addItems={this.addItems}
            type={this.props.type}
            stateId={selectedState ? selectedState.id : null}
          />
        </ScreenContainer>

        {items.length > 0 &&
          type != EASY_LIFE_TYPES.WHAT_TO_WEAR && (
            <View>
              <Button
                onPress={this.addItemsToMyList}
                text={"SAVE MY LIST"}
                color="secondary"
                borderRadius={0}
                style={styles.addItemBtn}
              />
            </View>
          )}
        <LoadingOverlay visible={isLoading} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  checkboxWrapper: {
    width: 150,
    flexDirection: "row",
    marginBottom: 10
  },
  blankPageImage: {
    height: 70,
    width: 70,
    alignItems: "center",
    alignSelf: "center"
  },
  blankPageText: {
    fontSize: 14,
    color: "#9b9b9b"
  },
  body: {
    flex: 1
  },
  addItemBtn: {
    width: "100%"
  },
  box: {
    borderColor: colors.secondaryText,
    borderWidth: 1,
    height: 20,
    width: 20,
    alignItems: "center",
    borderRadius: 3
  }
});

export default WhatToListScreen;
