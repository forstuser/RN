import React, { Component } from "react";
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Text, TextInput, Button } from '../../elements';
import AddressView from "./address-view";
import { colors, defaultStyles } from "../../theme";
import Icon from "react-native-vector-icons/Ionicons";
import RNGooglePlaces from "react-native-google-places";
import Modal from "../../components/modal";
import RNModal from 'react-native-modal';
import { getUserAddresses, updateUserAddresses, deleteUserAddresses } from "../../api"

class AddressScreen extends Component {
    static navigationOptions = {
        title: 'Manage Addresses'
    };
    constructor(props) {
        super(props);
        this.state = {
            addresses: [],
            latitude: null,
            longitude: null,
            isVisible: false,
            deleteModalShow: false,
            address1: "",
            address2: "",
            addreesID: null,
            btnTXT: 'Add'
        }
    }
    componentDidMount() {
        this.fetchUserAddress();
    }
    show = item => {
        this.setState({ isVisible: true });
    };
    hide = () => {
        this.setState({ isVisible: false });
    };
    showDeleteModal = () => {
        this.setState({ deleteModalShow: true });
    }
    hideDeleteModal = () => {
        this.setState({ deleteModalShow: false });
    }
    fetchUserAddress = async () => {
        try {
            const userAddresses = await getUserAddresses();
            console.log('userAddresses', userAddresses.result);
            this.setState({
                addresses: userAddresses.result
            })

        } catch (error) {
            console.log("error: ", error);
        }
    };

    saveAddress = async () => {
        try {
            let item = { 'address_line_1': this.state.address1, 'address_line_2': this.state.address2, 'latitude': this.state.latitude, 'longitude': this.state.longitude, id: this.state.addreesID }
            if (item.id == null) {
                delete item.id;
            }
            const updateAddressResponse = await updateUserAddresses(item);
            console.log('updateAddressResponse', updateAddressResponse);
            this.hide();
            this.fetchUserAddress();
        } catch (error) {
            console.log("error: ", error);
        }
    }
    updateAddress = (index) => {
        console.log(this.state.addresses[index])
        this.setState({
            address1: this.state.addresses[index].address_line_1,
            address2: this.state.addresses[index].address_line_2,
            addreesID: this.state.addresses[index].id,
            btnTXT: "Update"
        })
        this.show();
    }
    deleteAddressModel = (index) => {
        console.log(this.state.addresses[index])
        this.setState({
            addreesID: this.state.addresses[index].id,
        })
        this.showDeleteModal();
    }
    deleteAddress = async () => {
        try {
            const deleteReponse = await deleteUserAddresses(this.state.addreesID);
            console.log('userAddresses', deleteReponse);
            this.hideDeleteModal();
        } catch (error) {
            console.log("error: ", error);
        }
    }

    openLocationModal = () => {
        RNGooglePlaces.openPlacePickerModal()
            .then(place => {
                this.setState({
                    latitude: place.latitude,
                    longitude: place.longitude,
                    address2: place.address || place.name,
                    isVisible: true
                });
            })
            .catch(error => console.log(error.message)); // error is a Javascript Error object
    }
    render() {
        const { addresses, isVisible, deleteModalShow, address1, address2, btnTXT } = this.state;
        return (
            <View style={styles.constainer}>
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        {addresses.map((item, index) => {
                            return <AddressView index={index} address1={item.address_line_1} address2={item.address_line_2} updateAddress={this.updateAddress} deleteAddressModel={this.deleteAddressModel} />
                        })}
                        {addresses.length > 0 ? <View style={{ top: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                            <Text>---- </Text>
                            <View style={styles.or}><Text style={styles.orText}>OR</Text></View>
                            <Text> ----</Text>
                        </View> : null}
                    </View>
                    <TouchableOpacity onPress={() => { this.openLocationModal() }} style={styles.search}>
                        <Text style={styles.searchText}>Search New Location</Text>
                        <Text><Icon name="ios-pin-outline" size={20} color={colors.pinkishOrange} /></Text>
                    </TouchableOpacity>
                </ScrollView>
                <Modal
                    isVisible={isVisible}
                    title="Update Address"
                    onClosePress={this.hide}
                    onBackButtonPress={this.hide}
                    onBackdropPress={this.hide}
                    style={{ height: 240, backgroundColor: "#fff" }}
                >
                    <View style={{ width: 320 }}>
                        <TextInput
                            placeholder="Add Line 1"
                            value={address1}
                            style={{ marginLeft: 10, borderRadius: 5 }}
                            onChangeText={address1 => this.setState({ address1 })}
                        />
                        <TextInput
                            placeholder="Add Line 2"
                            value={address2}
                            style={{ marginLeft: 10, borderRadius: 5 }}
                            onChangeText={address2 => this.setState({ address2 })}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', width: 300, justifyContent: 'space-between', alignSelf: 'center' }}>
                        <Button
                            text="Cancel"
                            onPress={this.hide}
                            borderRadius={0}
                            color="grey"
                            style={styles.btn}
                        />
                        <Button
                            text={btnTXT}
                            onPress={this.saveAddress}
                            borderRadius={0}
                            color="secondary"
                            style={styles.btn}
                        />
                    </View>
                </Modal>
                <RNModal
                    isVisible={deleteModalShow}
                    onClosePress={this.hide}
                    onBackButtonPress={this.hide}
                    onBackdropPress={this.hide}
                >
                    <View style={{ height: 100, backgroundColor: "#fff" }}>
                        <View style={{ width: 300, alignSelf: 'center', top: 10 }}>
                            <Text weight="Bold">Do you want to delete this address?</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: 300, justifyContent: 'space-between', alignSelf: 'center' }}>
                            <Button
                                text="No"
                                onPress={this.hideDeleteModal}
                                borderRadius={0}
                                color="grey"
                                style={styles.btn}
                            />
                            <Button
                                text="Yes"
                                onPress={this.deleteAddress}
                                borderRadius={0}
                                color="secondary"
                                style={styles.btn}
                            />
                        </View>
                    </View>
                </RNModal>
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
    },
    search: {
        height: 45,
        marginTop: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        marginBottom: 12,
        borderRadius: 10,
        ...defaultStyles.card
    },
    searchText: {
        marginTop: 2,
        color: colors.secondaryText
    },
    btn: {
        height: 40,
        width: 140,
        alignSelf: "center",
        marginTop: 20
    }
};

export default AddressScreen;