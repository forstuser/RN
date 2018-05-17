import React, { Component } from "react";
import CategoryScreenWithFilters from "./with-filters";
import CategoryScreenWithPager from "./with-pager";
import Direct from "./direct";
import { MAIN_CATEGORY_IDS } from "../../constants";

class MainCategoryScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      title: params.title ? params.title : ""
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      mainCategory: {},
      isAppearingFirstTime: true,
      reloadList: false
    };
  }

  async componentDidMount() {
    const mainCategory = this.props.navigation.state.params.category;
    this.props.navigation.setParams({ title: mainCategory.name });
    this.setState({
      mainCategory
    });
  }

  onNavigatorEvent = event => {
    switch (event.id) {
      case "didAppear":
        if (!this.state.isAppearingFirstTime) {
          this.setState({
            reloadList: true
          });
        }
        this.setState({
          isAppearingFirstTime: false
        });
        break;
    }
  };

  render() {
    const mainCategory = this.state.mainCategory;
    switch (+mainCategory.id) {
      case MAIN_CATEGORY_IDS.AUTOMOBILE:
      case MAIN_CATEGORY_IDS.ELECTRONICS:
        return (
          <CategoryScreenWithFilters
            navigation={this.props.navigation}
            category={mainCategory}
            reloadList={this.state.reloadList}
          />
        );
      case MAIN_CATEGORY_IDS.FURNITURE:
      case MAIN_CATEGORY_IDS.TRAVEL:
      case MAIN_CATEGORY_IDS.HEALTHCARE:
      case MAIN_CATEGORY_IDS.SERVICES:
      case MAIN_CATEGORY_IDS.HOUSEHOLD:
      case MAIN_CATEGORY_IDS.PERSONAL:
        return (
          <CategoryScreenWithPager
            navigation={this.props.navigation}
            category={mainCategory}
            reloadList={this.state.reloadList}
          />
        );
      case MAIN_CATEGORY_IDS.FASHION:
      case MAIN_CATEGORY_IDS.OTHERS:
        return (
          <Direct
            navigation={this.props.navigation}
            category={mainCategory}
            reloadList={this.state.reloadList}
          />
        );
      default:
        return null;
    }
  }
}

export default MainCategoryScreen;
