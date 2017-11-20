import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  FlatList,
  Image,
  Alert,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import { Dropdown } from "react-native-material-dropdown";
import { actions as loggedInUserActions } from "../modules/logged-in-user";
import { getBrands, getCategories } from "../api";
import { Text, Button, ScreenContainer } from "../elements";

const bgImage = require("../images/ic_asc_bg_image.jpg");

class AscScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true
  };
  constructor(props) {
    super(props);
    this.state = {
      brandOptions: [],
      productOptions: [],
      selectedBrandId: null,
      selectedProductId: null
    };
  }
  async componentDidMount() {
    try {
      const res = await getBrands();
      const brandOptions = res.brands.map(brand => {
        return {
          value: String(brand.id),
          label: brand.brandName
        };
      });
      this.setState({
        brandOptions
      });
    } catch (e) {
      Alert.alert(e.message);
    }
  }

  onSelectBrand = async brandId => {
    this.setState({
      productOptions: [],
      selectedBrandId: brandId,
      selectedProductId: null
    });
    try {
      const res = await getCategories(brandId);
      const productOptions = res.categories.map(product => {
        return {
          value: String(product.category_id),
          label: product.category_name
        };
      });
      this.setState({
        productOptions
      });
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  onProductOptionsFocus = () => {
    Alert.alert("Please select brand first");
    if (!this.state.selectedBrandId) {
      Alert.alert("Please select brand first");
    }
  };

  onSelectProduct = productId => {
    this.setState({
      selectedProductId: productId
    });
  };

  startSearch = () => {
    Alert.alert(
      this.state.selectedBrandId + " - " + this.state.selectedProductId
    );
  };

  renderCategoryItem = ({ item }) => <CategoryItem {...item} />;
  render() {
    return (
      <ScreenContainer style={{ padding: 0, backgroundColor: "#fafafa" }}>
        <View style={{ flex: 1 }}>
          <Image
            style={{
              position: "absolute",
              width: "100%",
              height: "100%"
            }}
            resizeMode="cover"
            source={bgImage}
          />
          <View style={styles.titlesContainer}>
            <Text weight="Medium" style={styles.title}>
              Authorised Service Centres
            </Text>
            <Text weight="Medium" style={styles.subTitle}>
              Get your device serviced by certified professionals
            </Text>
          </View>
        </View>
        <View style={{ flex: 1, padding: 20, alignContent: "center" }}>
          <Dropdown
            onChangeText={this.onSelectBrand}
            rippleOpacity={0}
            label="Select Brand"
            data={this.state.brandOptions}
          />
          <TouchableOpacity onPress={this.onProductOptionsFocus}>
            <Dropdown
              onChangeText={this.onSelectProduct}
              rippleOpacity={0}
              label="Select Product"
              data={this.state.productOptions}
            />
          </TouchableOpacity>
          <Button
            onPress={this.startSearch}
            style={{ marginTop: 20, width: "100%" }}
            text="Search Now"
            color="secondary"
          />
        </View>
      </ScreenContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    authToken: state.loggedInUser.authToken
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTestClick: () => {
      dispatch(loggedInUserActions.setLoggedInUserAuthToken(null));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AscScreen);

const styles = StyleSheet.create({
  titlesContainer: {
    position: "absolute",
    bottom: 30,
    width: "100%"
  },
  title: {
    color: "#fff",
    fontSize: 24,
    textAlign: "center"
  },
  subTitle: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 30
  }
});
