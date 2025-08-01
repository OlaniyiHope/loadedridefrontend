//List
import React, { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View, Text, TouchableOpacity, FlatList, PermissionsAndroid, ViewToken, Image, Linking, Alert } from 'react-native';
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { normal, bold, api_url, get_sos_list, maxHeaderHeight, img_url, f_s, f_xl, f_30, regular } from '../config/Constants';
import axios from 'axios';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import Geolocation from '@react-native-community/geolocation';

const CustomerSafety = (props) => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState("");
    const viewableItems = useSharedValue([]);

    const go_back = () => {
        navigation.goBack();
    }

    useEffect(() => {
        call_get_sos_list();
    }, []);

    const call_get_sos_list = () => {
        setLoading(true);
        axios({
            method: 'get',
            url: api_url + get_sos_list,
        })
            .then(async response => {
                setLoading(false);
                setData(response.data.result)
            })
            .catch(error => {
                setLoading(false);
                alert('Sorry something went wrong')
            });
    }

    const choose_contact = (item) => {
        if(item.id = 1){
            call_police_number(item.phone_number)
        }else if(item.id = 2){
            call_ambulance_number(item.phone_number)
        }else if(item.id = 3){
            call_suport_team(item.phone_number)
        }else if(item.id = 4){
            send_sos();
        }
    }

    const send_sos = async () => {
        Alert.alert(
            'Please confirm',
            'Are you in emergency ?',
            [
                {
                    text: 'Yes',
                    onPress: () => get_location()
                },
                {
                    text: 'No',
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                }
            ],
            { cancelable: false }
        );
    }

    const get_location = async () => {
        if (Platform.OS == "android") {
            await requestCameraPermission();
        } else {
            await getInitialLocation();
        }
    }

    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                'title': 'Location access required',
                'message': { app_name } + 'Needs to access your location for tracking'
            }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                await getInitialLocation();
            } else {
                alert('Sorry unable to fetch your location');
            }
        } catch (err) {
            alert('Sorry unable to fetch your location');
        }
    }

    const getInitialLocation = async () => {
        Geolocation.getCurrentPosition(async (position) => {
            call_sos_sms(position.coords.latitude, position.coords.longitude);
        }, error => console.log('Unable fetch your location'),
            { enableHighAccuracy: false, timeout: 10000 });
    }

    const navigate_add_contact = () => {
        navigation.navigate("AddEmergencyContact")
    }

    const call_sos_sms = (lat, lng) => {
        setLoading(true);
        axios({
            method: 'post',
            url: api_url + sos_sms,
            data: { customer_id: global.id, booking_id: trip_id, latitude: lat, longitude: lng, lang: global.lang }
        })
            .then(async response => {
                setLoading(false);
                if (response.data.status == 1) {
                    alert(response.data.message);
                } if (response.data.status == 2) {
                    alert(response.data.message);
                } else {
                    Alert.alert(
                        'Alert',
                        response.data.message,
                        [
                            {
                                text: 'Okay',
                                onPress: () => navigate_add_contact()
                            },
                            {
                                text: 'Cancel',
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel"
                            }
                        ],
                        { cancelable: false }
                    );
                }
            })
            .catch(error => {
                setLoading(false);
                alert('Sorry something went wrong3')
            });
    }


    const call_police_number = (phone_number) => {
        Linking.openURL(`tel:${phone_number}`)
    }

    const call_ambulance_number = (phone_number) => {
        Linking.openURL(`tel:${phone_number}`)
    }

    const call_suport_team = (phone_number) => {
        Linking.openURL(`tel:${phone_number}`)
    }

    type ListItemProps = {
        viewableItems: Animated.SharedValue<ViewToken[]>;
        item: {
            id: number;
        };
    };

    const ListItem: React.FC<ListItemProps> = React.memo(
        ({ item, viewableItems }) => {
            const rStyle = useAnimatedStyle(() => {
                const isVisible = Boolean(
                    viewableItems.value
                        .filter((item) => item.isViewable)
                        .find((viewableItem) => viewableItem.item.id === item.id)
                );
                return {
                    opacity: withTiming(isVisible ? 1 : 0),
                    transform: [
                        {
                            scale: withTiming(isVisible ? 1 : 0.6),
                        },
                    ],
                };
            }, []);
            return (
                <Animated.View style={[
                    {
                        width: '100%',
                    },
                    rStyle,
                ]}>
                    <TouchableOpacity activeOpacity={1} onPress={choose_contact.bind(this, item)} style={{ flexDirection: 'row', padding: 20 }}>
                        <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ width: 50, height: 50 }} >
                                <Image style={{ height: undefined, width: undefined, flex: 1, borderRadius: 10 }} source={{ uri: img_url + item.icon }} />
                            </View>
                        </View>
                        <View style={{ width: '80%', alignItems: 'flex-start', justifyContent: 'center' }}>
                            <Text style={{ color: colors.theme_fg_two, fontSize: f_s, fontFamily: normal }}>{item.sos_name}</Text>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            );
        }
    );

    const onViewableItemsChanged = ({ viewableItems: vItems }) => {
        viewableItems.value = vItems;
    };

    const viewabilityConfigCallbackPairs = useRef([{ onViewableItemsChanged }]);

    return (
        <View style={styles.container}>
            <View style={[styles.header]}>
                <TouchableOpacity activeOpacity={1} onPress={go_back.bind(this)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_three} style={{ fontSize: 30 }} />
                </TouchableOpacity>
                <View activeOpacity={1} style={{ width: '85%', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_three, fontSize: f_xl, fontFamily: regular }}>Safety Contacts</Text>
                </View>
            </View>
            <FlatList
                data={data}
                contentContainerStyle={{ paddingTop: 20 }}
                viewabilityConfigCallbackPairs={
                    viewabilityConfigCallbackPairs.current
                }
                renderItem={({ item }) => {
                    return <ListItem item={item} viewableItems={viewableItems} />;
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 60,
        backgroundColor: colors.theme_bg,
        flexDirection: 'row',
        alignItems: 'center'
    },
    container: {
        flex: 1,
    },
    title: {
        backgroundColor: 'transparent',
        color: 'white',
        fontSize: 18,
    },
});

export default CustomerSafety;