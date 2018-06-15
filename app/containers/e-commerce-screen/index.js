import React, { Component } from "react";
import {
  StyleSheet
} from "react-native";
import Amazon from "./amazon";
import Flipkart from "./flipkart";
class EcommerceScreen extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    console.log(this.props)
  }
  render() {
    const item = this.props.navigation.getParam("item", null);
    if (item.seller == 'amazonIn') {
      return <Amazon navigation={this.props.navigation} item={item} />;
    } else {
      return <Flipkart navigation={this.props.navigation} item={item} />;
    }
  }
}

const styles = StyleSheet.create({});

export default EcommerceScreen;
