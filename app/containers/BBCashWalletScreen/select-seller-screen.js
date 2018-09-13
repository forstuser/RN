import React, { Component } from 'react';
import { View, FlatList } from 'react-native';

import { Text } from '../../elements';
import SelectSellerHeader from './select-seller-header';
import SingleSeller from './single-seller';
import { getSellersBBCashWallet } from '../../api';


class SelectSellerScreen extends Component {
    static navigationOptions = {
        header: null
      };
      constructor(props) {
        super(props);
        this.state = {
            selectedSeller: null,
            error: null,
            isFetchingData: true,
            sellerInfo: []
        };
    }

    componentDidMount() {
        this.fetchSellers();
    }

    fetchSellers = async () => {
        this.setState({
            error: null
        });
        try {
            const sellerData = await getSellersBBCashWallet();
            console.log('Seller Data: ', sellerData.result);
            //console.log('Seller Data: ', sellerData.result[0].name);
            //console.log('Seller Data: ', sellerData.result[0].cashback_total);
            this.setState({
                sellerInfo: sellerData.result,
                isFetchingData: false,
            });
        } catch (error) {
            console.log("error: ", error);
            this.setState({
              error,
              isFetchingData: false
            });
          }
    };

    onSellerPressedHandler = (seller) => {
        this.setState({
            selectedSeller: seller
        });
    };

    renderSellers = ({item:seller, index}) => {
        return <SingleSeller 
            seller={seller}
            selectedSeller={this.state.selectedSeller}
            onSellerPressed={this.onSellerPressedHandler}
        />;
    };

    render() {
        return (
            <View style={{ backgroundColor: '#fff' }}>
                <SelectSellerHeader navigation={this.props.navigation} />
                <FlatList
                    data={this.state.sellerInfo}
                    renderItem={this.renderSellers}
                    extraData={this.state.selectedSeller}
                    keyExtractor={item => item.id}
                />
            </View>
        );
    }
}

export default SelectSellerScreen;