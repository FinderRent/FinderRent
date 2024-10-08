import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { useCallback, useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { I18nManager } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MenuProvider } from "react-native-popup-menu";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import FlashMessage from "react-native-flash-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { UserContext, useUsers } from "./context/UserContext";
import { DarkModeProvider } from "./context/DarkModeContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { checkRtllanguages } from "./utils/features";
import AuthStackScreens from "./navigation/AuthStackScreens";
import FavoritesContextProvider from "./context/FavoritesContext";
import i18next from "./services/i18next";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 60 * 1000,
      staleTime: 0,
    },
  },
});

export default function App() {
  const { i18n } = useTranslation();
  const [appIsLoaded, setAppIsLoaded] = useState(false);

  const {
    login,
    logout,
    token,
    pushToken,
    userType,
    id,
    firstName,
    lastName,
    country,
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
    socialNetworks,
  } = useUsers();

  useEffect(() => {
    const changeLayoutDirection = async () => {
      const isRTL = checkRtllanguages(i18n.language);
      I18nManager.forceRTL(isRTL);
      I18nManager.allowRTL(isRTL);

      if (appIsLoaded) {
        await SplashScreen.hideAsync();
      }
    };

    changeLayoutDirection();
  }, [i18n.language, appIsLoaded]);

  useEffect(() => {
    const prepare = async () => {
      const loadLanguage = async () => {
        const savedLanguage = await AsyncStorage.getItem("appLanguage");
        if (savedLanguage) {
          i18next.changeLanguage(savedLanguage);
        }
      };
      loadLanguage();
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
              pushToken,
              userType,
              id,
              firstName,
              lastName,
              country,
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
              socialNetworks,
            }}
          >
            <CurrencyProvider>
              <FavoritesContextProvider userId={id}>
                <MenuProvider>
                  <AuthStackScreens />
                </MenuProvider>
                <Toast />
                <FlashMessage position="top" />
              </FavoritesContextProvider>
            </CurrencyProvider>
          </UserContext.Provider>
        </QueryClientProvider>
      </DarkModeProvider>
    </SafeAreaProvider>
  );
}
