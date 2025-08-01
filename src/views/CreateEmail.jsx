import React, { useState, useEffect, useRef } from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    SafeAreaView,
    TextInput,
    StatusBar,
    Image, ScrollView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import { normal, bold, regular, f_xl, f_xs, f_m, logo } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import DropdownAlert from 'react-native-dropdownalert';
import { connect } from 'react-redux';
import { updateEmail } from '../actions/RegisterActions';

const CreateEmail = (props) => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    let dropDownAlertRef = useRef();
    const inputRef = useRef();

    const go_back = () => {
        navigation.goBack();
    }

    useEffect(() => {
        setTimeout(() => inputRef.current.focus(), 100)
    }, []);


    const check_valid = () => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)/;
        if (reg.test(email) === false) {
            dropDownAlertRef.alertWithType('error', 'Validation error', 'Please enter valid email');
            setEmail(email)
            return false;
        }
        else {
            setEmail(email)
            navigate();
        }
    }

    const navigate = async () => {
        props.updateEmail(email);
        navigation.navigate('CreatePassword');
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
              Enter your email address
            </Text>
         
            <View style={{ margin: 20 }} />
            <View style={{ width: "80%" }}>
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
                    name="email"
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
                    ref={inputRef}
                    secureTextEntry={false}
                    placeholder="Email"
                    placeholderTextColor={colors.grey}
                    style={styles.textinput}
                    onChangeText={(TextInputValue) => setEmail(TextInputValue)}
                  />
                </View>
              </View>
              <View style={{ margin: 30 }} />
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
                  Next
                </Text>
              </TouchableOpacity>
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

const mapDispatchToProps = (dispatch) => ({
    updateEmail: (data) => dispatch(updateEmail(data)),
});

export default connect(null, mapDispatchToProps)(CreateEmail);