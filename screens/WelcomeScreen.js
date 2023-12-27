import { StatusBar } from 'expo-status-bar';
import { ImageBackground, StyleSheet, View, SafeAreaView } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { name as app_name, version as app_version } from '../package.json';
import { Color } from '../constants/colors';

function WelcomeScreen({ navigation }) {
  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <ImageBackground
          source={require('../assets/images/home-background.jpg')}
          resizeMode="cover"
          style={styles.image}
        >
          <View style={styles.text}>
            <Text variant="displaySmall" style={styles.title}>
              ── ברוכים הבאים ──
            </Text>
          </View>

          <View style={styles.container}>
            <Button
              style={styles.button}
              buttonColor={Color.Blue600}
              textColor={Color.white}
              icon="school"
              mode="elevated"
              onPress={() =>
                navigation.navigate('SignInScreen', { userType: 'student' })
              }
            >
              סטודנט
            </Button>
            <Button
              style={styles.button}
              buttonColor={Color.Blue600}
              textColor={Color.white}
              icon="home-account"
              onPress={() =>
                navigation.navigate('SignInScreen', { userType: 'landlord' })
              }
              mode="elevated"
            >
              משכיר
            </Button>
          </View>
          <View style={styles.footer}>
            <Text style={styles.name}>{app_name}</Text>
            <Text style={styles.version}> גרסה: {app_version}</Text>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 100,
  },
  image: {
    flex: 1,
    opacity: 0.9,
  },
  text: {
    alignItems: 'center',
    marginTop: 30,
  },
  title: {
    color: Color.Blue700,
    marginTop: 15,
  },
  footer: {
    alignItems: 'center',
  },
  name: {
    color: Color.Blue800,
    letterSpacing: 0.1,
  },
  version: {
    color: Color.darkTheme,
    fontSize: 11,
  },
  button: {
    margin: 10,
  },
});
