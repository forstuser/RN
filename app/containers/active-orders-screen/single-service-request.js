import React, { Component } from 'react';
import { View, Image } from 'react-native';

import { Text, Button } from '../../elements';
import { defaultStyles } from "../../theme";

class SingleServiceRequest extends Component {
    render() {
        const { serviceRequest } = this.props;
        let btnText = null;
        if(serviceRequest.status_type === 4)
            btnText = 'New';
        else if(serviceRequest.status_type === 16)
            btnText = 'Approved';
        else if(serviceRequest.status_type === 17)
            btnText = 'Cancelled';
        else if(serviceRequest.status_type === 18)
            btnText = 'Rejected';
        else if(serviceRequest.status_type === 19)
            btnText = 'Out for delivery';
        else if(serviceRequest.status_type === 5)
            btnText = 'Complete';
        return (
            <View style={styles.container}>
                {/* <View style={[styles.box, styles.box1]}>
                    <Image style={styles.serviceIcon} source={require('./car.png')} resizeMode='contain' />
                </View> */}
                <View style={[styles.box, styles.box2]}>
                    <Text style={styles.type} weight='Medium'>{serviceRequest.order_details[0].service_name}</Text>
                    <Button
                        style={{ height: 30, width: 150, marginTop: 10 }}
                        text={btnText} 
                        onPress={() => {}}
                        color='secondary'
                        textStyle={{ fontSize: 14 }}
                        type="outline"
                        state='disabled'
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
        fontSize: 16
    },
    serviceIcon: {
        height: 80,
        width: 80,
        marginLeft: 10,
        marginTop: 10
    }   
};

export default SingleServiceRequest;
