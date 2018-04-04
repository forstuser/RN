import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  FlatList,
  Image,
  Alert,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  Dimensions,
  PanResponder,
  Modal
} from "react-native";
import { connect } from "react-redux";
import {
  API_BASE_URL,
  fetchDoYouKnowItems,
  fetchDoYouKnowTags,
  likeDoYouKnowItem,
  unlikeDoYouKnowItem
} from "../../api";
import { Text, Button, ScreenContainer } from "../../elements";
import I18n from "../../i18n";
import { colors } from "../../theme";
import TabSearchHeader from "../../components/tab-screen-header";
import LoadingOverlay from "../../components/loading-overlay";
import ErrorOverlay from "../../components/error-overlay";
import { SCREENS, GLOBAL_VARIABLES } from "../../constants";
import { actions as loggedInUserActions } from "../../modules/logged-in-user";

import TagsModal from "./tags-modal";
import Item from "./item";

const doYouKnowIcon = require("../../images/ic_do_you_know.png");

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

class DoYouKNowScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true,
    tabBarHidden: false
  };

  constructor(props) {
    super(props);
    this.currentCardTranslateY = new Animated.Value(0);
    this.justSwipedCardTranslateY = new Animated.Value(-SCREEN_HEIGHT);
    this.state = {
      currentIndex: 0,
      nextIndex: 1,
      isFetchingItems: true,
      isFetchingTags: true,
      items: [],
      tags: [],
      selectedTagIds: [],
      offsetId: 0,
      error: null,
      isModalVisible: false
    };
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, { dy }) => {
        return dy > 10 || dy < -10;
      },
      onPanResponderMove: (evt, { dy }) => {
        const { items, currentIndex } = this.state;
        if (currentIndex > 0 && dy > 0) {
          this.justSwipedCardTranslateY.setValue(-SCREEN_HEIGHT + dy);
        } else {
          this.currentCardTranslateY.setValue(dy);
        }
      },
      onPanResponderRelease: (evt, { vy, dy }) => {
        const { items, currentIndex } = this.state;
        if (currentIndex > 0 && (vy >= 0.5 || dy >= 0.5 * SCREEN_HEIGHT)) {
          Animated.timing(this.justSwipedCardTranslateY, {
            toValue: 0,
            duration: 300
          }).start(() => {
            this.justSwipedCardTranslateY.setValue(-SCREEN_HEIGHT);
            this.setState({
              currentIndex: currentIndex - 1,
              nextIndex: currentIndex
            });
          });
        } else if (
          currentIndex < items.length &&
          (-vy >= 0.5 || -dy >= 0.5 * SCREEN_HEIGHT)
        ) {
          Animated.timing(this.currentCardTranslateY, {
            toValue: -SCREEN_HEIGHT,
            duration: 300
          }).start(() => {
            this.currentCardTranslateY.setValue(0);
            const nextState = {
              currentIndex: this.state.nextIndex
            };
            if (this.state.nextIndex == items.length - 1) {
              nextState.nextIndex = 0;
            } else {
              nextState.nextIndex = this.state.nextIndex + 1;
            }
            this.setState(nextState, () => {
              const newId = this.state.items[this.state.currentIndex].id;
              if (newId > this.props.latestDoYouKnowReadId) {
                this.props.setLatestDoYouKnowReadId(newId);
              }
            });
          });
        } else {
          Animated.parallel([
            Animated.spring(this.justSwipedCardTranslateY, {
              toValue: -SCREEN_HEIGHT,
              bounciness: 10
            }).start(),
            Animated.spring(this.currentCardTranslateY, {
              toValue: 0,
              bounciness: 10
            }).start()
          ]);
        }
      }
    });
  }

  componentDidMount() {
    this.setState(
      {
        offsetId: this.props.latestDoYouKnowReadId
      },
      () => {
        this.loadItems();
      }
    );

    this.loadTags();
  }

  loadItems = async () => {
    const tagIds = this.state.selectedTagIds;
    this.setState({
      error: null,
      isFetchingItems: true
    });
    try {
      const res = await fetchDoYouKnowItems({
        tagIds: tagIds || [],
        offsetId:
          tagIds.length == 0 ? this.state.offsetId || undefined : undefined
      });

      if (res.items.length == 0 && this.state.items.length == 0) {
        this.setState(
          {
            offsetId: 0
          },
          () => {
            this.loadItems();
          }
        );
        return;
      }
      const newState = {
        items: [...this.state.items, ...res.items],
        currentIndex: 0
      };

      //deep linking handling
      // if (global[GLOBAL_VARIABLES.DO_YOU_KNOW_ITEM_ID_TO_OPEN_DIRECTLY]) {
      //   for (let i = 0; i < res.items.length; i++) {
      //     if (
      //       res.items[i].id ==
      //       global[GLOBAL_VARIABLES.DO_YOU_KNOW_ITEM_ID_TO_OPEN_DIRECTLY]
      //     ) {
      //       newState.currentIndex = i;
      //       break;
      //     }
      //   }
      // }

      this.setState(newState);
    } catch (error) {
      console.log("error1: ", error);
      this.setState({
        error
      });
    }
    this.setState({
      isFetchingItems: false
    });
  };

  loadTags = async () => {
    this.setState({
      isFetchingTags: true
    });
    try {
      const res = await fetchDoYouKnowTags();
      this.setState({
        tags: res.items
      });
    } catch (error) {
      console.log("error1: ", error);
      this.setState({
        error
      });
    }
    this.setState({
      isFetchingTags: false
    });
  };

  toggleLike = async index => {
    const { items } = this.state;
    const item = items[index];
    const itemId = item.id;

    item.isTogglingLike = true;
    items[index] = item;
    this.setState({ items });

    try {
      if (!item.isLikedByUser) {
        await likeDoYouKnowItem({ itemId });
        item.isLikedByUser = true;
        item.totalLikes = item.totalLikes + 1;
        items[index] = item;
      } else {
        await unlikeDoYouKnowItem({ itemId });
        item.isLikedByUser = false;
        item.totalLikes = item.totalLikes - 1;
        items[index] = item;
      }

      this.setState({ items });
    } catch (e) {
      Alert.alert(e.message);
    }
    item.isTogglingLike = false;
    items[index] = item;
    this.setState({ items });
  };

  render() {
    const {
      items,
      currentIndex,
      nextIndex,
      error,
      isFetchingItems,
      isFetchingTags,
      tags,
      selectedTagIds,
      isModalVisible
    } = this.state;
    if (error) {
      return <ErrorOverlay error={error} onRetryPress={this.loadItems} />;
    }

    let previousItemRender = null;
    let currentItemRender = null;
    let nextItemRender = null;

    items.forEach((item, index) => {
      if (index == currentIndex - 1) {
        previousItemRender = (
          <Animated.View
            key={item.id}
            {...this.panResponder.panHandlers}
            style={[
              styles.item,
              {
                transform: [{ translateY: this.justSwipedCardTranslateY }]
              }
            ]}
          >
            <Item item={item} />
          </Animated.View>
        );
      } else if (index == currentIndex) {
        currentItemRender = (
          <Animated.View
            key={item.id}
            {...this.panResponder.panHandlers}
            style={[
              styles.item,
              {
                transform: [{ translateY: this.currentCardTranslateY }]
              }
            ]}
          >
            <Item
              item={item}
              onLikePress={() => this.toggleLike(index)}
              isFetchingItems={isFetchingItems}
            />
          </Animated.View>
        );
      } else if (index == nextIndex) {
        nextItemRender = (
          <Animated.View
            key={item.id}
            {...this.panResponder.panHandlers}
            style={[
              styles.item,
              {
                transform: [{ translateX: 0 }, { translateY: 0 }]
              }
            ]}
          >
            <Item item={item} />
          </Animated.View>
        );
      }
    });

    return (
      <ScreenContainer style={styles.container}>
        <View style={styles.header}>
          <TabSearchHeader
            title={I18n.t("do_you_know_screen_title")}
            icon={doYouKnowIcon}
            navigator={this.props.navigator}
            showMailbox={false}
            showSearchInput={false}
            showRightSideSearchIcon={false}
            onRightSideSearchIconPress={() => {
              this.tagsModal.show();
            }}
          />
        </View>
        <View style={styles.body}>
          {items.length > 0 && (
            <Animated.View
              style={[
                styles.item,
                styles.endItem,
                {
                  transform: [{ translateX: 0 }, { translateY: 0 }]
                }
              ]}
            >
              <Item />
            </Animated.View>
          )}

          {nextItemRender}
          {currentItemRender}
          {previousItemRender}
        </View>
        <LoadingOverlay visible={isFetchingItems || isFetchingTags} />
        <TagsModal
          ref={ref => (this.tagsModal = ref)}
          tags={tags}
          selectedTagIds={selectedTagIds}
          setSelectedTagIds={setSelectedTagIds =>
            this.setState({ setSelectedTagIds })
          }
          onSearchPress={this.loadItems}
        />
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: "#fafafa"
  },
  header: {
    width: "100%",
    ...Platform.select({
      ios: {
        zIndex: 1
      },
      android: {}
    })
  },
  body: {
    width: "100%",
    flex: 1,
    overflow: "hidden"
  },
  item: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%"
  },
  endItem: {
    top: 5
  }
});

const mapStateToProps = state => {
  return {
    latestDoYouKnowReadId: state.loggedInUser.latestDoYouKnowReadId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLatestDoYouKnowReadId: newValue => {
      dispatch(loggedInUserActions.setLatestDoYouKnowReadId(newValue));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoYouKNowScreen);
