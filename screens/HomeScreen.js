import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useQuery } from "@tanstack/react-query";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import { useUsers } from "../context/UserContext";
import { fetchAllApartments } from "../utils/http";
import ProfileLocationHeader from "../components/Headers/ProfileLocationHeader";
import ListingsMap from "../components/Map/ListingsMap";
import HouseList from "../components/House/HouseList";
import ExploreHeader from "../components/Headers/ExploreHeader";
import SignInHeader from "../components/Headers/SignInHeader";

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

function HomeScreen({ navigation, route }) {
  // console.log(route?.params);

  const { userData } = useUsers();
  const { isDarkMode } = useDarkMode();
  const tabBarHeight = useBottomTabBarHeight();

  const token = userData.token;
  let coordinates = userData?.coordinates || null;
  try {
    coordinates = userData?.coordinates
      ? JSON.parse(userData.coordinates)
      : null;
  } catch (error) {
    console.error("Failed to parse coordinates:", error);
  }

  const [categoryIndex, setCategoryIndex] = useState(
    route?.params?.category[0] ?? 0
  );
  const [category, setCategory] = useState(route?.params?.category[1]);
  const [sort, setSort] = useState(route?.params?.sort);
  const [distance, setDistance] = useState(route?.params?.distance || 1.0);
  const [numberOfRooms, setNumberOfRooms] = useState(
    route?.params?.apartmentFilters[0][1]
  );
  const [floor, setFloor] = useState(route?.params?.apartmentFilters[1][1]);
  const [totalCapacity, setTotalCapacity] = useState(
    route?.params?.apartmentFilters[2][1]
  );

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const { data, refetch } = useQuery({
    queryKey: ["apartments"],
    queryFn: () =>
      fetchAllApartments({
        sort,
        apartmentType: category,
        numberOfRooms,
        floor,
        totalCapacity,
        distance,
        coordinates,
      }),
  });

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

  useFocusEffect(
    useCallback(() => {
      const fetched = async () => {
        await refetch();
      };
      fetched();
    }, [token, coordinates])
  );
  useEffect(() => {
    setCategoryIndex(route?.params?.category[0]);
    setCategory(route?.params?.category[1]);
    setSort(route?.params?.sort);
    setDistance(route?.params?.distance || 1.0);
    setNumberOfRooms(route?.params?.apartmentFilters[0][1]);
    setFloor(route?.params?.apartmentFilters[1][1]);
    setTotalCapacity(route?.params?.apartmentFilters[2][1]);
  }, [route?.params]);
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
      {token ? <ProfileLocationHeader /> : <SignInHeader />}

      <ExploreHeader
        onCategoryChanged={onDataChanged}
        categoryIndex={categoryIndex}
        filtersValues={{
          sort,
          distance,
          category,
          numberOfRooms,
          floor,
          totalCapacity,
        }}
      />

      <ListingsMap
        navigation={navigation}
        listings={data?.apartments}
        {...(token ? { coordinates } : {})}
      />

      <HouseList
        navigation={navigation}
        sort={sort}
        category={category}
        numberOfRooms={numberOfRooms}
        floor={floor}
        totalCapacity={totalCapacity}
        distance={distance}
        coordinates={coordinates}
        token={token}
      />
    </SafeAreaView>
  );
}

export default HomeScreen;
