import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";

import {
  MD3LightTheme,
  MD3DarkTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import MainTabScreen from "./MainTabScreen";
import SignUpScreen from "../screens/SignUpScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import SignInScreen from "../screens/SignInScreen";

const AuthStack = createNativeStackNavigator();

const CustomDefaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Color.white,
    text: Color.black,
  },
};

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Color.darkTheme,
    text: Color.white,
  },
};

const CustomPaperDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    text: Color.white,
  },
};

const CustomPaperDefaultTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    text: Color.black,
  },
};

function AuthStackScreens() {
  const { isDarkMode } = useDarkMode();

  const theme = isDarkMode ? CustomDarkTheme : CustomDefaultTheme;
  const paperTheme = isDarkMode
    ? CustomPaperDarkTheme
    : CustomPaperDefaultTheme;

  return (
    <NavigationContainer theme={theme}>
      <PaperProvider theme={paperTheme}>
        <AuthStack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
          <AuthStack.Screen
            name="MainTabScreen"
            component={MainTabScreen}
            options={{
              headerShown: false,
              title: "",
              animation: "simple_push",
            }}
          />
          <AuthStack.Screen
            name="SignUpScreen"
            component={SignUpScreen}
            options={{
              headerStyle: {
                backgroundColor: isDarkMode
                  ? Color.buttomSheetDarkTheme
                  : Color.defaultTheme,
              },
              title: "FinderRent",
              headerTitleStyle: {
                fontFamily: "DancingScript",
                fontSize: 32,
                color: Color.Blue700,
              },
              headerTintColor: Color.Blue700,
              animation: "simple_push",
              // header: () => (
              //   <View
              //     style={{ height: 50, backgroundColor: Color.Blue600 }}
              //   ></View>
              // ),
            }}
          />
          <AuthStack.Screen
            name="ResetPasswordScreen"
            component={ResetPasswordScreen}
            options={{
              headerStyle: {
                backgroundColor: isDarkMode
                  ? Color.buttomSheetDarkTheme
                  : Color.defaultTheme,
              },
              title: "ResetPassword",
              headerTitleStyle: {
                fontFamily: "DancingScript",
                fontSize: 32,
                color: Color.Blue700,
              },
              headerTintColor: Color.Blue700,
              animation: "simple_push",
            }}
          />
          <AuthStack.Screen name="SignInScreen" component={SignInScreen} />
        </AuthStack.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
}

export default AuthStackScreens;
