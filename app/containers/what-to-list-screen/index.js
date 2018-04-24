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
    selectedItemIds: [],
    items: [],
    states: [],
    isVeg: false,
    placeholderText: 'Select State',
    selectedState: null
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
    this.loadStates();
  }

  loadStates = async () => {
    try {
      const res = await fetchStates();
      this.setState({
        states: res.states
      });
    } catch (e) { }
  };
  selectCategory = async (value) => {
    this.setState({
      placeholderText: value.state_name,
      selectedState: value
    })
    try {
      const res = await fetchStateMeals({ stateId: value.id, isVeg: this.state.isVeg });
      console.log(res);
      this.setState({ items: res.mealList })
    } catch (e) { }
  }
  showCloathesImageUploader = () => {
    // this.cloathesImageUploader.showActionSheet();
    this.WhatToListModal.show();
  };
  getItemDetails = item => {
    this.setState({ items: [...this.state.items, item] }, () => {
      console.log(this.state.items);
    });
  };
  removeItem = item => {
    // const index = this.state.items.indexOf(item);
    // console.log(index);
    // this.setState({
    //   items: this.state.items.splice(index, 1)
    // })
    //  this.setState
  };
  addItemsToMyList = () => { };
  toggleVegOrNonveg = () => {
    this.setState({
      isVeg: this.state.isVeg ? false : true
    }, () => {
      this.selectCategory(this.state.selectedState)
    });
  };
  render() {
    const { type } = this.props;
    const { placeholderText, items, image, text, selectedItemIds, btnText, isVeg } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <ScreenContainer>
          {type == EASY_LIFE_TYPES.WHAT_TO_COOK && (
            <View style={{ padding: 5 }}>
              <SelectModal
                placeholder={placeholderText}
                placeholderRenderer={({ placeholder }) => (
                  <Text weight="Bold">{placeholder}</Text>
                )}
                options={this.state.states}
                valueKey="id"
                visibleKey="state_name"
                hideAddNew={true}
                onOptionSelect={value => {
                  this.selectCategory(value);
                }}
              />
              <View style={styles.checkboxWrapper}>
                <TouchableOpacity
                  style={styles.box}
                  onPress={this.toggleVegOrNonveg}>
                  {isVeg && <Icon
                    name="md-checkmark"
                    color={colors.pinkishOrange}
                    size={15}
                  />}</TouchableOpacity><Text> Veg Only</Text></View>
            </View>
          )}
          {items.length <= 0 && (
            <View style={styles.container}>
              <Image style={styles.whatToWearImage} source={image} />
              <Text weight="Medium" style={styles.whatToWearText}>
                {text}
              </Text>
            </View>
          )}
          {items.length > 0 && (
            <ScrollView style={styles.body}>
              {items.map((item, index) => {
                return (
                  <View key={item.id}>
                    <EasyLifeItem
                      showCheckbox={false}
                      text={item.meal_name}
                      imageUri={item.url}
                      showRemoveBtn={false}
                      onRemoveBtnPress={() => this.removeItem(item)}
                    />
                  </View>
                );
              })}
            </ScrollView>
          )}
          <View>
            <AddNewBtn
              text={btnText}
              onPress={this.showCloathesImageUploader}
            />
          </View>
          <CloathesImageUploader
            ref={ref => (this.cloathesImageUploader = ref)}
            navigator={navigator}
            addImageDetails={this.getItemDetails}
          />
          <WhatToListModal
            ref={ref => (this.WhatToListModal = ref)}
            navigator={this.props.navigator}
            addDetails={this.getItemDetails}
          />
        </ScreenContainer>
        {items.length > 0 && (
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
    // backgroundColor: 'yellow',
    width: 150,
    flexDirection: 'row'
  },
  whatToWearImage: {
    height: 70,
    width: 70,
    alignItems: "center",
    alignSelf: "center"
  },
  whatToWearText: {
    fontSize: 14,
    color: "#9b9b9b"
  },
  body: {
    flex: 1
  },
  addItemBtn: {
    width: "100%"
    // backgroundColor: 'green',
  },
  box: {
    borderColor: colors.secondaryText,
    borderWidth: 1,
    height: 20,
    width: 20,
    alignItems: 'center'
  }
});

export default WhatToListScreen;
