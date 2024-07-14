import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, SafeAreaView, FlatList, Platform } from "react-native";
import { Text } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import { useUsers } from "../context/UserContext";
import { fetchAllApartments } from "./../utils/http";
import LandlordHeader from "../components/LandlordHeader";
import SignInHeader from "../components/SignInHeader";
import LandlordHouseCard from "../components/House/LandlordHouseCard";
import AddApartmentButton from "../components/ui/AddApartmentButton";
import AddApartmentScreen from "./AddApartmentScreen";
import Loader from "../components/ui/Loader";
import ErrorMessage from "../components/ui/ErrorMessage";

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
function LandlordHomeScreen({ navigation }) {
  const { userData } = useUsers();
  const { isDarkMode } = useDarkMode();
  const tabBarHeight = useBottomTabBarHeight();

  const token = userData.token;
  const owner = userData.id;
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const [addButtonPress, setAddButtonPress] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const notificationListener = useRef();
  const responseListener = useRef();

  const {
    data: apartments,
    isFetching: isFetchingApartments,
    isError: isErrorApartments,
    error,
    refetch,
  } = useQuery({
    queryKey: ["apartments", owner],
    queryFn: () => fetchAllApartments({ owner }),
    enabled: !!owner, // Enable the query only if owner is defined
  });

  // useFocusEffect(
  //   useCallback(() => {
  //     refetch();
  //   }, [refetch])
  // );

  useFocusEffect(
    useCallback(() => {
      const fetched = async () => {
        await refetch();
      };
      fetched();
    }, [])
  );

  const renderApartmentCard = ({ item: apartment }) => {
    return (
      <LandlordHouseCard
        navigation={navigation}
        apartment={apartment}
        userData={userData}
      />
    );
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then((pushToken) =>
      setExpoPushToken(pushToken)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

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

  const handleAddButtonPress = () => {
    setAddButtonPress((prevState) => !prevState);
    refetch();
  };

  const handleIsOpen = () => {
    setIsOpen((prevState) => !prevState);
  };
  // console.log(isFetching);

  // if (isFetching)
  //   return <Loader color={isDarkMode ? Color.defaultTheme : Color.darkTheme} />;

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
      {token ? <LandlordHeader /> : <SignInHeader />}
      <Text style={styles.PropertiesHeader}>Your properties</Text>
      {isFetchingApartments ? (
        <Loader color={isDarkMode ? Color.defaultTheme : Color.darkTheme} />
      ) : (
        <FlatList
          data={apartments?.apartments}
          keyExtractor={(item) => item._id}
          renderItem={renderApartmentCard}
        />
      )}
      {isErrorApartments && <ErrorMessage errorMessage={error} />}
      <AddApartmentScreen
        handleAddButtonPress={handleAddButtonPress}
        bottomSheetIndex={addButtonPress}
        handleIsOpen={handleIsOpen}
      />
      <AddApartmentButton
        style={styles.addApartmentButton}
        handleAddButtonPress={handleAddButtonPress}
        handleIsOpen={handleIsOpen}
        isOpen={isOpen}
      />
    </SafeAreaView>
  );
}

export default LandlordHomeScreen;

const styles = StyleSheet.create({
  absoluteView: {
    position: "absolute",
    bottom: 10,
    width: "100%",
    alignItems: "center",
  },
  PropertiesHeader: {
    fontSize: 30,
    fontWeight: "bold",
    marginHorizontal: "5%",
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
  addApartmentButton: {
    bottom: Platform.OS === "ios" ? "22%" : "13%",
    right: "15%",
  },
});
