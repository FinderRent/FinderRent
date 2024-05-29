import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, SafeAreaView, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import { useUsers } from "../context/UserContext";
import ProfileLocation from "../components/ProfileLocation";
import SignInHeader from "../components/SignInHeader";
import ExploreHeader from "../components/ExploreHeader";
import ListingsMap from "../components/Map/ListingsMap";
import HouseList from "../components/House/HouseList";
import listingsDataGeo from "../data/apartments-listings.geo.json";

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
  const { userData } = useUsers();
  const { isDarkMode } = useDarkMode();
  const tabBarHeight = useBottomTabBarHeight();

  const token = userData.token;
  let coordinates = null;
  try {
    coordinates = userData?.coordinates
      ? JSON.parse(userData.coordinates)
      : null;
  } catch (error) {
    console.error("Failed to parse coordinates:", error);
  }

  const [category, setCategory] = useState(null);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);

  const notificationListener = useRef();
  const responseListener = useRef();

  const getoItems = useMemo(() => listingsDataGeo, []);

  useEffect(() => {
    registerForPushNotificationsAsync().then((pushToken) =>
      setExpoPushToken(pushToken)
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

        if (data.chatId && token) {
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
          navigation.navigate("ChatStackScreen");
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [notificationListener, token]);

  const onDataChanged = (category) => {
    setCategory(category);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "ios" ? 0 : 35,
        marginBottom: Platform.OS === "ios" ? 0 : tabBarHeight,
        backgroundColor: isDarkMode ? Color.darkTheme : Color.white,
      }}
    >
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      {token ? <ProfileLocation /> : <SignInHeader />}

      <ExploreHeader onCategoryChanged={onDataChanged} />

      <ListingsMap listings={getoItems} {...(token ? { coordinates } : {})} />

      <HouseList category={category} navigation={navigation} />
    </SafeAreaView>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  absoluteView: {
    position: "absolute",
    bottom: 10,
    width: "100%",
    alignItems: "center",
  },
  mapBtn: {
    backgroundColor: Color.darkTheme,
    padding: 10,
    height: 40,
    borderRadius: 10,
    flexDirection: "row",
    marginHorizontal: "auto",
    alignItems: "center",
  },
  sheetContainer: {
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsText: {
    textAlign: "center",
    color: Color.gray,
    fontFamily: "varelaRound",
    fontSize: 17,
    letterSpacing: 0.3,
  },
});
