import CustomDrawer from '../components/CustomDrawer';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Color } from '../constants/colors';
import MainTabScreen from './MainTabScreen';
import ChatScreen from '../screens/ChatScreen';

const Drawer = createDrawerNavigator();

function DrawerScreens() {
  return (
    <Drawer.Navigator
      initialRouteName="MainTabScreen"
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerLabelStyle: { marginLeft: -20, fontSize: 15 },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={MainTabScreen}
        options={{
          headerStyle: {
            backgroundColor: Color.Brown100,
          },
          headerTitle: '',
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />
      {/* <Drawer.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            drawerIcon: ({ color }) => (
              <Ionicons name="person-outline" size={22} color={color} />
            ),
          }}
        /> */}
      <Drawer.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="chatbox-ellipses-outline" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default DrawerScreens;
