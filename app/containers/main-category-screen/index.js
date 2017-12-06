import React, { Component } from "react";
import CategoryScreenWithFilters from "./with-filters";
import CategoryScreenWithPager from "./with-pager";
import Direct from "./direct";
import { MAIN_CATEGORY_IDS } from "../../constants";

class MainCategoryScreen extends Component {
  static navigatorStyle = {
    tabBarHidden: true
  };
  async componentDidMount() {
    this.props.navigator.setTitle({
      title: this.props.category.name
    });
  }

  render() {
    switch (+this.props.category.id) {
      case MAIN_CATEGORY_IDS.AUTOMOBILE:
      case MAIN_CATEGORY_IDS.ELECTRONICS:
        return (
          <CategoryScreenWithFilters
            navigator={this.props.navigator}
            category={this.props.category}
          />
        );
      case MAIN_CATEGORY_IDS.FURNITURE:
      case MAIN_CATEGORY_IDS.TRAVEL:
      case MAIN_CATEGORY_IDS.HEALTHCARE:
      case MAIN_CATEGORY_IDS.SERVICES:
      case MAIN_CATEGORY_IDS.HOUSEHOLD:
        return (
          <CategoryScreenWithPager
            navigator={this.props.navigator}
            category={this.props.category}
          />
        );
      case MAIN_CATEGORY_IDS.FASHION:
      case MAIN_CATEGORY_IDS.OTHERS:
      case MAIN_CATEGORY_IDS.PERSONAL:
        return (
          <Direct
            navigator={this.props.navigator}
            category={this.props.category}
          />
        );
      default:
        return null;
    }
  }
}

export default MainCategoryScreen;
