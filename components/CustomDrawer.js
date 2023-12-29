import React from "react";
import { View, Text, ImageBackground, Image, Touchable } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { TouchableOpacity } from "react-native-gesture-handler";
import Ionicons from 'react-native-vector-icons/Ionicons';

function CustomDrawer(props) {
    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={{ backgroundColor: '#5FBDFF' }}
            >

                <View
                    style={{ padding: 20 }}>

                    <Image
                        source={require('../assets/images/profile-cartoon.png')}
                        style={{ height: 80, width: 80, borderRadius: 40, marginBottom: 10 }}
                    />
                    <Text
                        style={{ color: '#fff', fontSize: 18 }}
                    >User Name</Text>
                </View>
                <View
                    style={{ flex: 1, backgroundColor: '#fff', paddingTop: 10 }}
                >
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>
            <View
                style={{ padding: 20, paddingTop: 0, marginBottom: 20, borderTopWidth: 1, borderTopColor: '#ccc' }}
            >
                <TouchableOpacity onPress={() => { }} style={{ paddingVertical: 15 }} />
                <View
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                    {/* TODO:change the login-logout button to be dynamic */}
                    <Ionicons name='share-social-outline' size={22} />
                    <Text
                        style={{ fontSize: 15, marginLeft: 15 }}
                    >
                        Tell a friend
                    </Text>
                </View>
                <TouchableOpacity onPress={() => { }} style={{ paddingVertical: 15 }} />
                <View
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                    {/* TODO:change the login-logout button to be dynamic */}
                    <Ionicons name='log-out-outline' size={22} />
                    <Text
                        style={{ fontSize: 15, marginLeft: 15 }}
                    >
                        Log Out
                    </Text>
                </View>
            </View>
        </View>
    );
}

export default CustomDrawer;