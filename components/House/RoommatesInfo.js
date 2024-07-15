import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";

import { Color } from "../../constants/colors";
import { useDarkMode } from "../../context/DarkModeContext";
import { fetchUser } from "../../utils/http";
import Loader from "../ui/Loader";
import ErrorMessage from "../ui/ErrorMessage";

const RoommatesInfo = ({ tenant }) => {
  const { isDarkMode } = useDarkMode();
  const navigation = useNavigation();

  //change it to the real person image
  const images = [
    "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg?t=st=1718994903~exp=1718998503~hmac=5d66ee2ce11b89c86b03f926658dac5b99441c548a993f4beb7d0b539f76bfae&w=1480",
  ];

  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    status: statusUser,
    error: errorUser,
  } = useQuery({
    queryKey: ["User", tenant],
    queryFn: () => fetchUser(tenant),
  });

  if (isLoadingUser)
    return <Loader color={isDarkMode ? Color.defaultTheme : Color.darkTheme} />;

  if (isErrorUser) return <ErrorMessage errorMessage={errorUser} />;

  return (
    <View>
      <View
        style={[
          styles.card,
          isDarkMode && { backgroundColor: Color.buttomSheetDarkTheme },
        ]}
      >
        <TouchableOpacity
          style={styles.cardContainer}
          key={tenant}
          onPress={() =>
            navigation.navigate("StudentProfileScreen", { tenant })
          }
        >
          <Image
            source={{
              uri: user?.avatar?.url,
            }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.detailsContainer}>
            <Text style={styles.userName}>
              {user?.firstName} {user?.lastName}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: "relative",
    borderRadius: 12,
    margin: 5,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: "#fff",
    // borderTopWidth: 1,
    // borderBottomColor: Color.gray,
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  detailsContainer: {
    marginLeft: 15,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default RoommatesInfo;
