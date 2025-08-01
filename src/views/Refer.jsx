import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  Share,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  api_url,
  app_name,
  bold,
  f_25,
  f_l,
  f_m,
  f_xl,
  get_referral_message,
  no_data_loader,
  normal,
  refer,
  regular,
} from "../config/Constants";

import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import * as colors from "../assets/css/Colors";
import { Text } from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import Icon, { Icons } from "../components/Icons";
import LottieView from "lottie-react-native";


import DropdownAlert, {
  DropdownAlertData,
  DropdownAlertType,
} from "react-native-dropdownalert";
import NetInfo from "@react-native-community/netinfo";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

const Refer = (props) => {
  const navigation = useNavigation();
  const [msg, setMsg] = useState("your referral code is");
  const [refferalMessage, setRefferalMessage] = useState("");
  const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };
  const [isLoading, setIsLoading] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  let dropDownAlertRef = useRef(
    (_data?: DropdownAlertData) =>
      new Promise() < DropdownAlertData > ((res) => res)
  );

  useEffect(() => {
    referral();
  }, []);
  useEffect(() => {
    const checkConnection = () => {
      NetInfo.fetch().then((state) => {
        if (!state.isConnected) {
          navigation.navigate("NoInternet");
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
  const showAlert = (message) => {
    Alert.alert("Error", message);
  };
  const copyToClipboard = () => {
    ReactNativeHapticFeedback.trigger("impactLight", options);

    Clipboard.setString(referralCode); // Copy referral code to clipboard

    alert("Referral Code Copied to Clipboard");
  };

  const referral = async () => {
    console.log("referral");
    console.log(api_url + get_referral_message);
    console.log({
      customer_id: global.id,
      lang: global.lang,
    });
    try {
      const response = await axios.post(api_url + get_referral_message, {
        customer_id: global.id,
        lang: global.lang,
      });
      setReferralCode(response.data.code);
      setRefferalMessage(response.data.result.referral_message);
    } catch (error) {
      console.error(error);
      alert("Sorry something went wrong");
    } finally {
    }
  };

  const openSms = async () => {
    ReactNativeHapticFeedback.trigger("impactLight", options);
    try {
      await Share.share({
        title: "Share you Referral Code",
        message: `${msg}${app_name}App is now available on Google Play Store. Your Referral Code is ${referralCode}`,
        url: "https://play.google.com/store/apps/details?id=nic.goi.aarogyasetu&hl=en",
      });
    } catch (error) {
      showAlert(error.message);
    }
  };
  const go_back = () => {
    ReactNativeHapticFeedback.trigger("impactLight", options);

    navigation.toggleDrawer();
  };
  return (
    <View style={{ flex: 1 }}>
      <DropdownAlert alert={(func) => (dropDownAlertRef = func)} />
      <View
        style={{
          height: 70,
          backgroundColor: colors.lite_bg,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
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
        <View
          activeOpacity={1}
          style={{
            width: "85%",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              width: undefined,
              height: undefined,
              color: colors.theme_fg_two,
              fontSize: f_xl,
              fontFamily: regular,
            }}
          >
            Refer And Earn
          </Text>
        </View>
      </View>
      {}
      {referralCode ? (
        <ScrollView>
          <View style={{ padding: 20 }}>
            <Text
              style={{
                color: colors.text_grey,
                fontSize: f_25,
                fontFamily: normal,
                marginBottom: 10,
                textAlign: "center",
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Earn While You Refer!
            </Text>
            <View
              style={{
                height: 300,
                width: "80%",
                justifyContent: "center",
                alignSelf: "center",
              }}
            >
              <LottieView source={refer} style={{ flex: 1 }} autoPlay loop />
            </View>
            <View>
              <View style={{ margin: 10 }} />
              <Text
                style={{
                  color: colors.text_grey,
                  fontSize: f_m,
                  fontFamily: regular,
                  marginBottom: 10,
                  textAlign: "justify",
                }}
              >
                {refferalMessage}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: colors.text_container_bg,

                margin: 10,
                borderRadius: 10,

                flexDirection: "row",
                width: "95%",
                elevation: 4,
                height: 70,
              }}
            >
              <View
                style={{
                  width: "80%",
                  justifyContent: "center",
                  alignSelf: "center",
                }}
              >
                <TextInput
                  style={{
                    color: colors.text_grey,
                    fontSize: f_l,
                    fontFamily: regular,
                    paddingHorizontal: 20,
                  }}
                  value={referralCode}
                  editable={false}
                />
              </View>
              <TouchableOpacity
                onPress={copyToClipboard}
                style={{
                  backgroundColor: colors.theme_bg,
                  width: "20%",
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon
                  type={Icons.Feather}
                  name="copy"
                  color={colors.theme_bg_three}
                  style={{ fontSize: 22 }}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={openSms}
              style={{
                margin: 10,
                borderRadius: 10,
                height: 50,
                width: "95%",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 0.5,
                borderColor: colors.theme_bg_two,
                flexDirection: "row",
                backgroundColor: colors.theme_bg,
              }}
            >
              <Text
                style={{
                  color: colors.theme_bg_three,
                  fontSize: f_m,
                  fontFamily: regular,
                  margin: 10,
                }}
              >
                Share
              </Text>
              <Icon
                type={Icons.MaterialIcons}
                name="share"
                color={colors.theme_bg_three}
                style={{ fontSize: 22 }}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View
          style={{
            height: 500,
            width: "80%",
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          <LottieView source={no_data_loader} style={{ flex: 1 }} autoPlay loop />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default Refer;
