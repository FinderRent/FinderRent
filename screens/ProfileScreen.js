import { useContext, useEffect } from "react";
import { View, SafeAreaView, StyleSheet, ImageBackground } from "react-native";
import { Title, Text, TouchableRipple } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Toast from "react-native-toast-message";

import { Color } from "../constants/colors";
import { UserContext, useUsers } from "../context/UserContext";
import { fullName } from "../utils/features";
import { ScrollView } from "react-native-gesture-handler";

const ProfileScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const auth = useContext(UserContext);

  const { userData } = useUsers();
  const isFocused = useIsFocused();
  const userType =
    userData?.userType?.charAt(0).toUpperCase() +
    userData?.userType?.slice(1).toLowerCase();

  const firstName = userData?.firstName || "";
  const lastName = userData?.lastName || "";

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
    });
  }, [isFocused]);
  async function logoutHandler(auth, navigation) {
    try {
      await AsyncStorage.removeItem("token");
      auth.logout();
      Toast.show({
        type: "success",
        text1: t("Logged Out Successfully"),
      });
      navigation.navigate("HomeScreen");
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.ScrollView}>
        <View style={styles.userInfoSection}>
          <View style={styles.avatar}>
            <ImageBackground
              style={{ height: 100, width: 100 }}
              imageStyle={{
                borderRadius: 50,
                borderWidth: 0.5,
                borderColor: Color.gray,
              }}
              source={{
                uri: userData?.avatar?.url,
              }}
            />
            <View>
              <Title style={styles.title}>
                {fullName(firstName, lastName)}
              </Title>
            </View>
          </View>
        </View>

        <View style={styles.info}>
          <Text style={styles.infoTitle}>
            {t(userType)} {t("Profile")}
          </Text>
        </View>

        {userData.userType === "student" ? (
          <View style={styles.userInfoSection}>
            <View style={styles.row}>
              <Icon
                name="map-marker-radius-outline"
                color={Color.icon}
                size={20}
              />
              <Text style={styles.text}>{userData.academic}</Text>
            </View>

            <View style={styles.row}>
              <Icon name="school-outline" color={Color.icon} size={20} />
              <Text style={styles.text}>{userData.department}</Text>
            </View>

            <View style={styles.row}>
              <Icon
                name="calendar-blank-outline"
                color={Color.icon}
                size={20}
              />
              <Text style={styles.text}>{userData.yearbook}</Text>
            </View>

            <View style={styles.row}>
              <Icon name="email-outline" color={Color.icon} size={20} />
              <Text style={styles.text}>{userData.email}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.userInfoSection}>
            <View style={styles.row}>
              <Icon name="phone-outline" color={Color.icon} size={20} />
              <Text style={styles.text}>
                {userData.phone ? userData.phone : t("Not available")}
              </Text>
            </View>

            <View style={styles.row}>
              <Icon name="email-outline" color={Color.icon} size={20} />
              <Text style={styles.text}>{userData.email}</Text>
            </View>
          </View>
        )}

        {userData.userType === "student" && (
          <View>
            <View style={styles.info}>
              <Text style={styles.infoTitle}>{t("Personal Info")}</Text>
            </View>

            <View style={styles.userInfoSection}>
              <View style={styles.row}>
                <Icon name="controller-classic" color={Color.icon} size={20} />
                <Text style={styles.text}>
                  {t("My Hobbies")}{" "}
                  {userData.hobbies ? userData.hobbies : t("addYourHobbies")}
                </Text>
              </View>

              <View style={styles.row}>
                <Icon name="beer" color={Color.icon} size={20} />
                <Text style={styles.text}>
                  {t("Fun Fact")}:{" "}
                  {userData.funFact ? userData.funFact : t("Empty")}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* {userData.userType === "student" && userData?.socialNetworks && (
          <View>
            <View style={styles.info}>
              <Text style={styles.infoTitle}>{t("socialNetworks")}</Text>
            </View>

            <View style={styles.userInfoSection}>
              <View style={styles.row}>
                <Icon name="instagram" color={Color.icon} size={20} />
                <Text style={styles.text}>
                  {t("instagram")}:{" "}
                  {userData?.socialNetworks.instagram
                    ? userData?.socialNetworks.instagram
                    : t("Add your profile link")}
                </Text>
              </View>

              <View style={styles.row}>
                <Icon name="facebook" color={Color.icon} size={20} />
                <Text style={styles.text}>
                  {t("facebook")}:{" "}
                  {userData?.socialNetworks.facebook
                    ? userData?.socialNetworks.facebook
                    : t("Add your profile link")}
                </Text>
              </View>
              <View style={styles.row}>
                <Icon name="linkedin" color={Color.icon} size={20} />
                <Text style={styles.text}>
                  {t("linkedin")}:{" "}
                  {userData?.socialNetworks.linkedin
                    ? userData?.socialNetworks.linkedin
                    : t("Add your profile link")}
                </Text>
              </View>
            </View>
          </View>
        )} */}

        <View style={styles.info}>
          <Text style={styles.infoTitle}>{t("Other")}</Text>
        </View>

        <View style={styles.menuWrapper}>
          {userData?.userType === "student" && (
            <TouchableRipple
              onPress={() => navigation.navigate("FavoritesScreen")}
            >
              <View style={styles.menuItem}>
                <Icon name="heart-outline" color={Color.icon} size={25} />
                <Text style={styles.menuItemText}>{t("Favorites")}</Text>
              </View>
            </TouchableRipple>
          )}

          <TouchableRipple
            onPress={() => navigation.navigate("SecurityScreen")}
          >
            <View style={styles.menuItem}>
              <Icon name="shield-lock-outline" color={Color.icon} size={25} />
              <Text style={styles.menuItemText}>{t("Security")}</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={() => logoutHandler(auth, navigation)}>
            <View style={styles.menuItem}>
              <Icon name="logout-variant" color={Color.icon} size={25} />
              <Text style={styles.menuItemText}>{t("Logout")}</Text>
            </View>
          </TouchableRipple>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  avatar: {
    alignItems: "center",
    marginTop: 10,
  },
  title: {
    marginTop: 5,
    marginBottom: 15,
    fontSize: 24,
    fontWeight: "bold",
  },
  info: {
    marginBottom: 10,
    marginHorizontal: 30,
    marginTop: -20,
    borderBottomWidth: 0.6,
    borderColor: Color.Blue500,
  },
  infoTitle: {
    fontWeight: "800",
    fontSize: 15,
    color: Color.Blue700,
    marginBottom: 5,
  },
  text: {
    color: Color.icon,
    marginLeft: 10,
    fontFamily: "varelaRound",
  },

  row: {
    flexDirection: "row",
    marginBottom: 10,
  },

  menuWrapper: {
    marginTop: -10,
    marginBottom: "4%",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: Color.icon,
    marginLeft: 10,
    fontSize: 16,
    fontFamily: "varelaRound",
  },
  ScrollView: {
    marginBottom: "10%",
  },
});
