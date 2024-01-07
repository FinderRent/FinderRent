import { View } from 'react-native';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';

import {
  MD3LightTheme,
  MD3DarkTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Color } from '../constants/colors';
import { useDarkMode } from '../context/DarkModeContext';
import MainTabScreen from './MainTabScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';

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
        <AuthStack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
          {/* -----removing the welcom screen for temporary time-------- */}
          {/* <AuthStack.Screen
          name="WelcomeScreen"
          component={WelcomeScreen}
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: 'fade_from_bottom',
          }}
        /> */}
          {/* ------------------------------------------------------------------- */}
          <AuthStack.Screen
            name="MainTabScreen"
            component={MainTabScreen}
            options={{
              headerShown: false,
              title: '',
              animation: 'simple_push',
            }}
          />
          {/* <AuthStack.Screen
            name="SignInScreen"
            component={SignInScreen}
            options={{
              headerShown: false,
              title: '',
              animation: 'simple_push',
              headerStyle: {
                backgroundColor: Color.Blue600,
              },
            }}
          /> */}
          <AuthStack.Screen
            name="SignUpScreen"
            component={SignUpScreen}
            options={{
              headerStyle: {
                backgroundColor: isDarkMode
                  ? Color.buttomSheetDarkTheme
                  : Color.defaultTheme,
              },
              title: 'FinderRent',
              headerTitleStyle: {
                fontFamily: 'DancingScript',
                fontSize: 32,
                color: Color.Blue900,
              },
              headerTintColor: Color.Blue900,
              animation: 'simple_push',
              // header: () => (
              //   <View
              //     style={{ height: 50, backgroundColor: Color.Blue600 }}
              //   ></View>
              // ),
            }}
          />
          <AuthStack.Screen
            name="ForgotPasswordScreen"
            component={ForgotPasswordScreen}
            options={{
              title: '',
              animation: 'slide_from_right',
              headerStyle: {
                backgroundColor: Color.Blue600,
              },
            }}
          />
          <AuthStack.Screen
            name="ResetPasswordScreen"
            component={ResetPasswordScreen}
            options={{
              title: '',
              animation: 'slide_from_right',
              header: () => (
                <View
                  style={{ height: 50, backgroundColor: Color.Blue600 }}
                ></View>
              ),
            }}
          />
        </AuthStack.Navigator>
      </PaperProvider>
    </NavigationContainer>
  );
}

export default AuthStackScreens;
