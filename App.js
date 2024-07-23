import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { useCallback, useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { I18nManager } from "react-native";
import { useTranslation } from "react-i18next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MenuProvider } from "react-native-popup-menu";
import Toast from "react-native-toast-message";
import FlashMessage from "react-native-flash-message";
import * as Updates from "expo-updates";

import { UserContext, useUsers } from "./context/UserContext";
import { DarkModeProvider } from "./context/DarkModeContext";
import AuthStackScreens from "./navigation/AuthStackScreens";
import FavoritesContextProvider from "./context/FavoritesContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

export default function App() {
  const { i18n } = useTranslation();
  const [appIsLoaded, setAppIsLoaded] = useState(false);
  const [rtlChanged, setRtlChanged] = useState(false); // State to track RTL changes

  const {
    login,
    logout,
    token,
    pushToken,
    userType,
    id,
    firstName,
    lastName,
    avatar,
    age,
    phone,
    gender,
    academic,
    coordinates,
    department,
    yearbook,
    hobbies,
    funFact,
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
        console.log(error);
      } finally {
        setAppIsLoaded(true);
      }
    };

    prepare();
  }, []);

  useEffect(() => {
    const changeLayoutDirection = async () => {
      const isRTL = i18n.language === "he";
      if (I18nManager.isRTL !== isRTL) {
        I18nManager.forceRTL(isRTL);
        I18nManager.allowRTL(isRTL);
        setRtlChanged(true);
      }
    };

    changeLayoutDirection();
  }, [i18n.language]);

  useEffect(() => {
    const restartApp = async () => {
      if (rtlChanged) {
        // Wait for a moment to ensure RTL settings are applied before restarting
        setTimeout(async () => {
          await Updates.reloadAsync();
        }, 500);
      }
    };

    restartApp();
  }, [rtlChanged]);

  const onLayout = useCallback(async () => {
    if (appIsLoaded && !rtlChanged) {
      await SplashScreen.hideAsync();
    }
  }, [appIsLoaded, rtlChanged]);

  if (!appIsLoaded || rtlChanged) {
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
              pushToken,
              userType,
              id,
              firstName,
              lastName,
              avatar,
              age,
              phone,
              gender,
              academic,
              coordinates,
              department,
              yearbook,
              hobbies,
              funFact,
              email,
            }}
          >
            <FavoritesContextProvider userId={id}>
              <MenuProvider>
                <AuthStackScreens />
              </MenuProvider>
              <Toast />
              <FlashMessage position="top" />
            </FavoritesContextProvider>
          </UserContext.Provider>
        </QueryClientProvider>
      </DarkModeProvider>
    </SafeAreaProvider>
  );
}
