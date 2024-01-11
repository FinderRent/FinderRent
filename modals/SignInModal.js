import { useContext, useEffect, useState } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import {
  View,
  Image,
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { Button, Text } from "react-native-paper";
import { useMutation } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import { UserContext } from "../context/UserContext";
import Input from "../components/Input";
import PasswordInput from "../components/PasswordInput";
import login from "../api/authentication/login";
import ErrorMessage from "../components/ui/ErrorMessage";
import ForgotPasswordModal from "./ForgotPasswordModal";

function SignInModal({ showVisible }) {
  const auth = useContext(UserContext);

  const { isDarkMode } = useDarkMode();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [signInModalVisible, setSignInModalVisible] = useState(true);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  useEffect(() => {
    if (!isFocused) {
      showVisible(!signInModalVisible);
    }
  }, [isFocused]);

  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (err) {
      console.log(err);
    }
  };

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: ({ email, password }) => login({ email, password }),
    onSuccess: (user) => {
      storeData("token", user.token);
      auth.login(user.data.user, user.token);
      Toast.show({
        type: "success",
        text1: "Logged In Successfully",
      });
      navigation.navigate("HomeScreen");
    },
  });

  const handleLogin = () => {
    mutate({ email, password });
  };

  const handleForgotPassword = () => {
    setShowForgotPasswordModal(true);
  };

  const handleCancel = () => {
    setSignInModalVisible(!signInModalVisible);
    showVisible(!signInModalVisible);
  };

  const handleRegister = () => {
    setSignInModalVisible(!signInModalVisible);
    showVisible(!signInModalVisible);
    navigation.navigate("SignUpScreen");
  };

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={signInModalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setSignInModalVisible(!signInModalVisible);
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.centeredView}>
            <View
              style={
                isDarkMode
                  ? {
                      ...styles.modalView,
                      backgroundColor: Color.buttomSheetDarkTheme,
                    }
                  : styles.modalView
              }
            >
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
                style={{ position: "absolute", margin: 10 }}
              >
                <Image source={require("../assets/images/close.png")} />
              </Pressable>
              <View style={styles.textInput}>
                <Input
                  label="Email"
                  keyboardType="email-address"
                  mode="outlined"
                  color={Color.Blue700}
                  onValueChange={(selectedMail) => setEmail(selectedMail)}
                />
                <PasswordInput
                  mode="outlined"
                  label="Password"
                  color={Color.Blue700}
                  onValueChange={(password) => setPassword(password)}
                />
              </View>

              {isError && <ErrorMessage errorMessage={error.message} />}

              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.textInput}>Forgot Password?</Text>
              </TouchableOpacity>

              {showForgotPasswordModal && (
                <ForgotPasswordModal
                  showVisible={(showVisible) =>
                    setShowForgotPasswordModal(showVisible)
                  }
                />
              )}

              <TouchableOpacity onPress={handleRegister}>
                <Text style={styles.textInput}>
                  Doesn't have an account? Register
                </Text>
              </TouchableOpacity>

              <Button
                style={styles.button}
                mode="contained"
                onPress={handleLogin}
                loading={isPending}
              >
                {!isPending && "Login   "}
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
    justifyContent: "center",
    marginTop: 30,
  },
  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
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
    backgroundColor: Color.Blue700,
  },
  buttonOpen: {
    borderRadius: 20,
    padding: 5,
    elevation: 2,
    marginVertical: 10,
    backgroundColor: Color.Blue700,
  },
  buttonClose: {
    backgroundColor: Color.Blue700,
  },
  textStyle: {
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 0,
    marginTop: 15,
    textAlign: "center",
    fontSize: 44,
    color: Color.Blue700,
    fontWeight: "bold",
  },
  textInput: {
    fontSize: 15,
    margin: 5,
    justifyContent: "center",
    color: Color.Blue700,
  },
  textRow: {
    flex: 1,
    justifyContent: "space-between",
    margin: 5,
  },
});

export default SignInModal;
