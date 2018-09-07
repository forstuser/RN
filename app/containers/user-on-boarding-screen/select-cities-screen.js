import React, { Component } from 'react';
import { ScrollView, View, Image, TouchableOpacity } from 'react-native';

import { Text, TextInput, Button } from '../../elements';
import { SCREENS } from '../../constants';

class SelectCitiesScreen extends Component {
    static navigationOptions = {
        title: 'Select City'
    };

    render() {
        return (
            <View style={styles.container}>
                    <View style={[styles.mainBox, styles.mainBox1]}>
                        <View style={[styles.box, styles.box1]}>
                            <TouchableOpacity
                                    onPress={() => alert('city pressed')}
                            >
                                    <Image
                                        style={styles.imageIcon}
                                        source={require('./delhi.png')}
                                        resizeMode='contain'
                                    />
                            </TouchableOpacity>
                            <Text weight='Bold' style={{ marginTop: 10, fontSize: 16, textAlign: 'center' }}>Delhi</Text>
                        </View>
                        <View style={[styles.box, styles.box1]}>
                            <TouchableOpacity
                                    onPress={() => alert('city pressed')}
                                >
                                    <Image
                                        style={styles.imageIcon}
                                        source={require('./noida.png')}
                                        resizeMode='contain'
                                    />
                                </TouchableOpacity>
                            <Text weight='Bold' style={{ marginTop: 10, fontSize: 16, textAlign: 'center' }}>Noida</Text>
                        </View>
                        <View style={[styles.box, styles.box1]}>
                            <TouchableOpacity
                                onPress={() => alert('city pressed')}
                            >
                                <Image
                                    style={styles.imageIcon}
                                    source={require('./ghaziabad.png')}
                                    resizeMode='contain'
                                />
                            </TouchableOpacity>
                            <Text weight='Bold' style={{ marginTop: 10, fontSize: 16, textAlign: 'center' }}>Ghaziabad</Text>
                        </View>
                    </View>
                    <View style={[styles.mainBox, styles.mainBox2]}>
                        <View style={[styles.box, styles.box1]}>
                            <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate(SCREENS.VERIFY_MOBILE_NUMBER_SCREEN_ONBOARDING)}
                            >
                                    <Image
                                        style={styles.imageIcon}
                                        source={require('./gurgaon.png')}
                                        resizeMode='contain'
                                    />
                            </TouchableOpacity>
                            <Text weight='Bold' style={{ marginTop: 10, fontSize: 16, textAlign: 'center' }}>Gurgaon</Text>
                        </View>
                        <View style={[styles.box, styles.box1]}>
                            <TouchableOpacity
                                    onPress={() => alert('city pressed')}
                                >
                                    <Image
                                        style={styles.imageIcon}
                                        source={require('./greater-noida.png')}
                                        resizeMode='contain'
                                    />
                                </TouchableOpacity>
                            <Text weight='Bold' style={{ marginTop: 10, fontSize: 16, textAlign: 'center' }}>Greater Noida</Text>
                        </View>
                        <View style={[styles.box, styles.box1]}>
                            <TouchableOpacity
                                onPress={() => alert('city pressed')}
                            >
                                <Image
                                    style={styles.imageIcon}
                                    source={require('./faridabad.png')}
                                    resizeMode='contain'
                                />
                            </TouchableOpacity>
                            <Text weight='Bold' style={{ marginTop: 10, fontSize: 16, textAlign: 'center' }}>Faridabad</Text>
                        </View>
                    </View>
            </View>
        );
    }
}

const styles = {
    imageIcon: {
        height: 120,
        width: 120,
        borderWidth: 1,
        borderRadius: 50
    },
    userPic: {
        height: 120,
        width: 120,
        borderWidth: 1,
        borderRadius: 50
    },
    container: {
        flex: 1,
        flexDirection: 'row', 
        backgroundColor: '#fff'
    },
    mainBox: {
        flex: 1
    },
    mainBox1: {
        flex: 1
    },
    mainBox2: { 
        flex: 1
    },
    box: {
        flex: 1,
        flexDirection: 'column'
    },
    box1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
};

export default SelectCitiesScreen;
