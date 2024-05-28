import { View, StyleSheet, Image, ImageBackground } from "react-native";
import { Text } from "react-native-paper";

import { Color } from "../constants/colors";
import { useUsers } from "../context/UserContext";

const LandlordHeader = () => {
  const { userData } = useUsers();
  return (
    <View style={styles.profileLocationView}>
      <View style={styles.midContainer}>
        <ImageBackground
          style={{ height: 10, width: 10 }}
          source={require("../assets/images/placeholder.png")}
        />
        <View>
          <Text style={styles.Name}>Hello, {userData.firstName}</Text>
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
  Name: {
    fontSize: 30,
    fontWeight: "bold",
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
export default LandlordHeader;
