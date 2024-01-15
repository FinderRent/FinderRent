import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Alert, I18nManager, Platform } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MenuProvider } from "react-native-popup-menu";
import Toast from "react-native-toast-message";

import { UserContext, useUsers } from "./context/UserContext";
import { DarkModeProvider } from "./context/DarkModeContext";
import AuthStackScreens from "./navigation/AuthStackScreens";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 60 * 1000,
      staleTime: 0,
    },
  },
});

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
  } else {
    console.log("Must use physical device for Push Notifications");
  }

  return token.data;
}

export default function App() {
  I18nManager.forceRTL(false);
  I18nManager.allowRTL(false);

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  console.log(expoPushToken);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const [appIsLoaded, setAppIsLoaded] = useState(false);

  const {
    login,
    logout,
    token,
    userType,
    id,
    firstName,
    lastName,
    avatar,
    age,
    phone,
    gender,
    academic,
    department,
    yearbook,
    email,
  } = useUsers();

  useEffect(() => {
    const prepare = async () => {
      try {
        await Font.loadAsync({
          varelaRound: require("./assets/fonts/VarelaRound-Regular.ttf"),
          DancingScript: require("./assets/fonts/DancingScript-Regular.ttf"),
          OrbitronMedium: require("./assets/fonts/Orbitron-Medium.ttf"),
          Merienda: require("./assets/fonts/Merienda-Regular.ttf"),
        });
      } catch (error) {
        console.log.error();
      } finally {
        setAppIsLoaded(true);
      }
    };

    prepare();
  }, []);

  const onLayout = useCallback(async () => {
    if (appIsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [appIsLoaded]);

  if (!appIsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider onLayout={onLayout}>
      <DarkModeProvider>
        <QueryClientProvider client={queryClient}>
          <UserContext.Provider
            value={{
              login,
              logout,
              token,
              userType,
              id,
              firstName,
              lastName,
              avatar,
              age,
              phone,
              gender,
              academic,
              department,
              yearbook,
              email,
            }}
          >
            <MenuProvider>
              <AuthStackScreens />
            </MenuProvider>
            <Toast />
          </UserContext.Provider>
        </QueryClientProvider>
      </DarkModeProvider>
    </SafeAreaProvider>
  );
}
