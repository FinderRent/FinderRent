import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { MaterialIcons } from "@expo/vector-icons";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import { useUsers } from "../context/UserContext";
import { fetchAllApartments } from "./../utils/http";
import HouseCard from "../components/House/HouseCard";
import ProfileLocation from "../components/ProfileLocation";
import SignInHeader from "../components/SignInHeader";
import ExploreHeader from "../components/ExploreHeader";
import Loader from "../components/ui/Loader";
import ListingsMap from "../components/Map/ListingsMap";
import listingsDataGeo from "../data/apartments-listings.geo.json";
import ErrorMessage from "../components/ui/ErrorMessage";

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

  //----------------------------------------------------------------------
  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(
    () => (Platform.OS === "ios" ? ["14%", "77.5%"] : ["3%", "76%"]),
    []
  );

  const {
    data: apartments,
    isLoading: isLoadingApartments,
    isError: isErrorApartments,
    error: errorApartments,
    refetch,
  } = useQuery({
    queryKey: ["apartments"],
    queryFn: () => fetchAllApartments(category),
  });

  useEffect(() => {
    refetch();
  }, [category, refetch]);

  //render the apartment card
  const renderApartmentCard = ({ item: apartment }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("HouseDetailsScreen", { apartment })}
      >
        <HouseCard
          navigation={navigation}
          apartment={apartment}
          userData={userData}
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

  const onShowMap = () => {
    bottomSheetRef.current?.collapse();
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

      <ListingsMap listings={getoItems} {...(token ? { coordinates } : {})} />

      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        backgroundStyle={{
          backgroundColor: isDarkMode ? Color.darkTheme : Color.white,
        }}
        handleIndicatorStyle={
          isDarkMode
            ? { backgroundColor: Color.gray }
            : { backgroundColor: Color.darkTheme }
        }
        style={styles.sheetContainer}
      >
        {isErrorApartments && <ErrorMessage errorMessage={errorApartments} />}

        {isLoadingApartments ? (
          <View style={{ paddingTop: "80%" }}>
            <Loader color={isDarkMode ? Color.white : Color.darkTheme} />
          </View>
        ) : apartments?.apartments.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <MaterialIcons
              name="apartment"
              size={120}
              color={Color.buttomSheetDarkTheme}
            />
            <Text style={styles.noResultsText}>There's No Apartments.</Text>
          </View>
        ) : (
          <BottomSheetFlatList
            data={apartments?.apartments}
            keyExtractor={(item) => item._id}
            renderItem={renderApartmentCard}
          />
        )}
        <View style={styles.absoluteView}>
          <TouchableOpacity onPress={onShowMap} style={styles.mapBtn}>
            <Text style={{ color: "#fff" }}>Map</Text>
            <Ionicons
              name="map"
              size={20}
              style={{ marginLeft: 10 }}
              color={"#fff"}
            />
          </TouchableOpacity>
        </View>
      </BottomSheet>
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
