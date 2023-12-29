import 'react-native-gesture-handler';
import CustomDrawer from '../components/CustomDrawer'
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Drawer = createDrawerNavigator();

function DrawerScreens() {
    return (
        <NavigationContainer>
            <Drawer.Navigator
                drawerContent={props => <CustomDrawer {...props} />}
                screenOptions={{ drawerLabelStyle: { marginLeft: -20, fontSize: 15 } }}
            >
                <Drawer.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        drawerIcon: ({ color }) => (
                            <Ionicons name="home-outline" size={22} color={color} />)
                    }}
                />
                <Drawer.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                        drawerIcon: ({ color }) => (
                            <Ionicons name="person-outline" size={22} color={color} />)
                    }} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}

export default DrawerScreens;
