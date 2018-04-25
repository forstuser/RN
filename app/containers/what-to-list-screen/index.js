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
import { fetchStates, fetchStateMeals } from "../../api";
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

const cooking = require("../../images/cooking.png");
const todo = require("../../images/to_do.png");
const whatToWear = require("../../images/whatToWear.png");
const headerBg = require("../../images/product_card_header_bg.png");

class WhatToListScreen extends Component {
  static navigatorStyle = {
    tabBarHidden: true
  };
  state = {
    text: "",
    btnText: "",
    image: cooking,
    systemItems: [],
    userCreatedItems: [],
    selectedSystemItemIds: [],
    selectedUserCreatedItemIds: [],
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
      case EASY_LIFE_TYPES.WHAT_TO_DO: // WHAT_TO_DO = 2
        title = "What to Do";
        text = "Select items that you would like to do";
        image = todo;
        btnText = "Add a New To Do Item";
        break;
      case EASY_LIFE_TYPES.WHAT_TO_WEAR: // WHAT_TO_WEAR = 3
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
        this.loadStateMeals();
      }
    );
  };

  loadStateMeals = async () => {
    this.setState({
      isLoading: true
    });
    try {
      const res = await fetchStateMeals({
        stateId: this.state.selectedState.id,
        isVeg: this.state.isVeg
      });
      console.log(res);
      this.setState({
        systemItems: res.mealList,
        selectedSystemItemIds: res.mealList.map(meal => meal.id)
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
    this.setState(
      { userCreatedItems: [...this.state.userCreatedItems, item] },
      () => {
        console.log(this.state.userCreatedItems);
      }
    );
  };

  addNewItemModelShow = () => {
    // this.cloathesImageUploader.showActionSheet();
    this.WhatToListModal.show();
  };
  // cook and to do
  addItems = items => {
    console.log(items);
    this.setState(
      {
        userCreatedItems: [...this.state.userCreatedItems, ...items]
      },
      () => {
        console.log(this.state.userCreatedItems);
      }
    );
  };

  removeItem = item => {
    const index = this.state.userCreatedItems.indexOf(item);
    console.log(index);
    this.setState({
      userCreatedItems: this.state.userCreatedItems.splice(index, 1)
    });
  };

  toggleVegOrNonveg = () => {
    this.setState(
      {
        isVeg: !this.state.isVeg
      },
      () => {
        this.loadStateMeals();
      }
    );
  };

  toggleSystemItemSelect = id => {
    let newSelectedSystemItemIds = [...this.state.selectedSystemItemIds];
    const idx = newSelectedSystemItemIds.indexOf(id);
    if (idx > -1) {
      newSelectedSystemItemIds.splice(idx, 1);
    } else {
      newSelectedSystemItemIds.push(id);
    }
    this.setState({
      selectedSystemItemIds: newSelectedSystemItemIds
    });
  };
  toggleUserCreatedItemSelect = id => {};

  onItemPress = item => {
    this.setState(
      {
        selectedUserCreatedItemIds: [
          ...this.state.selectedUserCreatedItemIds,
          item.id
        ]
      },
      () => {
        console.log(this.state.selectedUserCreatedItemIds);
      }
    );
  };

  addItemsToMyList = () => {};

  render() {
    const { type } = this.props;
    const {
      image,
      text,
      systemItems,
      userCreatedItems,
      selectedSystemItemIds,
      selectedUserCreatedItemIds,
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
          {systemItems.length == 0 &&
            userCreatedItems.length == 0 && (
              <View style={styles.container}>
                <Image style={styles.blankPageImage} source={image} />
                <Text weight="Medium" style={styles.blankPageText}>
                  {text}
                </Text>
              </View>
            )}
          <ScrollView style={styles.body}>
            {systemItems.length > 0 &&
              systemItems.map((item, index) => {
                return (
                  <View key={index}>
                    <EasyLifeItem
                      showCheckbox={true}
                      text={item.name}
                      imageUri={item.url}
                      showRemoveBtn={false}
                      isChecked={selectedSystemItemIds.includes(item.id)}
                      onPress={() => this.toggleSystemItemSelect(item.id)}
                    />
                  </View>
                );
              })}
            {userCreatedItems.length > 0 &&
              userCreatedItems.map((item, index) => {
                return (
                  <View key={index}>
                    <EasyLifeItem
                      showCheckbox={true}
                      text={item.name}
                      imageUri={item.url}
                      showRemoveBtn={false}
                      isChecked={selectedUserCreatedItemIds.includes(item.id)}
                      onPress={() => this.toggleUserCreatedItemSelect(item.id)}
                      onRemoveBtnPress={() => this.removeItem(item)}
                    />
                  </View>
                );
              })}
          </ScrollView>
          <View style={styles.addNewBtn}>
            <AddNewBtn text={btnText} onPress={this.addNewItemModelShow} />
          </View>
          <CloathesImageUploader
            ref={ref => (this.cloathesImageUploader = ref)}
            navigator={navigator}
            addImageDetails={this.addItem}
          />
          <WhatToListModal
            ref={ref => (this.WhatToListModal = ref)}
            navigator={this.props.navigator}
            addItems={this.addItems}
            stateId={selectedState ? selectedState.id : null}
          />
        </ScreenContainer>

        {(systemItems.length > 0 || userCreatedItems.length) > 0 && (
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
