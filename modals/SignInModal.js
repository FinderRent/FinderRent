import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Button, Text } from "react-native-paper";
import { useMutation } from "@tanstack/react-query";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Fontisto } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

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
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [signInModalVisible, setSignInModalVisible] = useState(true);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [pushToken, setPushToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    async function storePushToken() {
      if (!Device.isDevice) return;
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
        text1: t("logged_in_successfully"),
      });
      if (user.data.user.userType === "student") {
        navigation.navigate("HomeScreen");
      } else {
        navigation.navigate("LandlordHomeStackScreen");
      }
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
        onRequestClose={() => showVisible(!signInModalVisible)}
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
              <Text
                style={[
                  styles.modalText,
                  isDarkMode && { color: Color.defaultTheme },
                ]}
              >
                {t("login")}
              </Text>

              <Pressable
                onPress={() => handleCancel()}
                style={{ position: "absolute", margin: 15 }}
              >
                <Fontisto
                  name="close-a"
                  size={28}
                  color={isDarkMode ? "white" : "black"}
                />
              </Pressable>
              <View
                style={[
                  styles.textInput,
                  isDarkMode && { color: Color.defaultTheme },
                ]}
              >
                <Input
                  label={t("email")}
                  keyboardType="email-address"
                  mode="outlined"
                  color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
                  onValueChange={(selectedMail) => setEmail(selectedMail)}
                />
                <PasswordInput
                  mode="outlined"
                  label={t("password")}
                  color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
                  onValueChange={(password) => setPassword(password)}
                />
              </View>
              {isError && <ErrorMessage errorMessage={t(error.message)} />}
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text
                  style={[
                    styles.textInput,
                    isDarkMode && { color: Color.defaultTheme },
                  ]}
                >
                  {t("forgot_password")}
                </Text>
              </TouchableOpacity>
              {showForgotPasswordModal && (
                <ForgotPasswordModal
                  showVisible={(showVisible) =>
                    setShowForgotPasswordModal(showVisible)
                  }
                />
              )}
              <TouchableOpacity onPress={handleRegister}>
                <Text
                  style={[
                    styles.textInput,
                    isDarkMode && { color: Color.defaultTheme },
                  ]}
                >
                  {t("no_account_register")}
                </Text>
              </TouchableOpacity>
              <Button
                style={[
                  styles.button,
                  isDarkMode && { backgroundColor: Color.defaultTheme },
                ]}
                mode="contained"
                onPress={handleLogin}
                loading={isPending}
                textColor={isDarkMode ? Color.darkTheme : Color.defaultTheme}
              >
                {!isPending && t("login_button")}
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
    padding: 4,
    elevation: 2,
    marginVertical: 5,
    backgroundColor: Color.darkTheme,
  },
  modalText: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 44,
    color: Color.darkTheme,
    fontWeight: "bold",
  },
  textInput: {
    fontSize: 15,
    marginHorizontal: 5,
    margin: 2,
    justifyContent: "center",
    color: Color.darkTheme,
  },
  textRow: {
    flex: 1,
    justifyContent: "space-between",
    margin: 5,
  },
});

export default SignInModal;
