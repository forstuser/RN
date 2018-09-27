import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  FlatList,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView
} from "react-native";

import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";
import ActionSheet from "react-native-actionsheet";

import I18n from "../../i18n";
import {
  API_BASE_URL,
  getMealListByDate,
  addMealForADate,
  removeMealForADate,
  getTodoListByDate,
  getClothesListByDate,
  addTodoForADate,
  removeTodoForADate,
  removeClothForADate,
  addClothForADate
} from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";
import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";
// import Analytics from "../../analytics";
import { SCREENS, EASY_LIFE_TYPES } from "../../constants";
import { colors, defaultStyles } from "../../theme";
import DateSelector from "./date-selector";
import EasyLifeItem from "../../components/easy-life-item";
import AddNewBtn from "../../components/add-new-btn";
import ClothesImageUploader from "../../components/easy-life-items/clothes-image-uploader";
import WhatToListModal from "../../components/what-to-list-modal";
import WhatToListEmptyState from "../../components/what-to-list-empty-state";
import { showSnackbar } from "../../utils/snackbar";

const cooking = require("../../images/cooking.png");
const todo = require("../../images/to_do.png");
const whatToWear = require("../../images/whatToWear.png");
const headerBg = require("../../images/product_card_header_bg.png");

class DishCalendarScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      title: params.title ? params.title : ""
    };
  };

  state = {
    type: "",
    isScreenVisible: true,
    image: cooking,
    text: "",
    date: moment().format("YYYY-MM-DD"),
    items: [],
    selectedItemIds: [],
    isLoading: true,
    error: null,
    btnText: "",
    showSelectedItems: false,
    item: {}
  };

  componentDidMount() {
    const { type } = this.props.navigation.state.params;
    let title = "What's Cooking?";
    let text = "Select Dishes to be cooked";
    let image = cooking;
    let btnText = "Add New Dish";
    switch (type) {
      case EASY_LIFE_TYPES.WHAT_TO_DO:
        title = "What to Do?";
        text = "Select Tasks to be done";
        image = todo;
        btnText = `Add a New ‘To-Do’ Task`;
        break;
      case EASY_LIFE_TYPES.WHAT_TO_WEAR:
        title = "What to Wear?";
        text = "Select items that you would like to wear";
        image = whatToWear;
        btnText = "Add New Item";
        break;
    }

    this.props.navigation.setParams({
      title
    });

    this.setState(
      {
        type,
        image,
        text,
        btnText
      },
      () => {
        this.fetchItems();
      }
    );
    this.didFocusSubscription = this.props.navigation.addListener(
      "didFocus",
      () => {
        this.setState({ isScreenVisible: true });
        this.fetchItems();
      }
    );
  }

  componentWillUnmount() {
    this.didFocusSubscription.remove();
  }

  handleScroll = event => {
    if (event.nativeEvent.contentOffset.y > 220) {
      this.setState({
        showSelectedItems: true
      });
    } else {
      this.setState({
        showSelectedItems: false
      });
    }
    if (!this.state.isScreenVisible) {
      return;
    }
    if (event.nativeEvent.contentOffset.y > 0) {
      // this.props.navigation.setStyle({
      //   navBarTransparent: false,
      //   navBarBackgroundColor: "#fff",
      //   ...Platform.select({
      //     ios: {},
      //     android: {
      //       topBarElevationShadowEnabled: true
      //     }
      //   })
      // });
    } else {
      // this.props.navigation.setStyle({
      //   navBarTransparent: true,
      //   navBarBackgroundColor: "transparent",
      //   ...Platform.select({
      //     ios: {},
      //     android: {
      //       topBarElevationShadowEnabled: false
      //     }
      //   })
      // });
    }
  };

  nextDate = () => {
    this.setState(
      {
        date: moment(this.state.date)
          .add(1, "days")
          .format("YYYY-MM-DD")
      },
      () => {
        this.fetchItems();
      }
    );
  };

  previousDate = () => {
    this.setState(
      {
        date: moment(this.state.date)
          .subtract(1, "days")
          .format("YYYY-MM-DD")
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
      let newState = {};

      switch (this.props.navigation.state.params.type) {
        case EASY_LIFE_TYPES.WHAT_TO_COOK:
          res = await getMealListByDate(this.state.date);
          newState = {
            items: res.mealList,
            selectedItemIds: res.mealList
              .filter(item => moment(this.state.date).isSame(item.current_date))
              .map(item => item.id)
          };
          break;
        case EASY_LIFE_TYPES.WHAT_TO_DO:
          res = await getTodoListByDate(this.state.date);
          newState = {
            items: res.todoList,
            selectedItemIds: res.todoList
              .filter(item => moment(this.state.date).isSame(item.current_date))
              .map(item => item.id)
          };
          break;
        case EASY_LIFE_TYPES.WHAT_TO_WEAR:
          res = await getClothesListByDate(this.state.date);
          newState = {
            items: res.wearableList,
            selectedItemIds: res.wearableList
              .filter(item => moment(this.state.date).isSame(item.current_date))
              .map(item => item.id)
          };
          break;
      }

      this.setState(newState);
    } catch (e) {
      this.setState({ error: e });
    } finally {
      this.setState({
        isLoading: false
      });
    }
  };

  toggleItemSelect = async item => {
    let newSelectedItemIds = [...this.state.selectedItemIds];
    const idx = newSelectedItemIds.indexOf(item.id);

    // this.setState({ isLoading: true });
    try {
      if (idx > -1) {
        newSelectedItemIds.splice(idx, 1);
        this.setState({
          selectedItemIds: newSelectedItemIds
        });
        switch (this.props.navigation.state.params.type) {
          case EASY_LIFE_TYPES.WHAT_TO_COOK:
            await removeMealForADate({
              mealId: item.id,
              date: this.state.date
            });
            break;
          case EASY_LIFE_TYPES.WHAT_TO_DO:
            await removeTodoForADate({
              todoId: item.id,
              date: this.state.date
            });
            break;
          case EASY_LIFE_TYPES.WHAT_TO_WEAR:
            await removeClothForADate({
              clothId: item.id,
              date: this.state.date
            });
            break;
        }
      } else {
        newSelectedItemIds.push(item.id);

        let items = [...this.state.items];
        let itemIdx = items.findIndex(i => i.id == item.id);
        items[itemIdx].current_date = this.state.date;

        this.setState({
          selectedItemIds: newSelectedItemIds,
          items
        });
        switch (this.props.navigation.state.params.type) {
          case EASY_LIFE_TYPES.WHAT_TO_COOK:
            await addMealForADate({ mealId: item.id, date: this.state.date });
            break;
          case EASY_LIFE_TYPES.WHAT_TO_DO:
            await addTodoForADate({
              todoId: item.id,
              date: this.state.date
            });
            break;
          case EASY_LIFE_TYPES.WHAT_TO_WEAR:
            await addClothForADate({
              clothId: item.id,
              date: this.state.date
            });
            break;
        }
      }
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({
        isLoading: false
      });
    }
  };

  onAddNewPress = () => {
    const { type } = this.props.navigation.state.params;
    switch (type) {
      case EASY_LIFE_TYPES.WHAT_TO_COOK:
        // Analytics.logEvent(Analytics.EVENTS.CLICK_ON_ADD_NEW_DISH);
        this.WhatToListModal.show();
        break;
      case EASY_LIFE_TYPES.WHAT_TO_DO:
        // Analytics.logEvent(Analytics.EVENTS.CLICK_ON_ADD_NEW_WHAT_TO_DO);
        this.WhatToListModal.show();
        break;
      case EASY_LIFE_TYPES.WHAT_TO_WEAR:
        // Analytics.logEvent(Analytics.EVENTS.CLICK_ON_ADD_NEW_WEAR_ITEM);
        this.clothesImageUploader.showActionSheet();
        break;
    }
  };

  addItem = item => {
    this.setState(
      {
        items: [item, ...this.state.items],
        selectedItemIds: [item.id, ...this.state.selectedItemIds]
      },
      async () => {
        this.scrollView.scrollTo({ y: 0, animated: true });
      }
    );
  };

  addItems = items => {
    this.setState(
      {
        items: [...items, ...this.state.items],
        selectedItemIds: [
          ...items.map(item => item.id),
          ...this.state.selectedItemIds
        ]
      },
      () => {
        if (this.scrollView) {
          this.scrollView.scrollTo({ y: 0, animated: true });
        }
      }
    );
  };

  goToEditScreen = () => {
    const { items } = this.state;
    this.setState(
      {
        isScreenVisible: false
      },
      () => {
        this.props.navigation.navigate(SCREENS.WHAT_TO_LIST_SCREEN, {
          type: this.props.navigation.state.params.type,
          stateId: items.length > 0 ? items[0].state_id : null
        });
      }
    );
  };

  handleEditOptionPress = index => {
    switch (index) {
      case 0:
        this.goToEditScreen();
        break;
    }
  };

  render() {
    const { navigation } = this.props;
    const {
      isLoading,
      date,
      image,
      text,
      items,
      selectedItemIds,
      error,
      btnText,
      showSelectedItems,
      item
    } = this.state;

    let selectedItemsNames = [];
    let selectedItemsDateText = "";
    if (showSelectedItems) {
      selectedItemsNames = items
        .filter(item => selectedItemIds.indexOf(item.id) > -1)
        .map(item => item.name);
      const diff = moment()
        .startOf("day")
        .diff(moment(date).startOf("day"), "days");
      if (!diff) {
        selectedItemsDateText = "Today";
      } else if (diff == 1) {
        selectedItemsDateText = "Yesterday";
      } else if (diff == -1) {
        selectedItemsDateText = "Tomorrow";
      } else {
        selectedItemsDateText = moment(date).format("DD MMM, YYYY");
      }
    }

    return (
      <ScreenContainer style={styles.container}>
        {items.length > 0 && (
          <ScrollView
            onScroll={this.handleScroll}
            ref={ref => (this.scrollView = ref)}
          >
            <View collapsable={false} style={styles.header}>
              <Image style={styles.headerBg} source={headerBg} />
              <Image style={styles.image} source={image} />

              <View collapsable={false} style={styles.dateSelector}>
                <DateSelector
                  date={date}
                  onRightArrowPress={this.nextDate}
                  onLeftArrowPress={this.previousDate}
                />
              </View>
            </View>
            <View collapsable={false} style={styles.body}>
              <View
                collapsable={false}
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row"
                }}
              >
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={this.onAddNewPress}
                >
                  <Icon name="md-add" size={18} color={colors.pinkishOrange} />
                  <Text
                    weight="Medium"
                    style={{ color: colors.pinkishOrange, marginLeft: 10 }}
                  >
                    {btnText}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={this.goToEditScreen}
                >
                  <Icon
                    name="md-create"
                    size={18}
                    color={colors.pinkishOrange}
                  />
                  <Text
                    weight="Medium"
                    style={{ color: colors.pinkishOrange, marginLeft: 10 }}
                  >
                    Edit Your List
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.titleText}>{text}</Text>
              {items.map((item, index) => {
                const isChecked = selectedItemIds.indexOf(item.id) > -1;
                let secondaryText = "";
                let imageUrl = null;
                if (item.current_date) {
                  const diff = moment()
                    .startOf("day")
                    .diff(moment(item.current_date).startOf("day"), "days");
                  if (!diff) {
                    secondaryText = "Today";
                  } else if (diff == 1) {
                    secondaryText = "Yesterday";
                  } else if (diff == -1) {
                    secondaryText = "Tomorrow";
                  } else if (diff > 1) {
                    secondaryText = `${diff} days ago`;
                  } else if (diff < -1) {
                    secondaryText = moment(item.current_date).format(
                      "DD MMM, YYYY"
                    );
                  }
                }

                if (
                  this.props.navigation.state.params.type ==
                  EASY_LIFE_TYPES.WHAT_TO_WEAR
                ) {
                  imageUrl =
                    API_BASE_URL +
                    "/wearable/" +
                    item.id +
                    "/images/" +
                    item.image_code;
                }

                if (item.selected_times) {
                  secondaryText =
                    secondaryText + ", " + item.selected_times + "x";
                }

                return (
                  <View collapsable={false} key={item.id} style={styles.item}>
                    <EasyLifeItem
                      checkBoxStyle="circle"
                      text={item.name}
                      secondaryText={secondaryText}
                      imageUrl={imageUrl}
                      isChecked={isChecked}
                      onPress={() => this.toggleItemSelect(item)}
                    />
                  </View>
                );
              })}
              {/* <AddNewBtn
                style={{ margin: 5 }}
                text={btnText}
                onPress={this.onAddNewPress}
              /> */}
              <ClothesImageUploader
                ref={ref => (this.clothesImageUploader = ref)}
                navigation={navigation}
                addImageDetails={this.addItem}
                date={date}
              />
              <WhatToListModal
                ref={ref => (this.WhatToListModal = ref)}
                navigation={this.props.navigation}
                addItems={this.addItems}
                type={this.props.navigation.state.params.type}
                stateId={items.length > 0 ? items[0].state_id : null}
                date={date}
              />
            </View>
          </ScrollView>
        )}
        {selectedItemsNames.length > 0 ? (
          <View collapsable={false} style={styles.selectedItems}>
            <View collapsable={false} style={styles.selectedItemsTitle}>
              <View
                collapsable={false}
                style={styles.selectedItemsTitleCheckmark}
              >
                <Icon name="md-checkmark" size={12} color="#fff" />
              </View>
              <Text weight="Bold" style={styles.selectedItemsTitleText}>
                Selected for {selectedItemsDateText}
              </Text>
            </View>
            <Text
              weight="Medium"
              numberOfLines={3}
              style={styles.selectedItemsText}
            >
              {selectedItemsNames.join(", ")}
            </Text>
          </View>
        ) : (
          <View collapsable={false} />
        )}
        {items.length == 0 &&
          !isLoading && (
            <WhatToListEmptyState
              type={this.props.navigation.state.params.type}
              navigation={this.props.navigation}
              onCreateListBtnPress={this.goToEditScreen}
            />
          )}
        <ActionSheet
          onPress={this.handleEditOptionPress}
          ref={o => (this.editOptions = o)}
          cancelButtonIndex={1}
          options={["Edit List", "Cancel"]}
        />
        <LoadingOverlay visible={isLoading} />
        <ErrorOverlay error={error} onRetryPress={this.fetchItems} />
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0
  },
  header: {
    alignItems: "center",
    height: 260
  },
  headerBg: {
    position: "absolute",
    width: "100%",
    height: "100%"
  },
  image: {
    width: 74,
    height: 74,
    marginTop: 90
  },
  dateSelector: {
    marginTop: 30,
    width: "100%",
    paddingHorizontal: 10
  },
  body: {
    padding: 5
  },
  titleText: {
    textAlign: "center",
    fontSize: 14,
    color: "#9b9b9b"
    // marginLeft: 10
  },
  item: {
    marginBottom: 5
  },
  editBtn: {
    marginHorizontal: 5,
    marginBottom: 10,
    marginTop: 0,
    padding: 5,
    // ...defaultStyles.card,
    flexDirection: "row",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    borderColor: colors.pinkishOrange,
    borderWidth: 1
  },
  selectedItems: {
    borderTopWidth: 1,
    borderColor: "#eee",
    padding: 10,
    backgroundColor: "white"
  },
  selectedItemsTitle: {
    flexDirection: "row",
    color: "#fff",
    marginBottom: 5,
    justifyContent: "flex-start",
    alignItems: "center"
  },
  selectedItemsTitleCheckmark: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.success,
    justifyContent: "center",
    alignItems: "center"
  },
  selectedItemsText: {
    color: "#4a4a4a"
  },
  selectedItemsTitleText: {
    paddingLeft: 2
  }
});

export default DishCalendarScreen;
