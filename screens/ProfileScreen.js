import { ImageBackground, StyleSheet, View, SafeAreaView, Text, ScrollView } from 'react-native';


function ProfileScreen() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <View>
                    <Text>
                        Profile Screen
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({

});
export default ProfileScreen;