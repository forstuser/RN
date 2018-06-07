import React, { Component } from "react";
import {
  View,
  WebView,
  FlatList,
  Alert,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Linking,
  Platform
} from "react-native";
import { ActionSheetCustom as ActionSheet } from "react-native-actionsheet";

import { API_BASE_URL } from "../../api";
import { ScreenContainer, Text, Button, Image } from "../../elements";
import { colors } from "../../theme";
import { showSnackbar } from "../../utils/snackbar";

class Amazon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "https://www.amazon.in",
      orderId: null
    };
  }

  componentDidMount() {
    console.log(this.props);
    this.setState({
      url: this.props.item.url
    });
  }

  onWebViewMessage = event => {
    console.log("event.nativeEvent.data: ", event.nativeEvent.data);
    this.setState({
      url:
        "https://www.amazon.in/gp/aw/ya/ref=typ_rev_edit?ie=UTF8&ac=os&oid=" +
        event.nativeEvent.data,
      orderId: true
    });
  };
  onGetDataMessage = event => {
    console.log("event.nativeEvent.data: ", event.nativeEvent.data);
    this.setState({
      orderId: false,
      url: "https://www.amazon.in"
    });
  };

  render() {
    const { orderId } = this.state;
    let dirtyScript = ` (function(){
            // alert("Working");
             var _url = window.location.href;
             var regexp =  /.*\orderId=(.*?)\&/;
            if(regexp){
                var orderId = _url.match(regexp)[1];
                window.postMessage(orderId);
            }
        })()`;
    let scrapData = `
        (function(){
            alert("scrap data");
            var data = document.getElementsByClassName("a-section a-padding-medium")[0].innerText;
            if(data){
                window.postMessage(data);
            }
        })()`;
    return (
      <ScreenContainer style={styles.container}>
        <WebView
          injectedJavaScript={orderId ? scrapData : dirtyScript}
          scrollEnabled={false}
          source={{ uri: this.state.url }}
          onMessage={orderId ? this.onGetDataMessage : this.onWebViewMessage}
        />
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0
  },
  WebViewStyle: {
    justifyContent: "center",
    alignItems: "center"
    // flex: 1
    // marginTop: Platform.OS === "ios" ? 20 : 0
  }
});

export default Amazon;
