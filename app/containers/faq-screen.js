import React, { Component } from "react";
import { Platform, StyleSheet, View, FlatList, Alert } from "react-native";
import { API_BASE_URL, getFaqs } from "../api";
import { Text, Button, ScreenContainer } from "../elements";
import LoadingOverlay from "../components/loading-overlay";
import ErrorOverlay from "../components/error-overlay";
import Collapsible from "./../components/collapsible";
import I18n from "../i18n";

class FaqScreen extends Component {
  static navigationOptions = {
    title: I18n.t("faq_screen_title")
  };

  constructor(props) {
    super(props);
    this.state = {
      faqs: [],
      isLoading: true,
      error: null
    };
  }

  componentDidMount() {
    this.getFaqs();
  }

  getFaqs = async () => {
    this.setState({ isLoading: true, error: null });
    try {
      const res = await getFaqs();
      this.setState({
        faqs: res.faq
      });
    } catch (error) {
      console.log(error);
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    if (this.state.error) {
      return (
        <ErrorOverlay error={this.state.error} onRetryPress={this.getFaqs} />
      );
    }
    return (
      <ScreenContainer style={styles.contain}>
        <FlatList
          data={this.state.faqs}
          keyExtractor={(item, index) => index}
          ref={ref => (this.faqList = ref)}
          renderItem={({ item }) => (
            <Collapsible headerText={item.question} weight="Medium">
              <Text style={styles.text}>{item.answer}</Text>
            </Collapsible>
          )}
        />
        <LoadingOverlay visible={this.state.isLoading} />
      </ScreenContainer>
    );
  }
}
const styles = StyleSheet.create({
  contain: {
    padding: 0
  },
  text: {
    padding: 12,
    fontSize: 14,
    color: "#3b3b3b"
  }
});
export default FaqScreen;
