import React, { Component } from 'react';
import { ScrollView, View, Image, TouchableOpacity } from 'react-native';

import { Text, TextInput, Button } from '../../elements';
import Icon from "react-native-vector-icons/Ionicons";
import { SCREENS } from '../../constants';

class BasicDetailsScreen extends Component {
    static navigationOptions = {
        title: 'Basic Details'
    };

    render() {
        return (
            <ScrollView style={styles.container}>
                        {/* <TouchableOpacity
                            style={styles.cameraIcon}
                            onPress={() => alert('Camera Icon')}
                            >
                            <Icon
                                name="md-camera"                        
                                size={30}
                                color="#fff"
                            />
                        </TouchableOpacity> */}
                    <View style={[styles.box, styles.box1]}>
                        <Image 
                            style={styles.userPic} 
                            source={require('./user.png')}
                            resizeMode='contain' 
                        />
                        

                    </View>
                    <View style={[styles.box, styles.box2]}>
                        <TextInput
                            underlineColorAndroid='transparent'
                            placeholder='Name'
                            style={styles.input}
                        />
                        <TextInput
                            underlineColorAndroid='transparent'
                            placeholder='Mobile'
                            style={styles.input}
                        />
                        <TextInput
                            underlineColorAndroid='transparent'
                            placeholder='Email'
                            style={styles.input}
                        />
                    </View>
                    <View style={[styles.box, styles.box3]}>
                        <Button
                                text='Next' 
                                onPress={() => this.props.navigation.navigate(SCREENS.SELECT_CITIES_SCREEN_ONBOARDING)}
                                color='secondary'
                                textStyle={{ fontSize: 20 }}
                        />
                    </View>
            </ScrollView>
        );
    }
}

const styles = {
    userPic: {
        height: 120,
        width: 120,
        borderWidth: 1,
        borderRadius: 50
    },
    container: {
        flex: 1,
        flexDirection: 'column', 
        backgroundColor: '#fff'
    },
    box: {
        flex: 1,
        padding: 20
    },
    box1: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50    
    },
    box2: {
        flex: 6
    },
    box3: {
        flex: 1,
    },
    input: {
        paddingLeft: 10,
        paddingRight: 10
    }
};

export default BasicDetailsScreen;
