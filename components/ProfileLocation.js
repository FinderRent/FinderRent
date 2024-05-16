import { View, StyleSheet, Image, ImageBackground } from "react-native";
import { Text } from "react-native-paper";

import { Color } from "../constants/colors";
import { useUsers } from "../context/UserContext";

const ProfileLocation = () => {
  const { userData } = useUsers();
  return (
    <View style={styles.profileLocationView}>
      <View style={styles.midContainer}>
        <ImageBackground
          style={{ height: 10, width: 10 }}
          source={require("../assets/images/placeholder.png")}
        />
        <View>
          <Text style={styles.location}>Location</Text>
          <Text style={styles.locationName}>
            {userData.academic !== "undefined" ? userData.academic : ""}
          </Text>
        </View>
      </View>

      <View style={styles.midContainer}>
        <ImageBackground
          style={{ height: 60, width: 60 }}
          imageStyle={styles.profileImage}
          source={{
            uri: userData.avatar?.url,
          }}
        />
      </View>
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
    padding: 10,
    marginRight: 5,
    flexDirection: "row",
    alignItems: "center",
  },
});
export default ProfileLocation;
