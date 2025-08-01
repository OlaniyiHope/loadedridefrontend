import React, { useState, useEffect, useRef } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  StatusBar,
  FlatList
} from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import * as colors from '../assets/css/Colors';
import { screenHeight, screenWidth, bold, get_notification_messages, notification_bell, api_url, regular, loader, f_s, f_xs, f_xl, normal } from '../config/Constants';
import Icon, { Icons } from '../components/Icons';
import DropShadow from "react-native-drop-shadow";
import axios from 'axios';
import DropdownAlert from 'react-native-dropdownalert';
import Moment from 'moment';
import LottieView from 'lottie-react-native';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import NetInfo from "@react-native-community/netinfo";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const Notifications = (props) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  let dropDownAlertRef = useRef();
  const viewableItems = useSharedValue([]);

  const navigate_home = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Home" }],
      })
    );
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      call_get_notification_messages();
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
  const call_get_notification_messages = () => {
    console.log(api_url + get_notification_messages)
    console.log( { customer_id: global.id, lang: global.lang })
    setLoading(true);
    axios({
      method: 'post',
      url: api_url + get_notification_messages,
      data: { customer_id: global.id, lang: global.lang }
    })
      .then(async response => {
        setData(response.data.result)
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        dropDownAlertRef.alertWithType('error', 'Validation error', 'Sorry something went wrong');
      });
  }

  navigate_notification_details = (data) => {
    navigation.navigate('NotificationDetails', { data: data });
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
          <TouchableOpacity onPress={navigate_notification_details.bind(this, item)} activeOpacity={1} style={{ flexDirection: 'row', flex: 1, backgroundColor: colors.theme_bg_three, padding: 15, marginTop: 5, marginBottom: 5, borderRadius: 10 }}>
            <View style={{ width: 50, height: 50 }} >
              <Image style={{ height: undefined, width: undefined, flex: 1, borderRadius: 10 }} source={notification_bell} />
            </View>
            <View style={{ margin: 10 }} />
            <View style={{ alignItems: 'flex-start', justifyContent: 'center', width: '80%' }}>
              <Text numberOfLines={1} style={{ color: colors.theme_fg_two, fontSize: f_s, fontFamily: regular }}>{item.title}</Text>
              <View style={{ margin: 1 }} />
              <Text numberOfLines={1} style={{ color: colors.text_grey, fontSize: f_xs, fontFamily: normal }}>{item.message}</Text>
              <View style={{ margin: 4 }} />
              <Text numberOfLines={1} style={{ color: colors.text_grey, fontSize: f_xs, fontFamily: normal }}>{Moment(item.created_at).fromNow()}</Text>
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
    <SafeAreaView style={{ backgroundColor: colors.lite_bg, flex: 1 }}>
      <StatusBar backgroundColor={colors.theme_bg} />
      <View style={[styles.header]}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
        ReactNativeHapticFeedback.trigger("impactLight", options);navigation.toggleDrawer();
          }}
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
            Notifications
          </Text>
        </View>
      </View>
      {loading == true ? (
        <View
          style={{
            height: 100,
            width: 100,
            alignSelf: "center",
            marginTop: "30%",
          }}
        >
          <LottieView source={loader} autoPlay loop />
        </View>
      ) : (
        <DropShadow
          style={{
            width: "95%",
            marginBottom: 5,
            marginTop: 5,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            marginLeft: "2.5%",
          }}
        >
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
        </DropShadow>
      )}
      {drop_down_alert()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: screenHeight,
    width: screenWidth,
  },
  header: {
    height: 60,
    backgroundColor: colors.theme_bg,
    flexDirection: 'row',
    alignItems: 'center'
  },
});

export default Notifications;