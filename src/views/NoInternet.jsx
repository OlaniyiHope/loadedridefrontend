import React, { useState, useRef, useEffect } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  StatusBar,
  
  Linking,
  Platform,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as colors from "../assets/css/Colors";
import {

  no_internet,
} from "../config/Constants";
import DropdownAlert, {
  DropdownAlertData,
  DropdownAlertType,
} from "react-native-dropdownalert";
import LottieView from "lottie-react-native";

import Icon, { Icons } from "../components/Icons";
import { SafeAreaView } from "react-native-safe-area-context";
import NetInfo from "@react-native-community/netinfo";

const NoInternet = (props) => {
  const navigation = useNavigation();
  useEffect(() => {
    const checkConnection = () => {
      NetInfo.fetch().then((state) => {
        if (state.isConnected) {
          navigation.goBack();
        }
      });
    };

    // Call the function immediately
    checkConnection();

    // Set up interval to call it every 10 seconds
    const interval = setInterval(checkConnection, 10000); // 10 seconds

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);
  const go_back = () => {
    navigation.goBack();
  };
  const openSettings = () => {
    Linking.openSettings(); // Opens the device settings for enabling internet
  };
  const openInternetSettings = () => {
    if (Platform.OS === "android") {
      // Open Android internet settings
      Linking.sendIntent("android.settings.WIFI_SETTINGS").catch(() =>
        Alert.alert(
          "Error",
          "Unable to open internet settings. Please navigate to the settings manually."
        )
      );
    } else {
      // For iOS, fallback to general settings
      Linking.openURL("App-Prefs:root=WIFI").catch(() =>
        Alert.alert(
          "Error",
          "Unable to open settings. Please navigate to the settings manually."
        )
      );
    }
  };
  /*  const openInternetSettings = () => {
   if (Platform.OS === "android") {
     // Open Android mobile data settings
     Linking.sendIntent("android.settings.DATA_ROAMING_SETTINGS").catch(() =>
       Alert.alert(
         "Error",
         "Unable to open mobile data settings. Please navigate to the settings manually."
       )
     );
   } else {
     Alert.alert(
       "Not Supported",
       "Direct mobile data settings are only supported on Android."
     );
   }
 }; */
  return (
    <SafeAreaView style={{ backgroundColor: colors.lite_bg, flex: 1 }}>
      <StatusBar backgroundColor={colors.theme_bg} />
      <View style={[styles.header]}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={go_back.bind(this)}
          style={{
            width: "15%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon
            type={Icons.MaterialIcons}
            name="arrow-back"
            color={colors.theme_fg_two}
            style={{ fontSize: 30 }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <LottieView
          style={styles.lottie}
          speed={0.5}
          source={no_internet} // Replace with your Lottie file path
          autoPlay
          loop
        />
        <Text style={styles.message}>
            Please check your internet connection and try again.
        </Text>
        <TouchableOpacity style={styles.button} onPress={openInternetSettings}>
          <Text style={styles.buttonText}>Go to Settings</Text>
        </TouchableOpacity>
      </View>
      <DropdownAlert alert={(func) => (dropDownAlertRef = func)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: colors.lite_bg,
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  lottie: {
    height: 300,
    width: 300,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginHorizontal: 20,
    marginTop: 10,
  },
  button: {
    backgroundColor: colors.theme_bg,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default NoInternet;
