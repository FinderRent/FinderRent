import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';

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
      </AuthStack.Navigator>
    </NavigationContainer>
  );
}

export default AuthStackScreens;
