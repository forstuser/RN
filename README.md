# Overview

This is consumer application of BinBill for mobile, based on React Native. It runs on both Android and iOS.

# Directory Structure

Details of folders and files in root directory are as follow:

1. android: It contains the android part of the app.
2. app: This is the main folder of the app containing almost all the code. It will be detailed later.
3. assets: It contains all the custom fonts required. On running `react-native link`, these fonts are pushed to the respective directory of android and ios.
4. ios: iOS part of the application.

Other files are self explainatory or are not of much importance. It can be assumed that we will not have to change them.

There are multiple `index` files but they all just import the `app` folder. They are three because things like codepush use different files.

# File Structure of `app` folder:

1. analytics: It contains a single file witch exports an object with all the event names, and a logEvent function. Everywhere in the app, only this function should be used for event logging and any logging function should be added here, i.e. right now it has firebase and facebook logging, any other can be added too. This logEvent function has some basic details about the user, which it sends with all the ecents.

2. api: All the api calls are exported from this file as functions. There's a base function for api calls which set common headers like authToken and do common error handling. Every other call uses this function.

3. applozic: It provides simple functions for applozic, like `login` and `startChatWithSeller`. It is used this way so that we can

# Few Important Notes

## Crash without red screen

1. If app is crashing without red screen.then it can be due to

```
{condition && <View></View>}
```

#### Solution

replace it with ternary operator e.g.

```
{condition ? <View></View>:null}
```

# android

Android part is a little problematic to setup. Make sure you have android sdk version 27 installed. After every `npm` or `yarn` install, there are changes to be made in `gradle` files of some libraries.
Open the `android` folder in root directory in Android Studio and make following changes in the gradle files of the libraries:

1. Change version of every `com.google.android.gms:play-services` dependency to `+`, means change `com.google.android.gms:play-services-places:12.1` to `com.google.android.gms:play-services-places:+`
2. Change version of every `com.android.support` to `27.0.2` or the version your device has. e.g. change `com.android.support:appcompat-v7:25.0.1 to`com.android.support:appcompat-v7:27.0.2`

Don't forget to clean the android project regularly as it may show errors even if everything is alright. You can clean android project by running `./gradlew clean` in android folder and `yarn run android-clean` in root folder. Also restart android studio or computer if everything looks alright but building gives error.

## android release build

Making release build from Android Studio can be problematic and codepush may not work. But command line way works better.
