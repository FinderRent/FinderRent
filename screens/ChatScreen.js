import { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { io } from "socket.io-client";
import AwesomeAlert from "react-native-awesome-alerts";
import moment from "moment";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import { useUsers } from "../context/UserContext";
import PageContainer from "../components/PageContainer";
import Bubble from "../components/chats/Bubble";
import ReplyTo from "../components/chats/ReplyTo";
import getMessages from "../api/chats/getMessages";
import addMessages from "../api/chats/addMessages";
import updateChat from "../api/chats/updateChat";

function ChatScreen({ navigation, route }) {
  const { userData } = useUsers();
  const { isDarkMode } = useDarkMode();
  const { image, title, ouid } = route.params;
  const socket = useRef();

  const senderId = userData.id;
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [chatId, setChatId] = useState(route?.params?.chatId);
  const [onlineUsers, setOnilneUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [receiveMessage, setReceiveMessage] = useState(null);
  const [replyingTo, setReplyingTo] = useState();
  const [tempImageUri, setTempImageUri] = useState("");

  const message = {
    senderId,
    messageText,
    chatId,
  };

  useEffect(() => {
    const CustomHeader = () => (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View>
          <TouchableOpacity
            style={{
              paddingRight: 5,
            }}
            onPress={() => navigation.navigate("ChatListScreen")}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={isDarkMode ? Color.white : Color.darkTheme}
            />
          </TouchableOpacity>
        </View>
        <ImageBackground
          style={{ height: 40, width: 40 }}
          imageStyle={{
            borderRadius: 50,
            borderWidth: 0.5,
            borderColor: Color.gray,
          }}
          source={{
            uri: image,
          }}
        />
        <Text
          style={{
            marginHorizontal: 5,
            fontSize: 18,
          }}
        >
          {title}
        </Text>
      </View>
    );
    navigation.setOptions({
      headerLeft: () => <CustomHeader />,
    });
    moment.locale("en");
  }, [isDarkMode]);

  useEffect(() => {
    socket.current = io("http://192.168.1.214:3000");
    socket.current.emit("new-user-add", senderId);
    socket.current.on("get-users", (users) => {
      setOnilneUsers(users);
    });
    return () => {
      socket.current.disconnect();
      // console.log("user disconnect");
    };
  }, [senderId]);

  useEffect(() => {
    // sending message to socket server
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  useEffect(() => {
    // recieve message from socket server
    socket.current.on("receive-message", (data) => {
      setReceiveMessage(data);
    });
  }, [sendMessage]);

  useEffect(() => {
    const refetchData = async () => {
      await refetch();
    };
    if (receiveMessage !== null && receiveMessage.chatId === chatId) {
      setMessages([...messages, receiveMessage]);
    }
    refetchData();
  }, [receiveMessage]);

  const { data, refetch } = useQuery({
    queryKey: ["messages", chatId],
    queryFn: () => getMessages(chatId),
  });

  const { mutate } = useMutation({
    mutationFn: (message) => addMessages(message),
    onSuccess: async (data) => {
      setSendMessage({ ...message, ouid });
      await refetch();
      setMessages([...messages, data]);
      setMessageText("");
    },
    onError: (err) => console.log(err.message),
  });

  const handelSendMessage = useCallback(() => {
    mutate(message);
  }, [messageText]);

  const getBackgroundImage = (isDarkMode) => {
    return isDarkMode
      ? require("../assets/images/ChatDarkBackground.jpg")
      : require("../assets/images/ChatWhiteBackground.jpg");
  };

  return (
    <SafeAreaView edges={["right", "left", "bottom"]} style={styles.container}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={100}
      >
        <ImageBackground
          source={getBackgroundImage(isDarkMode)}
          style={styles.backgroundImage}
        >
          <PageContainer style={{ backgroundColor: "transparent" }}>
            {!chatId && (
              <Bubble text="Send message to start conversation" type="system" />
            )}
            {chatId && (
              <FlatList
                data={data}
                renderItem={(itemData) => {
                  const message = itemData.item;
                  const isOwnMessage = message.senderId === userData.id;
                  const time = moment(message.createdAt).fromNow();
                  const messageType = isOwnMessage
                    ? "myMessage"
                    : "theirMessage";

                  return (
                    <Bubble
                      type={messageType}
                      text={message.messageText}
                      time={time}
                      setReply={() => setReplyingTo(message)}
                      replyingTo={message.replyingTo}
                    />
                  );
                }}
              />
            )}
            {/* {isError && (
              <Bubble text="Error sending the message,try again" type="error" />
            )} */}
          </PageContainer>
          {replyingTo && (
            <ReplyTo
              name={replyingTo.senderId === senderId ? "You" : title}
              text={replyingTo.messageText}
              onCancel={() => setReplyingTo(null)}
            />
          )}
        </ImageBackground>

        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.mediaButton}
            onPress={() => console.log("Pressed!")}
          >
            <Ionicons name="add" size={24} color={Color.Blue500} />
          </TouchableOpacity>

          <TextInput
            autoCapitalize="none"
            style={
              isDarkMode
                ? { ...styles.textbox, color: Color.white }
                : { ...styles.textbox }
            }
            selectionColor={Color.Brown500}
            placeholder="Message"
            placeholderTextColor={
              isDarkMode ? Color.defaultTheme : Color.darkTheme
            }
            value={messageText}
            onChangeText={(text) => setMessageText(text)}
            onSubmitEditing={handelSendMessage}
          />

          {messageText === "" && (
            <TouchableOpacity
              style={styles.mediaButton}
              onPress={() => console.log("Pressed!")}
            >
              <Ionicons name="camera" size={24} color={Color.Blue500} />
            </TouchableOpacity>
          )}

          {messageText !== "" && (
            <TouchableOpacity
              style={styles.mediaButton}
              onPress={handelSendMessage}
            >
              <Ionicons name="send" size={24} color={Color.Blue500} />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  screen: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 10,
    height: 55,
  },
  textbox: {
    flex: 1,
    fontSize: 16,
    fontFamily: "varelaRound",
    borderWidth: 1,
    borderRadius: 50,
    marginHorizontal: 5,
    paddingHorizontal: 15,
    borderColor: Color.Blue500,
  },
  mediaButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 35,
  },
});
