import React, { Component } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';

import Modal from '../../components/modal';
import { defaultStyles } from "../../theme";
import { Text } from '../../elements';
import { SCREENS } from '../../constants';

class RedeemViaModal extends Component {
    state = {
        isVisible: false
    }

    show = () => {
        this.setState({ 
            isVisible: true 
        });
    };

    hide = () => {
        this.setState({
            isVisible: false
        });
    };

    closeModal = () => {
        this.setState({
          isVisible: false
        });
    };

    onSellerPressed = () => {
        this.hide();
        this.props.navigation.navigate(SCREENS.SELECT_SELLER_SCREEN_WALLET)
    }

    render() {
        return (
            <Modal
                isVisible={this.state.isVisible}
                title="Redeem Via"
                style={{
                ...defaultStyles.card,
                height: 300
                }}
                onClosePress={this.closeModal}
            >
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={[styles.box, styles.box1]}>
                        <TouchableOpacity onPress={() => alert('Pressed')}>
                            <Image style={styles.paytmIcon} source={require('./paytm.png')} />
                            <Text>Paytm*</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.box, styles.box2]}>
                        <TouchableOpacity onPress={this.onSellerPressed}>
                                <Image style={styles.sellerIcon} source={require('./seller.png')} />
                                <Text>Seller</Text>
                        </TouchableOpacity>
                    </View>     
                </View>
                <Text textStyle={{ fontSize: 6 }}>*if you claim cashback through Paytm, 2% will be deducted</Text>
            </Modal>
        );
    }
}

const styles = {
    mainBox: {
        flex: 1
    },
    box1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    box2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    paytmIcon: {
        height: 40,
        width: 125,
    },
    sellerIcon: {
        height:100,
        width: 100
    }
};

export default RedeemViaModal;