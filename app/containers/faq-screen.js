import React, { Component } from "react";
import { Platform, StyleSheet, View, FlatList, Alert } from "react-native";
import { API_BASE_URL, consumerGetEhome } from "../api";
import { Text, Button, ScreenContainer } from "../elements";
import Collapsible from "./../components/collapsible";
import I18n from "../i18n";

class FaqScreen extends Component {
  static navigatorStyle = {
    tabBarHidden: true
  };
  constructor(props) {
    super(props);
    this.state = {
      faqs: [
        {
          question: I18n.t("faq_question_1"),
          answer: I18n.t("faq_answer_1")
        },
        {
          question: I18n.t("faq_question_2"),
          answer: I18n.t("faq_answer_2")
        },
        {
          question: I18n.t("faq_question_3"),
          answer: I18n.t("faq_answer_3")
        },
        {
          question: I18n.t("faq_question_4"),
          answer: I18n.t("faq_answer_4")
        },
        {
          question: I18n.t("faq_question_5"),
          answer: I18n.t("faq_answer_5")
        },
        {
          question: I18n.t("faq_question_6"),
          answer: I18n.t("faq_answer_6")
        },
        {
          question: I18n.t("faq_question_7"),
          answer: I18n.t("faq_answer_7")
        },
        {
          question: I18n.t("faq_question_8"),
          answer: I18n.t("faq_answer_8")
        },
        {
          question: I18n.t("faq_question_9"),
          answer: I18n.t("faq_answer_9")
        },
        {
          question: I18n.t("faq_question_10"),
          answer: I18n.t("faq_answer_10")
        },
        {
          question: I18n.t("faq_question_11"),
          answer: I18n.t("faq_answer_11")
        },
        {
          question: I18n.t("faq_question_12"),
          answer: I18n.t("faq_answer_12")
        },
        {
          question: I18n.t("faq_question_13"),
          answer: I18n.t("faq_answer_13")
        },
        {
          question: I18n.t("faq_question_14"),
          answer: I18n.t("faq_answer_14")
        },
        {
          question: I18n.t("faq_question_15"),
          answer: I18n.t("faq_answer_15")
        }
      ]
    };
  }
  componentDidMount() {
    this.props.navigator.setTitle({
      title: I18n.t("faq_screen_title")
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
export default FaqScreen;
