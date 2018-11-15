import React from "react";
import { View, Text, ActivityIndicator } from "react-native";

class Loader extends React.Component {
  static navigationOptions = {
    header: null
  };
  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff"
        }}
      >
        <ActivityIndicator size="large" />
        <Text>Please Wait...</Text>
      </View>
    );
  }
}

export default Loader;
