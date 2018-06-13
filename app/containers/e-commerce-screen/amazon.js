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
      orderId: null
    };
  }

  componentDidMount() {}

  onWebViewMessage = event => {
    console.log("event.nativeEvent.data: ", event.nativeEvent.data);
    this.setState({
      orderId: event.nativeEvent.data
    });
  };

  onGetDataMessage = event => {
    console.log("event.nativeEvent.data2: ", event.nativeEvent.data);
  };

  render() {
    const { orderId } = this.state;
    let dirtyScript = ` (function(){
      var _url = window.location.href;
      var regexp =  /.*\orderId=(.*?)\&/;
      var orderArray = _url.match(regexp);
      if(orderArray){
        var orderId = orderArray[1];
        alert(orderId);
        setTimeout(function() {
          window.postMessage(orderId,'*');
        }, 200);
      }
    })()`;
    let scrapData = `
    (function(){
      alert("scrap data");
      var data = document.getElementsByClassName("a-section a-padding-medium")[0].innerText;
      if(data){
          window.postMessage(data,'*');
      }
    })()`;
    return (
      <ScreenContainer style={styles.container}>
        {orderId ? (
          <WebView
            injectedJavaScript={scrapData}
            scrollEnabled={false}
            source={{
              uri: `https://www.amazon.in/gp/aw/ya/ref=typ_rev_edit?ie=UTF8&ac=os&oid=${orderId}`
            }}
            onMessage={this.onGetDataMessage}
          />
        ) : (
          <WebView
            injectedJavaScript={dirtyScript}
            scrollEnabled={false}
            source={{ uri: this.props.item.url }}
            onMessage={this.onWebViewMessage}
          />
        )}
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
