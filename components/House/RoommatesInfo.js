import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";

import { Color } from "../../constants/colors";
import { useDarkMode } from "../../context/DarkModeContext";
import { fetchUser } from "../../utils/http";
import ErrorMessage from "../ui/ErrorMessage";
import Loader from "../ui/Loader";

const RoommatesInfo = ({ tenant }) => {
  const { isDarkMode } = useDarkMode();
  const navigation = useNavigation();

  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    error: errorUser,
  } = useQuery({
    queryKey: ["User", tenant],
    queryFn: () => fetchUser(tenant),
  });

  // if (isLoadingUser) {
  //   return (
  //     <View style={{ margin: 20 }}>
  //       <Loader
  //         color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
  //         size={18}
  //       />
  //     </View>
  //   );
  // }

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
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: "#fff",
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
