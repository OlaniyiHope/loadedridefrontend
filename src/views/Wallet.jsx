import React, { useState, useEffect, useRef } from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    SafeAreaView,
    ScrollView,
    Image,
    StatusBar,
    FlatList
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { normal, bold, img_url, api_url, add_wallet, no_data_loader, income_icon, expense_icon, payment_methods, app_name, wallet, f_xs, f_s, f_m, f_xl, f_30, regular, f_l, FLUTTERWAVE_KEY } from '../config/Constants';
import DropShadow from "react-native-drop-shadow";
import RazorpayCheckout from 'react-native-razorpay';
import RBSheet from "react-native-raw-bottom-sheet";
import DialogInput from 'react-native-dialog-input';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import Moment from 'moment';
import DropdownAlert from 'react-native-dropdownalert';

import { connect } from 'react-redux';
import NetInfo from "@react-native-community/netinfo";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};
import { PayWithFlutterwave } from "flutterwave-react-native";

const Wallet = (props) => {
    const navigation = useNavigation();
    let dropDownAlertRef = useRef();
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(0);
    const [payment_methods_list, setPaymentMethodsList] = useState([]);
    const wallet_ref = useRef(null);
    const [data, setData] = useState([]);
    const [all, setAll] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [receives, setReceives] = useState([]);
    const [isDialogVisible, setDialogVisible] = useState(false);
    const ref_flutterwave_sheet = useRef(null);

    const [wallet_amount, setWalletAmount] = useState(0);
    const [filter, setFilter] = useState(1);

    const go_back = () => {
ReactNativeHapticFeedback.trigger("impactLight", options);

        navigation.toggleDrawer();
    }

    useEffect(() => {
        console.log(global.currency_short_code);
        const unsubscribe = navigation.addListener("focus", async () => {
          
            call_wallet();
            call_payment_methods();
        });

        return (
            unsubscribe
        );
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
    const call_add_wallet = () => {
        setLoading(true);
        axios({
            method: 'post',
            url: api_url + add_wallet,
            data: { id: global.id, amount: amount }
        })
        .then(async response => {
            setLoading(false);
            if(response.data.status == 1){
                call_wallet();
                dropDownAlertRef.alertWithType('success', 'Success', 'Amount successfully added to your wallet');
            }else{
                dropDownAlertRef.alertWithType('error', 'Error', response.data.message);
            }
            
        })
        .catch(error => {
            setLoading(false);
            alert('Sorry something went wrong')
        });
    }
 const handleOnRedirect = (data) => {
   ref_flutterwave_sheet.current.close();
   if (data.status == "successful") {
     call_add_wallet();
   } else {
    alert("Sorry something went wrong");

     
   }
 };
    const call_payment_methods = () => {
        setLoading(true);
        axios({
            method: 'post',
            url: api_url + payment_methods,
            data: { lang: global.lang }
        })
        .then(async response => {
            setLoading(false);
             if(response.data.status == 1){
                setPaymentMethodsList(response.data.result)
            }
        })
        .catch(error => {
            setLoading(false);
            alert('Sorry something went wrong')
        });
    }

    const choose_payment = async (total_fare) => {
        if (total_fare == '' || total_fare == undefined || total_fare == 0) {
            alert('Please enter valid amount')
        } else {
            setDialogVisible(false);
            setAmount(total_fare);
            await wallet_ref.current.open()
        }
    }

    const select_payment = async (item) => {
        await payment_done(item.id);
        await wallet_ref.current.close();
    }

    const payment_done = async (payment_id) => {
        if (payment_id != 0) {
            if (payment_id == 5) {
                call_razorpay(); 
            }else if(payment_id == 7){
                ref_flutterwave_sheet.current.open();
            }
        }
        else {
            alert("Sorry something went wrong");
        }
    }



    const open_dialog = () =>{
        setDialogVisible(true);
    }
    
    const close_dialogbox = () =>{
    setDialogVisible(false);
    }

    const call_razorpay = async () => {
        var options = {
            currency: global.currency_short_code,
            key: global.razorpay_key,
            amount: amount * 100,
            name: app_name,
            prefill: {
                contact: global.phone_with_code,
                name: global.first_name,
                email: global.email
            },
            theme: { color: colors.theme_fg }
        }
        RazorpayCheckout.open(options).then((data) => {
            call_add_wallet();
        }).catch((error) => {
            alert('Transaction declined');
        });
    }

    const change_filter = (id) => {
ReactNativeHapticFeedback.trigger("impactLight", options);

        setFilter(id);
        if(id == 1){
            setData(all);
        }else if(id == 2){
            setData(expenses);
        }else if(id == 3){
            setData(receives);
        }
    }

    const call_wallet = () => {
        setLoading(true);
        axios({
            method: 'post',
            url: api_url + wallet,
            data: { id: global.id }
        })
        .then(async response => {
            setLoading(false);
            setWalletAmount(response.data.result.wallet);
            setAll(response.data.result.all);
            setExpenses(response.data.result.expenses);
            setReceives(response.data.result.receives);
            setFilter(1);
            setData(response.data.result.all);
        })
        .catch(error => {
            setLoading(false);
            alert('Sorry something went wrong')
        });
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

    const show_list = ({ item }) => (
        <View style={{ flexDirection: 'row', width: '100%', marginTop: 10, marginBottom: 10 }}>
            <View style={{ width: 70, alignItems: 'flex-start', justifyContent: 'center' }}>
                {item.type == 1 ? 
                <View style={{ height: 50, width: 50 }}>
                    <Image source={income_icon} style={{ flex: 1, height: undefined, width: undefined }} />
                </View>
                :
                <View style={{ height: 50, width: 50 }}>
                    <Image source={expense_icon} style={{ flex: 1, height: undefined, width: undefined }} />
                </View>
                }
            </View>
            <View style={{ width: '50%', alignItems: 'flex-start', justifyContent: 'center' }}>
                <Text style={{ color: colors.text_grey, fontSize: f_xs, fontFamily: normal }}>{Moment(item.created_at).format("DD-MMM-YYYY")}</Text>
                <View style={{ margin: 2 }} />
                <Text style={{ color: colors.theme_fg_two, fontSize: f_s, fontFamily: regular }}>{item.message}</Text>
            </View>
            <View style={{ width: '30%', alignItems: 'flex-end', justifyContent: 'center' }}>
                {item.type == 1 ? 
                <Text style={{ color: colors.success, fontSize: f_m, fontFamily: normal }}>+ {global.currency}{item.amount}</Text>
                :
                <Text style={{ color: colors.error, fontSize: f_m, fontFamily: normal }}>- {global.currency}{item.amount}</Text>
                }
            </View>
        </View>
    );

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
              color={colors.theme_fg_three}
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
                color: colors.theme_fg_three,
                fontSize: f_xl,
                fontFamily: regular,
              }}
            >
              Wallet
            </Text>
          </View>
        </View>
        <ScrollView>
          <View style={{ alignItems: "center", padding: 20 }}>
            <DropShadow
              style={{
                width: "100%",
                marginBottom: 5,
                marginTop: 5,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
                shadowOpacity: 0.1,
                shadowRadius: 5,
              }}
            >
              <View
                style={{
                  width: "100%",
                  backgroundColor: colors.theme_bg_three,
                  borderRadius: 10,
                  padding: 20,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      width: "15%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon
                      type={Icons.MaterialIcons}
                      name="credit-card"
                      color={colors.theme_fg_two}
                      style={{ fontSize: 30 }}
                    />
                  </View>
                  <View
                    style={{
                      width: "55%",
                      alignItems: "flex-start",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={{
                        color: colors.text_grey,
                        fontSize: f_s,
                        fontFamily: regular,
                      }}
                    >
                      Total wallet balance
                    </Text>
                  </View>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={open_dialog}
                    style={{
                      width: "30%",
                      alignItems: "flex-end",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{
                        color: colors.theme_fg,
                        fontSize: f_xs,
                        fontFamily: normal,
                      }}
                    >
                      Top up +
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      height: 2,
                      borderBottomWidth: 1,
                      borderColor: colors.grey,
                    }}
                  />
                </View>
                <View
                  style={{
                    height: 10,
                    borderBottomWidth: 1,
                    borderColor: colors.grey,
                    width: "85%",
                    alignSelf: "flex-end",
                    borderStyle: "dotted",
                    marginBottom: 10,
                  }}
                />
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      marginLeft: "15%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{
                        color: colors.theme_fg_two,
                        fontSize: f_30,
                        fontFamily: normal,
                        letterSpacing: 1,
                      }}
                    >
                      {global.currency}
                      {wallet_amount}
                    </Text>
                  </View>
                </View>
              </View>
            </DropShadow>
          </View>
          <View style={{ padding: 20 }}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                color: colors.text_grey,
                fontSize: f_s,
                fontFamily: regular,
              }}
            >
              Transactions List
            </Text>
            <View style={{ margin: 10 }} />
            <View style={{ flexDirection: "row", width: "100%" }}>
              <View
                style={{
                  width: "33%",
                  alignItems: "flex-start",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  onPress={change_filter.bind(this, 1)}
                  style={[
                    filter == 1
                      ? styles.segment_active_bg
                      : styles.segment_inactive_bg,
                  ]}
                >
                  <Text
                    style={[
                      filter == 1
                        ? styles.segment_active_fg
                        : styles.segment_inactive_fg,
                    ]}
                  >
                    All
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: "33%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  onPress={change_filter.bind(this, 2)}
                  style={[
                    filter == 2
                      ? styles.segment_active_bg
                      : styles.segment_inactive_bg,
                  ]}
                >
                  <Text
                    style={[
                      filter == 2
                        ? styles.segment_active_fg
                        : styles.segment_inactive_fg,
                    ]}
                  >
                    Expenses
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: "33%",
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  onPress={change_filter.bind(this, 3)}
                  style={[
                    filter == 3
                      ? styles.segment_active_bg
                      : styles.segment_inactive_bg,
                  ]}
                >
                  <Text
                    style={[
                      filter == 3
                        ? styles.segment_active_fg
                        : styles.segment_inactive_fg,
                    ]}
                  >
                    Receives
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ margin: 10 }} />
            <View style={{ flex: 1 }}>
              {data.length > 0 ? (
                <FlatList
                  data={data}
                  renderItem={show_list}
                  keyExtractor={(item) => item.id}
                />
              ) : (
                <View style={{ height: 300, width: 300, alignSelf: "center" }}>
                  <LottieView source={no_data_loader} autoPlay loop />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
        <RBSheet
          ref={ref_flutterwave_sheet}
          height={200}
          openDuration={250}
          closeOnDragDown={true}
          closeOnPressMask={true}
          customStyles={{
            container: [styles.sheetContainer, { padding: 20 }],
            draggableIcon: styles.draggableIcon,
          }}
        >
          <View style={{ margin: 10 }} />
          <PayWithFlutterwave
            onRedirect={handleOnRedirect}
            options={{
              tx_ref: Date.now() + "-" + global.id,
              authorization: FLUTTERWAVE_KEY,
              customer: {
                email: global.email,
              },
              amount: amount,
              currency: global.currency_short_code,
              payment_options: "card",
            }}
          />
        </RBSheet>
        <RBSheet
          ref={wallet_ref}
          height={250}
          animationType="fade"
          duration={250}
        >
          <View
            style={{
              padding: 15,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white", // Necessary for the shadow to be visible
              shadowColor: "#000", // Black shadow color
              shadowOffset: { width: 0, height: 2 }, // Position of the shadow
              shadowOpacity: 0.2, // Opacity of the shadow
              shadowRadius: 3, // Blur radius of the shadow
              elevation: 3, // Elevation for Android (height of the shadow)
            }}
          >
            <Text
              style={{
                fontSize: f_l,
                fontFamily: regular,
                color: colors.theme_bg_two,
              }}
            >
              Choose Your Payment Method
            </Text>
          </View>
          <FlatList
            data={payment_methods_list}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={{ flexDirection: "row", padding: 20 }}
                onPress={select_payment.bind(this, item)}
              >
                <View style={{ width: 50 }}>
                  <Image
                    style={{ flex: 1, height: 35, width: 35 }}
                    source={{ uri: img_url + item.icon }}
                  />
                </View>
                <View
                  style={{
                    width: "80%",
                    alignItems: "flex-start",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: normal,
                      fontSize: f_m,
                      alignItems: "center",
                      justifyContent: "flex-start",
                      color: colors.theme_fg_two,
                    }}
                  >
                    {item.payment}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />
        </RBSheet>
        <DialogInput
          isDialogVisible={isDialogVisible}
          title="Add Walet"
          message="Please enter your amount"
          hintInput="Enter Amount"
          textInputProps={{ keyboardType: "numeric" }}
          submitInput={(inputText) => {
            choose_payment(inputText);
          }}
          closeDialog={close_dialogbox}
        >
          submitText="Submit" cancelText="Cancel"
        </DialogInput>
        {drop_down_alert()}
      </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 60,
        backgroundColor: colors.theme_bg,
        flexDirection: 'row',
        alignItems: 'center'
    },
    segment_active_bg: { padding: 5, width: 100, backgroundColor: colors.theme_bg, alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
    segment_active_fg: { color: colors.theme_fg_three, fontSize: 14, fontFamily: normal },
    segment_inactive_bg: { padding: 5, width: 100, alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
    segment_inactive_fg: { color: colors.text_grey, fontSize: 14, fontFamily: normal }
});

function mapStateToProps(state){
    return{
      stripe_payment_status : state.payment.stripe_payment_status
    };
  }
  
  const mapDispatchToProps = (dispatch) => ({ 
    stripePaymentStatus: (data) => dispatch(stripePaymentStatus(data))
  });
  
  export default connect(mapStateToProps,mapDispatchToProps)(Wallet);