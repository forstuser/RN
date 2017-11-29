import React, { Component } from "react";
import CategoryScreenWithFilters from "./with-filters";
import CategoryScreenWithPager from "./with-pager";
import Direct from "./direct";

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
      case 2:
      case 3:
        return (
          <CategoryScreenWithFilters
            navigator={this.props.navigator}
            category={this.props.category}
          />
        );
      case 1:
      case 4:
      case 5:
      case 6:
      case 8:
        return (
          <CategoryScreenWithPager
            navigator={this.props.navigator}
            category={this.props.category}
          />
        );
      case 7:
      case 9:
      case 10:
        <Direct
          navigator={this.props.navigator}
          category={this.props.category}
        />;
      default:
        return null;
    }
  }
}

export default MainCategoryScreen;
