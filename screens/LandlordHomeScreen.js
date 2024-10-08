import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  Platform,
  View,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import AwesomeAlert from "react-native-awesome-alerts";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import { useUsers } from "../context/UserContext";
import { deleteApartment, fetchAllApartments } from "./../utils/http";
import LandlordHeader from "../components/Headers/LandlordHeader";
import SignInHeader from "../components/Headers/SignInHeader";
import LandlordHouseCard from "../components/House/LandlordHouseCard";
import AddApartmentButton from "../components/ui/AddApartmentButton";
import AddApartmentScreen from "./AddApartmentScreen";
import Loader from "../components/ui/Loader";
import ErrorMessage from "../components/ui/ErrorMessage";
import SwipeableRow from "../components/ui/SwipeableRow";
import NoApartments from "../components/House/NoApartments";

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
      // alert("Failed to get push token for push notification!");
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
  const { t } = useTranslation();
  const { userData } = useUsers();
  const { isDarkMode } = useDarkMode();

  const token = userData.token;
  const owner = userData.id;
  const [addButtonPress, setAddButtonPress] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [alertDeleteApartment, setAlertDeleteApartment] = useState(false);
  const [apartmentId, setApartmentId] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);

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

  const {
    mutate,
    isPending: isPendingDeleteApartment,
    error: errorDeleteApartment,
  } = useMutation({
    mutationFn: (apartmentId) => deleteApartment(apartmentId),
    onSuccess: async () => {
      setAlertDeleteApartment(false);
      await refetch();
    },
    onError: (err) => console.log(err.message),
  });

  const handleDeleteApartment = () => {
    mutate(apartmentId);
  };

  //refetch the flatlist data after an edit apartment happend
  useFocusEffect(
    useCallback(() => {
      const checkRefetchFlag = async () => {
        const needsRefetch = await AsyncStorage.getItem("needsRefetch");
        if (needsRefetch === "true") {
          // Trigger the refetch
          await refetch();
          // Reset the flag
          await AsyncStorage.setItem("needsRefetch", "false");
        }
      };

      checkRefetchFlag();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      if (!hasFetched) {
        const fetched = async () => {
          await refetch();
          setHasFetched(true);
        };
        fetched();
      }
    }, [hasFetched])
  );

  useEffect(() => {
    if (!hasFetched) {
      const initialFetch = async () => {
        await refetch();
        setHasFetched(true);
      };
      initialFetch();
    }
  }, [hasFetched]);

  const handleAddButtonPress = () => {
    setAddButtonPress((prevState) => !prevState);
    refetch();
  };

  const handleIsOpen = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleDelete = (id) => {
    setApartmentId(id);
    setAlertDeleteApartment(true);
  };

  const renderApartmentCard = ({ item: apartment }) => {
    return (
      <SwipeableRow
        color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
        key={apartment._id}
        onDelete={() => handleDelete(apartment._id)}
      >
        <LandlordHouseCard
          navigation={navigation}
          apartment={apartment}
          userData={userData}
        />
      </SwipeableRow>
    );
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
      {token ? <LandlordHeader /> : <SignInHeader />}
      <View style={{ marginTop: Platform.OS === "ios" ? 0 : 15 }}></View>
      {apartments?.apartments.length === 0 && <NoApartments />}
      {apartments?.apartments.length > 0 && isFetchingApartments ? (
        <Loader color={isDarkMode ? Color.defaultTheme : Color.darkTheme} />
      ) : (
        <FlatList
          style={styles.FlatList}
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
      <AwesomeAlert
        show={alertDeleteApartment !== false}
        contentContainerStyle={
          isDarkMode
            ? { backgroundColor: Color.buttomSheetDarkTheme }
            : { backgroundColor: Color.defaultTheme }
        }
        title={t("deleteApartment")}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        confirmText={t("yes")}
        cancelText={t("no")}
        confirmButtonColor={isDarkMode ? Color.defaultTheme : Color.darkTheme}
        confirmButtonTextStyle={
          isDarkMode
            ? { color: Color.darkTheme }
            : { color: Color.defaultTheme }
        }
        cancelButtonColor={
          isDarkMode ? Color.buttomSheetDarkTheme : Color.defaultTheme
        }
        titleStyle={isDarkMode ? styles.whiteTitle : styles.darkTitle}
        cancelButtonTextStyle={
          isDarkMode
            ? { color: Color.defaultTheme }
            : { color: Color.darkTheme }
        }
        onCancelPressed={() => setAlertDeleteApartment(false)}
        onConfirmPressed={handleDeleteApartment}
        onDismiss={() => setAlertDeleteApartment(false)}
        customView={
          <View>
            {isPendingDeleteApartment && (
              <ActivityIndicator
                style={{ marginTop: 10 }}
                color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
              />
            )}
            {errorDeleteApartment && (
              <ErrorMessage errorMessage={errorDeleteApartment} />
            )}
          </View>
        }
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
    marginHorizontal: "4%",
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
    bottom: Platform.OS === "ios" ? "22%" : "19%",
    right: "15%",
  },
  FlatList: {
    marginBottom: "20%",
    marginTop: "30%",
  },
  cardContainer: {
    padding: 10,
  },
  cardCover: {
    width: 100,
    height: 100,
    margin: 10,
  },
  card: {
    marginVertical: 10,
    paddingRight: 10,
  },
  cardContent: {
    marginLeft: -10,
    margin: 5,
  },
  whiteTitle: {
    color: Color.defaultTheme,
  },
  darkTitle: {
    color: Color.darkTheme,
  },
});
