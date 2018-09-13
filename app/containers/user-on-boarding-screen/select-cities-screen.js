import React, { Component } from 'react';
import { ScrollView, View, Image, TouchableOpacity } from 'react-native';

import { Text, TextInput, Button } from '../../elements';
import { SCREENS } from '../../constants';
import LoadingOverlay from '../../components/loading-overlay';
import { updateProfile } from '../../api';
import Snackbar from '../../utils/snackbar';
import { defaultStyles } from '../../theme';

class SelectCitiesScreen extends Component {
    static navigationOptions = {
        title: 'Select City'
    };

    constructor(props) {
        super(props);
        this.state = {
          location: '',  
          isLoading: false,
          error: null
        };
      }

    onCityPressed = async (city) => {
        const { location } = this.state;
        this.setState({
            isLoading: true,
            location: city
        });

        try {
            const res = await updateProfile({
                location
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
        return (
            <View style={styles.container}>    
                <View style={[styles.mb, styles.mb1]}>
                    <View style={[styles.mainBox, styles.mainBox1]}>
                        <View style={[styles.box, styles.box1]}>
                            <TouchableOpacity
                                    onPress={() => this.onCityPressed('Delhi')}
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
                                    onPress={() => this.onCityPressed('Noida')}
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
                                onPress={() => this.onCityPressed('Ghaziabad')}
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
                                    onPress={() => this.onCityPressed('Gurgaon')}
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
                                    onPress={() => this.onCityPressed('Greater Noida')}
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
                                onPress={() => this.onCityPressed('Faridabad')}
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
                <View style={[styles.mb, styles.mb2]}>
                    <TouchableOpacity style={styles.containerOther} onPress={() => this.onCityPressed('Other')}>
                        <Text weight='Bold' style={{ fontSize: 16 }}>Other</Text>
                    </TouchableOpacity>
                </View>    
                    <LoadingOverlay visible={this.state.isLoading} />
            </View>
        );
    }
}

const styles = {
    imageIcon: {
        height: 120,
        width: 120,
        borderWidth: 1,
        borderRadius: 60
    },
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
    mainBox: {
        flex: 1,
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
        alignItems: 'center',
    },
    mb: {
        flex: 1,
    },
    mb1: {
        flex: 9,
        flexDirection: 'row'
    },
    mb2: {
        flex: 1
    },
    containerOther: {
        ...defaultStyles.card,
        flex: 1,
        flexDirection: 'row',
        borderRadius: 10,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center'      
    }
};

export default SelectCitiesScreen;
