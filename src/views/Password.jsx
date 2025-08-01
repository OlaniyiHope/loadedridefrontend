import React, { useState, useEffect, useRef } from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    SafeAreaView,
    TextInput,
    StatusBar
} from "react-native";
import { useNavigation, useRoute, CommonActions } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import { api_url, normal, bold, regular, login, btn_loader, f_xl, f_xs, f_m } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import DropdownAlert from 'react-native-dropdownalert';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import { updateFirstName, updateLastName, updateEmail } from '../actions/RegisterActions';
import { connect } from 'react-redux';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};
const Password = (props) => {
    const navigation = useNavigation();
    const route = useRoute();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [phone_number, setPhoneNumber] = useState(route.params.phone_number);
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
            call_login();
        } else {
            dropDownAlertRef.alertWithType('error', 'Validation error', 'Please enter your password');
        }
    }

    const call_login = async () => {
        setLoading(true);
        await axios({
            method: 'post',
            url: api_url + login,
            data: { phone_with_code: phone_number, password: password, fcm_token: global.fcm_token }
        })
            .then(async response => {
                setLoading(false);
                save_data(response.data.result, response.data.status, response.data.message);
            })
            .catch(error => {
                setLoading(false);
                dropDownAlertRef.alertWithType('error', 'Error', 'Sorry something went wrong');
            });
    }

    const navigate = async (data) => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "Home" }],
            })
        );
    }

    const save_data = async (data, status, message) => {
        setLoading(true)
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
                props.updateFirstName(data.first_name);
                props.updateLastName(data.last_name);
                props.updateEmail(data.email);
                setLoading(false);

                await navigate();
            } catch (e) {
                dropDownAlertRef.alertWithType('error', 'Error', 'Sorry something went wrong');
                setLoading(false);

            }
        } else {
                setLoading(false);

            dropDownAlertRef.alertWithType('error', 'Error', message);
        }
    }

    const forgot_password = () => {
        navigation.navigate('Forgot');
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
        <View style={{ margin: 20 }} />
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text
            numberOfLines={1}
            style={{
              color: colors.theme_fg_two,
              fontSize: f_xl,
              fontFamily: regular,
            }}
          >
            Enter your password
          </Text>
          <View style={{ margin: 5 }} />
          <Text
            numberOfLines={1}
            style={{ color: colors.grey, fontSize: f_xs, fontFamily: normal }}
          >
            You need enter your password
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
                  width: "60%",
                  alignItems: "flex-start",
                  paddingLeft: 10,
                  justifyContent: "center",
                  backgroundColor: colors.text_container_bg,
                }}
              >
                <TextInput
                  ref={inputRef}
                  secureTextEntry={secureTextEntry}
                  placeholder="Password"
                  placeholderTextColor={colors.grey}
                  style={styles.textinput}
                  onChangeText={(TextInputValue) => setPassword(TextInputValue)}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  ReactNativeHapticFeedback.trigger("impactHeavy", options);
                  setSecureTextEntry(!secureTextEntry);
                }}
                style={{
                  width: "20%",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: colors.text_container_bg,
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
            <Text
              onPress={forgot_password.bind(this)}
              numberOfLines={1}
              style={{
                color: colors.grey,
                fontSize: f_xs,
                fontFamily: normal,
                textAlign: "right",
              }}
            >
              Forget Password?
            </Text>
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
                  Login
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
});

const mapDispatchToProps = (dispatch) => ({
    updateEmail: (data) => dispatch(updateEmail(data)),
    updateFirstName: (data) => dispatch(updateFirstName(data)),
    updateLastName: (data) => dispatch(updateLastName(data)),
});

export default connect(null, mapDispatchToProps)(Password);