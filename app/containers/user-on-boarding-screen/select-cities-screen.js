import React, { Component } from "react";
import {
  Dimensions,
  ScrollView,
  View,
  Image,
  TouchableOpacity
} from "react-native";

import { Text, TextInput, Button } from "../../elements";
import { SCREENS } from "../../constants";
import LoadingOverlay from "../../components/loading-overlay";
import { updateProfile } from "../../api";
import Snackbar from "../../utils/snackbar";
import { defaultStyles, colors } from "../../theme";
import DelhiImage from "../../images/cities/delhi.png";
import GurgaonImage from "../../images/cities/gurgaon.png";
import NoidaImage from "../../images/cities/noida.png";
import GreaterNoidaImage from "../../images/cities/greater-noida.png";
import GhaziabadImage from "../../images/cities/ghaziabad.png";
import FaridabadImage from "../../images/cities/faridabad.png";
import OtherCityImage from "../../images/cities/other.png";
import Analytics from "../../analytics";
const deviceWidth = Dimensions.get("window").width;

class SelectCitiesScreen extends Component {
  static navigationOptions = {
    title: "Select City you live in"
  };

  constructor(props) {
    super(props);
    this.state = {
      location: "",
      isLoading: false,
      error: null,
      cities: [
        {
          id: 1,
          name: "Delhi",
          imageUrl: DelhiImage
        },
        {
          id: 2,
          name: "Gurgaon",
          imageUrl: GurgaonImage
        },
        {
          id: 3,
          name: "Noida",
          imageUrl: NoidaImage
        },
        {
          id: 4,
          name: "Greater Noida",
          imageUrl: GreaterNoidaImage
        },
        {
          id: 5,
          name: "Ghaziabad",
          imageUrl: GhaziabadImage
        },
        {
          id: 6,
          name: "Faridabad",
          imageUrl: FaridabadImage
        },
        {
          id: 7,
          name: "Other",
          imageUrl: OtherCityImage
        }
      ]
    };
  }

  onCityPressed = city => {
    this.setState({
      location: city
    });
  };

  onSubmitPressed = async () => {
    Analytics.logEvent(Analytics.EVENTS.REGISTRATION_CITY);
    this.setState({ isLoading: true });
    if (this.state.location === "") {
      this.setState({ isLoading: false });
      return Snackbar.show({
        title: "Please Select Location",
        duration: Snackbar.LENGTH_SHORT
      });
    }
    try {
      const res = await updateProfile({
        location: this.state.location
      });
    } catch (e) {
      console.log("e: ", e);

      Snackbar.show({
        title: e.message,
        duration: Snackbar.LENGTH_SHORT
      });
    } finally {
      this.setState({ isLoading: false });
    }

    this.props.navigation.navigate(SCREENS.APP_STACK);
  };

  render() {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {this.state.cities.map(city => (
              <View style={styles.city}>
                <TouchableOpacity onPress={() => this.onCityPressed(city.name)}>
                  <Image
                    style={
                      this.state.location !== city.name
                        ? [styles.imageIcon]
                        : [styles.imageIcon, styles.selectedCity]
                    }
                    source={city.imageUrl}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <Text
                  weight="Bold"
                  style={{ marginTop: 10, fontSize: 16, textAlign: "center" }}
                >
                  {city.name}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
        <Button
          style={{ margin: 10 }}
          text="Submit"
          onPress={this.onSubmitPressed}
          color="secondary"
          textStyle={{ fontSize: 20 }}
        />
        <LoadingOverlay visible={this.state.isLoading} />
      </ScrollView>
    );
  }
}

const styles = {
  imageIcon: {
    height: 90,
    width: 90,
    borderRadius: 90,
    borderWidth: 1
  },
  city: {
    width: deviceWidth / 2,
    height: deviceWidth / 2,
    justifyContent: "center",
    alignItems: "center"
  },
  selectedCity: {
    borderColor: "#000",
    borderRadius: 90
  }
};

export default SelectCitiesScreen;
