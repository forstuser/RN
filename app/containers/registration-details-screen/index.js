import React from "react";
import { StyleSheet, View } from "react-native";

import {
  Text,
  Image,
  Button,
  ScreenContainer,
  TextInput
} from "../../elements";

import binbillImage from "../../images/binbill_logo.png";
import bgImage from "../../images/background1.png";
import { colors } from "../../theme";
export default class RegistrationDetails extends React.Component {
  static navigationOptions = {
    header: null
  };
  state = {
    name: "",
    email: "",
    phone: "",
    location: ""
  };
  render() {
    const { name, email, phone, location } = this.state;
    return (
      <ScreenContainer style={styles.container}>
        <Image style={styles.bg} source={bgImage} resizeMode="cover" />
        <View style={{ flex: 1, padding: 16, alignItems: "center" }}>
          <Image
            style={styles.logo}
            source={binbillImage}
            resizeMode="contain"
          />
          <Text weight="Bold" style={styles.welcome}>
            Welcome
          </Text>
          <Text style={styles.title}>Help us Manage your Home better!</Text>

          <TextInput
            value={name}
            placeholder="Full Name"
            leftIconName="ios-person-outline"
            onChangeText={name => this.setState({ name })}
          />

          <TextInput
            value={email}
            placeholder="Email Id"
            leftIconName="ios-mail-outline"
            onChangeText={email => this.setState({ email })}
          />

          <TextInput
            value={phone}
            placeholder="Mobile Number"
            leftIconName="ios-phone-portrait"
            onChangeText={phone => this.setState({ phone })}
          />

          <TextInput
            value=""
            placeholder="Enter Your Location"
            leftIconName="ios-pin-outline"
          />

          <Button
            text="NEXT"
            color="secondary"
            style={{ width: "100%", height: 40, marginTop: 30 }}
          />
        </View>
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0
  },
  bg: {
    position: "absolute",
    width: "100%",
    height: "100%"
  },
  logo: {
    marginTop: 40,
    marginBottom: 20,
    width: 95,
    height: 95
  },
  welcome: {
    fontSize: 18,
    color: colors.pinkishOrange
  },
  title: {
    color: "#5b5b5b",
    marginBottom: 30
  }
});
