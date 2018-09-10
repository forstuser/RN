import React, { Component } from "react";
import { View, TouchableOpacity } from 'react-native';
import { Text } from '../../elements';
import { colors } from "../../theme";
import Icon from "react-native-vector-icons/Ionicons";

class AddressView extends Component {

    constructor(props) {
        super(props);
    }
    setDefault = (index) => {
        console.log("setDefault");
        this.props.setDefault(index);
    }
    editAddress = (index) => {
        this.props.updateAddress(index);
    }
    deleteAddress = (index) => {
        this.props.deleteAddressModel(index);
    }
    render() {
        const { index, address, isSelectable } = this.props
        return (
            <View style={styles.constainer}>
                <View style={styles.header}>
                    <View style={{ alignContent: 'space-between', flexDirection: 'row', flex: 1 }}>
                        <TouchableOpacity style={{ alignItems: 'center', paddingTop: 2, width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff', borderColor: 'black', borderWidth: 1 }}>
                            <View style={{ width: 15, height: 15, borderRadius: 10, backgroundColor: colors.pinkishOrange, borderColor: colors.pinkishOrange, borderWidth: 1 }}>
                            </View>
                        </TouchableOpacity>
                        <View>
                            <Text style={styles.address}> Address {index + 1}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', }}>
                        {address.address_type == 1 ? <View style={{ right: 5 }}>
                            <Text style={styles.default}>Default</Text>
                        </View> : <TouchableOpacity onPress={() => { this.setDefault(index) }} style={{ right: 5 }}>
                                <Text style={styles.setDefault}>Set Default</Text>
                            </TouchableOpacity>
                        }
                        <TouchableOpacity onPress={() => { this.editAddress(index) }} style={{ marginLeft: 12 }}>
                            <Text><Icon name="ios-create-outline" size={20} color={colors.secondaryText} /></Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.deleteAddress(index) }} style={{ marginLeft: 12 }}>
                            <Text><Icon name="ios-trash-outline" size={20} color={colors.secondaryText} /></Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ paddingTop: 10, paddingBottom: 10 }}>
                    <Text style={{ fontSize: 12 }}>
                        {address.address_line_1} {address.address_line_2} {address.locality_name} {address.city_name} {address.state_name} {address.pin}
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
        fontSize: 12,
        color: '#939393'
    },
    default: {
        color: colors.secondaryText,
        textDecorationLine: 'underline',
        fontSize: 12
    },
    setDefault: {
        color: colors.pinkishOrange,
        textDecorationLine: 'underline',
        fontSize: 12
    }
};

export default AddressView;