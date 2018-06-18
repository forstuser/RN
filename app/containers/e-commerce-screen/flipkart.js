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
import Modal from "react-native-modal";
import KeyValueItem from "../../components/key-value-item";

class Flipkart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderId: null,
            isModalVisible: false,
        }
    }

    componentDidMount() {
        console.log(this.props)
    }
    showModal = () => {
        this.setState({ isModalVisible: true });
    };
    hideModal = () => {
        this.setState({ isModalVisible: false });
    };

    onWebViewMessage = event => {
        console.log("event.nativeEvent.data: ", event.nativeEvent.data);
        this.setState({
            orderId: event.nativeEvent.data
        });
    };

    onGetDataMessage = event => {
        const dirtyObjectArray = JSON.parse(event.nativeEvent.data);
        console.log(dirtyObjectArray)
        var cleanObjectArray = [
            { key: 'Order ID', value: dirtyObjectArray[0].orderId },
            { key: 'Order Date', value: dirtyObjectArray[1].orderDate },
            { key: 'Total Amount', value: dirtyObjectArray[2].orderTotal },
            { key: 'Payment Mode', value: dirtyObjectArray[3].paymentMode },
            { key: 'Delivery Date', value: dirtyObjectArray[4].deliveryDate },
            { key: 'Delivery Address', value: dirtyObjectArray[5].deliveryAddress }
            // { key: 'asin', value: dirtyObjectArray[4].asin },
        ];
        console.log(cleanObjectArray);
        this.props.successOrder(cleanObjectArray);
    };
    exploreMoreDetails = () => {
        this.props.navigation.goBack();
    };

    render() {
        const { orderId, isModalVisible, scrapObjectArray } = this.state;
        const { item } = this.props;
        return (
            <ScreenContainer style={styles.container}>
                <Text>Working on this</Text>
                <Modal
                    style={{ margin: 0 }}
                    isVisible={isModalVisible}
                    useNativeDriver={true}
                    onBackButtonPress={this.hideModal}
                    onBackdropPress={this.hideModal}
                >
                    <View style={{ backgroundColor: '#fff', padding: 20 }}>
                        <Text style={{ color: colors.tomato, fontWeight: 'bold', fontSize: 18 }} >Order Successful!</Text>
                        <View style={styles.imageContainer}>
                            <Image
                                style={{ width: 50, height: 50, flex: 1 }}
                                source={{ uri: item.image }}
                            />
                            <Text numberOfLines={2} style={{ flex: 2, fontWeight: 'bold' }}>{item.name}</Text>
                        </View>
                        <View style={{ marginTop: 10 }}>
                            {scrapObjectArray.map((item) => {
                                return (<KeyValueItem
                                    keyText={item.key}
                                    valueText={item.value}
                                />)
                            })}
                        </View>
                        <Button
                            onPress={this.exploreMoreDetails}
                            text={"Explore More Details"}
                            color="secondary"
                            borderRadius={30}
                            style={styles.exploreButton}
                        />
                    </View>
                </Modal>
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
    },
    imageContainer: {
        flexDirection: 'row',
        marginTop: 25
    },
    exploreButton: {
        width: "100%"
    },
});

export default Flipkart;
