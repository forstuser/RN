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
    systemListTitle: "",
    image: cooking,
    items: [],
    selectedItemIds: [],
    states: [],
    isVeg: false,
    checkAll: false,
    selectedState: { id: 0, state_name: "Select State" },
    isLoading: true,
    error: null
  };

  componentDidMount() {
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    const { type } = this.props;
    let title = "What's Cooking?";
    let text = "Get to know which dish was cooked and when.";
    let image = cooking;
    let systemListTitle = "List of Meals";
    let btnText = "Add New Dish";
    switch (type) {
      case EASY_LIFE_TYPES.WHAT_TO_DO:
        title = "What to Do?";
        text =
          "You are here because you want us to help you decide What to Do today, tomorrow or even the entire week.";
        image = todo;
        btnText = `Add a New ‘To-Do’ Task`;
        systemListTitle = "List of Tasks";
        break;
      case EASY_LIFE_TYPES.WHAT_TO_WEAR:
        title = "What to Wear?";
        text =
          "Get an overview of your entire wardrobe and history of what you had worn and when.Create your Digital Wardrobe by adding images of your clothes & accessories.";
        image = whatToWear;
        btnText = "Add New Item";
        systemListTitle = "";
        break;
    }
    this.setState({
      image,
      text,
      btnText,
      systemListTitle
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

      let stateId = null;
      if (this.props.stateId) {
        stateId = this.props.stateId;
      } else if (this.state.selectedState) {
        stateId = this.state.selectedState.id;
      }
      if (stateId) {
        const state = this.state.states.find(state => state.id == stateId);
        this.onSelectState(state);
      } else {
        this.fetchItems();
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
        selectedState: value
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
            stateId: this.state.selectedState
              ? this.state.selectedState.id
              : null
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
        Analytics.logEvent(Analytics.EVENTS.CLICK_ON_ADD_NEW_DISH);
        this.WhatToListModal.show();
        break;
      case EASY_LIFE_TYPES.WHAT_TO_DO:
        Analytics.logEvent(Analytics.EVENTS.CLICK_ON_ADD_NEW_WHAT_TO_DO);
        this.WhatToListModal.show();
        break;
      case EASY_LIFE_TYPES.WHAT_TO_WEAR:
        Analytics.logEvent(Analytics.EVENTS.CLICK_ON_ADD_NEW_WEAR_ITEM);
        this.clothesImageUploader.showActionSheet();
        break;
    }
  };
  // cook and to do
  addItems = items => {
    this.setState(
      {
        items: [...this.state.items, ...items],
        selectedItemIds: [
          ...this.state.selectedItemIds,
          ...items.map(item => item.id)
        ]
      },
      () => {
        if (this.scrollView) {
          this.scrollView.scrollTo({ y: 0, animated: true });
        }
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
        if (!this.state.isVeg) {
          this.setState({
            checkAll: false
          });
        }
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
          let selectedItemIds = [];
          if (
            this.props.type == EASY_LIFE_TYPES.WHAT_TO_COOK &&
            this.state.isVeg
          ) {
            selectedItemIds = this.state.items
              .filter(item => item.is_veg == true)
              .map(item => item.id);
          } else {
            selectedItemIds = this.state.items.map(item => item.id);
          }
          this.setState({
            selectedItemIds
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
          selectedState: this.state.selectedState
            ? this.state.selectedState.id
            : null
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
    if (!this.state.selectedState || this.state.selectedState.id == 0) {
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

  goToFaq = () => {
    this.props.navigator.push({
      screen: SCREENS.FAQS_SCREEN,
      passProps: { scrollToBottom: true }
    });
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
      error,
      systemListTitle
    } = this.state;

    return (
      <View collapsable={false} style={{ flex: 1 }}>
        <ScreenContainer>
          {type == EASY_LIFE_TYPES.WHAT_TO_COOK &&
            items.length > 0 && (
              <View collapsable={false} style={{ padding: 5 }}>
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
                {selectedState &&
                  selectedState.id > 0 && (
                    <View
                      collapsable={false}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between"
                      }}
                    >
                      <TouchableOpacity
                        style={styles.checkboxWrapper}
                        onPress={this.checkAllBox}
                      >
                        <View collapsable={false} style={styles.box}>
                          {checkAll ? (
                            <Icon
                              name="md-checkmark"
                              color={colors.pinkishOrange}
                              size={15}
                            />
                          ) : (
                            <View collapsable={false} />
                          )}
                        </View>
                        <Text style={{ color: colors.mainText }}>
                          {" "}
                          Select All{" "}
                        </Text>
                      </TouchableOpacity>
                      <View
                        collapsable={false}
                        style={{ flexDirection: "row" }}
                      >
                        <Text style={{ color: colors.mainText }}>
                          Veg Only{" "}
                        </Text>
                        <Switch
                          onValueChange={this.toggleVegOrNonveg}
                          value={isVeg}
                        />
                      </View>
                    </View>
                  )}
              </View>
            )}
          {items.length == 0 && (
            <View collapsable={false} style={styles.container}>
              <Image style={styles.blankPageImage} source={image} />
              <View collapsable={false} style={styles.blankPageView}>
                <Text weight="Regular" style={styles.blankPageText}>
                  {text}
                </Text>
              </View>
              {type == EASY_LIFE_TYPES.WHAT_TO_COOK ? (
                <Text style={styles.faqText} weight="Regular">
                  Select popular dishes for your state or by adding your own
                  favourite dishes.
                </Text>
              ) : (
                <View collapsable={false} />
              )}
              {type == EASY_LIFE_TYPES.WHAT_TO_COOK ? (
                <Text style={styles.faqText} weight="Regular">
                  And don’t you panic, each state also includes PAN India
                  popular dishes!
                </Text>
              ) : (
                <View collapsable={false} />
              )}
              <View collapsable={false} style={styles.faqView}>
                <Text style={styles.faqText} weight="Regular">
                  To know more, How it Works
                </Text>
                <TouchableOpacity
                  style={{ paddingVertical: 10 }}
                  onPress={this.goToFaq}
                >
                  <Text
                    weight="Medium"
                    style={{
                      color: colors.pinkishOrange,
                      fontSize: 18,
                      top: 10
                    }}
                  >
                    {" "}
                    click here
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {items.length > 0 && (
            <ScrollView
              style={styles.body}
              ref={ref => (this.scrollView = ref)}
            >
              {items.filter(item => item.status_type == 11).length > 0 && (
                <Text>Your List</Text>
              )}
              {items.map((item, index) => {
                let imageUrl = null;
                if (type == EASY_LIFE_TYPES.WHAT_TO_WEAR) {
                  imageUrl =
                    API_BASE_URL +
                    "/wearable/" +
                    item.id +
                    "/images/" +
                    item.image_code;
                }
                return (
                  <View collapsable={false} key={index}>
                    {item.status_type == 11 ? (
                      <EasyLifeItem
                        showCheckbox={true}
                        text={item.name}
                        imageUrl={imageUrl}
                        showRemoveBtn={true}
                        isChecked={selectedItemIds.includes(item.id)}
                        onPress={() => this.toggleSystemItemSelect(item.id)}
                        onRemoveBtnPress={() => this.removeItem(item)}
                      />
                    ) : (
                      <View collapsable={false} />
                    )}
                  </View>
                );
              })}

              {items.filter(item => item.status_type == 1).length > 0 &&
                type != EASY_LIFE_TYPES.WHAT_TO_WEAR && (
                  <Text>{systemListTitle}</Text>
                )}
              {items.length > 0 &&
                items.map((item, index) => {
                  let imageUrl = null;
                  if (type == EASY_LIFE_TYPES.WHAT_TO_WEAR) {
                    imageUrl =
                      API_BASE_URL +
                      "/wearable/" +
                      item.id +
                      "/images/" +
                      item.image_code;
                  } else if (type == EASY_LIFE_TYPES.WHAT_TO_COOK) {
                    if (isVeg && !item.is_veg) {
                      return null;
                    }
                  }
                  return (
                    <View collapsable={false} key={index}>
                      {item.status_type == 1 ? (
                        <EasyLifeItem
                          showCheckbox={type != EASY_LIFE_TYPES.WHAT_TO_WEAR}
                          text={item.name}
                          imageUrl={imageUrl}
                          showRemoveBtn={type == EASY_LIFE_TYPES.WHAT_TO_WEAR}
                          isChecked={selectedItemIds.includes(item.id)}
                          onPress={() => this.toggleSystemItemSelect(item.id)}
                          onRemoveBtnPress={() => this.removeItem(item)}
                        />
                      ) : (
                        <View collapsable={false} />
                      )}
                    </View>
                  );
                })}
            </ScrollView>
          )}
          <View collapsable={false} style={styles.addNewBtn}>
            {type == EASY_LIFE_TYPES.WHAT_TO_COOK && items.length == 0 ? (
              <View collapsable={false} style={{ padding: 5 }}>
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
              </View>
            ) : (
              <View />
            )}
            {type != EASY_LIFE_TYPES.WHAT_TO_COOK ? (
              <AddNewBtn text={btnText} onPress={this.onAddNewPress} />
            ) : (
              <View />
            )}
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
            <View collapsable={false}>
              <Button
                onPress={this.addItemsToMyList}
                text={"SAVE MY LIST"}
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
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 50
  },
  checkboxWrapper: {
    // width: 150,
    marginLeft: 14,
    flexDirection: "row"
    // marginBottom: 10
  },
  blankPageImage: {
    height: 100,
    width: 100,
    alignItems: "center",
    alignSelf: "center"
  },
  blankPageView: {
    marginTop: 20,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center"
  },
  blankPageText: {
    fontSize: 18,
    color: "#4a4a4a",
    textAlign: "center"
  },
  faqView: {
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  faqText: {
    top: 10,
    fontSize: 18,
    color: "#4a4a4a",
    textAlign: "center"
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
    alignItems: "center"
    // borderRadius: 3
  }
});

export default WhatToListScreen;
