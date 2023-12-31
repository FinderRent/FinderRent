import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Color } from '../constants/colors';
import HomeScreen from '../screens/HomeScreen';

const HomeStack = createNativeStackNavigator();

function HomeStackScreen({ navigation }) {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Color.Brown100,
        },
        drawerContentStyle: {
          backgroundColor: Color.defaultTheme,
        },
        headerTitle: '',
      }}
    >
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerRight: () => (
            <View style={{ marginLeft: -10 }}>
              <Ionicons.Button
                name="ios-menu"
                size={25}
                color={Color.darkTheme}
                backgroundColor={Color.Brown100}
                // underlayColor="transparent"
                onPress={() => navigation.openDrawer()}
              />
            </View>
          ),
        }}
      />
    </HomeStack.Navigator>
  );
}

export default HomeStackScreen;
