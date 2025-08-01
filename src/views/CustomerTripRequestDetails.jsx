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
import { useNavigation, useRoute, CommonActions } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import Icon, { Icons } from '../components/Icons';
import { normal, bold, get_bids, api_url, img_url, loader, no_data_loader, custome_accept, f_s, f_xs, f_tiny, f_xl, f_l, f_m, customer_accept, regular } from '../config/Constants';
import DropShadow from "react-native-drop-shadow";
import { Badge } from '@rneui/themed';
import axios from 'axios';
import Moment from 'moment';
import LottieView from 'lottie-react-native';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import Dialog from "react-native-dialog";
import { Button } from "react-native";

const CustomerTripRequestDetails = (props) => {
    const navigation = useNavigation();
    const route = useRoute();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState(1);
    const viewableItems = useSharedValue([]);
    const [trip_request_id, setTripRequestId] = useState(route.params.trip_request_id);
    const [dialog_visible, setDialogVisible] = useState(false);
    const [driver_id, setDriverId] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const go_back = () => {
        navigation.goBack();
    }

    useEffect(() => {
        call_get_bids();
    }, []);

    const call_get_bids = () => {
        console.log( api_url + get_bids)
        console.log( { trip_request_id: trip_request_id })
        setLoading(true);
        setRefreshing(true);
        axios({
            method: 'post',
            url: api_url + get_bids,
            data: { trip_request_id: trip_request_id }
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


    const call_confirm_booking = (id) => {
        setDriverId(id);
        showDialog();
    }

    const showDialog = () => {
        setDialogVisible(true);
    }

    const closeDialog = () => {
        setDialogVisible(false);
        call_customer_accept(driver_id);
    }

    const handleCancel = () => {
        setDialogVisible(false)
    }

    const handleAccept = async () => {
        closeDialog();
    }

    const call_customer_accept = (id) => {
        console.log( { trip_request_id: trip_request_id, driver_id: id })
        setLoading(true);
        axios({
            method: 'post',
            url: api_url + customer_accept,
            data: { trip_id: trip_request_id, driver_id: id }
        })
            .then(async response => {
                setLoading(false);
                navigate_home();
            })
            .catch(error => {
                setLoading(false);
                alert('Sorry something went wrong')
            });
    }

    const navigate_home =() => {
        navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Home" }],
            })
          );
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
                   
                    <TouchableOpacity activeOpacity={1} style={{ alignItems: 'center', borderRadius: 10,marginTop:0  }}>
                        <DropShadow
                            style={{
                                width: '100%',
                                marginBottom: 0,
                                marginTop: 0,                       
                            }}
                        >
                            <View style={{flex: 1,width:'100%', backgroundColor: colors.theme_bg_three, borderRadius: 10 }}>                              
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{
                                    width: 90,
                                    height: 90,
                                    padding: 10,             
                                
                                    justifyContent: 'center', 
                                    alignItems: 'center',
                                }}>
                                    <Image
                                        style={{
                                            height: '100%',    
                                            width: '100%',      
                                            borderRadius: 10,   
                                        }}
                                        source={{ uri: img_url + item.profile_picture }}
                                    />
                                </View>
                            </View>
                                <View style={{width:'70%',justifyContent:'center',alignItems:'flex-start',}}>
                                    <Text style={{marginTop:5,textTransform:'uppercase', color: colors.theme_bg_two, fontSize: f_s, fontFamily: regular ,}}>{item.first_name}  {item.last_name}</Text>          
                                    <Text style={{ color: 'gray', fontSize: f_xs, fontFamily: regular, }}>{item.vehicle_type}-{item.vehicle_name}-{item.vehicle_number}</Text>                       
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>                                  

                                        <Text style={{ color: 'gray', fontSize: f_xs, fontFamily: regular, marginRight: 2}}>
                                            {global.currency} {item.amount.toFixed(2)} |
                                        </Text>

                                        <Icon 
                                            type={Icons.MaterialIcons} 
                                            name="insert-drive-file"           
                                            color="gray"
                                            style={{ fontSize: 12, marginRight: 2 }}  // Adjusted margin
                                        />
                                        <Text style={{ color: 'gray', fontSize: f_xs, fontFamily: regular }}>
                                            {item.licence_number}
                                        </Text>
                                    </View>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', width: '100%', padding: 10 ,justifyContent:'space-evenly'}}>                                   
                              {/*   <TouchableOpacity
                                    style={{
                                        backgroundColor: colors.theme_bg_three,
                                        width: '48%',           // Reduced width
                                        padding: 8,            // Reduced padding
                                        marginRight: '4%',     // Adjusted margin for better spacing
                                        borderRadius: 10,       // Slightly smaller border radius
                                         
                                        borderWidth:.5,
                                        borderColor:'#d3d3d3'         // Elevation for Android
                                    }}
                                >
                                    <Text style={{
                                        textAlign: 'center',
                                        color: colors.theme_fg_two,
                                        fontSize: f_s,          // Adjust font size if needed
                                        fontFamily: regular,
                                    }}>
                                        Decline
                                    </Text>
                                </TouchableOpacity>     */}                        

                                <TouchableOpacity
                                    onPress={call_confirm_booking.bind(this, item.id)}
                                    style={{
                                        backgroundColor: colors.theme_bg,
                                        width: '100%',           // Reduced width
                                        padding: 8,            // Reduced padding
                                        borderRadius: 10,       // Slightly smaller border radius
                                        shadowColor: '#000',         // Shadow color
                                        shadowOffset: { width: 0, height: 2 }, // Slight shadow offset
                                        shadowOpacity: 1,         // Light shadow opacity
                                        shadowRadius: 3,             // Shadow radius for soft edges
                                        elevation: 2,                // Elevation for Android
                                        justifyContent: 'center',    // Center the content horizontally
                                        alignItems: 'center',        // Center the content vertically
                                    }}
                                >
                                    <Text style={{
                                        textAlign: 'center',
                                        color: colors.theme_bg_three,
                                        fontSize: f_s,          // Adjust font size if needed
                                        fontFamily: regular,
                                    }}>
                                        Accept
                                    </Text>
                                </TouchableOpacity>

                                </View>                            
                            </View>
                        </DropShadow>
                        <View style={{
                            height: .4,                      // Height of the divider
                            backgroundColor: '#d3d3d3',   // Light grey color
                            width: '100%',                 // Full width of the container or parent
                            marginTop: 10, 
                                       // Space above and below the divider (optional)
                        }} />
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
        <SafeAreaView style={{ backgroundColor: colors.theme_fg_three, flex: 1 }}>
            <StatusBar
                backgroundColor={colors.theme_bg}
            />

            <View style={[styles.header]}>
                <TouchableOpacity activeOpacity={1} onPress={go_back.bind(this)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.theme_fg_three} style={{ fontSize: 30 }} />
                </TouchableOpacity>
                <View activeOpacity={1} style={{ width: '85%', alignItems: 'flex-start', justifyContent: 'center' }}>
                    <Text numberOfLines={1} ellipsizeMode='tail' style={{ color: colors.theme_fg_three, fontSize: f_l, fontFamily: regular }}>Choose Your Driver</Text>
                </View>
            </View>
            <View style={{justifyContent:'center',alignItems:'center',margin:20 , marginBottom:0,backgroundColor:colors.theme_bg_three,padding:10,
                 borderRadius: 10,
                 shadowColor: "#000", // iOS
                 shadowOffset: { width: 0, height: 1 }, // iOS
                 shadowOpacity: 0.25, // iOS
                 shadowRadius: 3, // iOS
                 elevation: 1, // Android
            }}>
                <Text style={{color:colors.theme_bg_two,fontSize:f_m,fontFamily:regular}}>Available Drivers</Text>
            </View>
            {loading == true ?
                <View style={{ height: 100, width: 100, alignSelf: 'center', marginTop: '30%' }}>
                    <LottieView source={loader} autoPlay loop />
                </View>
                :                
                    data &&
                        <FlatList
                            data={data}
                            contentContainerStyle={{ paddingTop: 20 }}
                            viewabilityConfigCallbackPairs={
                                viewabilityConfigCallbackPairs.current
                            }
                            renderItem={({ item }) => {
                                return <ListItem item={item} viewableItems={viewableItems} />;
                            }}
                            onRefresh={call_get_bids}
                            refreshing={refreshing}
                            ListEmptyComponent={  <View style={{ height: 300, width: 300, alignSelf: 'center', marginTop: '30%' }}>
                            <LottieView source={no_data_loader} autoPlay loop />
                        </View>}
                        />
                        
                      
                    
          
            }
            <Dialog.Container visible={dialog_visible}>
                <Dialog.Title>Accept this driver</Dialog.Title>
                <Dialog.Description>
                    Do you want to confirm with this driver?
                </Dialog.Description>
                <Dialog.Button label="Yes" onPress={handleAccept} />
                <Dialog.Button label="No" onPress={handleCancel} />
            </Dialog.Container>
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

export default CustomerTripRequestDetails;