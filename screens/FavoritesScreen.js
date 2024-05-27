import { useQueries } from "@tanstack/react-query";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { Fontisto } from "@expo/vector-icons";

import { Color } from "../constants/colors";
import fetchApartment from "../api/apartments/fetchApartment";
import Loader from "../components/ui/Loader";
import ErrorMessage from "../components/ui/ErrorMessage";

const FavoritesScreen = ({ route }) => {
  const favoriteApartment = route.params?.ids;

  if (favoriteApartment.length === 0) {
    return (
      <View style={styles.container}>
        <Fontisto
          name="favorite"
          size={100}
          color={Color.buttomSheetDarkTheme}
        />
        <Text style={styles.noResultsText}>
          There's No Favorites Apartments.
        </Text>
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

  if (isLoading) {
    return <Loader color={Color.Blue500} size={30} />;
  }

  if (isError) {
    return <ErrorMessage errorMessage={error.message} />;
  }

  return (
    <View>
      {data?.map((apartment, index) => (
        <View key={index} style={styles.apartmentContainer}>
          <Text style={styles.apartmentName}>{apartment?.apartmentType}</Text>
          <Text>Price: ${apartment?.price}</Text>
          <Text>Rooms: {apartment?.numberOfRooms}</Text>
          <Text>Rating: {apartment?.rating}</Text>
          <Text>
            Capacity: {apartment?.realTimeCapacity}/{apartment?.totalCapacity}
          </Text>
        </View>
      ))}
    </View>
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
});
