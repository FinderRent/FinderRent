import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Color } from '../constants/colors';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';

const AuthStack = createNativeStackNavigator();

function AuthStackScreens() {
  return (
    <NavigationContainer>
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
        />
        <AuthStack.Screen
          name="SignUpScreen"
          component={SignUpScreen}
          options={{
            title: '',
            animation: 'simple_push',
            header: () => (
              <View
                style={{ height: 50, backgroundColor: Color.Blue600 }}
              ></View>
            ),
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
        {/* <AuthStack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            headerShown: false,
            title: '',
            animation: 'simple_push'
          }}
        /> */}
      </AuthStack.Navigator>
    </NavigationContainer>
  );
}

export default AuthStackScreens;
