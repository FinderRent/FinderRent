import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Color } from '../constants/colors';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignInScreen from '../screens/SignInScreen';

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
      </AuthStack.Navigator>
    </NavigationContainer>
  );
}

export default AuthStackScreens;
