import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Linking,
  Platform,
} from "react-native";
import { Button, Text } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import { ScrollView } from "react-native-gesture-handler";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import { useUsers } from "../context/UserContext";
import { fetchUser } from "../utils/http";
import Icon from "react-native-vector-icons/Ionicons";
import Spacer from "../components/ui/Spacer";
import Loader from "../components/ui/Loader";
import ErrorMessage from "../components/ui/ErrorMessage";

function StudentProfileScreen(props) {
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();
  const { userData } = useUsers();

  let chatId = null;
  let firstChat = true;
  const navigation = useNavigation();
  const ouid = props.route.params.tenant;
  const tabBarHeight = useBottomTabBarHeight();

  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    error,
  } = useQuery({
    queryKey: ["User", ouid],
    queryFn: () => fetchUser(ouid),
  });

  // if (isLoadingUser) return <Loader />;

  const { data: studentData, isLoading: studentDataIsLoading } = useQuery({
    queryKey: ["chats", userData.id],
    queryFn: () => getUser(userData.id),
  });

  const userChats = studentData?.data?.chats;
  const foundObject = userChats?.find((chat) => chat?.userID === ouid);
  chatId = foundObject?.chatID;

  function chatWithMe() {
    navigation.goBack();
    navigation.navigate("ChatStackScreen", {
      screen: "ChatScreen",
      params: {
        firstChat,
        chatId,
        ouid,
        pushToken: user?.pushToken,
        image: user?.avatar?.url,
        title: `${user?.firstName} ${user?.lastName}`,
      },
    });
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      {isErrorUser && <ErrorMessage errorMessage={error} />}
      <View
        style={[styles.container, isDarkMode && { backgroundColor: "#505050" }]}
      >
        <View
          style={[
            styles.card,
            isDarkMode && { backgroundColor: Color.buttomSheetDarkTheme },
          ]}
        >
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: user?.avatar?.url,
              }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.name}>{user?.firstName}</Text>
            <Text style={styles.role}>Student</Text>
          </View>
        </View>
        <View style={styles.detailsContainer}>
          <Icon
            name="school"
            size={35}
            color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
          />
          <Text style={styles.funFactText}>
            {t("academic")} {user?.academic || t("empty")}
          </Text>
        </View>
        <View style={styles.detailsContainer}>
          <Icon
            name="today"
            size={35}
            color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
          />
          <Text style={styles.funFactText}>
            {t("department")} {user?.department || t("empty")}
          </Text>
        </View>
        <View style={styles.detailsContainer}>
          <Icon
            name="body-sharp"
            size={35}
            color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
          />
          <Text style={styles.funFactText}>
            {t("age")} {user?.age || t("empty")}
          </Text>
        </View>
        <View style={styles.detailsContainer}>
          <Icon
            name="game-controller-sharp"
            size={35}
            color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
          />
          <Text style={styles.funFactText}>
            {t("hobbies")} {user?.hobbies || t("empty")}
          </Text>
        </View>
        <View style={styles.detailsContainer}>
          <Icon
            name="beer"
            size={35}
            color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
          />
          <Text style={styles.funFactText}>
            {t("funFact")} {user?.funFact || t("empty")}
          </Text>
        </View>

        {/* Social Links Section */}
        <View style={styles.socialLinksContainer}>
          <Text style={styles.socialLinksTitle}>{t("socialLinksTitle")}</Text>
          <View style={styles.socialLinks}>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  "https://www.facebook.com/amir.fukman.1?mibextid=LQQJ4d"
                )
              }
            >
              <Icon name="logo-facebook" size={35} color="#3b5998" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  "https://www.instagram.com/amir_fukman?igsh=MWhlamhxcm0zcmk1MQ%3D%3D&utm_source=qr"
                )
              }
            >
              <Icon name="logo-instagram" size={35} color="#C13584" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  "https://www.linkedin.com/in/amir-fukman-9093b019a/"
                )
              }
            >
              <Icon name="logo-linkedin" size={35} color="#0A66C2" />
            </TouchableOpacity>
          </View>
        </View>

        <Spacer>
          {!isLoadingUser && !studentDataIsLoading && (
            <Button
              style={{ marginTop: 10, marginHorizontal: 15 }}
              textColor={
                isDarkMode ? Color.buttomSheetDarkTheme : Color.defaultTheme
              }
              buttonColor={
                isDarkMode ? Color.defaultTheme : Color.buttomSheetDarkTheme
              }
              mode="contained"
              onPress={chatWithMe}
            >
              {t("chatWithMe")}
            </Button>
          )}
        </Spacer>

        <View style={[styles.footer, { height: tabBarHeight + 10 }]}></View>
      </View>
    </ScrollView>
  );
}

export default StudentProfileScreen;

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 10,
  },
  card: {
    width: "90%",
    aspectRatio: 1.2,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: Platform.OS === "android" ? "10%" : "20%",
    marginBottom: 10,
  },
  imageContainer: {
    width: "60%",
    aspectRatio: 1,
    borderRadius: 100,
    overflow: "hidden",
    marginBottom: 5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    alignItems: "center",
  },
  name: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 5,
  },
  role: {
    fontSize: 16,
    // color: "#373A40",
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  funFactText: {
    marginLeft: 10,
    fontSize: 20,
    // color: "#373A40",
    paddingRight: "12%",
  },
  socialLinksContainer: {
    marginTop: 10,
    alignItems: "center",
    width: "100%",
  },
  socialLinksTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
    textAlign: "center",
  },
  socialLinks: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "80%",
  },
  footer: {
    width: "100%",
  },
});
