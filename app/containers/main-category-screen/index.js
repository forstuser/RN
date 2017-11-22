import React, { Component } from "react";
import CategoryScreenWithFilters from "./category-screen-with-filters";
import CategoryScreenWithPager from "./category-screen-with-pager-2";

class MainCategoryScreen extends Component {
  async componentDidMount() {
    this.props.navigator.toggleTabs({
      to: "hidden", // required, 'hidden' = hide tab bar, 'shown' = show tab bar
      animated: true // does the toggle have transition animation or does it happen immediately (optional)
    });
    this.props.navigator.setTitle({
      title: this.props.category.name
    });
  }

  render() {
    switch (+this.props.category.id) {
      case 2:
      case 3:
        return <CategoryScreenWithFilters category={this.props.category} />;
      case 1:
      case 4:
      case 5:
      case 6:
      case 8:
        return <CategoryScreenWithPager category={this.props.category} />;
      case 7:
      case 9:
      case 10:
        return null;
      default:
        return null;
    }
  }
}

export default MainCategoryScreen;
