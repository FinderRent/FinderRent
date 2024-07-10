import { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { Text } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import Animated from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";

import { Color } from "../../constants/colors";
import { useDarkMode } from "../../context/DarkModeContext";
import { FavoritesContext } from "../../context/FavoritesContext";
import { capitalizeWords } from "../../utils/features";
import Indicators from "./Indicators";

const { width } = Dimensions.get("window");

const HouseCard = ({ navigation, apartment, userData }) => {
  const { isDarkMode } = useDarkMode();
  const [currentIndex, setCurrentIndex] = useState(0);
  const favoriteApartmentsCtx = useContext(FavoritesContext);
  const apartmentIsFavorite = favoriteApartmentsCtx.ids.includes(apartment._id);

  function changeFavoriteStatusHandler() {
    if (apartmentIsFavorite) {
      favoriteApartmentsCtx.removeFavorite(apartment._id);
    } else {
      favoriteApartmentsCtx.addFavorite(apartment._id);
    }
  }

  const city = capitalizeWords(apartment.address.city);
  const street = capitalizeWords(apartment.address.street);

  const images = [
    "https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/home-improvement/wp-content/uploads/2022/07/download-23.jpg",
    "https://www.bhg.com/thmb/3Vf9GXp3T-adDlU6tKpTbb-AEyE=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/white-modern-house-curved-patio-archway-c0a4a3b3-aa51b24d14d0464ea15d36e05aa85ac9.jpg",
  ];

  return (
    <View
      style={
        isDarkMode
          ? { ...styles.card, backgroundColor: Color.buttomSheetDarkTheme }
          : styles.card
      }
    >
      <TouchableOpacity style={styles.favoriteButton}>
        {userData?.token && (
          <FontAwesome
            name={"heart"}
            size={34}
            color={apartmentIsFavorite ? "red" : "#E5E1DA"}
            onPress={changeFavoriteStatusHandler}
          />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation.navigate("HouseDetailsScreen", { apartment })}
      >
        <Animated.View style={styles.imagesContainer}>
          <Carousel
            // mode="parallax"
            width={width}
            height={250}
            autoPlay={false}
            data={images}
            // scrollAnimationDuration={1000}
            onSnapToItem={(index) => setCurrentIndex(index)}
            renderItem={({ item }) => (
              <View style={styles.imageWrapper}>
                <Image source={{ uri: item }} style={styles.image} />
              </View>
            )}
          />
          <Indicators images={images} currentIndex={currentIndex} />
        </Animated.View>
        <View style={styles.detailsContainer}>
          <View style={styles.addressContainer}>
            {/* <Text style={styles.apartmentType}>{apartment.apartmentType}</Text> */}
            <Text style={styles.city}>{city}</Text>
            <Text style={styles.street}>
              {street} {apartment.address.buildingNumber}/
              {apartment.address.apartmentNumber}
            </Text>
            {/* <Text style={styles.distance}>{apartment.distanceFromAcademy}</Text> */}
          </View>
          <Text style={styles.price}>{apartment.price}$</Text>
        </View>
      </TouchableOpacity>
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
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 15,
  },
  imagesContainer: {
    height: 250,
    width: width,
    overflow: "hidden",
    alignSelf: "center",
    borderRadius: 12,
  },
  imageWrapper: {
    width: width,
    height: 250,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  addressContainer: {
    flex: 1,
  },
  apartmentType: {
    fontSize: 18,
    textAlign: "center",
    paddingLeft: 90,
    // fontWeight: "bold",
    fontFamily: "OrbitronMedium",
  },
  city: {
    fontSize: 22,
    fontWeight: "bold",
  },
  street: {
    fontSize: 15,
  },
  distance: {
    fontSize: 15,
    color: "#65B741",
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 5,
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
