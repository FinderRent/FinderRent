import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  FlatList,
  Platform,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
import { Text } from "react-native-paper";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FontAwesome5 } from "@expo/vector-icons";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";
import AwesomeAlert from "react-native-awesome-alerts";
import moment from "moment";
import "moment/locale/he";
import "moment/locale/ru";
import "moment/locale/ar";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import { useUsers } from "../context/UserContext";
import ErrorMessage from "../components/ui/ErrorMessage";
import Loader from "../components/ui/Loader";
import ChatList from "../components/chats/ChatList";
import fetchChatsList from "../api/chats/fetchChatsList";
import deleteChat from "../api/chats/deleteChat";

function ChatListScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const { userData } = useUsers();
  const { isDarkMode } = useDarkMode();
  const tabBarHeight = useBottomTabBarHeight();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChatIds, setSelectedChatIds] = useState([]);
  const [alertDeleteChat, setAlertDeleteChat] = useState(false);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["chatList", userData.id],
    queryFn: () => fetchChatsList(userData.id),
  });

  const {
    mutateAsync: handleDeleteChat,
    isPending: isPendingDeleteChat,
    error: errorDeleteChat,
  } = useMutation({
    mutationFn: (chatId) => deleteChat(chatId),
    onSuccess: async () => {
      setAlertDeleteChat(false);
      setSelectedChatIds([]);
      await refetch();
    },
    onError: (err) => console.log(err.message),
  });

  const handleRemoveChat = async () => {
    try {
      await Promise.all(
        selectedChatIds.map((chatId) => handleDeleteChat(chatId))
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerSearchBarOptions: {
        placeholder: "",
        headerIconColor: isDarkMode ? Color.defaultTheme : Color.darkTheme,
        textColor: isDarkMode ? Color.defaultTheme : Color.darkTheme,
        onChangeText: (event) => {
          setSearchQuery(event.nativeEvent.text);
        },
      },

      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {selectedChatIds.length > 0 && (
            <Text
              style={{
                marginRight: 10,
                fontSize: 20,
              }}
            >
              {selectedChatIds.length}
            </Text>
          )}
          <TouchableOpacity
            onPress={() => setAlertDeleteChat(!alertDeleteChat)}
          >
            {selectedChatIds.length > 0 && (
              <FontAwesome5
                name="trash-alt"
                size={22}
                color={isDarkMode ? "#fff" : "#000"}
              />
            )}
          </TouchableOpacity>
        </View>
      ),
    });
    switch (i18n.language) {
      case "en":
        moment.locale("en");
        break;
      case "he":
        moment.locale("he");
        break;
      case "ru":
        moment.locale("ru");
        break;
      case "ar":
        moment.locale("ar");
        break;
    }
  }, [navigation, isDarkMode, selectedChatIds, alertDeleteChat]);

  useFocusEffect(
    useCallback(() => {
      const fetched = async () => {
        await refetch();
      };
      fetched();
    }, [])
  );

  const handleSelectChat = (chatId) => {
    setSelectedChatIds((prevIds) =>
      prevIds.includes(chatId)
        ? prevIds.filter((id) => id !== chatId)
        : [...prevIds, chatId]
    );
  };

  if (isLoading) {
    return (
      <Loader
        color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
        size={30}
      />
    );
  }

  if (error) {
    return <ErrorMessage errorMessage={error.message} />;
  }

  const sortedChats = data.chat.sort((a, b) => {
    const dateA = new Date(a.updatedAt);
    const dateB = new Date(b.updatedAt);
    return dateB - dateA;
  });

  if (data.results === 0) {
    return (
      <View style={styles.container}>
        <FontAwesome5
          name="users"
          size={100}
          color={Color.buttomSheetDarkTheme}
        />
        <Text style={styles.noResultsText}>{t("noResultsText")}</Text>
      </View>
    );
  }

  return (
    <View>
      <View
        style={[
          styles.footer,
          { marginTop: Platform.OS === "ios" ? "37%" : null },
        ]}
      ></View>

      <View
        style={sortedChats.length > 7 && { marginBottom: tabBarHeight + 40 }}
      >
        <FlatList
          keyboardDismissMode="on-drag"
          data={sortedChats}
          keyExtractor={(item) => item._id}
          renderItem={(itemData) => {
            const chatData = itemData.item;
            const chatId = chatData._id;
            const lastMessage = chatData?.lastMessage;
            const updatedAt = chatData.updatedAt;
            let time = moment(updatedAt).fromNow();

            if (time.includes("in ")) {
              time = time.replace("in ", "");
            }
            if (time.includes("בעוד")) {
              time = time.replace("בעוד", "לפני");
            }
            const otherUserId = chatData.members.find(
              (uid) => uid !== userData.id
            );

            return (
              <ChatList
                ouid={otherUserId}
                chatId={chatId}
                lastMessage={lastMessage}
                time={time}
                searchUser={searchQuery}
                deleteChat={handleSelectChat}
              />
            );
          }}
        />
      </View>
      <AwesomeAlert
        show={alertDeleteChat !== false}
        contentContainerStyle={
          isDarkMode
            ? { backgroundColor: Color.buttomSheetDarkTheme }
            : { backgroundColor: Color.defaultTheme }
        }
        title={
          selectedChatIds.length === 1 ? t("deleteChat") : t("deleteChats")
        }
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        confirmText={t("yes")}
        cancelText={t("no")}
        confirmButtonColor={isDarkMode ? Color.defaultTheme : Color.darkTheme}
        confirmButtonTextStyle={
          isDarkMode
            ? { color: Color.darkTheme }
            : { color: Color.defaultTheme }
        }
        cancelButtonColor={
          isDarkMode ? Color.buttomSheetDarkTheme : Color.defaultTheme
        }
        titleStyle={isDarkMode ? styles.whiteTitle : styles.darkTitle}
        cancelButtonTextStyle={
          isDarkMode
            ? { color: Color.defaultTheme }
            : { color: Color.darkTheme }
        }
        onCancelPressed={() => setAlertDeleteChat(false)}
        onConfirmPressed={handleRemoveChat}
        onDismiss={() => setAlertDeleteChat(false)}
        customView={
          <View>
            {isPendingDeleteChat && (
              <ActivityIndicator
                style={{ marginTop: 10 }}
                color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
              />
            )}
            {errorDeleteChat && <ErrorMessage errorMessage={errorDeleteChat} />}
          </View>
        }
      />
      <View style={styles.line}></View>
    </View>
  );
}

export default ChatListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsIcon: {
    marginBottom: 10,
  },
  noResultsText: {
    textAlign: "center",
    color: Color.gray,
    fontFamily: "varelaRound",
    fontSize: 17,
    letterSpacing: 0.3,
  },
  whiteTitle: {
    color: Color.defaultTheme,
  },
  darkTitle: {
    color: Color.darkTheme,
  },
  line: {
    margin: 10,
    borderBottomWidth: 0.45,
    borderBottomColor: Color.Brown200,
  },
});
