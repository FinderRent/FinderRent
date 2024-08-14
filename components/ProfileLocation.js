import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { Text } from "react-native-paper";
import { useTranslation } from "react-i18next";

import { Color } from "../constants/colors";
import { useUsers } from "../context/UserContext";
import { useNavigation } from "@react-navigation/native";

const ProfileLocation = () => {
  const { t } = useTranslation();
  const { userData } = useUsers();
  const navigation = useNavigation();
  let academic = userData.academic;

  if (userData?.academic?.length > 18) {
    academic = userData?.academic?.substring(0, 21) + "..";
  }
  return (
    <View style={styles.profileLocationView}>
      <View style={styles.midContainer}>
        <ImageBackground
          style={{ height: 20, width: 20, marginBottom: 25 }}
          source={{
            uri: "https://res.cloudinary.com/finderent/image/upload/v1719761526/placeholder_eyilhp.png",
          }}
        />

        <View>
          <Text style={styles.location}>{t("location")}</Text>
          <Text style={styles.locationName}>
            {academic !== "undefined" ? academic : ""}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.midContainer}
        onPress={() => navigation.navigate("ProfileStackScreen")}
      >
        <ImageBackground
          style={{ height: 60, width: 60 }}
          imageStyle={styles.profileImage}
          source={{
            uri: userData.avatar?.url,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  profileLocationView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  location: {
    fontSize: 18,
    color: Color.Blue500,
  },
  locationName: {
    marginLeft: -5,
    fontSize: 20,
    fontWeight: "bold",
  },
  locationImage: {
    height: 42,
    width: 42,
    justifyContent: "flex-start",
  },
  profileImage: {
    borderRadius: 50,
    borderWidth: 0.5,
    borderColor: Color.gray,
  },
  midContainer: {
    padding: 7,
    marginRight: 5,
    flexDirection: "row",
    alignItems: "center",
  },
});
export default ProfileLocation;
