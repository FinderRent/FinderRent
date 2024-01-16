import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import HouseCard from "../components/House/HouseCard";
import ProfileLocation from "../components/ProfileLocation";
import MapModal from "../modals/MapModal";
import Map from "../components/Map/Map";

/**
 * TODO:
 * when press on the profile photo, go to profile page.
 * when press on the location, open a search new location option
 * make the cards dynamic data from the DB
 */

// function to get Permissions for PushNotifications
async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    });

    return token.data;
  } else {
    console.log("Must use physical device for Push Notifications");
    return;
  }
}

function HomeScreen({ navigation }) {
  const { isDarkMode } = useDarkMode();
  const tabBarHeight = useBottomTabBarHeight();

  const [mapPress, setMapPress] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);

  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // handle pressing the notifications
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const { data } = response.notification.request.content;
        const { chatId, ouid, pushToken, image, title } = data;

        if (data.chatId) {
          navigation.navigate("MainTabScreen", {
            screen: "ChatStackScreen",
            params: {
              screen: "ChatScreen",
              params: {
                chatId,
                ouid,
                pushToken,
                image,
                title,
              },
            },
          });
        } else {
          console.log("No chatId sent with notification");
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [notificationListener]);

  const handleMapPress = () => {
    setMapPress(!mapPress);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "ios" ? 0 : 35,
        backgroundColor: isDarkMode ? Color.darkTheme : Color.white,
      }}
    >
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <ProfileLocation />
      <ScrollView style={{ flex: 1, marginBottom: tabBarHeight - 50 }}>
        {/* <Map handleMapPress={handleMapPress} />
        {mapPress && <MapModal handleMapPress={handleMapPress} />} */}

        <TouchableOpacity
          onPress={() => navigation.navigate("HouseDetailsScreen")}
        >
          <HouseCard navigation={navigation} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("HouseDetailsScreen")}
        >
          <HouseCard navigation={navigation} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("HouseDetailsScreen")}
        >
          <HouseCard navigation={navigation} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});

export default HomeScreen;
