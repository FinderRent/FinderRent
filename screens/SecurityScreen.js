import { useState } from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Button, Text } from 'react-native-paper';

import { Color } from '../constants/colors';
import { useUsers } from '../context/UserContext';
import Spacer from '../components/ui/Spacer';
import PasswordInput from '../components/PasswordInput';
import NavLink from '../components/NavLink';

function SecurityScreen() {
  const { userData } = useUsers();
  const token = userData.token;

  const [passwordCurrent, setPasswordCurrent] = useState();
  const [password, setPassword] = useState();
  const [passwordConfirm, setPasswordConfirm] = useState();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ScrollView>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={100}
          >
            <Text style={styles.title} variant="headlineSmall">
              Change Password
            </Text>
            <View style={{ marginTop: 25 }}>
              <Text style={styles.text} variant="titleMedium">
                Enter current password:{' '}
              </Text>

              <PasswordInput
                mode="outlined"
                onValueChange={(passwordCurrent) =>
                  setPasswordCurrent(passwordCurrent)
                }
              />
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={styles.text} variant="titleMedium">
                Enter New Password:
              </Text>
            </View>
            <PasswordInput
              mode="outlined"
              onValueChange={(password) => setPassword(password)}
            />
            <Text style={styles.text} variant="titleMedium">
              Confirm Password:
            </Text>
            <PasswordInput
              mode="outlined"
              onValueChange={(passwordConfirm) =>
                setPasswordConfirm(passwordConfirm)
              }
            />

            <Spacer>
              <Button
                style={{ marginTop: 40 }}
                buttonColor={Color.Blue800}
                textColor={Color.defaultTheme}
                mode="contained"
                onPress={() => console.log('ok')}
              >
                Update Password
              </Button>
            </Spacer>
            <NavLink text="Back" style={{ marginTop: -5, fontSize: 14 }} />
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default SecurityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    marginTop: 50,
    marginHorizontal: 10,
  },
  title: {
    margin: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    borderBottomWidth: 0.4,
    borderBottomColor: Color.Blue500,
    color: Color.Blue900,
  },
  text: {
    marginLeft: 2,
    marginBottom: 5,
    fontWeight: 'bold',
    color: Color.Blue700,
  },
});
