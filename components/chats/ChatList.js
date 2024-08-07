import React, { useState } from "react";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { Color } from "../../constants/colors";
import { useDarkMode } from "../../context/DarkModeContext";
import { fullName } from "../../utils/features";
import ErrorMessage from "../ui/ErrorMessage";
import fetchChats from "../../api/chats/fetchChats";
import FullScreenImageModal from "../../modals/FullScreenImageModal";

const { width } = Dimensions.get("window");

function ChatList({
  ouid,
  chatId,
  lastMessage,
  time,
  searchUser,
  deleteChat,
  selectedChatIds,
}) {
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();
  const navigation = useNavigation();

  const translatedLastMessage =
    lastMessage === "image" ? t("image") : lastMessage;

  const [selectedChatId, setSelectedChatId] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { data, error, isLoading } = useQuery({
    queryKey: ["chats", ouid],
    queryFn: () => fetchChats(ouid),
  });

  if (isLoading) {
    return null;
  }

  if (error) {
    return <ErrorMessage errorMessage={error.message} />;
  }

  const firstName = data?.data?.firstName || "";
  const lastName = data?.data?.lastName || "";

  const fullUserName = fullName(firstName, lastName).toLowerCase();
  const isChatVisible = fullUserName.includes(searchUser.toLowerCase());

  if (!isChatVisible) {
    return null;
  }

  const handleChatAction = () => {
    if (selectedChatIds.length > 0) {
      setSelectedChatId(!selectedChatId);
      deleteChat(chatId);
    } else {
      navigation.push("ChatScreen", {
        chatId,
        ouid,
        pushToken: data?.data?.pushToken,
        image: data?.data?.avatar?.url,
        title: fullName(data?.data?.firstName, data?.data?.lastName),
      });
    }
  };

  const handleImagePress = () => {
    setIsModalVisible(true);
  };

  return (
    <>
      <TouchableNativeFeedback
        onLongPress={() => {
          setSelectedChatId(!selectedChatId);
          deleteChat(chatId);
        }}
        onPress={handleChatAction}
      >
        <View
          style={[styles.container, selectedChatId && styles.selectedContainer]}
        >
          <TouchableOpacity onPress={handleImagePress}>
            <ImageBackground
              style={{ height: 50, width: 50 }}
              imageStyle={{
                borderRadius: 50,
                borderWidth: 0.5,
                borderColor: Color.gray,
              }}
              source={{
                uri: data?.data?.avatar.url,
              }}
            >
              {selectedChatId && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={Color.green100}
                  style={styles.checkmarkIcon}
                />
              )}
            </ImageBackground>
          </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text numberOfLines={1} style={styles.title}>
              {fullName(firstName, lastName)}
            </Text>

            <View>
              <Text numberOfLines={1} style={styles.lastMessage}>
                {translatedLastMessage}
              </Text>

              <Text
                numberOfLines={1}
                style={
                  isDarkMode
                    ? { ...styles.time, color: Color.defaultTheme }
                    : styles.time
                }
              >
                {time}
              </Text>
              <Ionicons
                style={styles.type}
                name={
                  data?.data?.userType === "student"
                    ? "school-outline"
                    : "briefcase-outline"
                }
                size={20}
                color={isDarkMode ? "white" : "black"}
              />
            </View>
          </View>
        </View>
      </TouchableNativeFeedback>
      <FullScreenImageModal
        visible={isModalVisible}
        imageUri={data?.data?.avatar.url}
        onClose={() => setIsModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    padding: 8,
  },
  selectedContainer: {
    backgroundColor: Color.Brown400,
  },
  textContainer: {
    marginLeft: 10,
  },
  title: {
    fontWeight: "600",
    fontSize: 17,
    letterSpacing: 0.3,
  },
  lastMessage: {
    color: Color.extraGray,
    letterSpacing: 0.3,
  },
  time: {
    fontSize: 10,
    color: Color.darkTheme,
  },
  type: {
    left: width < 370 ? 240 : 280,
    position: "absolute",
  },
  checkmarkIcon: {
    position: "absolute",
    bottom: 2,
    right: 2,
  },
});

export default ChatList;
