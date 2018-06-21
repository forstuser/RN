import React, { Component } from "react";
import { View, WebView, StyleSheet } from "react-native";

import { API_BASE_URL } from "../../api";
import { ScreenContainer, Text, Button, Image } from "../../elements";
import { colors } from "../../theme";

class Flipkart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderId: ""
    };
  }

  componentDidMount() {
    // console.log("props", this.props)
  }

  onWebViewMessage = event => {
    console.log("event.nativeEvent.data: ", event.nativeEvent.data);
    var data = { orderId: event.nativeEvent.data };
    this.props.successOrder(data);
  };

  render() {
    const { orderId } = this.state;
    const { item } = this.props;
    let dirtyScript = ` (function(){
            var _url = window.location.href;
            var regexp =  /.*\id=(.*?)\&src=/;
            var orderArray = _url.match(regexp);
            if(orderArray){
              var orderId = orderArray[1] + '00';
              setTimeout(function() {
                window.postMessage(orderId,'*');
              }, 500);
            }
          })()`;
    return (
      <ScreenContainer style={styles.container}>
        <WebView
          injectedJavaScript={dirtyScript}
          source={{ uri: item.url }}
          onMessage={this.onWebViewMessage}
          javaScriptEnabled={true}
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
  }
});

export default Flipkart;
