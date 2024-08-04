import { useContext } from "react";
import { useQueries } from "@tanstack/react-query";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { ScrollView } from "react-native-gesture-handler";
import { Card, Text } from "react-native-paper";
import { Fontisto } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import { FavoritesContext } from "../context/FavoritesContext";
import fetchApartment from "../api/apartments/fetchApartment";
import Loader from "../components/ui/Loader";
import ErrorMessage from "../components/ui/ErrorMessage";
import SwipeableRow from "../components/SwipeableRow";

const FavoritesScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();
  const favoriteApartmentsCtx = useContext(FavoritesContext);

  const favoriteApartment = favoriteApartmentsCtx?.ids;

  if (favoriteApartment.length === 0) {
    return (
      <View style={styles.container}>
        <Fontisto
          name="favorite"
          size={100}
          color={Color.buttomSheetDarkTheme}
        />
        <Text style={styles.noResultsText}>{t("noFavorites")}</Text>
      </View>
    );
  }

  const favoriteApartmentsQueries = useQueries({
    queries: favoriteApartment.map((id) => ({
      queryKey: ["favoriteApartment", id],
      queryFn: () => fetchApartment(id),
    })),
  });
  const isLoading = favoriteApartmentsQueries.some((query) => query.isLoading);
  const isError = favoriteApartmentsQueries.some((query) => query.isError);
  const error = favoriteApartmentsQueries.some((query) => query.error);
  const data = favoriteApartmentsQueries.map(
    (query) => query.data?.data?.apartment
  );
  // console.log(data);
  if (isLoading) {
    return (
      <Loader
        color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
        size={30}
      />
    );
  }

  if (isError) {
    return <ErrorMessage errorMessage={error.message} />;
  }

  function changeFavoriteStatusHandler(id) {
    favoriteApartmentsCtx.removeFavorite(id);
  }

  return (
    <ScrollView contentContainerStyle={styles.cardContainer}>
      {data.map((apartment, index) => (
        <SwipeableRow
          key={index}
          onDelete={() => changeFavoriteStatusHandler(apartment._id)}
        >
          <Card
            key={index}
            style={[
              styles.card,
              isDarkMode
                ? { backgroundColor: Color.buttomSheetDarkTheme }
                : { backgroundColor: Color.defaultTheme },
            ]}
          >
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("HouseDetailsScreen", {
                  apartmentWithDistance: apartment,
                  favorite: true,
                })
              }
            >
              <View style={{ flexDirection: "row" }}>
                <Card.Cover
                  style={styles.cardCover}
                  source={{
                    uri:
                      apartment?.images?.[0] ||
                      "https://uploads.homeless.co.il/sale/202205/nvFile4211510.JPG",
                  }}
                />
                <Card.Content style={styles.cardContent}>
                  <Text style={{ fontWeight: "bold" }} variant="bodyLarge">
                    {apartment?.apartmentType}
                  </Text>
                  <Text>
                    {t("address")}: {apartment?.address?.street}
                  </Text>
                  <Text>
                    {t("numOfRooms")}: {apartment?.numberOfRooms}
                  </Text>
                  <Text>
                    {t("capacity")}: {apartment?.realTimeCapacity}/
                    {apartment?.totalCapacity}
                  </Text>
                  <Text style={{ fontWeight: "bold" }} variant="bodyMedium">
                    {t("price")}: ${apartment?.price}
                  </Text>
                </Card.Content>
              </View>
            </TouchableOpacity>
          </Card>
        </SwipeableRow>
      ))}
    </ScrollView>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  noResultsText: {
    textAlign: "center",
    color: Color.gray,
    fontFamily: "varelaRound",
    fontSize: 17,
    letterSpacing: 0.3,
  },
  apartmentContainer: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  apartmentName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardContainer: {
    padding: 10,
  },
  cardCover: {
    width: 100,
    height: 100,
    margin: 10,
  },
  card: {
    marginVertical: 10,
    paddingRight: 10,
  },
  cardContent: {
    marginLeft: -10,
    margin: 5,
  },
  iconContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "space-between",
  },
  arrow: {
    marginTop: 10,
  },
  trash: {
    marginBottom: 10,
  },
});
