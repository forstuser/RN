import React, { Component } from "react";
import { Platform, StyleSheet, View, FlatList, Alert } from "react-native";
import { API_BASE_URL, consumerGetEhome } from "../api";
import { Text, Button, ScreenContainer } from "../elements";
import Collapsible from "./../components/collapsible";

class AddProductsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.navigator.setTitle({
      title: "Add Products"
    });
  }

  render() {
    return (
      <ScreenContainer style={styles.contain}>
        <FlatList
          data={this.state.faqs}
          keyExtractor={(item, index) => index}
          renderItem={({ item }) => (
            <Collapsible headerText={item.question} weight="Medium">
              <Text style={styles.text}>{item.answer}</Text>
            </Collapsible>
          )}
        />
      </ScreenContainer>
    );
  }
}
const styles = StyleSheet.create({
  contain: {
    fontSize: 14,
    padding: 0
  },
  text: {
    padding: 12,
    fontSize: 14,
    color: "#3b3b3b"
  }
});
export default AddProductsScreen;
