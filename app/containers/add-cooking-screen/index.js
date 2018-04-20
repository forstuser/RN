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
import { SCREENS } from "../../constants";
import { colors, defaultStyles } from "../../theme";
import SelectModal from "../../components/select-modal";
import ScrollableTabView from "react-native-scrollable-tab-view";
import EasyLifeItem from "../../components/easy-life-item";
const cooking = require("../../images/cooking.png");

class AddCookingScreen extends Component {
  static navigatorStyle = {
    tabBarHidden: true
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      states: [
        { name: "delhi", id: 1 },
        { name: "hariyana", id: 2 },
        { name: "up", id: 3 },
        { name: "uk", id: 4 }
      ],
      dishes: [
        { name: "bread", id: 1 },
        { name: "butter", id: 2 },
        { name: "poha", id: 3 },
        { name: "bread", id: 1 },
        { name: "butter", id: 2 },
        { name: "poha", id: 3 },
        { name: "bread", id: 1 },
        { name: "butter", id: 2 },
        { name: "poha", id: 3 },
        { name: "bread", id: 1 },
        { name: "butter", id: 2 },
        { name: "poha", id: 3 },
        { name: "bread", id: 1 },
        { name: "butter", id: 2 },
        { name: "poha", id: 3 }
      ],
      selectedDishesIds: []
    };
  }

  componentDidMount() {
    this.props.navigator.setTitle({
      title: "What to Cook"
    });
    // this.loadStates();
  }

  selectStates = states => {
    this.setState({
      categoryTextInput: "",
      isCategoriesModalVisible: false,
      selectedCategory: category
    });
  };
  // loadStates() {
  //   this.setState({
  //     states
  //   });
  // }

  next = () => {
    this.props.navigator.push({
      screen: SCREENS.DISH_CALENDAR_SCREEN
    });
  };
  render() {
    const { loading, states, dishes } = this.state;
    alert(JSON.stringify(dishes));
    return (
      <ScreenContainer style={styles.container}>
        <View style={{ padding: 20 }}>
          <SelectModal
            style={styles.dropdown}
            placeholder="Select State"
            placeholderRenderer={({ placeholder }) => (
              <Text weight="Bold">{placeholder}</Text>
            )}
            options={this.state.states}
            valueKey="id"
            visibleKey="name"
            hideAddNew={true}
            // onOptionSelect={value => {
            //   this.selectCategory(value);
            // }}
          />
        </View>
        {/* if condition
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 40
            }}
          >
            <Image
              style={{ height: 72, width: 72, marginBottom: 40 }}
              source={cooking}
            />
            <Text style={styles.dishType}>Select Dishes that you like</Text>
          </View> */}

        <View style={{ marginTop: 20 }}>
          <Text style={styles.dishType}>Select Dishes that you like</Text>
        </View>
        {dishes.map((item, key) => (
          <ScrollView>
            <View>
              <Text key={key} style={styles.TextStyle}>
                {item.name}
              </Text>
            </View>
          </ScrollView>
        ))}

        <View style={{ padding: 20 }}>
          <EasyLifeItem
            text="Dish Name"
            bottomText="Today"
            showCheckbox={false}
            isChecked={true}
            imageUri="https://weddinginventory.co.za/wp-content/uploads/Cupid-Dresses-Bridal-Dress-Hire-Bothasig-Cape-Town-14-256x256.jpg"
          />
        </View>

        <TouchableOpacity>
          <View style={{ marginTop: 20, padding: 20 }}>
            <Text style={styles.addDish}>+ Add new Dish</Text>
          </View>
        </TouchableOpacity>

        <Button
          onPress={this.next}
          text="NEXT"
          color="secondary"
          borderRadius={0}
          style={styles.addItemBtn}
        />
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0
  },
  dishType: {
    textAlign: "center",
    fontSize: 14,
    color: "#9b9b9b",
    fontFamily: "Quicksand-Medium"
  },
  addDish: {
    borderRadius: 4,
    textAlign: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#d6d7da",
    height: 45,
    paddingTop: 10
  },
  addItemBtn: {
    width: "100%",
    position: "absolute",
    bottom: 0
  }
});

export default AddCookingScreen;
