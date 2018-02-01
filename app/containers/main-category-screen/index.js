import React, { Component } from "react";
import CategoryScreenWithFilters from "./with-filters";
import CategoryScreenWithPager from "./with-pager";
import Direct from "./direct";
import { MAIN_CATEGORY_IDS } from "../../constants";

class MainCategoryScreen extends Component {
  static navigatorStyle = {
    tabBarHidden: true
  };
  constructor(props) {
    super(props);
    this.state = {
      isAppearingFirstTime: true,
      reloadList: false
    };
  }

  async componentDidMount() {
    this.props.navigator.setTitle({
      title: this.props.category.name
    });
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
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
    switch (+this.props.category.id) {
      case MAIN_CATEGORY_IDS.AUTOMOBILE:
      case MAIN_CATEGORY_IDS.ELECTRONICS:
        return (
          <CategoryScreenWithFilters
            navigator={this.props.navigator}
            category={this.props.category}
            reloadList={this.state.reloadList}
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
            reloadList={this.state.reloadList}
          />
        );
      case MAIN_CATEGORY_IDS.FASHION:
      case MAIN_CATEGORY_IDS.OTHERS:
      case MAIN_CATEGORY_IDS.PERSONAL:
        return (
          <Direct
            navigator={this.props.navigator}
            category={this.props.category}
            reloadList={this.state.reloadList}
          />
        );
      default:
        return null;
    }
  }
}

export default MainCategoryScreen;
