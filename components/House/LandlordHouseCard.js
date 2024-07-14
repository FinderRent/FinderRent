import { View, StyleSheet, TouchableOpacity, Image } from "react-native";

import { useDarkMode } from "../../context/DarkModeContext";
import { Color } from "../../constants/colors";
import { Text } from "react-native-paper";

const LandlordHouseCard = ({ navigation, apartment }) => {
  const { isDarkMode } = useDarkMode();

  const images = [
    "https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/home-improvement/wp-content/uploads/2022/07/download-23.jpg",
    "https://www.bhg.com/thmb/3Vf9GXp3T-adDlU6tKpTbb-AEyE=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/white-modern-house-curved-patio-archway-c0a4a3b3-aa51b24d14d0464ea15d36e05aa85ac9.jpg",
    "https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/home-improvement/wp-content/uploads/2022/07/download-23.jpg",
  ];

  return (
    <View
      style={[
        styles.card,
        isDarkMode && { backgroundColor: Color.buttomSheetDarkTheme },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() =>
          navigation.navigate("LandlordHouseDetailsScreen", { apartment })
        }
      >
        <View
          style={[
            styles.cardContainer,
            isDarkMode && { backgroundColor: Color.buttomSheetDarkTheme },
          ]}
        >
          <View style={styles.imagesContainer}>
            <Image
              source={{ uri: images[0] }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.addressContainer}>
              <Text style={styles.city}>{apartment.address.city}</Text>
              <Text style={styles.street}>
                {apartment.address.street} {apartment.address.buildingNumber}/
                {apartment.address.apartmentNumber}
              </Text>
            </View>
            <Text style={styles.price}>{apartment.price}$</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: "relative",
    borderRadius: 12,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    flex: 0.75,
  },
  imagesContainer: {
    flex: 0.25,
  },
  image: {
    flex: 1,
    margin: "10%",
    borderRadius: 5,
  },
  addressContainer: {
    flex: 1,
  },
  city: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  street: {
    fontSize: 15,
    marginBottom: 5,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#65B741",
  },
});

export default LandlordHouseCard;
