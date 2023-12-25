import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Color } from '../constants/colors';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignInScreen from '../screens/SignInScreen';
import StudentsSignUpScreen from '../screens/StudentsSignUpScreen';
import { View } from 'react-native';

const AuthStack = createNativeStackNavigator();

function AuthStackScreens() {
  return (
    <NavigationContainer>
      <AuthStack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
        <AuthStack.Screen
          name="WelcomeScreen"
          component={WelcomeScreen}
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: 'fade_from_bottom',
          }}
        />
        <AuthStack.Screen
          name="SignInScreen"
          component={SignInScreen}
          options={{
            title: '',
            animation: 'simple_push',
            headerStyle: {
              backgroundColor: Color.Blue600,
            },
          }}
        />
        <AuthStack.Screen
          name="StudentsSignUpScreen"
          component={StudentsSignUpScreen}
          options={{
            // headerShown: false,
            title: '',
            animation: 'simple_push',
            header: () => (
              <View
                style={{ height: 50, backgroundColor: Color.Blue600 }}
              ></View>
            ),
          }}
        />
      </AuthStack.Navigator>
    </NavigationContainer>
  );
}

export default AuthStackScreens;
