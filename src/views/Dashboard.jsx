import React, { useState, useEffect, useRef } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Image,
  ScrollView,
  Animated,
  StatusBar,
  Keyboard,
  TextInput,
  Alert,
} from "react-native";
import { connect } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  screenHeight,
  screenWidth,
  trip_details,
  search_loader,
  normal,
  promo_codes,
  bold,
  GOOGLE_KEY,
  month_names,
  money_icon,
  discount_icon,
  no_favourites,
  add_favourite,
  get_home,
  api_url,
  img_url,
  get_estimation_fare,
  pin_marker,
  regular,
  get_zone,
  btn_loader,
  ride_confirm,
  f_m,
  trip_request_cancel,
  f_l,
  f_xl,
  f_tiny,
  f_s,
  f_25,
} from "../config/Constants";
import Icon, { Icons } from "../components/Icons";
import * as colors from "../assets/css/Colors";
import DropShadow from "react-native-drop-shadow";
import { Badge, Divider } from "@rneui/themed";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import axios from "axios";
import LottieView from "lottie-react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DropdownAlert from "react-native-dropdownalert";
import database from "@react-native-firebase/database";
import Dialog, {
  DialogTitle,
  SlideAnimation,
  DialogContent,
  DialogFooter,
  DialogButton,
} from "react-native-popup-dialog";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";
import NetInfo from "@react-native-community/netinfo";
import Geolocation from "@react-native-community/geolocation";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};
const Dashboard = (props) => {
  const navigation = useNavigation();
  const search = useRef();
  const map_ref = useRef();
  let dropDownAlertRef = useRef();
  const fav_RBSheet = useRef();
  const offer_fare_RBSheet = useRef();
  const [on_loaded, setOnLoaded] = useState(0);
  const [active_location, setActiveLocation] = useState(1);
  const [region, setRegion] = useState(props.initial_region);
  const [trip_types, setTripTypes] = useState([]);
  const [promo_list, setPromoList] = useState([]);
  const [promo, setPromo] = useState(0);
  const [trip_sub_types, setTripSubTypes] = useState([]);
  const [estimation_fares, setEstimationFares] = useState([]);

  const [customer_favourites, setCustomerFavourties] = useState([]);
  const [active_trip_type, setActiveTripType] = useState(0);
  const [active_trip_sub_type, setActiveTripSubType] = useState(0);
  const [active_vehicle_type, setActiveVehicleType] = useState(0);
  const [loading, setLoading] = useState(false);
  const [current_location_status, setCurrentLocationStatus] = useState(true);
  const [is_date_picker_visible, setDatePickerVisibility] = useState(false);
  const [pickup_date, setPickupDate] = useState(new Date());
  const [pickup_date_label, setPickupDateLabel] = useState("Now");
  const [packages, setPackages] = useState([]);
  const [package_hr, setPackageHr] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const [package_km, setPackageKm] = useState(0);
  const [package_id, setPackageId] = useState(0);
  const [is_mount, setIsMount] = useState(0);
  const [km, setKm] = useState(0);

  const [wallet, setWallet] = useState(0);
  const duration = 500;
  const [total, setTotal] = useState(0);
  const [trip_request_id, setTripRequestId] = useState(0);
  const [sync_status, setSyncStatus] = useState(0);
  const [notice, setNotice] = useState(false);

  //Address
  const [pickup_address, setPickupAddress] = useState("");
  const [pickup_lat, setPickupLat] = useState(props.initial_lat);
  const [pickup_lng, setPickupLng] = useState(props.initial_lng);

  const [drop_address, setDropAddress] = useState("");
  const [drop_lat, setDropLat] = useState(0);
  const [drop_lng, setDropLng] = useState(0);

  const [tmp_address, setTmpAddress] = useState("");
  const [tmp_lat, setTmpLat] = useState(props.initial_lat);
  const [tmp_lng, setTmpLng] = useState(props.initial_lng);

  //Screen Home
  const home_comp_1 = useRef(new Animated.Value(-60)).current;
  const home_comp_2 = useRef(new Animated.Value(screenHeight + 170)).current;

  //Screen Location
  const drop_comp_1 = useRef(new Animated.Value(-110)).current;
  const drop_comp_2 = useRef(new Animated.Value(screenHeight + 150)).current;
  const drop_comp_3 = useRef(new Animated.Value(-130)).current;
  const drop_comp_4 = useRef(
    new Animated.Value(screenHeight + (screenHeight - 100))
  ).current;

  //Screen Booking
  const book_comp_1 = useRef(new Animated.Value(screenHeight + 250)).current;

  useEffect(() => {

    get_home_api();
    screen_home_entry();
    booking_sync();
    const unsubscribe = navigation.addListener("focus", async () => {
      setIsMount(1);
    });
    setTimeout(() => {
      setOnLoaded(1);
    }, 2000);
    return unsubscribe;
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
 useEffect(() => {
   // Fetch the user's current location
   Geolocation.getCurrentPosition(
     (position) => {
       const { latitude, longitude } = position.coords;
       setUserLocation({ latitude, longitude });
       setRegion((prevRegion) => ({
         ...prevRegion,
         latitude,
         longitude,
       }));
     },
     (error) => console.error("Error fetching location:", error),
     { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
   );
 }, []);
  const booking_sync = () => {
    database()
      .ref(`customers/${global.id}`)
      .on("value", (snapshot) => {
        if (snapshot.val().booking_id != 0) {
          if (is_mount == 0) {
            setIsMount(1);
            booking_exit();
            setActiveTripType(1);
            call_trip_details(snapshot.val().booking_id);
          }
        }
      });
  };

  const call_trip_details = (trip_id) => {
    axios({
      method: "post",
      url: api_url + trip_details,
      data: { trip_id: trip_id },
    })
      .then(async (response) => {
        navigation.navigate("TripDetails", {
          trip_id: trip_id,
          from: "home",
          data: response.data.result,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const set_default_date = async (currentdate, type) => {
    let datetime =
      (await (currentdate.getDate() < 10 ? "0" : "")) +
      currentdate.getDate() +
      "-" +
      (currentdate.getMonth() + 1 < 10 ? "0" : "") +
      (currentdate.getMonth() + 1) +
      "-" +
      currentdate.getFullYear() +
      " " +
      (currentdate.getHours() < 10 ? "0" : "") +
      currentdate.getHours() +
      ":" +
      (currentdate.getMinutes() < 10 ? "0" : "") +
      currentdate.getMinutes() +
      ":" +
      (currentdate.getSeconds() < 10 ? "0" : "") +
      currentdate.getSeconds();
    let label =
      (await (currentdate.getDate() < 10 ? "0" : "")) +
      currentdate.getDate() +
      " " +
      month_names[currentdate.getMonth()] +
      ", " +
      formatAMPM(currentdate);
    if (type == 0) {
      setPickupDateLabel("Now");
    } else {
      setPickupDateLabel(label);
    }

    setPickupDate(datetime);
  };

  const formatAMPM = (date) => {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  };

  const screen_home_entry = () => {
    call_zone();
    Keyboard.dismiss();
    Animated.timing(home_comp_1, {
      toValue: 60,
      duration: duration,
      useNativeDriver: true,
    }).start();
    Animated.timing(home_comp_2, {
      toValue: screenHeight,
      duration: duration,
      useNativeDriver: true,
    }).start();
    setPromo(0);
  };

  const screen_home_exit = () => {
    Animated.timing(home_comp_1, {
      toValue: -60,
      duration: duration,
      useNativeDriver: true,
    }).start();
    Animated.timing(home_comp_2, {
      toValue: screenHeight + 170,
      duration: duration,
      useNativeDriver: true,
    }).start();
  };

  const location_entry = () => {
    Animated.timing(drop_comp_1, {
      toValue: 75,
      duration: duration,
      useNativeDriver: true,
    }).start();
    Animated.timing(drop_comp_2, {
      toValue: screenHeight,
      duration: duration,
      useNativeDriver: true,
    }).start();
    Animated.timing(drop_comp_3, {
      toValue: 0,
      duration: duration,
      useNativeDriver: true,
    }).start();
  };

  const location_exit = () => {
    Animated.timing(drop_comp_1, {
      toValue: -110,
      duration: duration,
      useNativeDriver: true,
    }).start();
    Animated.timing(drop_comp_2, {
      toValue: screenHeight + 150,
      duration: duration,
      useNativeDriver: true,
    }).start();
    Animated.timing(drop_comp_3, {
      toValue: -130,
      duration: duration,
      useNativeDriver: true,
    }).start();
    Animated.timing(drop_comp_4, {
      toValue: screenHeight + (screenHeight - 100),
      duration: duration,
      useNativeDriver: true,
    }).start();
  };

  const search_entry = () => {
    Animated.timing(drop_comp_4, {
      toValue: 100,
      duration: duration,
      useNativeDriver: true,
    }).start();
  };

  const search_exit = () => {
    Keyboard.dismiss();
    Animated.timing(drop_comp_4, {
      toValue: screenHeight + (screenHeight - 100),
      duration: duration,
      useNativeDriver: true,
    }).start();
  };

  const booking_entry = () => {
    location_exit();
    set_default_date(new Date(), 0);
    setCurrentLocationStatus(false);
    Animated.timing(book_comp_1, {
      toValue: 250,
      duration: duration,
      useNativeDriver: true,
    }).start();
  };

  const booking_exit = () => {
    setCurrentLocationStatus(true);
    screen_home_entry();
    Animated.timing(book_comp_1, {
      toValue: screenHeight + 250,
      duration: duration,
      useNativeDriver: true,
    }).start();
  };

  const check_address_details = () => {
    alert(drop_address);
  };

  const is_focus = () => {
    search_entry();
  };

  const region_change = (region) => {
    if (on_loaded == 1) {
      screen_home_exit();
      location_entry();
      onRegionChange(region, "T");
    } else {
      onRegionChange(region, "P");
    }
  };

  const onRegionChange = async (value, type) => {
    //console.log(value);
    fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
        value.latitude +
        "," +
        value.longitude +
        "&key=" +
        GOOGLE_KEY
    )
      .then((response) => response.json())
      .then(async (responseJson) => {
        if (responseJson.results[2].formatted_address != undefined) {
          if (type == "P") {
            setPickupAddress(responseJson.results[2].formatted_address);
            setPickupLat(value.latitude);
            setPickupLng(value.longitude);
          } else {
            setTmpAddress(responseJson.results[2].formatted_address);
            setTmpLat(value.latitude);
            setTmpLng(value.longitude);
            search.current?.setAddressText(
              responseJson.results[2].formatted_address
            );
          }
        }
      });
  };

  const confirm_location = async () => {
    if (active_location == 1) {
      setPickupAddress(tmp_address);
      setPickupLat(tmp_lat);
      setPickupLng(tmp_lng);
    } else {
      setDropAddress(tmp_address);
      setDropLat(tmp_lat);
      setDropLng(tmp_lng);
    }
    if (pickup_address != "" && active_location == 2) {
      booking_entry();
      get_estimation_fare_api(
        pickup_lat,
        pickup_lng,
        tmp_lat,
        tmp_lng,
        0,
        active_trip_sub_type,
        0
      );
    } else if (drop_address != "" && active_location == 1) {
      booking_entry();
      get_estimation_fare_api(
        tmp_lat,
        tmp_lng,
        drop_lat,
        drop_lng,
        0,
        active_trip_sub_type,
        0
      );
    } else {
      back_to_home_screen();
    }
  };

  const select_package = (data) => {
    screen_home_exit();
    setPackageId(data.id);
    setPackageHr(data.hours);
    setPackageKm(data.kilometers);
    booking_entry();
    get_estimation_fare_api(
      tmp_lat,
      tmp_lng,
      drop_lat,
      drop_lng,
      data.id,
      0,
      0
    );
    console.log(tmp_lat, tmp_lng, drop_lat, drop_lng, data.id, 0, 0);
  };
  const get_location = (data, details, type) => {
    setTmpAddress(data.description);
    setTmpLat(details.geometry.location.lat);
    setTmpLng(details.geometry.location.lng);
    search_exit();
    set_location(details.geometry.location.lat, details.geometry.location.lng);
  };

  const set_location = (lat, lng) => {
    map_ref?.current?.animateCamera(
      {
        center: {
          latitude: lat,
          longitude: lng,
        },
      },
      { duration: 2000 }
    );
  };

  const back_to_home_screen = () => {
    location_exit();
    screen_home_entry();
  };

  const open_location = async (location) => {
    search.current?.setAddressText("");
    search_entry();
    setActiveLocation(location);
    screen_home_exit();
    location_entry();
  };

  const estimation_fare_list = () => {
    return estimation_fares.map((data) => {
      return (
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
            shadowOpacity: active_vehicle_type == data.id ? 0.3 : 0,
            shadowRadius: 5,
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={change_vehicle_type.bind(this, data.id)}
            style={{
              width: "100%",
              backgroundColor: colors.theme_bg_three,
              padding: 10,
              flexDirection: "row",
              borderRadius: 10,
            }}
          >
            <View
              style={{
                width: "25%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View style={{ height: 50, width: 50 }}>
                <Image
                  style={{ height: undefined, width: undefined, flex: 1 }}
                  source={{ uri: img_url + data.active_icon }}
                />
              </View>
            </View>
            <View
              style={{
                width: "50%",
                alignItems: "flex-start",
                justifyContent: "center",
              }}
            >
              <Text
                numberOfLines={1}
                style={{
                  color: colors.theme_fg_two,
                  fontSize: 14,
                  fontFamily: normal,
                }}
              >
                {data.vehicle_type}
              </Text>
              <View style={{ margin: 2 }} />
              <Text
                numberOfLines={1}
                style={{
                  color: colors.text_grey,
                  fontSize: 12,
                  fontFamily: normal,
                }}
              >
                {data.description}
              </Text>
            </View>
            <View
              style={{
                width: "25%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  color: colors.theme_fg_two,
                  fontSize: 14,
                  fontFamily: normal,
                  letterSpacing: 1,
                }}
              >
                {global.currency}
                {data.fare}
              </Text>
            </View>
          </TouchableOpacity>
        </DropShadow>
      );
    });
  };

  const load_location = (address, lat, lng) => {
    back_to_home_screen();
    set_location(parseFloat(lat), parseFloat(lng));
  };

  const favourites_list = () => {
    if (customer_favourites.length == 0) {
      return (
        <View
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ height: 150, width: 150, alignSelf: "center" }}>
            <LottieView source={no_favourites} autoPlay loop />
          </View>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              fontSize: 12,
              color: colors.text_grey,
              fontFamily: regular,
            }}
          >
            No data found
          </Text>
        </View>
      );
    } else {
      return customer_favourites.map((data) => {
        return (
          <TouchableOpacity
            activeOpacity={1}
            onPress={load_location.bind(this, data.address, data.lat, data.lng)}
            style={{
              width: "100%",
              flexDirection: "row",
              borderBottomWidth: 0.5,
              paddingBottom: 10,
              paddingTop: 10,
            }}
          >
            <View
              style={{
                width: "15%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon
                type={Icons.MaterialIcons}
                name="near-me"
                color={colors.icon_inactive_color}
                style={{ fontSize: 22 }}
              />
            </View>
            <View
              style={{
                width: "85%",
                alignItems: "flex-start",
                justifyContent: "center",
              }}
            >
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={{
                  fontSize: 16,
                  color: colors.text_grey,
                  fontFamily: regular,
                }}
              >
                {data.address}
              </Text>
            </View>
          </TouchableOpacity>
        );
      });
    }
  };

  const get_home_api = async () => {
    setLoading(true);
    console.log("get_home_api");
    console.log(api_url + get_home);
    console.log({ lang: global.lang, customer_id: global.id });
    await axios({
      method: "post",
      url: api_url + get_home,
      data: { lang: global.lang, customer_id: global.id },
    })
      .then(async (response) => {
        setLoading(false);
        if (response.data.status == 1) {
          // setTripTypes(response.data.result.trip_types);
          // setPackages(response.data.result.packages);
          setCustomerFavourties(response.data.result.customer_favourites);
          // setActiveTripType(response.data.result.trip_types[0].id);
          setSyncStatus(response.data.result.sync_status);
        }
      })
      .catch((error) => {
        console.log("error", error);
        setLoading(false);
        alert("Sorry something went wrong");
      });
  };

  const add_favourite_api = async () => {
    fav_RBSheet.current.close();
    setLoading(true);
    await axios({
      method: "post",
      url: api_url + add_favourite,
      data: {
        customer_id: global.id,
        address: pickup_address,
        lat: pickup_lat,
        lng: pickup_lng,
      },
    })
      .then(async (response) => {
        setLoading(false);
        if (response.data.status == 1) {
          dropDownAlertRef.alertWithType(
            "success",
            "Success",
            "Location added in your favourite pot!"
          );
          setCustomerFavourties(response.data.result);
        }
      })
      .catch((error) => {
        setLoading(false);
        alert("Sorry something went wrong");
      });
  };

  const get_estimation_fare_api = async (
    lat1,
    lng1,
    lat2,
    lng2,
    package_id,
    sub_type,
    pr
  ) => {
    console.log({
      customer_id: global.id,
      pickup_lat: lat1,
      pickup_lng: lng1,
      drop_lat: lat2,
      drop_lng: lng2,
      trip_type: active_trip_type,
      promo: pr,
      lang: global.lang,
      package_id: package_id,
      days: 1,
      trip_sub_type: sub_type,
    });
    setLoading(true);
    await axios({
      method: "post",
      url: api_url + get_estimation_fare,
      data: {
        customer_id: global.id,
        pickup_lat: lat1,
        pickup_lng: lng1,
        drop_lat: lat2,
        drop_lng: lng2,
        trip_type: active_trip_type,
        promo: pr,
        lang: global.lang,
        package_id: package_id,
        days: 1,
        trip_sub_type: sub_type,
      },
    })
      .then(async (response) => {
        setLoading(false);
        if (response.data.status == 1) {
          setEstimationFares(response.data.result["vehicles"]);
          setWallet(response.data.result["wallet"]);
          setKm(response.data.result.km);
          change_vehicle_type(response.data.result["vehicles"][0].id);
          /* if (pr != 0 && response.data.result['vehicles'][0].fares.discount <= 0) {
            setPromo(0);
            dropDownAlertRef.alertWithType('error', 'Error', 'Sorry promo not applied!');
          } */
        }
      })
      .catch((error) => {
        setLoading(false);
        // alert(error)
        alert("Sorry something went wrong");
      });
  };

  const open_offer_fare = () => {
    if (total == 0) {
      offer_fare_RBSheet.current.open();
    } else {
      call_zone(1);
    }
  };

  const close_offer_fare = () => {
    if (total == 0 || total == "") {
      Alert.alert("Please Enter Amount");
    } else {
      offer_fare_RBSheet.current.close();
    }
  };

  const call_zone = async ($type = 0) => {
    setLoading(true);
    await axios({
      method: "post",
      url: api_url + get_zone,
      data: { lat: pickup_lat, lng: pickup_lng },
    })
      .then(async (response) => {
        if (response.data.result == 0) {
          setLoading(false);
          dropDownAlertRef.alertWithType(
            "error",
            "Not Available",
            "Our service is not available in your location.!"
          );
        } else {
          if ($type == 1) {
            call_ride_confirm(response.data.result);
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        alert("Sorry something went wrong");
      });
  };

  const call_ride_confirm = async (zone) => {
    console.log({
      km: km,
      promo: promo,
      vehicle_type: active_vehicle_type,
      payment_method: 1,
      customer_id: global.id,
      trip_type: active_trip_type,
      surge: 1,
      pickup_address: pickup_address,
      pickup_date: pickup_date,
      pickup_lat: pickup_lat,
      pickup_lng: pickup_lng,
      drop_address: drop_address,
      drop_lat: drop_lat,
      drop_lng: drop_lng,
      package_id: package_id,
      trip_sub_type: active_trip_sub_type,
      stops: JSON.stringify([]),
      zone: zone,
      total: total,
      sub_total: total,
      discount: 0,
      tax: 0,
    });
    setLoading(true);
    await axios({
      method: "post",
      url: api_url + ride_confirm,
      data: {
        km: km,
        promo: promo,
        vehicle_type: active_vehicle_type,
        payment_method: 1,
        customer_id: global.id,
        trip_type: active_trip_type,
        surge: 1,
        pickup_address: pickup_address,
        pickup_date: pickup_date,
        pickup_lat: pickup_lat,
        pickup_lng: pickup_lng,
        drop_address: drop_address,
        drop_lat: drop_lat,
        drop_lng: drop_lng,
        package_id: package_id,
        trip_sub_type: active_trip_sub_type,
        stops: JSON.stringify([]),
        zone: zone,
        total: total,
        sub_total: total,
        discount: 0,
        tax: 0,
      },
    })
      .then(async (response) => {
        setLoading(false);
        if (response.data.status == 1) {
          setTripRequestId(response.data.result);
          if (response.data.booking_type == 1) {
            dropDownAlertRef.alertWithType(
              "success",
              "Booking placed successfully",
              "You can see you bookings in my trip request menu."
            );

            booking_exit();
            navigation.navigate("CustomerTripRequest");
          } else if (response.data.booking_type == 2) {
            dropDownAlertRef.alertWithType(
              "success",
              "Booking placed successfully",
              "You can see you bookings in my rides menu."
            );

            navigation.navigate("CustomerTripRequest");
          }
          // booking_exit();
        } else {
          dropDownAlertRef.alertWithType(
            "error",
            "Sorry",
            "Driver not available, try again"
          );
        }
      })
      .catch((error) => {
        setLoading(false);
        alert("Sorry something went wrong");
      });
    setTotal("");
  };

  const change_vehicle_type = (vehicle_type) => {
    //alert(vehicle_type+'-'+km);
    setActiveVehicleType(vehicle_type);
    //setKm(km);
  };

  const show_date_picker = () => {
    setDatePickerVisibility(true);
  };

  const hide_date_picker = () => {
    setDatePickerVisibility(false);
  };

  const handle_confirm = (date) => {
    console.warn("A date has been picked: ", date);
    hide_date_picker();
    set_default_date(new Date(date), 1);
  };

  const change_trip_sub_type = (id) => {
    setActiveTripSubType(id);
    get_estimation_fare_api(
      pickup_lat,
      pickup_lng,
      drop_lat,
      drop_lng,
      0,
      id,
      0
    );
  };

  const load_trip_sub_types = () => {
    return trip_sub_types.map((item) => {
      return (
        <TouchableOpacity
          onPress={change_trip_sub_type.bind(this, item.id)}
          style={[
            active_trip_sub_type == item.id
              ? styles.segment_active_bg
              : styles.segment_inactive_bg,
          ]}
        >
          <Text
            style={[
              active_trip_sub_type == item.id
                ? styles.segment_active_fg
                : styles.segment_inactive_fg,
            ]}
          >
            {item.trip_sub_type}
          </Text>
        </TouchableOpacity>
      );
    });
  };
  const centerToUserLocation = () => {
    if (userLocation && map_ref.current) {
      ReactNativeHapticFeedback.trigger("impactHeavy", options);
      map_ref.current.animateToRegion({
        ...region,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      });
    }
  };
  const show_packages = () => {
    return packages.map((data) => {
      return (
        <TouchableOpacity
          onPress={select_package.bind(this, data)}
          style={{
            width: 70,
            borderColor: colors.text_grey,
            marginLeft: 5,
            marginRight: 5,
            borderRadius: 10,
            padding: 5,
            borderWidth: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: colors.theme_fg_two,
              fontSize: 16,
              fontFamily: bold,
            }}
          >
            {data.hours} Hr
          </Text>
          <View style={{ margin: 2 }} />
          <Text
            style={{
              color: colors.text_grey,
              fontSize: 13,
              fontFamily: regular,
            }}
          >
            {data.kilometers} km
          </Text>
        </TouchableOpacity>
      );
    });
  };

  const screen_home = () => {
    return (
      <View>
        <Animated.View
          style={[
            { transform: [{ translateY: home_comp_1 }] },
            [
              {
                position: "absolute",
                width: "100%",
                height: 60,
                alignItems: "center",
                justifyContent: "center",
              },
            ],
          ]}
        >
          <DropShadow
            style={{
              width: "90%",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.3,
              shadowRadius: 5,
            }}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={()=>{navigation.toggleDrawer();   ReactNativeHapticFeedback.trigger("impactLight", {
                enableVibrateFallback: true,
                ignoreAndroidSystemSettings: false,
              });
}}
              style={{
                width: "10%",
                borderRadius: 5,
                marginBottom: 5,
                backgroundColor: colors.theme_bg_three,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon
                type={Icons.MaterialIcons}
                name="menu"
                color={colors.icon_active_color}
                style={{ fontSize: 28 }}
              />
            </TouchableOpacity>
            <View style={{ margin: 2 }} />
          </DropShadow>
          <DropShadow
            style={{
              width: "90%",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.3,
              shadowRadius: 5,
            }}
          >
            <View
              activeOpacity={1}
              style={{
                padding: 10,
                width: "100%",
                backgroundColor: colors.theme_bg_three,
                borderRadius: 10,
                height: 50,
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={open_location.bind(this, 1)}
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
                    color: colors.theme_fg_two,
                    fontSize: 14,
                    fontFamily: normal,
                  }}
                >
                  {pickup_address}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => fav_RBSheet.current.open()}
                style={{
                  width: "15%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon
                  type={Icons.MaterialIcons}
                  name="favorite-border"
                  color={colors.icon_inactive_color}
                  style={{ fontSize: 22 }}
                />
              </TouchableOpacity>
            </View>
          </DropShadow>
        </Animated.View>
        <Animated.View
          style={[
            { transform: [{ translateY: home_comp_2 }] },
            [
              {
                position: "absolute",
                bottom: 0,
                width: "100%",
                height: 100,
                alignItems: "center",
                justifyContent: "center",
              },
            ],
          ]}
        >
          {active_trip_type != 2 ? (
            <DropShadow
              style={{
                width: "90%",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
                shadowOpacity: 0.3,
                shadowRadius: 5,
              }}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={open_location.bind(this, 2)}
                style={{
                  width: "100%",
                  backgroundColor: colors.theme_bg_three,
                  borderRadius: 10,
                  height: 50,
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    width: "15%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon
                    type={Icons.MaterialIcons}
                    name="search"
                    color={colors.theme_fg_two}
                    style={{ fontSize: 30 }}
                  />
                </View>
                <View
                  style={{
                    width: "85%",
                    alignItems: "flex-start",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: colors.theme_fg_two,
                      fontSize: 16,
                      color: colors.text_grey,
                    }}
                  >
                    Where are u going?
                  </Text>
                </View>
              </TouchableOpacity>
            </DropShadow>
          ) : (
            <View style={{ height: 60, flexDirection: "row" }}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                {show_packages()}
              </ScrollView>
            </View>
          )}
        </Animated.View>
      </View>
    );
  };

  const screen_location = () => {
    return (
      <View>
        <Animated.View
          style={[
            { transform: [{ translateY: drop_comp_3 }] },
            [
              {
                position: "absolute",
                width: "100%",
                height: 100,
                alignItems: "center",
                paddingBottom: 10,
                justifyContent: "center",
                backgroundColor: colors.theme_bg_three,
              },
            ],
          ]}
        >
          <View style={{ flexDirection: "row", height: 90, width: "100%" }}>
            <TouchableOpacity
              onPress={back_to_home_screen.bind(this)}
              style={{
                width: "15%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon
                type={Icons.MaterialIcons}
                name="arrow-back"
                color={colors.icon_active_color}
                style={{ fontSize: 22 }}
              />
            </TouchableOpacity>
            <View
              style={{
                width: "85%",
                alignItems: "flex-start",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: colors.theme_fg_two,
                  fontSize: 18,
                  fontFamily: bold,
                }}
              >
                {active_location == 1 ? "Pick up" : "Destination"}
              </Text>
            </View>
          </View>
        </Animated.View>
        <Animated.View
          style={[
            { transform: [{ translateY: drop_comp_2 }] },
            [
              {
                position: "absolute",
                bottom: 0,
                width: "100%",
                height: 100,
                alignItems: "center",
                justifyContent: "center",
              },
            ],
          ]}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={confirm_location.bind(this)}
            style={{
              width: "90%",
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
                fontSize: 16,
                color: colors.theme_fg_three,
                fontFamily: bold,
              }}
            >
              Confirm Location
            </Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          style={[
            { transform: [{ translateY: drop_comp_4 }] },
            [
              {
                position: "absolute",
                width: "100%",
                height: screenHeight - 100,
                alignItems: "center",
                paddingBottom: 10,
                justifyContent: "flex-start",
                backgroundColor: colors.theme_bg_three,
              },
            ],
          ]}
        >
          <View style={{ margin: 30 }} />
          <TouchableOpacity
            activeOpacity={1}
            onPress={search_exit.bind(this)}
            style={{
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              borderWidth: 1,
              padding: 10,
              borderRadius: 10,
              borderColor: colors.grey,
            }}
          >
            <Icon
              type={Icons.MaterialIcons}
              name="location-on"
              color={colors.icon_inactive_color}
              style={{ fontSize: 22 }}
            />
            <View style={{ margin: 5 }} />
            <Text
              style={{
                fontSize: 18,
                color: colors.text_grey,
                fontFamily: bold,
              }}
            >
              Locate on map
            </Text>
          </TouchableOpacity>
          <View style={{ margin: 20 }} />
          <View style={{ width: "100%", padding: 20 }}>
            <Text
              style={{
                fontSize: 18,
                color: colors.text_grey,
                fontFamily: bold,
              }}
            >
              Favourites
            </Text>
            <View style={{ margin: 10 }} />
            {favourites_list()}
          </View>
        </Animated.View>
        <Animated.View
          style={[
            { transform: [{ translateY: drop_comp_1 }] },
            [
              {
                position: "absolute",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              },
            ],
          ]}
        >
          <DropShadow
            style={{
              width: "90%",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.3,
              shadowRadius: 5,
            }}
          >
            <View
              style={{
                borderRadius: 10,
                backgroundColor: colors.theme_bg_three,
              }}
            >
              <GooglePlacesAutocomplete
                ref={search}
                minLength={2}
                placeholder={
                  active_location == 1
                    ? "Enter the pick up"
                    : "Enter the destination"
                }
                listViewDisplayed="auto"
                fetchDetails={true}
                GooglePlacesSearchQuery={{
                  rankby: "distance",
                  types: "food",
                }}
                debounce={200}
                filterReverseGeocodingByTypes={[
                  "locality",
                  "administrative_area_level_3",
                ]}
                textInputProps={{
                  onFocus: () => is_focus(),
                  placeholderTextColor: colors.text_grey,
                  returnKeyType: "search",
                }}
                styles={{
                  textInputContainer: {
                    backgroundColor: colors.theme_bg_three,
                    borderRadius: 10,
                  },
                  description: {
                    color: "#000",
                  },
                  textInput: {
                    height: 45,
                    color: colors.theme_fg_two,
                    fontFamily: normal,
                    fontSize: 14,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  },
                  predefinedPlacesDescription: {
                    color: colors.theme_fg_two,
                  },
                }}
                currentLocation={true}
                enableHighAccuracyLocation={true}
                onPress={(data, details = null) => {
                  get_location(data, details);
                }}
                query={{
                  key: GOOGLE_KEY,
                  language: "en",
                  radius: "1500",
                  location: pickup_lat + "," + pickup_lng,
                  types: ["geocode", "address"],
                }}
              />
            </View>
          </DropShadow>
        </Animated.View>
      </View>
    );
  };

  const screen_booking = () => {
    return (
      <View>
        {!current_location_status && (
          <DropShadow
            style={{
              width: "100%",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.3,
              shadowRadius: 25,
            }}
          >
            <TouchableOpacity
              activeOpacity={0}
              onPress={booking_exit.bind(this)}
              style={{
                width: 40,
                height: 40,
                backgroundColor: colors.theme_bg_three,
                borderRadius: 25,
                alignItems: "center",
                justifyContent: "center",
                top: 20,
                left: 20,
              }}
            >
              <Icon
                type={Icons.MaterialIcons}
                name="arrow-back"
                color={colors.icon_active_color}
                style={{ fontSize: 22 }}
              />
            </TouchableOpacity>
          </DropShadow>
        )}
        <Animated.View
          style={[
            { transform: [{ translateY: book_comp_1 }] },
            [
              {
                position: "absolute",
                width: "100%",
                height: screenHeight - 250,
                paddingBottom: 10,
                justifyContent: "flex-start",
                backgroundColor: colors.theme_bg_three,
              },
            ],
          ]}
        >
          <View style={{ width: "100%", height: 110 }}>
            <DropShadow
              style={{
                width: "100%",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
                shadowOpacity: 0.3,
                shadowRadius: 5,
              }}
            >
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  width: "100%",
                  backgroundColor: colors.theme_bg_three,
                }}
              >
                <View
                  style={{ flexDirection: "row", width: "100%", height: 50 }}
                >
                  <View
                    style={{
                      width: "10%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Badge status="success" />
                  </View>
                  <View
                    style={{
                      width: "90%",
                      alignItems: "flex-start",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{
                        color: colors.theme_fg_two,
                        fontSize: 13,
                        fontFamily: normal,
                      }}
                    >
                      {pickup_address}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <Divider style={{ backgroundColor: colors.grey }} />

              <TouchableOpacity
                activeOpacity={1}
                style={{
                  width: "100%",
                  backgroundColor: colors.theme_bg_three,
                }}
              >
                <View
                  style={{ flexDirection: "row", width: "100%", height: 50 }}
                >
                  <View
                    style={{
                      width: "10%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Badge status="error" />
                  </View>
                  <View
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
                        color: colors.theme_fg_two,
                        fontSize: 13,
                        fontFamily: normal,
                      }}
                    >
                      {drop_address}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </DropShadow>
          </View>

          <ScrollView style={{zIndex: 100, width: "100%"}}>
            <Text
              style={{
                color: colors.theme_fg_two,
                fontSize: 16,
                fontFamily: regular,
              }}
            >
              Available rides
            </Text>
            {estimation_fare_list()}
          </ScrollView>
          <View
            style={{
              height: 100,
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                width: "100%",
                height: 30,
                backgroundColor: colors.grey,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  color: colors.theme_fg_three,
                  fontSize: 12,
                  fontFamily: normal,
                  letterSpacing: 1,
                }}
              >
                You have {global.currency}
                {wallet} in your wallet !
              </Text>
            </View>
            <View style={{ margin: 5 }} />

            {loading == false ? (
              <View
                style={{
                  width: "90%",
                  backgroundColor: colors.btn_color,
                  borderRadius: 10,
                  height: 50,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  onPress={open_offer_fare.bind(this)}
                  activeOpacity={1}
                  style={{
                    width: "90%",
                    backgroundColor: colors.btn_color,
                    borderRadius: 10,
                    height: 50,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {total == 0 ? (
                    <Text
                      style={{
                        color: colors.theme_fg_two,
                        fontSize: 16,
                        color: colors.theme_fg_three,
                        fontFamily: normal,
                      }}
                    >
                      Update Your Fare
                    </Text>
                  ) : (
                    <Text
                      style={{
                        color: colors.theme_fg_two,
                        fontSize: 16,
                        color: colors.theme_fg_three,
                        fontFamily: bold,
                      }}
                    >
                      Book Now
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ height: 50, width: "90%", alignSelf: "center" }}>
                <LottieView source={btn_loader} autoPlay loop />
              </View>
            )}
          </View>
        </Animated.View>
      </View>
    );
  };

  const rb_favourite = () => {
    return (
      <RBSheet
        ref={fav_RBSheet}
        height={190}
        openDuration={250}
        customStyles={{
          container: {
            justifyContent: "flex-end",
            alignItems: "flex-start",
            padding: 10,
          },
        }}
      >
        <View style={{ padding: 10, width: "100%" }}>
          <Text
            style={{
              color: colors.theme_fg_two,
              fontSize: f_25,
              fontFamily: regular,
            }}
          >
            Save as favourite
          </Text>
          <View style={{ margin: 5 }} />
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              color: colors.theme_fg_two,
              fontSize: f_s,
              fontFamily: normal,
            }}
          >
            {pickup_address}
          </Text>
        </View>
        <View style={{ margin: 10 }} />
        <View style={{ flexDirection: "row", width: "100%" }}>
          <View style={{ width: "1%" }} />
          <View
            style={{
              width: "48%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => fav_RBSheet.current.close()}
              style={{
                width: "100%",
                backgroundColor: colors.lite_grey,
                borderRadius: 5,
                height: 50,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: colors.theme_fg_two,
                  fontSize: 16,
                  color: colors.theme_fg_two,
                  fontFamily: regular,
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ width: "1%" }} />
          <View
            style={{
              width: "48%",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "flex-end",
            }}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => add_favourite_api()}
              style={{
                width: "100%",
                backgroundColor: colors.btn_color,
                borderRadius: 5,
                height: 50,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: colors.theme_fg_two,
                  fontSize: 16,
                  color: colors.theme_fg_three,
                  fontFamily: regular,
                }}
              >
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    );
  };

  const rb_offer_fare = () => {
    return (
      <RBSheet
        ref={offer_fare_RBSheet}
        height={170}
        openDuration={250}
        customStyles={{
          container: {
            justifyContent: "flex-end",
            alignItems: "flex-start",
            padding: 10,
          },
        }}
      >
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              width: "100%",
              backgroundColor: colors.theme_bg_three,
              borderRadius: 10,
              padding: 20,
              marginTop: 5,
              marginBottom: 5,
            }}
          >
            <View
              style={{
                width: "100%",
                alignItems: "flex-start",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: colors.theme_fg_two,
                  fontSize: 16,
                  fontFamily: regular,
                }}
              >
                Specify your reasonable fare.
              </Text>
            </View>
            <View style={{ margin: 5 }} />
            <View
              style={{
                width: "100%",
                borderRadius: 10,
                flexDirection: "row",
                borderWidth: 1,
                padding: 10,
                backgroundColor: colors.text_container_bg,
                borderStyle: "dotted",
              }}
            >
              <View
                style={{
                  width: "60%",
                  alignItems: "flex-start",
                  justifyContent: "center",
                }}
              >
                <TextInput
                  placeholder="Enter your fare"
                  secureTextEntry={false}
                  keyboardType="numeric"
                  placeholderTextColor={colors.grey}
                  style={styles.textinput}
                  onChangeText={(TextInputValue) => setTotal(TextInputValue)}
                />
              </View>
              <TouchableOpacity
                onPress={close_offer_fare.bind(this)}
                activeOpacity={1}
                style={{
                  width: "40%",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: colors.theme_bg,
                  borderRadius: 10,
                  padding: 10,
                }}
              >
                <Text
                  style={{
                    color: colors.theme_fg_three,
                    fontSize: 14,
                    fontFamily: normal,
                  }}
                >
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </RBSheet>
    );
  };

  const cancel_request = () => {
    console.log({ trip_request_id: trip_request_id });
    axios({
      method: "post",
      url: api_url + trip_request_cancel,
      data: { trip_request_id: trip_request_id },
    })
      .then(async (response) => {})
      .catch((error) => {
        console.log(error);
      });
  };



  const date_picker = () => {
    return (
      <DateTimePickerModal
        isVisible={is_date_picker_visible}
        mode="datetime"
        date={new Date()}
        minimumDate={new Date(Date.now() + 10 * 60 * 1000)}
        is24Hour={false}
        onConfirm={handle_confirm}
        onCancel={hide_date_picker}
      />
    );
  };

  const drop_down_alert = () => {
    return (
      <DropdownAlert
        ref={(ref) => {
          if (ref) {
            dropDownAlertRef = ref;
          }
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.theme_bg} />

      <MapView
        provider={PROVIDER_GOOGLE}
        ref={map_ref}
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={false}
        onRegionChangeComplete={(region) => {
          region_change(region);
        }}
      ></MapView>
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 170,
          right: 20,
          backgroundColor: "#fff",
          borderRadius: 50,
          padding: 10,
          elevation: 5,
        }}
        onPress={centerToUserLocation}
      >
        <Icon
          type={Icons.MaterialIcons}
          name="my-location"
          color={colors.theme_bg_two}
          style={{ fontSize: 22 }}
        />
      </TouchableOpacity>
      <View
        style={{
          height: 100,
          width: 100,
          alignSelf: "center",
          position: "absolute",
          top: screenHeight / 2 - 50,
        }}
      >
        <LottieView style={{ flex: 1 }} source={pin_marker} autoPlay loop />
      </View>
      {screen_home()}
      {screen_location()}
      {screen_booking()}
      {rb_favourite()}
      {date_picker()}
      {drop_down_alert()}
      {rb_offer_fare()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: screenHeight,
    width: screenWidth,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  vehicle_img: {
    height: 40,
    width: 60,
  },
  active_trip_type_label: {
    color: colors.theme_fg_two,
    fontSize: 12,
    fontFamily: bold,
  },
  inactive_trip_type_label: {
    color: colors.text_grey,
    fontSize: 12,
    fontFamily: normal,
  },
  segment_active_bg: {
    width: "48%",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    marginLeft: "1%",
    marginRight: "1%",
    backgroundColor: colors.theme_bg,
    borderRadius: 10,
  },
  segment_active_fg: {
    color: colors.theme_fg_two,
    fontSize: 14,
    fontFamily: bold,
    color: colors.theme_fg_three,
  },
  segment_inactive_bg: {
    width: "48%",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    marginLeft: "1%",
    marginRight: "1%",
    backgroundColor: colors.lite_bg,
    borderRadius: 10,
  },
  segment_inactive_fg: {
    color: colors.theme_fg_two,
    fontSize: 14,
    fontFamily: normal,
    color: colors.theme_fg_two,
  },
  textinput: {
    fontSize: f_m,
    color: colors.grey,
    fontFamily: regular,
    height: 50,
    width: "90%",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "98%",
    backgroundColor: colors.warning_background,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "red",
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "grey",
    color: colors.theme_bg_two,
  },
});

function mapStateToProps(state) {
  return {
    initial_lat: state.booking.initial_lat,
    initial_lng: state.booking.initial_lng,
    initial_region: state.booking.initial_region,
  };
}

export default connect(mapStateToProps, null)(Dashboard);
