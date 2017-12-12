import React, { Component } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  View,
  FlatList,
  Alert,
  ScrollView,
  Image
} from "react-native";
import Modal from "react-native-modal";
import { openAppScreen, openAddProductScreen } from "../../navigation";
import { API_BASE_URL, consumerGetEhome } from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";
import Collapsible from "./../../components/collapsible";
import { colors } from "../../theme";
import AddProductItem from "./add-product-item";
import UploadBillOptions from "../../components/upload-bill-options";
import { showSnackbar } from "../snackbar";

const finshImageIcon = require("../../images/ehome_circle_with_category_icons.png");
class AddProductsScreen extends Component {
  static navigatorButtons = {
    rightButtons: [
      {
        title: "SKIP",
        id: "skip",
        buttonColor: colors.pinkishOrange,
        buttonFontWeight: "600"
      }
    ]
  };
  constructor(props) {
    super(props);
    this.state = {
      productTypes: [
        "Mobile",
        "Car",
        "Bike",
        "Fridge",
        "Television",
        "Washing Machine"
      ],
      currentIndex: 0,
      productsAdded: [],
      currentScrollPosition: 0,
      screenWidth: Dimensions.get("window").width,
      isFinishModalVisible: false,
      finishMsg: "Want to add some other product?",
      finishBtnText: "Yes",
      finishImageSource: finshImageIcon
    };
  }
  componentDidMount() {
    this.props.navigator.setTitle({
      title: "Add Products"
    });
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  onNavigatorEvent = event => {
    if (event.type == "NavBarButtonPress") {
      if (event.id == "skip") {
        this.scrollToNext();
      }
    }
  };

  scrollToNext = () => {
    const {
      currentIndex,
      currentScrollPosition,
      screenWidth,
      productTypes,
      productsAdded
    } = this.state;

    const isLastSlide = currentIndex == productTypes.length - 1;
    if (isLastSlide && productsAdded.length == 0) {
      this.setState({
        isFinishModalVisible: true,
        finishMsg: "Want to add some other product?",
        finishBtnText: "Yes",
        finishImageSource: finshImageIcon
      });
    } else if (isLastSlide && productsAdded.length == 1) {
      this.setState({
        isFinishModalVisible: true,
        finishMsg: productsAdded[0] + " added to your eHome",
        finishBtnText: "ADD MORE PRODUCTS",
        finishImageSource: finshImageIcon
      });
    } else if (isLastSlide && productsAdded.length > 1) {
      this.setState({
        isFinishModalVisible: true,
        finishMsg: "All your products added to your eHome",
        finishBtnText: "ADD MORE PRODUCTS",
        finishImageSource: finshImageIcon
      });
    }
    const newScrollPosition = currentScrollPosition + screenWidth;
    this.productListScroll.scrollTo({
      x: newScrollPosition,
      y: 0,
      animated: true
    });
    this.setState({
      currentIndex: currentIndex + 1,
      currentScrollPosition: newScrollPosition
    });
  };

  onProductAdded = productType => {
    showSnackbar({
      text: productType + " added successfully!"
    });
    let productsAdded = [...this.state.productsAdded];
    productsAdded.push(productType);
    this.setState({
      productsAdded
    });
    this.scrollToNext();
  };

  render() {
    const {
      productTypes,
      isFinishModalVisible,
      finishMsg,
      finishImageSource,
      finishBtnText
    } = this.state;
    return (
      <ScreenContainer style={styles.container}>
        <ScrollView
          ref={ref => (this.productListScroll = ref)}
          scrollEnabled={false}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
        >
          {productTypes.map(productType => (
            <AddProductItem
              key={productType}
              onProductAdded={() => {
                this.onProductAdded(productType);
              }}
              onUploadBillPress={() => {
                this.uploadBillOptions.show();
              }}
              productType={productType}
            />
          ))}
        </ScrollView>
        <Modal useNativeDriver={true} isVisible={isFinishModalVisible}>
          <View style={styles.finishModal}>
            <Image
              style={styles.finishImage}
              source={finishImageSource}
              resizeMode="contain"
            />
            <Text weight="Bold" style={styles.finishMsg}>
              {finishMsg}
            </Text>
            <Button
              onPress={() => {
                openAddProductScreen();
              }}
              style={styles.finishBtn}
              text={finishBtnText}
              color="secondary"
            />
            <Text weight="Bold" style={styles.doItLaterText}>
              I’ll Do it Later
            </Text>
          </View>
        </Modal>
        <UploadBillOptions
          ref={ref => (this.uploadBillOptions = ref)}
          navigator={this.props.navigator}
        />
      </ScreenContainer>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    padding: 0
  },
  text: {
    padding: 12,
    fontSize: 14,
    color: "#3b3b3b"
  },
  finishModal: {
    backgroundColor: "#fff",
    height: 500,
    borderRadius: 10,
    padding: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  finishImage: {
    width: 200,
    height: 200
  },
  finishMsg: {
    color: colors.mainBlue,
    fontSize: 24,
    textAlign: "center",
    marginTop: 25
  },
  finishBtn: {
    width: 200,
    marginTop: 20
  },
  doItLaterText: {
    color: colors.pinkishOrange,
    fontSize: 16,
    marginTop: 20
  }
});
export default AddProductsScreen;
