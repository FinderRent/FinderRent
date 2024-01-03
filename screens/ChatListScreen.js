import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { Color } from '../constants/colors';

function ChatListScreen({ navigation }) {
  return (
    <View>
      <Text>ChatListScreen</Text>

      <Button
        style={{ margin: 20 }}
        buttonColor={Color.Brown500}
        textColor={Color.white}
        mode="elevated"
        onPress={() => navigation.navigate('ChatScreen')}
      >
        מסך צאט
      </Button>
    </View>
  );
}

export default ChatListScreen;
