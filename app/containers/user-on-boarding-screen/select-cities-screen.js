import React, { Component } from 'react';
import { Dimensions, ScrollView, View, Image, TouchableOpacity } from 'react-native';

import { Text, TextInput, Button } from '../../elements';
import { SCREENS } from '../../constants';
import LoadingOverlay from '../../components/loading-overlay';
import { updateProfile } from '../../api';
import Snackbar from '../../utils/snackbar';
import { defaultStyles, colors } from '../../theme';
import DelhiImage from './delhi.png';
import GurgaonImage from './gurgaon.png';
import NoidaImage from './noida.png';
import GreaterNoidaImage from './greater-noida.png';
import GhaziabadImage from './ghaziabad.png';
import FaridabadImage from './faridabad.png';
import OtherCityImage from './other.png';

const deviceWidth = Dimensions.get('window').width;

class SelectCitiesScreen extends Component {
    static navigationOptions = {
        title: 'Select City'
    };

    constructor(props) {
        super(props);
        this.state = {
            location: '',
            isLoading: false,
            error: null,
            cities: [
                {
                    'id': 1,
                    'name': 'Delhi',
                    'imageUrl': DelhiImage
                },
                {
                    'id': 2,
                    'name': 'Gurgaon',
                    'imageUrl': GurgaonImage
                },
                {
                    'id': 3,
                    'name': 'Noida',
                    'imageUrl': NoidaImage
                },
                {
                    'id': 4,
                    'name': 'Greater Noida',
                    'imageUrl': GreaterNoidaImage
                },
                {
                    'id': 5,
                    'name': 'Ghaziabad',
                    'imageUrl': GhaziabadImage
                },
                {
                    'id': 6,
                    'name': 'Faridabad',
                    'imageUrl': FaridabadImage
                },
                {
                    'id': 7,
                    'name': 'Other',
                    'imageUrl': OtherCityImage
                },
            ]
        };
    }

    onCityPressed = (city) => {
        this.setState({
            location: city
        });
    };

    onSubmitPressed = async () => {
        if (this.state.location === '') {
            return Snackbar.show({
                title: "Please Select Location",
                duration: Snackbar.LENGTH_SHORT
            });
        }
        try {
            const res = await updateProfile({
                location: this.state.location
            });
        } catch (e) {
            console.log("e: ", e);

            Snackbar.show({
                title: e.message,
                duration: Snackbar.LENGTH_SHORT
            });
        } finally {
            this.setState({ isLoading: false });
        }

        this.props.navigation.navigate(SCREENS.APP_STACK);
    };

    render() {
        return(
            <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
                <ScrollView style={{ flex: 1 }}>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                        {this.state.cities.map(city => (
                            <View 
                                style={{  
                                    width: deviceWidth/2, 
                                    height: deviceWidth/2, 
                                    justifyContent: 'center', 
                                    alignItems: 'center' 
                                    }}
                            >
                                <TouchableOpacity
                                    onPress={() => this.onCityPressed(city.name)}
                                >
                                    <Image
                                        style={styles.imageIcon}
                                        source={city.imageUrl}
                                        resizeMode='contain'
                                    />
                                </TouchableOpacity>
                                <Text weight='Bold' style={{ marginTop: 10, fontSize: 16, textAlign: 'center' }}>{city.name}</Text>
                            </View>
                        ))}
                    </View>  
                </ScrollView>
                <Button
                    style={{ margin: 10 }}
                    text='Submit'
                    onPress={this.onSubmitPressed}
                    color='secondary'
                    textStyle={{ fontSize: 20 }}
                />
            </ScrollView>
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

export default SelectCitiesScreen;