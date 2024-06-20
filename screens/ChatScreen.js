import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { io } from "socket.io-client";
import { launchCameraAsync } from "expo-image-picker";
import * as ImagePickerFromGallery from "expo-image-picker";
import AwesomeAlert from "react-native-awesome-alerts";
import moment from "moment";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import { useUsers } from "../context/UserContext";
import ChatScreenHeader from "../components/chats/ChatScreenHeader";
import PageContainer from "../components/PageContainer";
import Bubble from "../components/chats/Bubble";
import ReplyTo from "../components/chats/ReplyTo";
import getMessages from "../api/chats/getMessages";
import addMessages from "../api/chats/addMessages";
import updateChat from "../api/chats/updateChat";
import removeMessage from "../api/chats/removeMessage";
import sendPushNotification from "../api/sendPushNotifications";
import newChat from "../api/chats/newChat";

function ChatScreen({ navigation, route }) {
  const { userData } = useUsers();
  const { isDarkMode } = useDarkMode();
  const { ouid, pushToken, image, title } = route?.params;
  const socket = useRef();
  const scrollRef = useAnimatedRef();
  let scrollOffset = null;

  const senderId = userData.id;
  const firstChat = route?.params?.firstChat;
  const fullName = `${userData.firstName} ${userData.lastName}`;
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [templateMessage, setTemplateMessage] = useState(
    route?.params?.templateMessage || ""
  );
  const [chatId, setChatId] = useState(route?.params?.chatId);
  const [onlineUsers, setOnilneUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [receiveMessage, setReceiveMessage] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [tempImageUri, setTempImageUri] = useState("");
  const [deleteMessage, setDeleteMessage] = useState({
    show: false,
    messageId: "",
  });

  const message = {
    senderId,
    messageText,
    chatId,
    replyingTo,
    tempImageUri,
  };
  const pushData = {
    chatId,
    image: userData.avatar.url,
    title: fullName,
    pushToken: userData.pushToken,
    ouid: senderId,
  };

  async function pickedImageHandler() {
    const image = await ImagePickerFromGallery.launchImageLibraryAsync({
      mediaTypes: ImagePickerFromGallery.MediaTypeOptions.Images,
      aspect: [4, 3],
      allowsEditing: true,
      quality: 0.5,
    });

    if (!image.canceled) {
      setTempImageUri(image.assets[0].uri);
    }
  }

  async function takeImageHandler() {
    const image = await launchCameraAsync({
      aspect: [4, 3],
      allowsEditing: true,
      quality: 0.5,
    });

    if (!image.canceled) {
      setTempImageUri(image.assets[0].uri);
    }
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <ChatScreenHeader image={image} title={title} />,
    });
    moment.locale("en");
  }, [route.params]);

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
  }, [senderId, chatId]);

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

  // check for the number of image Message to inverse the data at FlatList
  const imageMessage = data?.filter(
    (message) => message.messageText === "image"
  ).length;

  const { mutate: handleCreateChat } = useMutation({
    mutationFn: ({ senderId, receiverId }) => newChat({ senderId, receiverId }),
    onSuccess: async (newChat) => {
      handleUpdateChat({ messageText: templateMessage, chatId: newChat._id });
      handleAddMessages({
        ...message,
        chatId: newChat._id,
        messageText: templateMessage,
      });
      setChatId(newChat._id);
      setTemplateMessage("");
    },
    onError: (err) => console.log(err.message),
  });

  const {
    mutate: handleAddMessages,
    isError: isErrorAddMessages,
    isPending: isPendingAddMessages,
  } = useMutation({
    mutationFn: (message) => addMessages(message),
    onSuccess: async (data) => {
      setSendMessage({ ...message, ouid });
      setReplyingTo(null);
      setMessageText("");
      setTemplateMessage("");
      await refetch();
      setTempImageUri("");
      setMessages([...messages, data]);
    },
    onError: (err) => console.log(err.message),
  });

  const { mutate: handleUpdateChat } = useMutation({
    mutationFn: ({ messageText: lastMessage, chatId }) =>
      updateChat({ messageText: lastMessage, chatId }),
    onError: (err) => console.log(err.message),
  });

  const { mutate: handleRemoveMessage, isPending: isPendingRemoveMessage } =
    useMutation({
      mutationFn: (messageId) => removeMessage(messageId),
      onSuccess: async () => {
        await refetch();
        setDeleteMessage({ show: false, messageId: "" });
      },
    });

  const handelSendMessage = useCallback(() => {
    if (!chatId) {
      handleCreateChat({ senderId, receiverId: ouid });
    } else {
      handleUpdateChat({ messageText, chatId });
      handleAddMessages(message);
    }
    sendPushNotification(pushToken, message.messageText, fullName, pushData);
  }, [messageText, tempImageUri, chatId]);

  const handleSendTemplateMessage = useCallback(() => {
    if (!chatId) {
      handleCreateChat({ senderId, receiverId: ouid });
    } else {
      handleUpdateChat({ templateMessage, chatId });
      handleAddMessages(message);
    }
    sendPushNotification(pushToken, templateMessage, fullName, pushData);
  }, [messageText, tempImageUri, chatId, templateMessage]);

  const handleDeleteMessage = useCallback(() => {
    handleUpdateChat({ messageText: "message deleted", chatId });
    handleRemoveMessage(deleteMessage.messageId);
  }, [deleteMessage]);

  const getBackgroundImage = (isDarkMode) => {
    return isDarkMode
      ? require("../assets/images/ChatDarkBackground.jpg")
      : require("../assets/images/ChatWhiteBackground.jpg");
  };

  if (!firstChat) {
    scrollOffset = useScrollViewOffset(scrollRef);
  }

  const downButton = useAnimatedStyle(() => {
    return {
      opacity:
        scrollOffset && scrollOffset.value > 100
          ? withSpring(0.9)
          : withSpring(0),
    };
  });
  const scrollDown = () => {
    scrollRef?.current?.scrollToOffset({ animated: true, offset: 0 });
  };

  return (
    <SafeAreaView edges={["right", "left", "bottom"]} style={styles.container}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={100}
      >
        <ImageBackground
          // source={getBackgroundImage(isDarkMode)}
          // style={styles.backgroundImage}
          style={
            isDarkMode
              ? {
                  ...styles.backgroundImage,
                  backgroundColor: Color.buttomSheetDarkTheme,
                }
              : {
                  ...styles.backgroundImage,
                  backgroundColor: Color.defaultTheme,
                }
          }
        >
          <PageContainer style={{ backgroundColor: "transparent" }}>
            {!chatId && (
              <Bubble text="Send message to start conversation" type="system" />
            )}
            {chatId && (
              <FlatList
                ref={scrollRef}
                inverted={data?.length > 6 - imageMessage * 2.5 ? true : false}
                data={
                  data?.length > 6 - imageMessage * 2.5
                    ? data && [...data].reverse()
                    : data
                }
                renderItem={(itemData) => {
                  const message = itemData.item;
                  const isOwnMessage = message.senderId === userData.id;
                  let time = moment(message.createdAt).fromNow();
                  const messageType = isOwnMessage
                    ? "myMessage"
                    : "theirMessage";

                  if (time.includes("in ")) {
                    time = time.replace("in ", "");
                  }

                  return (
                    <Bubble
                      senderId={senderId}
                      title={title}
                      type={messageType}
                      text={message.messageText}
                      time={time}
                      setReply={() => setReplyingTo(message)}
                      replyingTo={message.replyingTo}
                      imageUrl={message?.image?.url}
                      setDeleteMessage={() =>
                        setDeleteMessage({ show: true, messageId: message._id })
                      }
                    />
                  );
                }}
              />
            )}
            {isErrorAddMessages && (
              <Bubble text="Error sending the message,try again" type="error" />
            )}
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
            onPress={pickedImageHandler}
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
            selectionColor={Color.Blue500}
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
              onPress={takeImageHandler}
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

          <AwesomeAlert
            show={tempImageUri !== ""}
            contentContainerStyle={
              isDarkMode
                ? { backgroundColor: Color.darkTheme }
                : { backgroundColor: Color.defaultTheme }
            }
            title="Send Image"
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            showConfirmButton={true}
            confirmText="Send"
            cancelText="Cancel"
            confirmButtonColor={Color.Blue700}
            cancelButtonColor={
              isDarkMode ? Color.darkTheme : Color.defaultTheme
            }
            cancelButtonTextStyle={{ color: Color.Blue500 }}
            titleStyle={styles.popupTitleStyle}
            onCancelPressed={() => setTempImageUri("")}
            onConfirmPressed={handelSendMessage}
            onDismiss={() => setTempImageUri("")}
            customView={
              <View>
                {tempImageUri !== "" && (
                  <Image
                    source={{ uri: tempImageUri }}
                    style={{ width: 250, height: 200, borderRadius: 10 }}
                  />
                )}
                {isPendingAddMessages && (
                  <ActivityIndicator
                    style={{ marginTop: 10 }}
                    color={Color.Blue700}
                  />
                )}
              </View>
            }
          />
        </View>
        <AwesomeAlert
          show={deleteMessage.show !== false}
          contentContainerStyle={
            isDarkMode
              ? { backgroundColor: Color.darkTheme }
              : { backgroundColor: Color.defaultTheme }
          }
          title="Delete Message"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          confirmText="Yes"
          cancelText="No"
          confirmButtonColor={Color.Blue700}
          cancelButtonColor={isDarkMode ? Color.darkTheme : Color.defaultTheme}
          cancelButtonTextStyle={{ color: Color.Blue500 }}
          titleStyle={styles.popupTitleStyle}
          onCancelPressed={() =>
            setDeleteMessage({ show: false, messageId: "" })
          }
          onConfirmPressed={handleDeleteMessage}
          onDismiss={() => setDeleteMessage({ show: false, messageId: "" })}
          customView={
            <View>
              {isPendingRemoveMessage && (
                <ActivityIndicator
                  style={{ marginTop: 10 }}
                  color={Color.Blue700}
                />
              )}
            </View>
          }
        />
        <AwesomeAlert
          show={templateMessage !== ""}
          contentContainerStyle={
            isDarkMode
              ? { backgroundColor: Color.darkTheme }
              : { backgroundColor: Color.defaultTheme }
          }
          title="Send Message"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          confirmText="Yes"
          cancelText="No"
          confirmButtonColor={Color.Blue700}
          cancelButtonColor={isDarkMode ? Color.darkTheme : Color.defaultTheme}
          cancelButtonTextStyle={{ color: Color.Blue500 }}
          titleStyle={styles.popupTitleStyle}
          onCancelPressed={() => setTemplateMessage("")}
          onConfirmPressed={handleSendTemplateMessage}
          onDismiss={() => setTemplateMessage("")}
          customView={
            <View>
              <TextInput
                autoCapitalize="none"
                style={
                  isDarkMode
                    ? { ...styles.templateTextbox, color: Color.white }
                    : { ...styles.templateTextbox }
                }
                selectionColor={Color.Blue500}
                placeholder="Message"
                placeholderTextColor={
                  isDarkMode ? Color.defaultTheme : Color.darkTheme
                }
                value={templateMessage}
                editable={false}
                multiline={true}
                numberOfLines={8}
                textAlignVertical="top"
              />
            </View>
          }
        />
        <Animated.View
          style={[
            { position: "absolute", bottom: "10%", right: 20 },
            downButton,
          ]}
        >
          <TouchableOpacity
            style={
              isDarkMode
                ? {
                    ...styles.downButton,
                    backgroundColor: Color.buttomSheetDarkTheme,
                  }
                : styles.downButton
            }
            onPress={scrollDown}
          >
            <Feather
              name="chevrons-down"
              size={24}
              color={isDarkMode ? "white" : "black"}
            />
          </TouchableOpacity>
        </Animated.View>
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
  templateTextbox: {
    fontSize: 16,
    fontFamily: "varelaRound",
    borderWidth: 1,
    borderRadius: 20,
    marginHorizontal: 5,
    paddingHorizontal: 15,
    borderColor: Color.Blue500,
  },
  mediaButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 35,
  },
  downButton: {
    padding: 6,
    backgroundColor: Color.Brown50,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
