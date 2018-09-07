import React, { Component } from "react";
import { View, TouchableOpacity } from 'react-native';
import { Text } from '../../elements';
import { colors } from "../../theme";
import Icon from "react-native-vector-icons/Ionicons";

class AddressView extends Component {

    constructor(props) {
        super(props);
    }
    setDefault = () => {
        console.log("setDefault");
    }
    render() {
        const { index, address } = this.props
        console.log("addresses", address)
        return (
            <View style={styles.constainer}>
                <View style={styles.header}>
                    <View><Text style={styles.address}>Address {index}</Text></View>
                    <View style={{ flexDirection: 'row', }}>
                        <TouchableOpacity onPress={() => { this.setDefault }} style={{ right: 5 }}>
                            <Text style={styles.default}>Default</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.setDefault }}>
                            <Text><Icon name="ios-create-outline" size={20} color={colors.secondaryText} /></Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ paddingTop: 10, paddingBottom: 10 }}>
                    <Text>{address}
                    </Text>
                </View>
            </View>
        );
    }
}
const styles = {
    constainer: {
        backgroundColor: '#fff',
        // flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    address: {
        fontSize: 12
    },
    default: {
        color: colors.pinkishOrange,
        textDecorationLine: 'underline',
        fontSize: 12
    }
};

export default AddressView;