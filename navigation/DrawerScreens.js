import { createDrawerNavigator } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';

import CustomDrawer from '../components/CustomDrawer';
import MainTabScreen from './MainTabScreen';
import ChatStackScreen from './ChatStackScreen';
import ProfileStackScreen from './ProfileStackScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Drawer = createDrawerNavigator();

function DrawerScreens({ navigation }) {
  return (
    <Drawer.Navigator
      initialRouteName="MainTabScreen"
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{ drawerLabelStyle: { marginLeft: -20, fontSize: 15 } }}
    >
      <Drawer.Screen
        name="Home"
        component={MainTabScreen}
        options={{
          headerShown: false,
          swipeEdgeWidth: 0,
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          // headerShown: false,
          drawerIcon: ({ color }) => (
            <Ionicons name="person-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Chat"
        component={ChatStackScreen}
        options={{
          headerShown: false,
          drawerIcon: ({ color }) => (
            <Ionicons name="chatbox-ellipses-outline" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default DrawerScreens;
