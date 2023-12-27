import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Color } from '../constants/colors';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';

const AuthStack = createNativeStackNavigator();

function AuthStackScreens() {
  return (
    <NavigationContainer>
      <AuthStack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
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
      </AuthStack.Navigator>
    </NavigationContainer>
  );
}

export default AuthStackScreens;
