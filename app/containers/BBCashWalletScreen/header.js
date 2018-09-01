import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';

import Icon from "react-native-vector-icons/Ionicons";
import { Text, Button } from '../../elements';

class Header extends Component {
    
    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.backIcon}
                    onPress={() => alert('Pressed')}
                    >
                    <Icon
                        name="md-arrow-back"                        
                        size={30}
                        color="#fff"
                    />
                </TouchableOpacity>
                <Text weight="Bold" style={[styles.heading,styles.heading1]}>BBCash Wallet</Text>
                <Text style={[styles.heading,styles.heading2]}>Available BBCash</Text>
                <Text style={[styles.heading,styles.heading3]}>1000</Text>
                <Button
                    style={styles.button} 
                    text='Redeem BBCash' 
                    onPress={() => alert('Button Pressed')}
                />
            </View>
        );
    }
}

const styles = {
   container: {
        height: 250,
        backgroundColor: '#3496d8'
   }, 
   backIcon: {
       position: 'absolute',
       top: 10,
       left: 15
   },
   heading: {
       color: '#fff', 
       textAlign: 'center'
   },
   heading1: {
        fontSize: 18,
        marginTop: 10
   },
   heading2: {
        fontSize: 16,
        marginTop: 25
   },
   heading3: {
        fontSize: 56
   },
   button: {
        width: 200,
        alignSelf: 'center',
        marginTop: 15
   }
};

export default Header;
