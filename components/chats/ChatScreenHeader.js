import { ImageBackground, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { Color } from "../../constants/colors";
import { useDarkMode } from "../../context/DarkModeContext";

function ChatScreenHeader({ image, title }) {
  const { isDarkMode } = useDarkMode();
  const navigation = useNavigation();

  const handleNavigation = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "ChatListScreen" }],
    });
  };

  return (
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
          onPress={handleNavigation}
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
}

export default ChatScreenHeader;
