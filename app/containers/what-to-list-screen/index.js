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
import I18n from "../../i18n";
import { API_BASE_URL } from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";
import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";
import Analytics from "../../analytics";
import { SCREENS, EASY_LIFE_TYPES } from "../../constants";
import { colors, defaultStyles } from "../../theme";
import AddNewBtn from "../../components/add-new-btn";
import CloathesImageUploader from "../../components/easy-life-items/cloathes-image-uploader"
import EasyLifeItem from "../../components/easy-life-item";

const cooking = require("../../images/cooking.png");
const todo = require("../../images/to_do.png");
const whatToWear = require("../../images/whatToWear.png");
const headerBg = require("../../images/product_card_header_bg.png");

class WhatToListScreen extends Component {
  static navigatorStyle = {
    tabBarHidden: true,
  };
  state = {
    text: "",
    btnText: "",
    image: cooking,
    selectedItemIds: [],
    items: []
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

  }

  showCloathesImageUploader = () => {
    this.cloathesImageUploader.showActionSheet();
  }
  getItemDetails = (item) => {
    this.setState({ items: [...this.state.items, item] }, () => {
      console.log(this.state.items)
    });
  }
  onItemPress = item => {
    this.setState({ selectedItemIds: [...this.state.selectedItemIds, item.id] }, () => {
      console.log(this.state.selectedItemIds)
    });

  };

  render() {
    const { items, image, text, selectedItemIds, btnText } = this.state;
    return (
      <ScreenContainer>
        {items.length <= 0 &&
          <View style={styles.container}>
            <Image style={styles.whatToWearImage} source={image} />
            <Text weight="Medium" style={styles.whatToWearText}>{text}</Text>
          </View>
        }
        {items.length > 0 && <ScrollView style={styles.body}>
          {items.map((item, index) => {
            const isChecked = selectedItemIds.indexOf(item.id) > -1;
            return (
              <View key={item.id}>
                <EasyLifeItem
                  showCheckbox={true}
                  text={item.name}
                  imageUri={item.url}
                  isChecked={isChecked}
                  onPress={() => this.onItemPress(item)}
                />
              </View>)
          })}
        </ScrollView>}
        <View style={styles.addNewBtn}>
          <AddNewBtn text={btnText} onPress={this.showCloathesImageUploader}></AddNewBtn>
        </View>
        <CloathesImageUploader
          ref={ref => (this.cloathesImageUploader = ref)}
          navigator={navigator}
          addImageDetails={this.getItemDetails}
        />
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whatToWearImage: {
    height: 70,
    width: 70,
    alignItems: 'center',
    alignSelf: 'center'
  },
  whatToWearText: {
    fontSize: 14,
    color: '#9b9b9b',
  },
  body: {
    flex: 1
  },
  addNewBtn: {
    padding: 8
  }
});

export default WhatToListScreen;
