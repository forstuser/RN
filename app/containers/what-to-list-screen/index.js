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
  ScrollView,
  Switch
} from "react-native";
import I18n from "../../i18n";
import {
  API_BASE_URL,
  fetchStates,
  fetchStateMeals,
  saveMealList,
  saveTodoList,
  removeMealById,
  fetchAllTodos,
  getClothesListByDate,
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
import ClothesImageUploader from "../../components/easy-life-items/clothes-image-uploader";
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
    checkAll: false,
    selectedState: null,
    isLoading: true,
    error: null
  };

  componentDidMount() {
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    const { type } = this.props;
    let title = "What's Cooking?";
    let text =
      "A comprehensive list of local and popular dishes can be selected for your state or add your own dish to help you decide what to cook for the day";
    let image = cooking;
    let btnText = "Add New Dish";
    switch (type) {
      case EASY_LIFE_TYPES.WHAT_TO_DO:
        title = "What to Do?";
        text =
          "Plan your day by selecting or adding tasks to be completed for the day.";
        image = todo;
        btnText = `Add a New ‘To Do’ Item`;
        break;
      case EASY_LIFE_TYPES.WHAT_TO_WEAR:
        title = "What to Wear?";
        text =
          "Plan your wardrobe by selecting or adding items to be worn for the day.";
        image = whatToWear;
        btnText = "Add New Item";
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

    this.fetchStatesOrItems();
  }

  fetchStatesOrItems = () => {
    if (this.props.type == EASY_LIFE_TYPES.WHAT_TO_COOK) {
      this.loadStates();
    } else {
      this.fetchItems();
    }
  };

  loadStates = async () => {
    this.setState({
      isLoading: true
    });
    try {
      const res = await fetchStates();
      this.setState({
        states: res.states
      });

      let stateId = this.props.stateId;
      if (this.state.selectedState) {
        stateId = this.state.selectedState.id;
      }
      if (stateId) {
        const state = this.state.states.find(state => state.id == stateId);
        this.onSelectState(state);
      } else {
        this.setState({
          isLoading: false
        });
      }
    } catch (error) {
      this.setState({
        error,
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
      isLoading: true,
      checkAll: false
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
          res = await getClothesListByDate();
          items = res.wearableList;
          break;
      }

      this.setState({
        items,
        selectedItemIds: items
          .filter(item => item.isSelected)
          .map(item => item.id)
      });
    } catch (e) {
      alert(e.message);
    } finally {
      this.setState({
        isLoading: false
      });
    }
  };
  // to wear case
  addItem = item => {
    this.setState({ items: [...this.state.items, item] }, () => {
      this.scrollView.scrollToEnd();
    });
  };

  onAddNewPress = () => {
    const { type } = this.props;
    switch (type) {
      case EASY_LIFE_TYPES.WHAT_TO_COOK:
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
        this.scrollView.scrollTo({ y: 0, animated: true });
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
        case EASY_LIFE_TYPES.WHAT_TO_WEAR:
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
  checkAllBox = () => {
    this.setState(
      {
        checkAll: !this.state.checkAll
      },
      () => {
        if (this.state.checkAll) {
          this.setState({
            selectedItemIds: [
              ...this.state.selectedItemIds,
              ...this.state.items.map(item => item.id)
            ]
          });
        } else {
          this.setState({
            selectedItemIds: []
          });
        }
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

  beforeOpenStatesModal = () => {
    if (!this.state.selectedState) {
      return true;
    } else {
      Alert.alert(
        "Are you sure?",
        `Changing state will remove the list of current state`,
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel"
          },
          {
            text: "Continue",
            onPress: () => this.selectStateModal.openModal()
          }
        ]
      );
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
      isLoading,
      checkAll,
      error
    } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <ScreenContainer>
          {type == EASY_LIFE_TYPES.WHAT_TO_COOK && (
            <View style={{ padding: 5 }}>
              <SelectModal
                ref={ref => (this.selectStateModal = ref)}
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
                beforeModalOpen={this.beforeOpenStatesModal}
              />
              {selectedState && (
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ color: colors.mainText }}>is Veg ?</Text>
                  <Switch
                    onValueChange={this.toggleVegOrNonveg}
                    value={isVeg}
                  />
                  <TouchableOpacity
                    style={styles.checkboxWrapper}
                    onPress={this.checkAllBox}
                  >
                    <Text style={{ color: colors.mainText }}> Select All </Text>
                    <View style={styles.box}>
                      {checkAll && (
                        <Icon
                          name="md-checkmark"
                          color={colors.pinkishOrange}
                          size={15}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
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
          <ScrollView style={styles.body} ref={ref => (this.scrollView = ref)}>
            {items.filter(item => item.status_type == 11).length > 0 && (
              <Text>User Created</Text>
            )}
            {items.map((item, index) => {
              let imageUrl = null;
              if (this.props.type == EASY_LIFE_TYPES.WHAT_TO_WEAR) {
                imageUrl =
                  API_BASE_URL +
                  "/wearable/" +
                  item.id +
                  "/images/" +
                  item.image_code;
              }
              return (
                <View key={index}>
                  {item.status_type == 11 && (
                    <EasyLifeItem
                      showCheckbox={true}
                      text={item.name}
                      imageUrl={imageUrl}
                      showRemoveBtn={true}
                      isChecked={selectedItemIds.includes(item.id)}
                      onPress={() => this.toggleSystemItemSelect(item.id)}
                      onRemoveBtnPress={() => this.removeItem(item)}
                    />
                  )}
                </View>
              );
            })}

            {items.filter(item => item.status_type == 1).length > 0 &&
              type != EASY_LIFE_TYPES.WHAT_TO_WEAR && (
                <Text>List of Tasks</Text>
              )}
            {items.length > 0 &&
              items.map((item, index) => {
                let imageUrl = null;
                if (this.props.type == EASY_LIFE_TYPES.WHAT_TO_WEAR) {
                  imageUrl =
                    API_BASE_URL +
                    "/wearable/" +
                    item.id +
                    "/images/" +
                    item.image_code;
                }
                return (
                  <View key={index}>
                    {item.status_type == 1 && (
                      <EasyLifeItem
                        showCheckbox={type != EASY_LIFE_TYPES.WHAT_TO_WEAR}
                        text={item.name}
                        imageUrl={imageUrl}
                        showRemoveBtn={type == EASY_LIFE_TYPES.WHAT_TO_WEAR}
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
          <ClothesImageUploader
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
        <ErrorOverlay error={error} onRetryPress={this.fetchStatesOrItems} />
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
    // width: 150,
    flexDirection: "row"
    // marginBottom: 10
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
