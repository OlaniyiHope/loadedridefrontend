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
import { useNavigation, CommonActions } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { normal, bold, trip_details, ongoing_trip_requests, api_url, img_url, loader, no_data_loader, cancel, f_s, f_xs, f_tiny, f_xl, regular } from '../config/Constants';
import DropShadow from "react-native-drop-shadow";
import { Badge } from '@rneui/themed';
import axios from 'axios';
import Moment from 'moment';
import LottieView from 'lottie-react-native';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import NetInfo from "@react-native-community/netinfo";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const CustomerTripRequest = (props) => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState(1);
    const viewableItems = useSharedValue([]);
    const [refreshing, setRefreshing] = useState(false);
    const go_back = () => {
ReactNativeHapticFeedback.trigger("impactLight", options);

        navigation.toggleDrawer();
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", async () => {
            call_ongoing_trip_requests();
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
    const call_ongoing_trip_requests = () => {
        setLoading(true);
        setRefreshing(true);
        axios({
            method: 'post',
            url: api_url + ongoing_trip_requests,
            data: { customer_id: global.id }
        })
            .then(async response => {
                setTimeout(function () {
                    setLoading(false);
                    setData(response.data.result)
                    setRefreshing(false);
                }, 1000)
            })
            .catch(error => {
                setLoading(false);
                alert('Sorry something went wrong')
            });
    }

    const navigate_trip_detail = (trip_request_id) => {
        navigation.navigate("CustomerTripRequestDetails", { trip_request_id: trip_request_id })
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
                    <TouchableOpacity activeOpacity={1} onPress={navigate_trip_detail.bind(this, item.id)} style={{ alignItems: 'center', borderRadius: 10, padding: 10 }}>
                        <DropShadow
                            style={{
                                width: '95%',
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
                            <View style={{ flexDirection: 'row', flex: 1, backgroundColor: colors.theme_bg_three, padding: 15, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                                <View style={{ width: '33%', alignItems: 'center', justifyContent: 'center' }}>
                                <Image
                                        style={{
                                            height: 60,    
                                            width: 60,      
                                            borderRadius: 10,   
                                        }}
                                        source={{ uri: img_url + item.profile_picture }}
                                    />
                                </View>
                                <View style={{ width: '33%', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ color: colors.text_grey, fontSize: f_xs, fontFamily: normal }}>Your Fare</Text>
                                    <View style={{ margin: 3 }} />
                                    <Text style={{ fontSize: f_s, fontFamily: bold, color: colors.theme_fg_two }}>{global.currency}{item.total}</Text>
                                </View>
                                <View style={{ width: '33%', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ color: colors.text_grey, fontSize: f_xs, fontFamily: normal }}>Distance</Text>
                                    <View style={{ margin: 3 }} />
                                    <Text style={{ color: colors.theme_fg_two, fontSize: f_s, fontFamily: bold }}>{item.distance} km</Text>
                                </View>
                            </View>
                            <View style={{ bottomBorderWidth: 0.5, borderColor: colors.grey, height: 1 }} />
                            <View style={{ flex: 1, backgroundColor: colors.theme_bg_three, padding: 15, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                                <View style={{ width: '100%', alignItems: 'flex-start', justifyContent: 'center' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Badge status="success" />
                                        <View style={{ margin: 5 }} />
                                        {item.actual_pickup_address ?
                                            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: f_xs, fontFamily: normal }}>{item.actual_pickup_address}</Text>
                                            :
                                            <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: f_xs, fontFamily: normal }}>{item.pickup_address}</Text>
                                        }
                                    </View>
                                    {item.trip_type != 'Rental' &&
                                        <View>
                                            <View style={{ height: 20, borderLeftWidth: 1, marginLeft: 3, borderStyle: 'dotted' }} />
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Badge status="error" />
                                                <View style={{ margin: 5 }} />
                                                {item.actual_drop_address ?
                                                    <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: f_xs, fontFamily: normal }}>{item.actual_drop_address}</Text>
                                                    :
                                                    <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: f_xs, fontFamily: normal }}>{item.drop_address}</Text>
                                                }
                                            </View>
                                        </View>
                                    }
                                </View>
                                <View style={{ margin: 5, marginTop: 10, flexDirection: 'row', width: '100%' }}>
                                    <View style={{ width: '50%', alignItems: 'flex-start', justifyContent: 'center' }}>
                                        <Text style={{ fontSize: f_tiny, fontFamily: normal, color: colors.text_grey }}>{Moment(item.pickup_date).format("DD-MMM-YYYY")}</Text>
                                    </View>
                                    <View style={{ width: '50%', alignItems: 'flex-start', justifyContent: 'center' }}>
                                        <Text style={{ fontSize: f_tiny, fontFamily: normal, color: colors.text_grey, alignSelf: 'flex-end' }}>{Moment(item.pickup_date).format("hh:mm a")}</Text>
                                    </View>
                                </View>
                            </View>
                        </DropShadow>
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
        <SafeAreaView style={{ backgroundColor: colors.lite_bg, flex: 1 }}>
            <StatusBar
                backgroundColor={colors.theme_bg}
            />

            <View style={[styles.header]}>
                <TouchableOpacity activeOpacity={1} onPress={go_back.bind(this)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_three} style={{ fontSize: 30 }} />
                </TouchableOpacity>
                <View activeOpacity={1} style={{ width: '85%', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_three, fontSize: f_xl, fontFamily: regular }}>Trip Request</Text>
                </View>
            </View>
            {loading == true ?
                <View style={{ height: 100, width: 100, alignSelf: 'center', marginTop: '30%' }}>
                    <LottieView source={loader} autoPlay loop />
                </View>
                :
                <ScrollView>
    
                        <FlatList
                            data={data}
                            contentContainerStyle={{ paddingTop: 20 }}
                            viewabilityConfigCallbackPairs={
                                viewabilityConfigCallbackPairs.current
                            }
                            renderItem={({ item }) => {
                                return <ListItem item={item} viewableItems={viewableItems} />;
                            }}
                            onRefresh={call_ongoing_trip_requests}
                            refreshing={refreshing}
                            ListEmptyComponent={ <View style={{ height: 300, width: 300, alignSelf: 'center', marginTop: '30%' }}>
                            <LottieView source={no_data_loader} autoPlay loop />
                        </View>}
                        />
                        
                  
                </ScrollView>
            }
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
    segment_active_bg: { width: '33%', alignItems: 'center', justifyContent: 'center', padding: 15, backgroundColor: colors.theme_bg, borderRadius: 10 },
    segment_active_fg: { color: colors.theme_fg_two, fontSize: 12, fontFamily: bold, color: colors.theme_fg_three },
    segment_inactive_bg: { width: '33%', alignItems: 'center', justifyContent: 'center', padding: 15, backgroundColor: colors.theme_bg_three, borderRadius: 10 },
    segment_inactive_fg: { color: colors.theme_fg_two, fontSize: 12, fontFamily: normal, color: colors.theme_fg_two }
});

export default CustomerTripRequest;