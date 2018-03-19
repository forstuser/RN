import React from "react";
import { StyleSheet, View, Image, TouchableOpacity, Alert } from "react-native";

import ActionSheet from "react-native-actionsheet";

import I18n from "../i18n";
import { LANGUAGES } from "../constants";
import { Text, Button } from "../elements";
import { colors } from "../theme";
import { SCREENS } from "../constants";

class LanguageOptions extends React.Component {
  show = () => {
    this.languageOptions.show();
  };

  onLanguageOptionPress = index => {
    if (index < LANGUAGES.length) {
      const language = LANGUAGES[index];
      Alert.alert(
        I18n.t("language_options_confirm_msg_title", {
          languageName: language.name
        }),
        I18n.t("language_options_confirm_msg_desc"),
        [
          {
            text: I18n.t("language_options_change"),
            onPress: () => this.props.onLanguageChange(language)
          },
          {
            text: I18n.t("language_options_dont_change"),
            onPress: () => console.log("Cancel Pressed")
          }
        ]
      );
    }
  };

  render() {
    return (
      <ActionSheet
        onPress={this.onLanguageOptionPress}
        ref={o => (this.languageOptions = o)}
        cancelButtonIndex={LANGUAGES.length}
        options={[...LANGUAGES.map(language => language.name), "Cancel"]}
      />
    );
  }
}

export default LanguageOptions;
