import { ImageBackground, StyleSheet, View, SafeAreaView, Text, ScrollView } from 'react-native';


function HomeScreen() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <View>
                    <Text>
                        Home Screen
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({

});
export default HomeScreen;