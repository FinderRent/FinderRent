import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import Input from '../components/Input';
import PasswordInput from '../components/PasswordInput';
import { Button } from 'react-native-paper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

function SignInModal() {
  const navigation = useNavigation();

  const [signInModalVisible, setSignInModalVisible] = useState(true);
  const [signUpModalVisible, setSignUpModalVisible] = useState(false);

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  useFocusEffect(
    useCallback(() => {
      setSignInModalVisible(true);
      // navigation.navigate('HomeScreen');
    }, [])
  );

  const handleForgotPassword = () => {
    setSignInModalVisible(!signInModalVisible);
  };

  const handleCancel = () => {
    setSignInModalVisible(!signInModalVisible);
  };

  const handleRegister = () => {
    setSignInModalVisible(!signInModalVisible);
  };

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={signInModalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setSignInModalVisible(!signInModalVisible);
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Login</Text>

              {/* <Image
                source={require("../assets/images/sign-in-photo.jpg")}
                style={{
                  height: 300,
                  width: 280,
                }}
              /> */}
              <Pressable
                onPress={() => handleCancel()}
                style={{ position: 'absolute', margin: 10 }}
              >
                <Image source={require('../assets/images/close.png')} />
              </Pressable>
              <View style={styles.textInput}>
                <Input
                  label="Email"
                  keyboardType="email-address"
                  mode="outlined"
                  onValueChange={(selectedMail) => setEmail(selectedMail)}
                />
                <PasswordInput
                  mode="outlined"
                  label="Password"
                  onValueChange={(password) => setPassword(password)}
                />
              </View>

              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.textInput}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleRegister}>
                <Text style={styles.textInput}>
                  doesn't have an account? Register
                </Text>
              </TouchableOpacity>

              <Button
                style={styles.button}
                mode="contained"
                onPress={() => console.log('preesed')}
              >
                Login
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 30,
  },
  modalView: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 5,
    elevation: 2,
    marginVertical: 10,
    backgroundColor: '#2196F3',
  },
  buttonOpen: {
    borderRadius: 20,
    padding: 5,
    elevation: 2,
    marginVertical: 10,
    backgroundColor: '#2196F3',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 0,
    marginTop: 15,
    textAlign: 'center',
    fontSize: 44,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  textInput: {
    fontSize: 15,
    margin: 10,
    justifyContent: 'center',
    color: 'blue',
  },
  textRow: {
    flex: 1,
    justifyContent: 'space-between',
    margin: 5,
  },
});

export default SignInModal;
