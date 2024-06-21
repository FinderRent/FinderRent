import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  Platform,
  TouchableOpacity,
  View,
  Keyboard,
} from "react-native";
import { Text } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import LandlordHeader from "../components/LandlordHeader";
import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import { useUsers } from "../context/UserContext";
import LandlordHouseCard from "../components/House/LandlordHouseCard";
import SignInHeader from "../components/SignInHeader";
import Loader from "../components/ui/Loader";
import { fetchAllApartments } from "./../utils/http";
import AddApartmentButton from "../components/ui/AddApartmentButton";
import AddApartmentScreen from "./AddApartmentScreen";
import BottomSheet from "@gorhom/bottom-sheet";
import { useFocusEffect } from "@react-navigation/native";

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

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const [addButtonPress, setAddButtonPress] = useState(false);
  const [sheetIndex, setSheetIndex] = useState(-1); // -1 means closed
  const bottomSheetRef = useRef(null);

  const notificationListener = useRef();
  const responseListener = useRef();

  const {
    data: apartments,
    isLoading: isLoadingApartments,
    isError: isErrorApartments,
    status: statusApartments,
    refetch,
  } = useQuery({
    queryKey: ["apartments"],
    queryFn: () => fetchAllApartments({ owner: userData.id }),
  });

  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    status: statusUser,
  } = useQuery({
    queryKey: ["User", userData.id],
    queryFn: () => fetchUser(userData.id),
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const renderApartmentCard = ({ item: apartment }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("LandlordHouseDetailsScreen", { apartment })
        }
      >
        <LandlordHouseCard
          navigation={navigation}
          apartment={apartment}
          userData={userData}
        />
      </TouchableOpacity>
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

  const snapPoints = useMemo(
    () => (Platform.OS === "ios" ? ["14%", "90%"] : ["3%", "76%"]),
    []
  );

  const handleSheetChanges = (index) => {
    setSheetIndex(index);
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
      {token ? <LandlordHeader /> : <SignInHeader />}
      <Text style={styles.PropertiesHeader}>Your properties</Text>
      <FlatList
        data={apartments?.apartments}
        keyExtractor={(item) => item._id}
        renderItem={renderApartmentCard}
      />
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        index={addButtonPress ? 1 : 0}
      >
        <AddApartmentScreen handleAddButtonPress={handleAddButtonPress} />
      </BottomSheet>
      <AddApartmentButton
        style={styles.addApartmentButton}
        handleAddButtonPress={handleAddButtonPress}
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
    bottom: Platform.OS === "ios" ? "22%" : "12%",
    right: "15%",
  },
});
