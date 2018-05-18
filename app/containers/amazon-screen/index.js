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
import { showSnackbar } from "../snackbar";

// import WebViewBridge from 'react-native-webview-bridge-updated';


class AmazonScreen extends Component {
    static navigatorStyle = {
        tabBarHidden: true
    };
    constructor(props) {
        super(props);
        // this.state = {

        // };
    }
    onMessage(data) {
        console.log("data", data);
    }
    componentDidMount() {

    }
    render() {
        let jsCode = `
        window.postMessage("Sending data from WebView");
    `;
        return (
            <ScreenContainer style={styles.container}>
                <WebView
                    style={styles.WebViewStyle}
                    source={{ uri: 'https://www.amazon.in' }}
                    injectedJavaScript={jsCode}
                />
            </ScreenContainer>
        );

    }
}

const styles = StyleSheet.create({

    WebViewStyle:
        {
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            marginTop: (Platform.OS) === 'ios' ? 20 : 0
        }
});

export default AmazonScreen;
