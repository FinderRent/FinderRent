import React from "react";
import {
  Modal,
  View,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

import { useDarkMode } from "../context/DarkModeContext";
import { Color } from "../constants/colors";

function FullScreenImageModal({
  visible,
  userData,
  onClose,
  onChatPress,
  image,
  showIcon,
  userType,
}) {
  const { isDarkMode } = useDarkMode();
  const navigation = useNavigation();

  return (
    <Modal
      onRequestClose={onClose}
      visible={visible}
      transparent={true}
      animationType="fade"
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View
              style={
                isDarkMode
                  ? {
                      ...styles.modalContainer,
                      backgroundColor: Color.buttomSheetDarkTheme,
                    }
                  : styles.modalContainer
              }
            >
              <Image
                source={{ uri: image }}
                style={styles.fullScreenImage}
                resizeMode="stretch"
              />
              <View style={styles.buttonContainer}>
                {showIcon === true && (
                  <TouchableOpacity
                    onPress={onChatPress}
                    style={styles.iconButton}
                  >
                    <MaterialCommunityIcons
                      name="message-text-outline"
                      size={24}
                      color={isDarkMode ? "white" : "black"}
                    />
                  </TouchableOpacity>
                )}

                {userType === "student" && (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("StudentProfileScreen", {
                        userData,
                        chatList: true,
                      })
                    }
                    style={styles.iconButton}
                  >
                    <MaterialCommunityIcons
                      name="information-outline"
                      size={24}
                      color={isDarkMode ? "white" : "black"}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 300,
    height: 270,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Color.white,
    marginBottom: 50,
  },
  fullScreenImage: {
    width: "100%",
    height: "100%",
    bottom: 50,
  },
  buttonContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 20,
    justifyContent: "center",
    width: "100%",
  },
  iconButton: {
    marginHorizontal: 40,
    padding: 10,
    borderRadius: 50,
    marginBottom: -17,
  },
});

export default FullScreenImageModal;
