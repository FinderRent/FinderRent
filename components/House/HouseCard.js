import React, { useEffect, useState, useSyncExternalStore } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { SliderBox } from "react-native-image-slider-box";
import { useQuery } from "@tanstack/react-query";
import { useDarkMode } from "../../context/DarkModeContext";
import { Color } from "../../constants/colors";
import { Text } from "react-native-paper";
import {
  addFavourite,
  removeFavourite,
  checkIfFavourite,
} from "../../utils/http";
import Loader from "../../components/ui/Loader";

const HouseCard = ({ navigation, apartment, userData, isFavourite }) => {
  const { isDarkMode } = useDarkMode();
  const [isFavorite, setIsFavorite] = useState(isFavourite);

  //component updating ----------------------------------
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  console.log(
    "apartment ",
    apartment._id,
    " indise card - is favourite - ",
    isFavorite
  );

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
