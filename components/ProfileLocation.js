import { View, StyleSheet, ImageBackground } from "react-native";
import { Text } from "react-native-paper";

import { Color } from "../constants/colors";
import { useUsers } from "../context/UserContext";

const ProfileLocation = () => {
  const { userData } = useUsers();
  let academic = userData.academic;

  if (userData.academic.length > 18) {
    academic = userData.academic.substring(0, 21) + "..";
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
          <Text style={styles.location}>Location</Text>
          <Text style={styles.locationName}>
            {academic !== "undefined" ? academic : ""}
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
    padding: 5,
    marginRight: 5,
    flexDirection: "row",
    alignItems: "center",
  },
});
export default ProfileLocation;
