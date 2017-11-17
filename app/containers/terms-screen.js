import React, { Component } from "react";
import { ScreenContainer, Text, Button } from "../elements";
import I18n from "../i18n";

class TermsScreen extends Component {
  componentDidMount() {
    this.props.navigator.setTitle({
      title: "Terms of Use"
    });
  }
  render() {
    return (
      <ScreenContainer>
        <Text>{I18n.t("terms_of_use")}</Text>
      </ScreenContainer>
    );
  }
}

export default TermsScreen;
