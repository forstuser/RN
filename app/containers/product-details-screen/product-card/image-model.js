import React from "react";
import { StyleSheet, View, TouchableOpacity, Platform, Image } from "react-native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";
import { API_BASE_URL } from "../../../api";
import I18n from "../../../i18n";
import { Text } from "../../../elements";
import { colors } from "../../../theme";
import moment from "moment";
import LoadingOverlay from "../../../components/loading-overlay";

class ImageModal extends React.Component {
    state = {
        isModalVisible: false,
        isImageLoading: true
    };

    show = () => {
        this.setState({
            isModalVisible: true
        });
    };

    hide = () => {
        this.setState({
            isModalVisible: false
        });
    };
    hideLoader = () => {
        this.setState({
            isImageLoading: false
        });
    };

    render() {
        const { isModalVisible, isImageLoading } = this.state;
        const { product } = this.props;
        console.log(product);
        let headerBg = require("../../../images/product_card_header_bg.png");
        if (product.file_type) {
            headerBg = {
                uri: API_BASE_URL + product.cImageURL + "?t=" + moment().format("X")
            };
        }
        return (
            <Modal
                isVisible={isModalVisible}
                useNativeDriver={true}
                onBackButtonPress={this.hide}
                onBackdropPress={this.hide}
                avoidKeyboard={Platform.OS == "ios"}
                style={{ flex: 1, margin: 0 }}
            >
                <LoadingOverlay visible={isImageLoading} />
                <View style={styles.modal}>
                    <Image onLoad={this.hideLoader} style={styles.bg} source={headerBg} resizeMode="contain" />
                    <TouchableOpacity style={styles.closeIcon} onPress={this.hide}>
                        <Icon name="md-close" size={30} color={colors.mainText} />
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modal: {
        // paddingTop: 40,
        // backgroundColor: "rgba(0,0,0,0.5)",
        backgroundColor: "#fff",
        borderRadius: 5,
        flex: 1,
        margin: 0,
        // backgroundColor: 'red',
        width: '100%',
    },
    closeIcon: {
        position: "absolute",
        right: 15,
        backgroundColor: "#fff",
        width: 30,
        height: 30,
        borderRadius: 15,
        // justifyContent: 'center',
        alignItems: 'center',
        top: 10
    }, bg: {
        // position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%"
    },
});

export default ImageModal;
