import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  FlatList,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useQuery } from "@tanstack/react-query";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import { useUsers } from "../context/UserContext";
import { fetchAllApartments } from "./../utils/http";
import { fetchUser } from "./../utils/http";
import HouseCard from "../components/House/HouseCard";
import ProfileLocation from "../components/ProfileLocation";
import SignInHeader from "../components/SignInHeader";
import ExploreHeader from "../components/ExploreHeader";
import Loader from "../components/ui/Loader";
import ListingsMap from "../components/Map/ListingsMap";
import listingsDataGeo from "../data/apartments-listings.geo.json";
import { checkIfFavourite } from "../utils/http";
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
  console.log("Home page rendered");
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

  //getting all apartments data
  const {
    data: apartments,
    isLoading: isLoadingApartments,
    isError: isErrorApartments,
    status: statusApartments,
  } = useQuery({
    queryKey: ["apartments"],
    queryFn: () => fetchAllApartments(),
  });

  //getting curreny user data
  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    status: statusUser,
  } = useQuery({
    queryKey: ["User", userData.id],
    queryFn: () => fetchUser(userData.id),
  });

  //check favourite apaerments--------------------------------------
  // const handleFirstQuery = {
  //   queryKey: ["isFavourite"],
  //   queryFn: () => checkIfFavourite(apartment._id, userData.id),
  // };

  // const {
  //   data: favourite,
  //   isLoading: isLoadingFavourite,
  //   isError: isError1,
  //   status: status1,
  // } = useQuery(handleFirstQuery);

  // if (isLoadingFavourite) {
  //   console.log("waiting for data");
  // } else {
  //   console.log("success - Favourite: " + isFavorite);
  // }
  //----------------------------------------------------------------

  //render the apartment card
  const renderApartmentCard = ({ item: apartment }) => {
    let isFavourite = false;
    user?.favouriteApartments.forEach((element) => {
      if (apartment._id == element) {
        isFavourite = true;
      }
    });
    console.log("Card " + apartment._id + " rendered");

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("HouseDetailsScreen", { apartment })}
      >
        <HouseCard
          navigation={navigation}
          apartment={apartment}
          userData={userData}
          isFavourite={isFavourite}
        />
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

  const getoItems = useMemo(() => listingsDataGeo, []);

  const handleMapPress = () => {
    setMapPress(!mapPress);
  };

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

      {/* <ListingsMap listings={getoItems} /> */}

      {isLoadingApartments && (
        <View style={{ paddingTop: "80%" }}>
          <Loader color={isDarkMode ? Color.white : Color.darkTheme} />
        </View>
      )}

      <FlatList
        data={apartments?.apartments}
        keyExtractor={(item) => item._id}
        renderItem={renderApartmentCard}
      />
    </SafeAreaView>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({});
