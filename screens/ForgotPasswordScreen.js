import { useState } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { Color } from '../constants/colors';
import { useDarkMode } from '../context/DarkModeContext';
import Input from '../components/Input';
import Spacer from '../components/ui/Spacer';

function ForgotPasswordScreen({ navigation }) {
  const { isDarkMode } = useDarkMode();

  const [email, setEmail] = useState();

  const getBackgroundImage = (isDarkMode) => {
    return isDarkMode
      ? require('../assets/images/MidnightCity.jpg')
      : require('../assets/images/Zinc.jpg');
  };

  return (
    <ImageBackground
      source={getBackgroundImage(isDarkMode)}
      resizeMode="cover"
      style={styles.image}
    >
      <View style={styles.container}>
        <Text style={styles.text} variant="titleMedium">
          אנא הזן מייל לקבלת קוד לאיפוס סיסמה
        </Text>
        <View style={styles.line} />
        <Spacer>
          <Input
            label="אימייל"
            mode="outlined"
            keyboardType="email-address"
            onValueChange={(selectedMail) => setEmail(selectedMail)}
          />
        </Spacer>

        <View style={styles.line} />

        <Button
          style={styles.button}
          textColor={Color.white}
          buttonColor={Color.Brown500}
          mode="contained"
          onPress={() => navigation.navigate('ResetPasswordScreen')}
        >
          שלח
        </Button>
      </View>
    </ImageBackground>
  );
}

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    margin: 15,
  },
  image: {
    flex: 1,
  },

  text: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
  line: {
    height: 3,
    backgroundColor: Color.Brown500,
    marginTop: 10,
  },
  button: {
    margin: 15,
  },
});
