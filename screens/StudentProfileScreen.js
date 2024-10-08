import { useEffect } from "react";
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

function StudentProfileScreen(props) {
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();
  const { userData } = useUsers();

  const navigation = useNavigation();
  const tabBarHeight = useBottomTabBarHeight();

  const routes = navigation.getState()?.routes;
  const prevRoute = routes[routes.length - 1];

  let chatId = null;
  let firstChat = true;
  const ouid = props.route?.params?.tenant;
  const userInfo = props.route?.params?.userData;

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["User", ouid],
    queryFn: () => fetchUser(ouid),
  });

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
      {/* {isErrorUser && <ErrorMessage errorMessage={error} />} */}
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
                uri: user?.avatar?.url ?? userInfo?.avatar?.url,
              }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.name}>
              {user?.firstName ?? userInfo?.firstName}
            </Text>
            <Text style={styles.role}>{t("student")}</Text>
          </View>
        </View>
        <View style={styles.detailsContainer}>
          <Icon
            name="school"
            size={35}
            color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
          />
          <Text style={styles.funFactText}>
            <Text style={{ fontWeight: "bold" }}>{t("academic")}</Text>
            {user?.academic ?? userInfo?.academic ?? t("empty")}
          </Text>
        </View>
        <View style={styles.detailsContainer}>
          <Icon
            name="today"
            size={35}
            color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
          />
          <Text style={styles.funFactText}>
            <Text style={{ fontWeight: "bold" }}>{t("department")}</Text>{" "}
            {user?.department ?? userInfo?.department ?? t("empty")}
          </Text>
        </View>
        <View style={styles.detailsContainer}>
          <Icon
            name="body-sharp"
            size={35}
            color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
          />
          <Text style={styles.funFactText}>
            <Text style={{ fontWeight: "bold" }}>{t("age")}</Text>{" "}
            {user?.age ?? userInfo?.age ?? t("empty")}
          </Text>
        </View>
        <View style={styles.detailsContainer}>
          <Icon
            name="game-controller-sharp"
            size={35}
            color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
          />
          <Text style={styles.funFactText}>
            <Text style={{ fontWeight: "bold" }}>{t("myHobbies")}</Text>{" "}
            {user?.hobbies ?? userInfo?.hobbies ?? t("empty")}
          </Text>
        </View>
        <View style={styles.detailsContainer}>
          <Icon
            name="beer"
            size={35}
            color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
          />
          <Text style={styles.funFactText}>
            <Text style={{ fontWeight: "bold" }}>{t("funFact")}</Text>{" "}
            {user?.funFact ?? userInfo?.funFact ?? t("empty")}
          </Text>
        </View>

        {/* Social Links Section */}
        {(user?.socialNetworks?.instagram ||
          user?.socialNetworks?.facebook ||
          user?.socialNetworks?.linkedin) && (
          <View style={styles?.socialLinksContainer}>
            <Text style={styles?.socialLinksTitle}>
              {t("socialLinksTitle")}
            </Text>
            <View style={styles?.socialLinks}>
              {user?.socialNetworks?.facebook && (
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL("https://" + user?.socialNetworks.facebook)
                  }
                >
                  <Icon name="logo-facebook" size={35} color="#3b5998" />
                </TouchableOpacity>
              )}
              {user?.socialNetworks?.instagram && (
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL("https://" + user?.socialNetworks.instagram)
                  }
                >
                  <Icon name="logo-instagram" size={35} color="#C13584" />
                </TouchableOpacity>
              )}
              {user?.socialNetworks?.linkedin && (
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL("https://" + user?.socialNetworks.linkedin)
                  }
                >
                  <Icon name="logo-linkedin" size={35} color="#0A66C2" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        <Spacer>
          {!isLoadingUser &&
          !studentDataIsLoading &&
          !prevRoute?.params?.chatList ? (
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
          ) : (
            <Loader color={isDarkMode ? Color.defaultTheme : Color.darkTheme} />
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
    width: "100%",
    marginTop: 20,
    paddingRight: 50,
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
