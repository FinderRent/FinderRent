import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import { useUsers } from "../context/UserContext";
import HouseCard from "../components/House/HouseCard";
import ProfileLocation from "../components/ProfileLocation";
import MapModal from "../modals/MapModal";
import Map from "../components/Map/Map";
import SignInHeader from "../components/SignInHeader";
import ExploreHeader from "../components/ExploreHeader";
import { fetchAllApartments } from "./../utils/http";
import Loader from "../components/ui/Loader";
import { useQuery } from "@tanstack/react-query";
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
  const { userData } = useUsers();
  const { isDarkMode } = useDarkMode();
  const tabBarHeight = useBottomTabBarHeight();

  const token = userData.token;
  const [mapPress, setMapPress] = useState(false);
  const [category, setCategory] = useState("All");
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);

  const notificationListener = useRef();
  const responseListener = useRef();
  //----------------------------------------------------------------------

  const { data, isLoading, isError, status } = useQuery({
    queryKey: ["apartments"],
    queryFn: () => fetchAllApartments(),
  });

  const renderApartmentCard = ({ item: apartment }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("HouseDetailsScreen")}
      >
        <HouseCard navigation={navigation} apartment={apartment} />
      </TouchableOpacity>
    );
  };

  //----------------------------------------------------------------------
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

  const handleMapPress = () => {
    setMapPress(!mapPress);
  };

  const onDataChanged = (category) => {
    setCategory(category);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "ios" ? 0 : 35,
        backgroundColor: isDarkMode ? Color.darkTheme : Color.white,
      }}
    >
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      {token ? <ProfileLocation /> : <SignInHeader />}

      <ExploreHeader onCategoryChanged={onDataChanged} />

      <FlatList
        data={data.apartments}
        keyExtractor={(item) => item._id}
        renderItem={renderApartmentCard}
      />
    </SafeAreaView>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({});
