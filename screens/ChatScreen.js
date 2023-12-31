import { ImageBackground, StyleSheet, View, SafeAreaView, Text, ScrollView } from 'react-native';


function ChatScreen() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <View>
                    <Text>
                        Chat Screen
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({

});
export default ChatScreen;