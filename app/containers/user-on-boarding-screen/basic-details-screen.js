import React, { Component } from "react";
import { ScrollView, View, Image, TouchableOpacity } from "react-native";

import { Text, TextInput, Button } from "../../elements";
import Icon from "react-native-vector-icons/Ionicons";
import { SCREENS } from "../../constants";
import { getProfileDetail, updateProfile } from "../../api";
import LoadingOverlay from "../../components/loading-overlay";
import Snackbar from "../../utils/snackbar";
import HeaderPic from "./headerPic";
import Analytics from "../../analytics";
import ProfilePicModal from "./profile-pic-modal";

class BasicDetailsScreen extends Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      name: "",
      mobile: "",
      email: "",
      imageUrl: "",
      image_name: "",
      isLoading: false,
      error: null,
      imageUploaded: false
    };
  }

  componentDidMount() {
    this.fetchUserDetails();
  }

  fetchUserDetails = async () => {
    try {
      this.setState({
        isLoading: true,
        error: null
      });
      const r = await getProfileDetail();
      const user = r.userProfile;
      this.setState({
        user: user,
        isLoading: false,
        name: user.name || "",
        mobile: user.mobile_no || null,
        email: user.email || "",
        imageUrl: user.imageUrl || "",
        image_name: user.image_name || null
      });
    } catch (error) {
      this.setState({ error });
    }
  };

  onProceedAnyway = async () => {
    this.profilePicModal.hide();
    const {
      name,
      phone,
      email,
      user,
      image_name,
      imageUrl,
      imageUploaded
    } = this.state;

    if (this.state.name === "") {
      return Snackbar.show({
        title: "Please enter your name",
        duration: Snackbar.LENGTH_SHORT
      });
    }
    if (this.state.mobile === null) {
      return Snackbar.show({
        title: "Please enter your phone",
        duration: Snackbar.LENGTH_SHORT
      });
    }
    Analytics.logEvent(Analytics.EVENTS.REGISTRATION_BASIC_DETAILS);

    if (
      email &&
      !email.match(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      return Snackbar.show({
        title: "Please enter valid email address",
        duration: Snackbar.LENGTH_SHORT
      });
    }

    // if (user.image_name === null && !imageUploaded) {
    //   return Snackbar.show({
    //     title:
    //       "Your selfie makes it quicker for your seller to respond on orders.",
    //     duration: Snackbar.LENGTH_SHORT
    //   });
    // }

    this.setState({
      isLoading: true
    });

    try {
      const res = await updateProfile({
        name,
        email,
        image_name,
        imageUrl
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
    this.props.navigation.navigate(SCREENS.SELECT_GENDER_SCREEN_ONBOARDING, {
      navigation: this.props.navigation
    });
  };

  onNextPress = () => {
    const {
      name,
      phone,
      email,
      user,
      image_name,
      imageUrl,
      imageUploaded
    } = this.state;

    if (this.state.name === "") {
      return Snackbar.show({
        title: "Please enter your name",
        duration: Snackbar.LENGTH_SHORT
      });
    }

    if (this.state.mobile === null) {
      return Snackbar.show({
        title: "Please enter your phone",
        duration: Snackbar.LENGTH_SHORT
      });
    }

    if (user.image_name === null && !imageUploaded) {
      this.profilePicModal.show();
    } else {
      this.onProceedAnyway();
    }
  };

  render() {
    console.log("ABC: ", this.state.user);
    return (
      <ScrollView style={styles.container}>
        <View style={[styles.box, styles.box1]}>
          {/* <Image 
                            style={styles.userPic} 
                            source={require('./user.png')}
                            resizeMode='contain' 
                        />
                        <TouchableOpacity
                            style={styles.cameraIcon}
                            onPress={this.uploadPic}
                            >
                            <Icon
                                name="md-camera"                        
                                size={20}
                                color="#ff732e"
                            />
                        </TouchableOpacity>
 */}
          {this.state.user ? (
            <HeaderPic
              profile={this.state.user}
              onUploadImage={() => {
                this.setState({ imageUploaded: true });
              }}
            />
          ) : null}
        </View>
        <View style={[styles.box, styles.box2]}>
          <TextInput
            underlineColorAndroid="transparent"
            placeholder="Name (Recommended)"
            style={styles.input}
            onChangeText={name => this.setState({ name })}
            value={this.state.name}
          />
          <TextInput
            underlineColorAndroid="transparent"
            placeholder="Mobile"
            style={styles.input}
            onChangeText={mobile => this.setState({ mobile })}
            value={this.state.mobile}
            maxLength={10}
          />
          <TextInput
            underlineColorAndroid="transparent"
            placeholder="Email"
            style={styles.input}
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
          />
        </View>
        <View style={[styles.box, styles.box3]}>
          <Button
            text="Next"
            onPress={this.onNextPress}
            color="secondary"
            textStyle={{ fontSize: 20 }}
          />
        </View>
        <ProfilePicModal
          ref={node => {
            this.profilePicModal = node;
          }}
          onProceedAnyway={this.onProceedAnyway}
        />
        <LoadingOverlay visible={this.state.isLoading} />
      </ScrollView>
    );
  }
}

const styles = {
  userPic: {
    height: 120,
    width: 120,
    borderWidth: 1,
    borderRadius: 50
  },
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff"
  },
  box: {
    flex: 1
    //padding: 20
  },
  box1: {
    flex: 3
    //justifyContent: 'center',
    //alignItems: 'center',
  },
  box2: {
    flex: 6,
    padding: 20
  },
  box3: {
    flex: 1,
    padding: 20
  },
  input: {
    paddingLeft: 10,
    paddingRight: 10
  },
  cameraIcon: {
    position: "absolute",
    top: 110,
    left: 225,
    padding: 5,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: "#fff",
    backgroundColor: "#fff"
  }
};

export default BasicDetailsScreen;
