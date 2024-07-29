import React, { useState } from "react";
import {
  Dimensions,
  ImageBackground,
  Platform,
  StyleSheet,
  TouchableNativeFeedback,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { Color } from "../../constants/colors";
import { useDarkMode } from "../../context/DarkModeContext";
import ErrorMessage from "../ui/ErrorMessage";
import fetchChats from "../../api/chats/fetchChats";

const { width } = Dimensions.get("window");

function ChatList({ ouid, chatId, lastMessage, time, searchUser, deleteChat }) {
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();
  const navigation = useNavigation();

  const translatedLastMessage =
    lastMessage === "image" ? t("image") : lastMessage;

  const [selectedChatId, setSelectedChatId] = useState(false);

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

  const fullName =
    `${data?.data?.firstName} ${data?.data?.lastName}`.toLowerCase();
  const isChatVisible = fullName.includes(searchUser.toLowerCase());

  if (!isChatVisible) {
    return null;
  }

  return (
    <TouchableNativeFeedback
      onLongPress={() => {
        setSelectedChatId(!selectedChatId);
        deleteChat(chatId);
      }}
      onPress={() =>
        navigation.push("ChatScreen", {
          chatId,
          ouid,
          pushToken: data?.data?.pushToken,
          image: data?.data?.avatar?.url,
          title: `${data?.data?.firstName} ${data?.data?.lastName}`,
        })
      }
    >
      <View
        style={[styles.container, selectedChatId && styles.selectedContainer]}
      >
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
        <View style={styles.textContainer}>
          <Text numberOfLines={1} style={styles.title}>
            {data?.data?.firstName} {data?.data?.lastName}
          </Text>

          <View>
            <Text numberOfLines={1} style={styles.lastMessage}>
              {translatedLastMessage}
            </Text>

            <Text numberOfLines={1} style={styles.time}>
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
    backgroundColor: Color.Brown300,
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
    color: Color.gray,
    letterSpacing: 0.3,
  },
  time: {
    fontSize: 10,
    color: Color.Brown500,
  },
  type: {
    left: width < 370 ? "280%" : "330%",
    position: "absolute",
  },
  checkmarkIcon: {
    position: "absolute",
    bottom: 2,
    right: 2,
  },
});

export default ChatList;
