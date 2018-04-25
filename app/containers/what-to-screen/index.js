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
import { Navigation } from "react-native-navigation";
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
  getClothesListByDate
} from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";
import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";
import Analytics from "../../analytics";
import { SCREENS, EASY_LIFE_TYPES } from "../../constants";
import { colors, defaultStyles } from "../../theme";
import DateSelector from "./date-selector";
import EasyLifeItem from "../../components/easy-life-item";
import AddNewBtn from "../../components/add-new-btn";
import CloathesImageUploader from "../../components/easy-life-items/cloathes-image-uploader";
import WhatToListModal from "../../components/what-to-list-modal";
import { showSnackbar } from "../snackbar";

const cooking = require("../../images/cooking.png");
const todo = require("../../images/to_do.png");
const whatToWear = require("../../images/whatToWear.png");
const headerBg = require("../../images/product_card_header_bg.png");

const NavOptionsButton = ({ addImageText }) => (
  <TouchableOpacity
    style={{
      ...Platform.select({
        ios: {
          paddingLeft: 15
        },
        android: {
          position: "absolute",
          top: 5,
          right: 4,
          width: 30,
          height: 30,
          alignItems: "center",
          justifyContent: "flex-end"
        }
      })
    }}
    onPress={() =>
      Navigation.handleDeepLink({ link: "what-to-nav-options-btn" })
    }
  >
    <Icon name="md-more" size={30} color={colors.pinkishOrange} />
  </TouchableOpacity>
);

Navigation.registerComponent("WhatToOptionsButton", () => NavOptionsButton);

class DishCalendarScreen extends Component {
  static navigatorStyle = {
    tabBarHidden: true,
    drawUnderNavBar: true,
    navBarTranslucent: Platform.OS === "ios",
    navBarTransparent: true,
    navBarBackgroundColor: "#fff",
    topBarElevationShadowEnabled: false
  };

  static navigatorButtons = {
    rightButtons: [
      {
        component: "WhatToOptionsButton"
      }
    ]
  };

  state = {
    isScreenVisible: true,
    image: cooking,
    text: "",
    date: moment().format("YYYY-MM-DD"),
    items: [],
    selectedItemIds: [],
    isLoading: false
  };

  componentDidMount() {
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    const { type } = this.props;
    let title = "What to Cook";
    let text = "Select Dishes that you like";
    let image = cooking;
    switch (type) {
      case EASY_LIFE_TYPES.WHAT_TO_DO:
        title = "What to Do";
        text = "Select items that you would like to do";
        image = todo;
        break;
      case EASY_LIFE_TYPES.WHAT_TO_WEAR:
        title = "What to Wear";
        text = "Select items that you would like to wear";
        image = whatToWear;
        break;
    }

    this.setState({
      image,
      text
    });

    this.props.navigator.setTitle({
      title
    });
  }

  onNavigatorEvent = event => {
    switch (event.id) {
      case "didAppear":
        this.setState({ isScreenVisible: true });
        this.fetchItems();
      // case "didDisappear":
      //   console.log("willDisappear");
      //   this.setState({ isScreenVisible: false });
      //   this.isScreenVisible = false;
    }
    if (event.type == "DeepLink") {
      if (event.link == "what-to-nav-options-btn") {
        this.editOptions.show();
      }
    }
  };

  handleScroll = event => {
    console.log("this.state.isScreenVisible: ", this.state.isScreenVisible);
    if (!this.state.isScreenVisible) {
      return;
    }
    if (event.nativeEvent.contentOffset.y > 0) {
      this.props.navigator.setStyle({
        navBarTransparent: false,
        navBarBackgroundColor: "#fff",
        ...Platform.select({
          ios: {},
          android: {
            topBarElevationShadowEnabled: true
          }
        })
      });
    } else {
      this.props.navigator.setStyle({
        navBarTransparent: true,
        navBarBackgroundColor: "transparent",
        ...Platform.select({
          ios: {},
          android: {
            topBarElevationShadowEnabled: false
          }
        })
      });
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

      switch (this.props.type) {
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

      this.setState(newState, () => {
        if (this.state.items.length == 0) {
          this.showCreateListAlert();
        }
      });
    } catch (e) {
    } finally {
      this.setState({
        isLoading: false
      });
    }
  };

  showCreateListAlert = () => {
    let listName = "dishes";
    if (this.props.type == EASY_LIFE_TYPES.WHAT_TO_DO) {
      listName = "to-do";
    } else if (this.props.type == EASY_LIFE_TYPES.WHAT_TO_WEAR) {
      listName = "wearables";
    }
    Alert.alert(
      "Create List First",
      `You don't have any items in your ${listName} list, please create your list first`,
      [
        {
          text: "Create Your List",
          onPress: this.goToEditScreen,
          style: "cancel"
        },
        {
          text: "Go Back",
          onPress: () => {
            this.props.navigator.pop();
          }
        }
      ]
    );
  };

  toggleItemSelect = async item => {
    let newSelectedItemIds = [...this.state.selectedItemIds];
    const idx = newSelectedItemIds.indexOf(item.id);

    this.setState({ isLoading: true });
    try {
      if (idx > -1) {
        await removeMealForADate({ mealId: item.id, date: this.state.date });
        newSelectedItemIds.splice(idx, 1);
      } else {
        await addMealForADate({ mealId: item.id, date: this.state.date });
        newSelectedItemIds.push(item.id);
      }

      this.setState({
        selectedItemIds: newSelectedItemIds
      });
    } catch (e) {
      showSnackbar({ text: e.message });
    } finally {
      this.setState({
        isLoading: false
      });
    }
  };

  onAddNewPress = () => {
    const { type } = this.props;
    switch (type) {
      case EASY_LIFE_TYPES.WHAT_TO_COOK:
        this.WhatToListModal.show();
        break;
      case EASY_LIFE_TYPES.WHAT_TO_DO:
        // this.cloathesImageUploader.showActionSheet();
        break;
      case EASY_LIFE_TYPES.WHAT_TO_WEAR:
        this.cloathesImageUploader.showActionSheet();
        break;
    }
  };

  addItems = items => {
    this.setState(
      {
        items: [...items, ...this.state.items],
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

  goToEditScreen = () => {
    const { items } = this.state;
    this.setState(
      {
        isScreenVisible: false
      },
      () => {
        this.props.navigator.push({
          screen: SCREENS.WHAT_TO_LIST_SCREEN,
          passProps: {
            type: this.props.type,
            stateId: items.length > 0 ? items[0].state_id : null
          }
        });
      }
    );
  };

  handleEditOptionPress = index => {
    const { type } = this.props;
    switch (index) {
      case 0:
        this.goToEditScreen();
        break;
    }
  };

  render() {
    const { isLoading, date, image, text, items, selectedItemIds } = this.state;
    return (
      <ScreenContainer style={styles.container}>
        <ScrollView
          onScroll={this.handleScroll}
          ref={ref => (this.scrollView = ref)}
        >
          <View style={styles.header}>
            <Image style={styles.headerBg} source={headerBg} />
            <Image style={styles.image} source={image} />

            <View style={styles.dateSelector}>
              <DateSelector
                date={date}
                onRightArrowPress={this.nextDate}
                onLeftArrowPress={this.previousDate}
              />
            </View>
          </View>
          <View style={styles.body}>
            <Text style={styles.titleText}>{text}</Text>
            {items.map((item, index) => {
              const isChecked = selectedItemIds.indexOf(item.id) > -1;
              let rightText = "";
              if (item.current_date) {
                const diff = moment()
                  .startOf("day")
                  .diff(moment(item.current_date).startOf("day"), "days");

                if (!diff) {
                  rightText = "Today";
                } else if (diff == 1) {
                  rightText = "Yesterday";
                } else if (diff == -1) {
                  rightText = "Tomorrow";
                } else if (diff > 1) {
                  rightText = `${diff} days ago`;
                } else if (diff < -1) {
                  rightText = moment(item.current_date).format("DD MMM, YYYY");
                }
              }
              return (
                <View key={item.id} style={styles.item}>
                  <EasyLifeItem
                    showCheckbox={false}
                    text={item.name}
                    rightText={rightText}
                    isChecked={isChecked}
                    onPress={() => this.toggleItemSelect(item)}
                  />
                </View>
              );
            })}
            <AddNewBtn
              style={{ margin: 5 }}
              text={"Add New Item"}
              onPress={this.onAddNewPress}
            />
            <CloathesImageUploader
              ref={ref => (this.cloathesImageUploader = ref)}
              navigator={navigator}
            />
            <WhatToListModal
              ref={ref => (this.WhatToListModal = ref)}
              navigator={this.props.navigator}
              addItems={this.addItems}
              stateId={items.length > 0 ? items[0].state_id : null}
            />
          </View>
        </ScrollView>
        <ActionSheet
          onPress={this.handleEditOptionPress}
          ref={o => (this.editOptions = o)}
          cancelButtonIndex={1}
          options={["Edit List", "Cancel"]}
        />
        <LoadingOverlay visible={isLoading} />
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0
  },
  header: {
    alignItems: "center"
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
    color: "#9b9b9b",
    marginBottom: 10
  },
  item: {
    marginBottom: 5
  }
});

export default DishCalendarScreen;