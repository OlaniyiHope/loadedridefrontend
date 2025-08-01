import React, { useState, useEffect, useRef } from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    ScrollView,
    Image,
    StatusBar,
    FlatList,
    Linking,
    Alert,
    Platform,
    PermissionsAndroid
} from "react-native";
import { useNavigation, useRoute, CommonActions } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import { screenHeight, GOOGLE_KEY, screenWidth, normal, bold, app_name, sos, regular, api_url, trip_details, img_url, get_tips, add_tip, trip_cancel, loader, sos_sms, f_s, f_xs, f_tiny } from '../config/Constants';
import BottomSheet from 'react-native-simple-bottom-sheet';
import Icon, { Icons } from '../components/Icons';
import MapView, { Marker, PROVIDER_GOOGLE, AnimatedRegion, MarkerAnimated, Polyline } from 'react-native-maps';
import DropShadow from "react-native-drop-shadow";
import LottieView from 'lottie-react-native';
import { Badge } from '@rneui/themed';
import { connect } from 'react-redux';
import axios from 'axios';
import Dialog, { DialogTitle, SlideAnimation, DialogContent, DialogFooter, DialogButton } from 'react-native-popup-dialog';
import database from '@react-native-firebase/database';
import DropdownAlert from 'react-native-dropdownalert';
import Geolocation from '@react-native-community/geolocation';
import { decode, encode } from "@googlemaps/polyline-codec";

const TripDetails = (props) => {
    const navigation = useNavigation();
    const route = useRoute();
    const map_ref = useRef();
    //const driver_loc = useRef();
    let dropDownAlertRef = useRef();
    const [region, setRegion] = useState(props.initial_region);
    const [loading, setLoading] = useState(false);
    const [cancel_loading, setCancelLoading] = useState(false);
    const [data, setData] = useState(route.params.data);
    const [trip_id, setTripId] = useState(route.params.trip_id);
    const [from, setFrom] = useState(route.params.from);
    const [dialog_visible, setDialogVisible] = useState(false);
    const [driver_track, setDriverTrack] = useState(null);
    const [coords, setCoords] = useState([]);
    const [on_load, setOnLoad] = useState(0);

    const [is_mount, setIsMount] = useState(0);
    const [pickup_statuses, setPickupStatuses] = useState([1, 2]);
    const [cancellation_reason, setCancellationReasons] = useState([]);
    const [cancellation_statuses, setCancellationStatuses] = useState([6, 7]);
    const [drop_statuses, setDropStatuses] = useState([3, 4]);
    const [driver_location, setDriverLocation] = useState({ latitude: 9.914372, longitude: 78.155033 });
    const [driver_location_ios, setDriverLocationIos] = useState(new AnimatedRegion({ latitude: 9.914372, longitude: 78.155033 }));
    const [home_marker, setHomeMarker] = useState({ latitude: parseFloat(route.params.data.trip.pickup_lat), longitude: parseFloat(route.params.data.trip.pickup_lng) });
    const [destination_marker, setDestinaionMarker] = useState({ latitude: parseFloat(route.params.data.trip.drop_lat), longitude: parseFloat(route.params.data.trip.drop_lng) });
    const [bearing, setBearing] = useState(0);
    const go_back = () => {
        if (from == 'home') {
            navigation.navigate('Dashboard')
        } else {
            navigation.goBack();
        }
    }

    const showDialog = () => {
        setDialogVisible(true);
    }

    useEffect(() => {
        call_trip_details();
        const onValueChange = database().ref(`/trips/${trip_id}`)
            .on('value', snapshot => {
                console.log(snapshot.val())
                if (snapshot.val() != null && snapshot.val().status != data.status) {
                    call_trip_details();
                }
            });
        const onDriverTracking = database().ref(`/drivers/${data.trip.vehicle_type}/${data.trip.driver_id}`)
            .on('value', snapshot => {
                if (snapshot.val()) {
                    let marker = {
                        latitude: parseFloat(snapshot.val().geo.lat),
                        longitude: parseFloat(snapshot.val().geo.lng)
                    }
                    if (data.trip.status <= 2) {
                        get_direction(snapshot.val().geo.lat + "," + snapshot.val().geo.lng, data.trip.pickup_lat + "," + data.trip.pickup_lng)
                    } else {
                        get_direction(snapshot.val().geo.lat + "," + snapshot.val().geo.lng, data.trip.drop_lat + "," + data.trip.drop_lng)
                    }
                    setBearing(snapshot.val().geo.bearing)
                    setDriverLocation(marker)
                    setDriverLocationIos(marker)
                    animate(marker);
                }
            });
        return (
            onValueChange,
            onDriverTracking
        );
    }, []);

    const get_direction = async (startLoc, destinationLoc) => {
        try {
            let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=${GOOGLE_KEY}`)
            let respJson = await resp.json();
            let points = decode(respJson.routes[0].overview_polyline.points, 5);
            let coords = points.map((point, index) => {
                return {
                    latitude: point[0],
                    longitude: point[1]
                }
            })
            setCoords(coords);
        } catch (error) {
            console.log(error)
            //return error
        }
    }

    const animate = (nextProps) => {
        const duration = 500;
        if (driver_location !== nextProps) {
            if (Platform.OS === 'android') {
                if (driver_track) {
                    driver_track.animateMarkerToCoordinate(
                        nextProps,
                        duration
                    )
                }
            } else {
                driver_location_ios.timing({
                    ...nextProps,
                    duration
                }).start();
            }
        }
    }

 

    const call_trip_details = () => {
        setLoading(true);
        axios({
            method: 'post',
            url: api_url + trip_details,
            data: { trip_id: trip_id }
        })
            .then(async response => {
                setLoading(false);
                setData(response.data.result);
                setCancellationReasons(response.data.result.cancellation_reasons);
                setOnLoad(1);
                if (response.data.result.trip.status == 5 && from == 'home') {
                    if (is_mount == 0) {
                        setIsMount(1);
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{ name: "Bill", params: { trip_id: trip_id, from: from } }],
                            })
                        );
                    }
                } else if (cancellation_statuses.includes(parseInt(response.data.result.trip.status)) && from == 'home') {
                    navigate_home();
                }
            })
            .catch(error => {
                setLoading(false);
                console.log(error)
            });
    }

    const call_dialog_visible = () => {
        setDialogVisible(false)
    }

    call_driver = () => {
        Linking.openURL(`tel:${data.trip.driver.phone_number}`)
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

    const call_trip_cancel = async (reason_id, type) => {
        // console.log({ trip_id: trip_id, status: 6, reason_id: reason_id, cancelled_by: type })
        setDialogVisible(false)
        setCancelLoading(true);
        await axios({
            method: 'post',
            url: api_url + trip_cancel,
            data: { trip_id: trip_id, status: 6, reason_id: reason_id, cancelled_by: type }
        })
            .then(async response => {
                setCancelLoading(false);
                console.log('success')
            })
            .catch(error => {
                //alert(error)
                setCancelLoading(false);
            });
    }

    const navigate_home = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "Home" }],
            })
        );
    }

    const move_chat = () => {
        navigation.navigate('Chat', { trip_id: trip_id });
    }

 
    useEffect(() => {
        if (coords.length > 1) {
            map_ref.current.fitToCoordinates(coords, {
                edgePadding: {
                    top: 50,           
                    right: 50,       
                    bottom: screenHeight-500 > 0 ? 500 + 50 : 50, 
                    left: 50              
                },
                animated: true,
            });
        }
    }, [coords]);
   

    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor={colors.theme_bg}
            />
            <MapView
                provider={PROVIDER_GOOGLE}
                ref={map_ref}
                style={styles.map}
                region={region}
                fitToElements={true}
            >

                {data.trip.status <= 2 &&
                    <Marker coordinate={home_marker}>
                        <Image style={{ height: 30, width: 25 }} source={require('.././assets/img/tracking/home.png')} />
                    </Marker>
                }
                {data.trip.status >= 2 &&
                    <Marker coordinate={destination_marker}>
                        <Image style={{ height: 30, width: 25 }} source={require('.././assets/img/tracking/destination.png')} />
                    </Marker>
                }
                <MarkerAnimated
                    ref={marker => {
                        setDriverTrack(marker);
                    }}
                    rotation={bearing}
                    coordinate={Platform.OS === "ios" ? driver_location_ios : driver_location}
                    identifier={'mk1'}
                >
                    {data.trip.vehicle_slug == 'car' &&
                        <Image style={{ height: 30, width: 15 }} source={require('.././assets/img/tracking/car.png')} />
                    }
                    {data.trip.vehicle_slug == 'bike' &&
                        <Image style={{ height: 30, width: 15 }} source={require('.././assets/img/tracking/bike.png')} />
                    }
                    {data.trip.vehicle_slug == 'truck' &&
                        <Image style={{ height:30, width:15 }} source={require('.././assets/img/tracking/truck.png')} />
                    }
                </MarkerAnimated>
                {coords.length > 0 && global.polyline_status == 1 &&(
                    <Polyline
                        coordinates={coords}
                        strokeWidth={4}
                        strokeColor={colors.theme_fg}
                    />
                )}  
               
            </MapView>
            {drop_down_alert()}
            <View style={{ flexDirection: 'row' }}>
                <DropShadow
                    style={{
                        width: '50%',
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 0,
                        },
                        shadowOpacity: 0.3,
                        shadowRadius: 25,
                    }}
                >
                    <TouchableOpacity activeOpacity={0} onPress={go_back.bind(this)} style={{ width: 40, height: 40, backgroundColor: colors.theme_bg_three, borderRadius: 25, alignItems: 'center', justifyContent: 'center', top: 20, left: 20 }}>
                        <Icon type={Icons.MaterialIcons} name="arrow-back" color={colors.icon_active_color} style={{ fontSize: 22 }} />
                    </TouchableOpacity>
                </DropShadow>                
            </View>
            <BottomSheet sliderMinHeight={400} sliderMaxHeight={screenHeight - 100} isOpen>
                {(onScrollEndDrag) => (
                    <ScrollView onScrollEndDrag={onScrollEndDrag}>
                        {on_load == 1 ?
                            <View>
                                <View style={{ flexDirection:'row', width:'100%', marginBottom:10}}>
                                    <View style={{ flex:1, alignItems: 'flex-start', justifyContent: 'center' }}>
                                        <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontFamily: regular }}>OTP</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                            <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: 13, fontFamily: normal }}>#{data.trip.otp}</Text>
                                        </View>
                                    </View>
                                    <View style={{ flex:1, alignItems: 'flex-end', justifyContent: 'center' }}>
                                        <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontFamily: regular }}>Status</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                            <Text numberOfLines={1} style={{ color: colors.theme_fg, fontSize: 13, fontFamily: normal }}>{data.trip.status_name}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: colors.grey, flexDirection:'row', paddingVertical:20 }}>
                                    <View style={{ flex:1, alignItems:'center', justifyContent:'flex-start', flexDirection:'row'}}>
                                        <View style={{ height: 50, width: 50, borderRadius:5 }} >
                                            <Image style={{ height: undefined, width: undefined, flex: 1, borderRadius:5 }} source={{ uri: img_url + data.trip.driver.profile_picture }} />
                                        </View>
                                        <View style={{ margin:10 }} />
                                        <View>
                                            <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: 17, fontFamily: normal }}>{data.trip.driver.first_name}</Text>
                                            <View style={{ flexDirection:'row'}}>
                                                <Icon type={Icons.MaterialIcons} name="star" color={colors.warning} style={{ fontSize: 18 }} />
                                                <Text numberOfLines={1} style={{ color: colors.grey, fontSize: 13, fontFamily: regular }}>{data.trip.driver.overall_ratings}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ flex:1, alignItems:'center', justifyContent:'flex-end', flexDirection:'row'}}>
                                        <View>
                                            <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: 17, fontFamily: normal }}>{data.trip.vehicle.vehicle_name}</Text>
                                            <Text numberOfLines={1} style={{ color: colors.grey, fontSize: 13, fontFamily: regular }}>{data.trip.vehicle.vehicle_number}</Text>
                                        </View>
                                        
                                    </View>
                                </View>           
                                <View style={{ borderBottomWidth: 0.5, borderColor: colors.grey }}>
                                    <View style={{ flexDirection: 'row', width: '100%', marginTop: 10, marginBottom: 10 }}>
                                        <View style={{ width: '33%', alignItems: 'center', justifyContent: 'center' }}>
                                            <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontFamily: regular }}>Distance</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                                <Icon type={Icons.MaterialIcons} name="map" color={colors.theme_fg_two} style={{ fontSize: 22 }} />
                                                <View style={{ margin: 2 }} />
                                                <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: 13, fontFamily: normal }}>{data.trip.distance} Km</Text>
                                            </View>
                                        </View>                                        
                                        <View style={{ width: '33%', alignItems: 'center', justifyContent: 'center' }}>
                                            <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontFamily: regular }}>Estimation Fare</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                                <Icon type={Icons.MaterialIcons} name="local-atm" color={colors.theme_fg_two} style={{ fontSize: 22 }} />
                                                <View style={{ margin: 2 }} />
                                                <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: 13, fontFamily: normal }}>{global.currency}{data.trip.total}</Text>
                                            </View>
                                        </View>                                       
                                    </View>
                                </View>
                                <View style={{ backgroundColor:colors.theme_bg_three, padding:10, borderRadius:10, marginVertical:10}}>
                                    <View>
                                        <View style={{ flexDirection: 'row', alignItems:'center'}}>
                                            <Badge status="success" backgroundColor="green" size={10} />  
                                            <View style={{ margin: 5}}/>
                                            <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontFamily: regular }}>Pickup Address</Text>
                                        </View>
                                        <View style={{ margin:3 }} />
                                        <Text numberOfLines={2} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: f_tiny, fontFamily: regular }}>{data.trip.pickup_address}</Text>
                                    </View>
                                    <View style={{ margin:10 }} />
                                    <View>
                                        <View style={{ flexDirection: 'row', alignItems:'center'}}>
                                            <Badge status="error" backgroundColor="red" size={10} />  
                                            <View style={{ margin: 5}}/>
                                            <Text numberOfLines={1} style={{ color: colors.grey, fontSize: f_xs, fontFamily: regular }}>Drop Address</Text>
                                        </View>
                                        <View style={{ margin:3 }} />
                                        <Text numberOfLines={2} ellipsizeMode='tail' style={{ color: colors.theme_fg_two, fontSize: f_tiny, fontFamily: regular }}>{data.trip.drop_address}</Text>
                                    </View>
                                </View>
                            
                                {pickup_statuses.includes(data.trip.status) &&
                                    <View style={{ borderTopWidth: 0, borderColor: colors.grey,marginBottom:10 }}>
                                        <View style={{ flexDirection: 'row', width: '100%', }}>
                                            <TouchableOpacity onPress={move_chat.bind(this)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                                                <Icon type={Icons.MaterialIcons} name="chat" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                                            </TouchableOpacity>
                                            <View style={{ width: '5%' }} />
                                            <TouchableOpacity activeOpacity={1} onPress={call_driver.bind(this)} style={{ width: '15%', alignItems: 'center', justifyContent: 'center' }}>
                                                <Icon type={Icons.MaterialIcons} name="call" color={colors.theme_fg_two} style={{ fontSize: 30 }} />
                                            </TouchableOpacity>
                                            <View style={{ width: '10%' }} />
                                            {cancel_loading == false ?
                                                <TouchableOpacity onPress={showDialog.bind(this)} activeOpacity={1} style={{ width: '55%', backgroundColor: colors.error_background, borderRadius: 10, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Text style={{ color: colors.theme_fg_two, fontSize: 16, color: colors.error, fontFamily: bold }}>Cancel</Text>
                                                </TouchableOpacity>
                                                :
                                                <View style={{ height: 50, width: '90%', alignSelf: 'center' }}>
                                                    <LottieView style={{flex: 1}}source={loader} autoPlay loop />
                                                </View>
                                            }
                                        </View>
                                    </View>
                                }
                            </View>
                            :
                            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                <Text style={{ color: colors.theme_fg_two, fontSize: 15, fontFamily: regular }}>Loading...</Text>
                            </View>
                        }
                        <View style={{margin:'5%'}}/>
                    </ScrollView>
                )}
            </BottomSheet>
            <Dialog
                visible={dialog_visible}
                width="90%"
                animationDuration={100}
                dialogTitle={<DialogTitle title="Reason to cancel your ride." />}
                dialogAnimation={new SlideAnimation({
                    slideFrom: 'bottom',
                })}
                footer={
                    <DialogFooter>
                        <DialogButton
                            text="Close"
                            textStyle={{ fontSize: 16, color: colors.theme_fg_two, fontFamily: regular }}
                            onPress={call_dialog_visible}
                        />
                    </DialogFooter>
                }
                onTouchOutside={() => {
                    call_dialog_visible()
                }}
            >
                <DialogContent>
                    <FlatList
                        data={cancellation_reason}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity onPress={call_trip_cancel.bind(this, item.id, item.type)} activeOpacity={1} >
                                <View style={{ padding: 10 }}>
                                    <Text style={{ fontFamily: regular, fontSize: 12, color: colors.theme_fg_two }}>{item.reason}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        keyExtractor={item => item.id}
                    />
                </DialogContent>
            </Dialog>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        height: screenHeight,
        width: screenWidth,
        backgroundColor: colors.lite_bg
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

function mapStateToProps(state) {
    return {
        initial_lat: state.booking.initial_lat,
        initial_lng: state.booking.initial_lng,
        initial_region: state.booking.initial_region,
    };
}

export default connect(mapStateToProps, null)(TripDetails);