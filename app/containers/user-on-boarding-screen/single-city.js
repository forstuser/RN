import React, { Component } from 'react';
import { ScrollView, View, Image, TouchableOpacity } from 'react-native';

import { Text, TextInput, Button } from '../../elements';
import { SCREENS } from '../../constants';
import LoadingOverlay from '../../components/loading-overlay';
import { updateProfile } from '../../api';
import Snackbar from '../../utils/snackbar';
import { defaultStyles } from '../../theme';

class SingleCity extends Component {
    
    render() {
        const { item, deviceWidth } = this.props;
        return (
            <View 
                style={{ 
                    flex: 1, 
                    width: deviceWidth/2, 
                    height: deviceWidth/2, 
                    backgroundColor: '#eee', 
                    justifyContent: 'center', 
                    alignItems: 'center' 
                    }}
            >
                <TouchableOpacity
                    onPress={this.onPressed}
                >
                    <Image
                        style={styles.imageIcon}
                        source={item.imageUrl}
                        resizeMode='contain'
                    />
                </TouchableOpacity>
                <Text weight='Bold' style={{ marginTop: 10, fontSize: 16, textAlign: 'center' }}>{item.name}</Text>
            </View>
        );
    }
}

const styles = {
    imageIcon: {
        height: 90,
        width: 90,
        borderRadius: 90,
        borderWidth: 1    
    }
};

export default SingleCity;