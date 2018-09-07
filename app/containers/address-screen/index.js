import React, { Component } from "react";
import { View } from 'react-native';
import { Text } from '../../elements';
import AddressView from "./address-view";

class AddressScreen extends Component {

    static navigationOptions = {
        title: 'Manage Addresses'
    };
    constructor(props) {
        super(props);
        this.state = {
            addresses: [{
                'index': 1,
                'address': "46/B, Block B2, Tower B, Spaze iTech Park, Sohna Rd, Sector Gurugram, Haryana 122002, Sohna Rd, Gurugram Haryana"
            },
            {
                'index': 2,
                'address': "46/B, Block B2, Tower B, Spaze iTech Park, Sohna Rd, Sector Gurugram, Haryana 122002, Sohna Rd, Gurugram Haryana"
            }]
        }
    }
    render() {
        const { addresses } = this.state;
        console.log(addresses)
        return (
            <View style={styles.constainer}>
                {addresses.map((item) => {
                    return <AddressView index={item.index} address={item.address} />
                })}
                <View style={{ top: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                    <Text>---- </Text>
                    <View style={styles.or}><Text style={styles.orText}>OR</Text></View>
                    <Text> ----</Text>
                </View>


            </View>
        );
    }
}
const styles = {
    constainer: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    or: {
        backgroundColor: 'grey',
        borderRadius: 20,
        width: 35,
        height: 35,
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        textAlign: 'center',
        justifyContent: 'center',
    },
    orText: {
        color: '#fff',
        marginTop: -2,
    }
};

export default AddressScreen;