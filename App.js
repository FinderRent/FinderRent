import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { useCallback, useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { I18nManager } from "react-native";
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

export default function App() {
  I18nManager.forceRTL(false);
  I18nManager.allowRTL(false);

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
    avatar,
    age,
    phone,
    gender,
    academic,
    department,
    yearbook,
    email,
    favouriteApartments,
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
              department,
              yearbook,
              email,
              favouriteApartments,
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
