import React, { useEffect, useState, useSyncExternalStore } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { SliderBox } from "react-native-image-slider-box";
import { useQuery } from "@tanstack/react-query";
import { useDarkMode } from "../../context/DarkModeContext";
import { Color } from "../../constants/colors";
import { Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addFavourite,
  removeFavourite,
  checkIfFavourite,
} from "../../utils/http";
import Loader from "../../components/ui/Loader";

const LandlordHouseCard = ({
  navigation,
  apartment,
  userData,
  isFavourite,
}) => {
  const { isDarkMode } = useDarkMode();

  const [isFavorite, setIsFavorite] = useState(isFavourite);

  //component updating ----------------------------------
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleFavoriteQuery = isFavorite
    ? {
        queryKey: ["addFavourite"],
        queryFn: () => addFavourite(apartment._id, userData.id),
      }
    : {
        queryKey: ["removeFavourite"],
        queryFn: () => removeFavourite(apartment._id, userData.id),
      };

  const { data, isLoading, isError, status } = useQuery(handleFavoriteQuery);
  //-----------------------------------------------------

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
      <View style={styles.cardContainer}>
        <View style={styles.imagesContainer}>
          <Image
            source={{ uri: images[0] }} // Use the first image in the array
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
    backgroundColor: "#fff",
  },
  imagesContainer: {
    flex: 0.25,
    backgroundColor: "#fff",
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
