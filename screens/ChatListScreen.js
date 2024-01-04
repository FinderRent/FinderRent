import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { FontAwesome5 } from '@expo/vector-icons';
import moment from 'moment';
import 'moment/locale/he';

import { Color } from '../constants/colors';
import { useUsers } from '../context/UserContext';
import ErrorMessage from '../components/ui/ErrorMessage';
import Loader from '../components/ui/Loader';
import ChatList from '../components/chats/ChatList';
import fetchChatsList from '../api/chats/fetchChatsList';

function ChatListScreen({ navigation }) {
  const { userData } = useUsers();

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['chatList', userData.id],
    queryFn: () => fetchChatsList(userData.id),
  });

  useFocusEffect(
    useCallback(() => {
      const fetched = async () => {
        await refetch();
      };
      moment.locale('he');
      fetched();
    }, [])
  );

  // if (isLoading) {
  //   return <Loader color={Color.Brown400} size={30} />;
  // }

  if (error) {
    return <ErrorMessage errorMessage={error.message} />;
  }

  // if (data?.results == 0) {
  return (
    <View style={styles.container}>
      <FontAwesome5
        name="users"
        size={60}
        color={Color.Brown400}
        style={styles.noResultsIcon}
      />
      <Text style={styles.noResultsText}>עדיין אין צאטי'ם</Text>
    </View>
  );
  // }

  const sortedChats = data.chat.sort((a, b) => {
    const dateA = new Date(a.updatedAt);
    const dateB = new Date(b.updatedAt);
    return dateB - dateA;
  });

  return (
    <View>
      <FlatList
        data={sortedChats}
        keyExtractor={(item) => item._id}
        renderItem={(itemData) => {
          const chatData = itemData.item;
          const chatId = chatData._id;
          const lastMessage = chatData?.lastMessage;
          const updatedAt = chatData.updatedAt;
          let time = moment(updatedAt).fromNow();

          if (time.includes('בעוד')) {
            time = time.replace('בעוד', 'לפני');
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
            />
          );
        }}
      />
      <View style={styles.line}></View>

      {/* <Button
        style={{ margin: 20 }}
        buttonColor={Color.Brown500}
        textColor={Color.white}
        mode="elevated"
        onPress={() => navigation.navigate('ChatScreen')}
      >
        מסך צאט
      </Button> */}
    </View>
  );
}

export default ChatListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsIcon: {
    marginBottom: 10,
  },
  noResultsText: {
    color: Color.Brown500,
    fontFamily: 'varelaRound',
    fontSize: 15,
    letterSpacing: 0.3,
  },
  line: {
    margin: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: Color.Blue400,
  },
});
