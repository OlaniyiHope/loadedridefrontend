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
import { updateFirstName, updateLastName } from '../actions/RegisterActions';

const CreateName = (props) => {
    const navigation = useNavigation();
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    let dropDownAlertRef = useRef();
    const inputRef = useRef();

    const go_back = () => {
        navigation.goBack();
    }




    const check_valid = async () => {
        if (first_name != '' && last_name != '') {
            navigate();
        } else {
            dropDownAlertRef.alertWithType('error', 'Validation error', 'Please enter all the required fields');
        }
    }

    const navigate = async () => {
        props.updateFirstName(first_name);
        props.updateLastName(last_name);
        navigation.navigate('CreateEmail');
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
              Enter your name
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
                    name="badge"
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
                    placeholder="First Name"
                    secureTextEntry={false}
                    placeholderTextColor={colors.grey}
                    style={styles.textinput}
                    onChangeText={(TextInputValue) =>
                      setFirstName(TextInputValue)
                    }
                  />
                </View>
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
                    name="badge"
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
                    placeholder="Last Name"
                    secureTextEntry={false}
                    placeholderTextColor={colors.grey}
                    style={styles.textinput}
                    onChangeText={(TextInputValue) =>
                      setLastName(TextInputValue)
                    }
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
    updateFirstName: (data) => dispatch(updateFirstName(data)),
    updateLastName: (data) => dispatch(updateLastName(data)),
});

export default connect(null, mapDispatchToProps)(CreateName);