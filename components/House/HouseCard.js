import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { Text, Card } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Carousel from "react-native-reanimated-carousel";
import { useTranslation } from "react-i18next";

import { Color } from "../../constants/colors";
import { useDarkMode } from "../../context/DarkModeContext";
import { FavoritesContext } from "../../context/FavoritesContext";
import { useCurrency } from "../../context/CurrencyContext";
import {
  capitalizeWords,
  convertCurrency,
  iconName,
} from "../../utils/features";
import Indicators from "./Indicators";

const { width } = Dimensions.get("window");

const HouseCard = ({ navigation, apartment, userData }) => {
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();
  const { currency } = useCurrency();

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

  return (
    <Card
      style={[
        styles.card,
        isDarkMode && {
          backgroundColor: Color.buttomSheetDarkTheme,
          borderColor: Color.Blue500,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() =>
          navigation.navigate("HouseDetailsScreen", {
            apartmentWithDistance: apartment,
          })
        }
      >
        <View style={styles.imageContainer}>
          <Carousel
            width={width - 20}
            height={300}
            autoPlay={false}
            data={apartment.images}
            onSnapToItem={(index) => setCurrentIndex(index)}
            renderItem={({ item }) => (
              <View style={styles.imageWrapper}>
                <Image source={{ uri: item }} style={styles.image} />
              </View>
            )}
          />
          <Indicators images={apartment.images} currentIndex={currentIndex} />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.addressContainer}>
            <Text style={styles.city}>{city}</Text>
            <Text style={styles.street} numberOfLines={1}>
              {street} {apartment.address.buildingNumber}/
              {apartment.address.apartmentNumber}
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.price}>
              {currency?.symbol || apartment?.currency?.symbol}
              {convertCurrency(
                apartment?.currency?.currency,
                currency?.code,
                apartment?.price
              )}
            </Text>
            <View
              style={[
                styles.detailsContainer,
                !userData.token && { bottom: 20 },
              ]}
            >
              <View style={styles.iconTextContainer}>
                <Icon
                  name={iconName(apartment.apartmentType)}
                  size={16}
                  color={Color.extraGray}
                />
                <Text style={styles.infoText}>
                  {t(apartment?.apartmentType)}
                </Text>
              </View>
              <View style={styles.iconTextContainer}>
                <Icon name="door" size={16} color={Color.extraGray} />
                <Text style={styles.infoText}>
                  {apartment?.numberOfRooms} {t("rooms")}
                </Text>
              </View>
              <View style={styles.iconTextContainer}>
                <Icon
                  name="account-group-outline"
                  size={16}
                  color={Color.extraGray}
                />
                <Text style={styles.infoText}>
                  {t("capacity")}: {apartment?.realTimeCapacity}/
                  {apartment?.totalCapacity}
                </Text>
              </View>
              {userData.token && (
                <View style={styles.iconTextContainer}>
                  <Icon
                    name="map-marker-distance"
                    size={16}
                    color={Color.extraGray}
                  />
                  <Text style={styles.infoText}>{apartment.distance}Km</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
      {userData?.token && (
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={changeFavoriteStatusHandler}
        >
          <FontAwesome
            name="heart"
            size={30}
            color={apartmentIsFavorite ? Color.red200 : Color.defaultTheme}
          />
        </TouchableOpacity>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    borderRadius: 14,
    // overflow: "hidden",
    backgroundColor: Color.white,
    borderColor: Color.Blue100,
    borderBottomWidth: 3,
  },
  imageContainer: {
    height: 230,
    width: width,
    overflow: "hidden",
    alignSelf: "center",
    borderRadius: 12,
  },
  imageWrapper: {
    width: width,
    height: 300,
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
  contentContainer: {
    padding: 12,
    marginBottom: -5,
    marginTop: -10,
  },
  addressContainer: {
    // marginBottom: 2,
  },
  city: {
    fontSize: 23,
    fontWeight: "bold",
  },
  street: {
    fontSize: 15,
    color: Color.extraGray,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  price: {
    fontSize: 23,
    fontWeight: "bold",
    marginTop: 15,
  },
  detailsContainer: {
    marginTop: -40,
    bottom: 10,
    justifyContent: "space-between",
  },
  iconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  infoText: {
    fontSize: 12,
    color: Color.extraGray,
    marginLeft: 4,
  },
  favoriteButton: {
    position: "absolute",
    top: 17,
    right: 18,
    zIndex: 1,
  },
});

export default HouseCard;
