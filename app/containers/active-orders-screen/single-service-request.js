import React, { Component } from 'react';
import { View, Image } from 'react-native';

import { Text, Button } from '../../elements';
import { defaultStyles } from "../../theme";

class SingleServiceRequest extends Component {
    render() {
        const { serviceRequest } = this.props;
        return (
            <View style={styles.container}>
                <View style={[styles.box, styles.box1]}>
                    <Image style={styles.serviceIcon} source={require('./car.png')} resizeMode='contain' />
                </View>
                <View style={[styles.box, styles.box2]}>
                    <Text style={styles.type} weight='Medium'>{serviceRequest.type}</Text>
                    <Button
                        style={{ height: 30, width: 120, marginTop: 10 }}
                        text='Status' 
                        onPress={() => alert('Current Status')}
                        color='secondary'
                        textStyle={{ fontSize: 16 }}
                    />
                </View>
            </View>
        );
    }
}

const styles = {
    container: {
        ...defaultStyles.card,
        flex: 1,
        flexDirection: 'row',
        borderRadius: 10,
        margin: 10      
    },
    box: {
        height: 120
    },
    box1: {
        flex: 3,    
    },
    box2: {
        flex: 7,
        marginLeft: 20
    },
    type: {
        marginTop: 20,
        fontSize: 20
    },
    serviceIcon: {
        height: 80,
        width: 80,
        marginLeft: 10,
        marginTop: 10
    }   
};

export default SingleServiceRequest;
