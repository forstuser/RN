import React, { Component } from 'react';
import { View, FlatList } from 'react-native';

import { Text } from '../../elements';
import Header from './header';
import SingleTransaction from './singleTransaction';
import { retrieveWalletDetails } from "../../api";
import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";

class BBCashWalletScreen extends Component {
    static navigationOptions = {
        header: null
      };
    
      constructor(props) {
        super(props);
        this.state = {
            error: null,
            isFetchingData: true,
            transactions: [
                {
                    'description': 'Redeemed at Paytm',
                    'date': 'August 31, 2018',
                    'id': 12345678901,
                    'price': 100
                },
                {
                    'description': 'Redeemed at Paytm',
                    'date': 'August 31, 2018',
                    'id': 12345678902,
                    'price': 100
                },
                {
                    'description': 'Redeemed at Paytm',
                    'date': 'August 31, 2018',
                    'id': 12345678903,
                    'price': 100
                },
                {
                    'description': 'Redeemed at Paytm',
                    'date': 'August 31, 2018',
                    'id': 12345678904,
                    'price': 100
                },
                {
                    'description': 'Redeemed at Paytm',
                    'date': 'August 31, 2018',
                    'id': 12345678905,
                    'price': 100
                }               
            ],
            walletAmount: 0 
        };
    }  
    
    // componentDidMount() {
    //     this.fetchWalletData();
    // }

    // fetchWalletData = async () => {
    //     this.setState({
    //         error: null
    //     });
    //     try {
    //         const walletData = await retrieveWalletDetails();
    //         console.log(walletData);
    //         this.setState({
    //             isFetchingData: false
    //         });
    //     } catch (error) {
    //         console.log("error: ", error);
    //         this.setState({
    //           error,
    //           isFetchingData: false
    //         });
    //       }
    // };

    renderTransactions = ({item:transaction, index}) => {
        return <SingleTransaction 
            description={transaction.description}
            date={transaction.date}
            id={transaction.id}
            price={transaction.price}
        />;
    };
    
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <Header navigation={this.props.navigation} />
                <Text style={styles.heading} weight="Bold">BBCash Transactions</Text>
                <FlatList
                    data={this.state.transactions}
                    renderItem={this.renderTransactions}
                    keyExtractor={item => item.id}
                />
            </View>
        );
    }
}

const styles = {
    heading: {
        fontSize: 14,
        marginTop: 10,
        marginLeft: 10
    },
};

export default BBCashWalletScreen;
