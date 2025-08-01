import React, { useState, useEffect, useRef } from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    SafeAreaView,
    TextInput,
    Keyboard,
    StatusBar,
    Image, ScrollView
} from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import { api_url, register, normal, bold, regular, f_xl, f_xs, f_m, btn_loader, logo } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import DropdownAlert from 'react-native-dropdownalert';
import { connect } from 'react-redux';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};
const CreatePassword = (props) => {
    const navigation = useNavigation();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirm_password, setConfirmPassword] = useState('');
    const [referral_code, setReferralCode] = useState(""); 
    let dropDownAlertRef = useRef();
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const inputRef = useRef();

    const go_back = () => {
        navigation.goBack();
    }

    useEffect(() => {
        setTimeout(() => inputRef.current.focus(), 100)
    }, []);


    const check_valid = () => {
        if (password) {
            check_password();
        } else {
            dropDownAlertRef.alertWithType('error', 'Validation error', 'Please enter your password');
        }
    }

    const check_password = () => {
        if (password == confirm_password) {
            //navigation.navigate('Home');
            call_register();
        } else {
            dropDownAlertRef.alertWithType('error', 'Validation error', 'Your password and confirm password did not match');
        }
    }

    const call_register = async () => {
        console.log({
          fcm_token: global.fcm_token,
          phone_number: props.phone_number,
          phone_with_code: props.phone_with_code,
          country_code: props.country_code,
          first_name: props.first_name,
          last_name: props.last_name,
          email: props.email,
          password: password,
          referral_code: referral_code,
        });
        Keyboard.dismiss();
        setLoading(true);
        await axios({
          method: "post",
          url: api_url + register,
          data: {
            fcm_token: global.fcm_token,
            phone_number: props.phone_number,
            phone_with_code: props.phone_with_code,
            country_code: props.country_code,
            first_name: props.first_name,
            last_name: props.last_name,
            email: props.email,
            password: password,
            referral_code: referral_code,
          },
        })
          .then(async (response) => {
            setLoading(false);
            if (response.data.status == 1) {
              save_data(
                response.data.result,
                response.data.status,
                response.data.message
              );
            } else {
              dropDownAlertRef.alertWithType(
                "error",
                "Error",
                response.data.message
              );
            }
          })
          .catch((error) => {
            setLoading(false);
            dropDownAlertRef.alertWithType(
              "error",
              "Error",
              "Sorry something went wrong"
            );
          });
    }

    const save_data = async (data, status, message) => {
        if (status == 1) {
            try {
                await AsyncStorage.setItem('id', data.id.toString());
                await AsyncStorage.setItem('first_name', data.first_name.toString());
                await AsyncStorage.setItem('profile_picture', data.profile_picture.toString());
                await AsyncStorage.setItem('phone_with_code', data.phone_with_code.toString());
                await AsyncStorage.setItem('email', data.email.toString());
                global.id = await data.id;
                global.first_name = await data.first_name;
                global.phone_with_code = await data.phone_with_code;
                global.email = await data.email;
                global.profile_picture = await data.profile_picture;
                await navigate();
            } catch (e) {
                dropDownAlertRef.alertWithType('error', 'Error', 'Sorry something went wrong');
            }
        } else {
            dropDownAlertRef.alertWithType('error', 'Error', message);
        }
    }

    const navigate = async (data) => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "Home" }],
            })
        );
    }

    const drop_down_alert = () => {
        return (
            <DropdownAlert
                ref={(ref) => {
                    if (ref) {
                        dropDownAlertRef = ref;
                    }
                }}
            />
        )
    }

    return (
      <SafeAreaView style={{ backgroundColor: colors.lite_bg, flex: 1 }}>
        <ScrollView>
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
          <View style={{ margin: 0 }} />
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <View style={styles.logo_container}>
              <Image style={styles.logo} source={logo} />
            </View>
            <View style={{ margin: 10 }} />

            <Text
              numberOfLines={1}
              style={{
                color: colors.theme_fg_two,
                fontSize: f_xl,
                fontFamily: regular,
              }}
            >
              Create your password
            </Text>
            <View style={{ margin: 20 }} />
            <View style={{ width: "80%" }}>
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    width: "20%",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: colors.theme_bg_three,
                  }}
                >
                  <Icon
                    type={Icons.MaterialIcons}
                    name="lock"
                    color={colors.theme_fg_two}
                    style={{ fontSize: 30 }}
                  />
                </View>
                <View
                  style={{
                    width: "65%",
                    alignItems: "center",
                    paddingLeft: 10,
                    justifyContent: "center",
                    backgroundColor: colors.text_container_bg,
                    flexDirection: "row",
                  }}
                >
                  <TextInput
                    ref={inputRef}
                    placeholder="Password"
                    secureTextEntry={secureTextEntry}
                    placeholderTextColor={colors.grey}
                    style={styles.textinput}
                    onChangeText={(TextInputValue) =>
                      setPassword(TextInputValue)
                    }
                  />
                </View>
                <TouchableOpacity
                  onPress={() => {
                    ReactNativeHapticFeedback.trigger("impactHeavy", options);
                    setSecureTextEntry(!secureTextEntry);
                  }}
                  style={{
                    backgroundColor: colors.text_container_bg,
                    width: "15%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Icon
                    type={Icons.MaterialIcons}
                    name={secureTextEntry ? "visibility-off" : "visibility"}
                    color={colors.grey}
                    style={{ fontSize: 25, marginRight: 10 }}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ margin: 10 }} />
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    width: "20%",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: colors.theme_bg_three,
                  }}
                >
                  <Icon
                    type={Icons.MaterialIcons}
                    name="lock"
                    color={colors.theme_fg_two}
                    style={{ fontSize: 30 }}
                  />
                </View>
                <View
                  style={{
                    width: "65%",
                    alignItems: "flex-start",
                    paddingLeft: 10,
                    justifyContent: "center",
                    backgroundColor: colors.text_container_bg,
                  }}
                >
                  <TextInput
                    placeholder="Confirm Password"
                    secureTextEntry={secureTextEntry}
                    placeholderTextColor={colors.grey}
                    style={styles.textinput}
                    onChangeText={(TextInputValue) =>
                      setConfirmPassword(TextInputValue)
                    }
                  />
                </View>
                <TouchableOpacity
                  onPress={() => {
                    ReactNativeHapticFeedback.trigger("impactHeavy", options);
                    setSecureTextEntry(!secureTextEntry);
                  }}
                  style={{
                    backgroundColor: colors.text_container_bg,
                    width: "15%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Icon
                    type={Icons.MaterialIcons}
                    name={secureTextEntry ? "visibility-off" : "visibility"}
                    color={colors.grey}
                    style={{ fontSize: 25, marginRight: 10 }}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ margin: 10 }} />
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    width: "25%",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: colors.theme_bg_three,
                  }}
                >
                  <Icon
                    type={Icons.MaterialIcons}
                    name="share"
                    color={colors.theme_fg_two}
                    style={{ fontSize: 30 }}
                  />
                </View>
                <View
                  style={{
                    width: "75%",
                    alignItems: "flex-start",
                    paddingLeft: 10,
                    justifyContent: "center",
                    backgroundColor: colors.text_container_bg,
                  }}
                >
                  <TextInput
                    placeholder="Refferal Code (Optional)"
                    secureTextEntry={true}
                    placeholderTextColor={colors.grey}
                    style={styles.textinput}
                    onChangeText={(TextInputValue) =>
                      setReferralCode(TextInputValue)
                    }
                  />
                </View>
              </View>
              <View style={{ margin: 30 }} />
              {loading == false ? (
                <TouchableOpacity
                  onPress={check_valid.bind(this)}
                  activeOpacity={1}
                  style={{
                    width: "100%",
                    backgroundColor: colors.btn_color,
                    borderRadius: 10,
                    height: 50,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: colors.theme_fg_two,
                      fontSize: f_m,
                      color: colors.theme_fg_three,
                      fontFamily: normal,
                    }}
                  >
                    Register
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={{ height: 50, width: "90%", alignSelf: "center" }}>
                  <LottieView
                    style={{ flex: 1 }}
                    source={btn_loader}
                    autoPlay
                    loop
                  />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
        {drop_down_alert()}
      </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 60,
        backgroundColor: colors.lite_bg,
        flexDirection: 'row',
        alignItems: 'center'
    },
    textinput: {
        fontSize: f_m,
        color: colors.grey,
        fontFamily: regular,
        height: 60,
        backgroundColor: colors.text_container_bg,
        width: '100%'
    },
    logo_container: {
        height: 196,
        width: 196,

    },
    logo: {
        height: undefined,
        width: undefined,
        flex: 1,
        borderRadius: 98
    },
});

function mapStateToProps(state) {
    return {
        phone_number: state.register.phone_number,
        phone_with_code: state.register.phone_with_code,
        country_code: state.register.country_code,
        first_name: state.register.first_name,
        last_name: state.register.last_name,
        email: state.register.email,
    };
}

export default connect(mapStateToProps, null)(CreatePassword);