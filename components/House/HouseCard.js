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
    "https://img.mako.co.il/2018/11/07/Wellcome_Realter_Beer_Sheva_18_3_g.jpg",
    "https://uploads.homeless.co.il/sale/202205/nvFile4211510.JPG",
    "https://images2.madlan.co.il/t:nonce:v=2/projects/%D7%9E%D7%AA%D7%97%D7%9D%20%D7%A7%D7%95%D7%A4%D7%AA%20%D7%97%D7%95%D7%9C%D7%99%D7%9D%20-%20%D7%A2%D7%96%D7%A8%D7%99%D7%90%D7%9C%D7%99/48950_br_group_pic_950x650_3-683b75f9-b8f5-427d-8f29-cad7d8865ff4.jpg",
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
            {userData.token && (
              <Text style={styles.distance}>{apartment.distance}Km</Text>
            )}
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
    padding: 20,
    marginLeft: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    margin: -10,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    marginTop: -30,
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
    fontSize: 13,
    // color: "#65B741",
  },
  price: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 12,
    color: "#65B741",
  },
  favoriteButton: {
    position: "absolute",
    top: 15,
    right: 12,
    zIndex: 1,
  },
});

export default HouseCard;
