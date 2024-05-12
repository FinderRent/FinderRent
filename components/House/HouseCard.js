import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { SliderBox } from "react-native-image-slider-box";

import { useDarkMode } from "../../context/DarkModeContext";
import { Color } from "../../constants/colors";
import { Text } from "react-native-paper";

const HouseCard = ({ navigation, apartment }) => {
  const { isDarkMode } = useDarkMode();
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const images = [
    "https://149347005.v2.pressablecdn.com/wp-content/uploads/modern-home-twilight-1.jpg",
    "https://www.bhg.com/thmb/3Vf9GXp3T-adDlU6tKpTbb-AEyE=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/white-modern-house-curved-patio-archway-c0a4a3b3-aa51b24d14d0464ea15d36e05aa85ac9.jpg",
    "https://149347005.v2.pressablecdn.com/wp-content/uploads/modern-home-twilight-1.jpg",
  ];

  return (
    <View
      style={
        isDarkMode
          ? { ...styles.card, backgroundColor: Color.buttomSheetDarkTheme }
          : styles.card
      }
    >
      <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
        <FontAwesome
          name={isFavorite ? "heart" : "heart"}
          size={34}
          color={isFavorite ? "red" : "#E5E1DA"}
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <View style={styles.images}>
          <SliderBox
            images={images}
            onCurrentImagePressed={() =>
              navigation.navigate("HouseDetailsScreen", { apartment })
            }
          />
        </View>
      </TouchableOpacity>

      <View style={styles.detailsContainer}>
        <View style={styles.addressContainer}>
          <Text style={styles.city}>{apartment.address.city}</Text>
          <Text style={styles.street}>
            {apartment.address.street} {apartment.address.buildingNumber}/
            {apartment.address.apartmentNumber}
          </Text>
          <Text style={styles.distance}>{apartment.distanceFromAcademy}</Text>
        </View>
        <Text style={styles.price}>{apartment.price}$</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: "relative",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
    margin: 10,
  },
  images: {
    width: "100%",
    overflow: "hidden",
    alignSelf: "center",
    borderRadius: 12,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
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

  distance: {
    fontSize: 15,
    color: "#65B741",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#65B741",
  },
  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
});

export default HouseCard;
