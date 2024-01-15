import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useEffect, useRef, useState } from "react";
import { Platform, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  MD3LightTheme as DefaultTheme,
  MD3DarkTheme as DarkTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import { StackActions, useNavigation } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import { useUsers } from "../context/UserContext";
import HomeStackScreen from "./HomeStackScreen ";
import ProfileStackScreen from "./ProfileStackScreen";
import ChatStackScreen from "./ChatStackScreen";

const Tab = createBottomTabNavigator();

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    secondaryContainer: Color.darkTheme,
    text: Color.white,
  },
};

const CustomDefaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    secondaryContainer: Color.white,
    text: Color.black,
  },
};

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

function MainTabScreen() {
  const { userData } = useUsers();
  const { isDarkMode } = useDarkMode();
  const navigation = useNavigation();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const theme = isDarkMode ? CustomDarkTheme : CustomDefaultTheme;

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

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const { data } = response.notification.request.content;
        const chatId = data["chatId"];

        if (chatId) {
          const pushAction = StackActions.push("ChatListScreen");
          navigation.dispatch(pushAction);
        } else {
          console.log("No chat id sent with notification");
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem("token");

      if (storedToken) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }

    fetchToken();
  }, [userData]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <PaperProvider theme={theme}>
          <Tab.Navigator
            initialRouteName="HomeStackScreen"
            screenOptions={{
              headerShown: false,
              tabBarHideOnKeyboard: true,
              activeTintColor: isDarkMode ? Color.white : Color.black,
              inactiveTintColor: isDarkMode ? Color.white : Color.black,
              tabBarStyle: {
                backgroundColor: isDarkMode ? Color.darkTheme : Color.white,
                borderTopColor: Color.Brown100,
                borderTopWidth: 1,
                height: Platform.OS === "ios" ? "9.5%" : "7%",
                position: "absolute",
                padding: Platform.OS === "ios" ? "6%" : "6%",
              },
            }}
          >
            <Tab.Screen
              name="HomeStackScreen"
              component={HomeStackScreen}
              options={{
                tabBarLabel: "",
                tabBarIcon: ({ focused }) => (
                  <View style={{ alignItems: "center" }}>
                    <MaterialCommunityIcons
                      name={focused ? "home" : "home-outline"}
                      style={{ marginTop: -10 }}
                      color={isDarkMode ? Color.white : Color.darkTheme}
                      size={26}
                    />
                    <Text
                      style={{
                        fontSize: focused ? 10 : 9,
                        color: isDarkMode ? Color.white : Color.black,
                      }}
                    >
                      Home
                    </Text>
                  </View>
                ),
              }}
            />
            <Tab.Screen
              name="ProfileStackScreen"
              component={ProfileStackScreen}
              initialParams={{ isAuthenticated }}
              listeners={({ navigation }) => ({
                tabPress: (e) => {
                  e.preventDefault();
                  navigation.navigate("ProfileStackScreen", {
                    isAuthenticated,
                  });
                },
              })}
              options={{
                tabBarLabel: "",
                tabBarIcon: ({ focused }) => (
                  <View style={{ alignItems: "center" }}>
                    <MaterialCommunityIcons
                      name={focused ? "account" : "account-outline"}
                      style={{ marginTop: -10 }}
                      color={isDarkMode ? Color.white : Color.darkTheme}
                      size={26}
                    />
                    <Text
                      style={{
                        fontSize: focused ? 10 : 9,
                        color: isDarkMode ? Color.white : Color.black,
                      }}
                    >
                      Profile
                    </Text>
                  </View>
                ),
              }}
            />
            <Tab.Screen
              name="ChatStackScreen"
              component={ChatStackScreen}
              initialParams={{ isAuthenticated }}
              listeners={({ navigation }) => ({
                tabPress: (e) => {
                  e.preventDefault();
                  navigation.navigate("ChatStackScreen", {
                    isAuthenticated,
                  });
                },
              })}
              options={{
                tabBarLabel: "",
                tabBarIcon: ({ focused }) => (
                  <View style={{ alignItems: "center" }}>
                    <MaterialCommunityIcons
                      name={focused ? "chat" : "chat-outline"}
                      style={{ marginTop: -10 }}
                      color={isDarkMode ? Color.white : Color.darkTheme}
                      size={26}
                    />
                    <Text
                      style={{
                        fontSize: focused ? 10 : 9,
                        color: isDarkMode ? Color.white : Color.black,
                      }}
                    >
                      Chats
                    </Text>
                  </View>
                ),
              }}
            />
          </Tab.Navigator>
        </PaperProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

export default MainTabScreen;
