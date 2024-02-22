import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
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
import Input from "../components/inputs/Input";
import PasswordInput from "../components/inputs/PasswordInput";
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

  const [pushToken, setPushToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // store the expoPustToken in database to send notification
  useEffect(() => {
    async function storePushToken() {
      if (!Device.isDevice) {
        return;
      }
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      });
      setPushToken(token.data);
    }
    storePushToken();
  }, []);

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
    mutationFn: ({ email, password, pushToken }) =>
      login({ email, password, pushToken }),
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
    mutate({ email, password, pushToken });
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
          showVisible(!signInModalVisible);
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.centeredView}>
            <View
              style={{
                ...styles.modalView,
                height: showForgotPasswordModal ? 1 : undefined,
                backgroundColor: isDarkMode
                  ? Color.buttomSheetDarkTheme
                  : styles.modalView.backgroundColor,
              }}
            >
              <Text style={styles.modalText}>Login</Text>

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
                textColor={Color.defaultTheme}
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
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
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
