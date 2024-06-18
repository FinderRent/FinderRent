import { useEffect, useMemo, useRef } from "react";
import { StyleSheet, Platform, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";

import { Color } from "../../constants/colors";
import { useUsers } from "../../context/UserContext";
import { useDarkMode } from "../../context/DarkModeContext";
import { fetchAllApartments } from "../../utils/http";
import HouseCard from "./HouseCard";
import Loader from "../../components/ui/Loader";
import ErrorMessage from "../../components/ui/ErrorMessage";

function HouseList({
  navigation,
  sort,
  category,
  numberOfRooms,
  floor,
  totalCapacity,
}) {
  const { userData } = useUsers();
  const { isDarkMode } = useDarkMode();
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(
    () => (Platform.OS === "ios" ? ["14%", "77.5%"] : ["3%", "76%"]),
    []
  );

  const {
    data: apartments,
    isError: isErrorApartments,
    isFetching: isFetchingApartments,
    error: errorApartments,
    refetch,
  } = useQuery({
    queryKey: ["apartments"],
    queryFn: () =>
      fetchAllApartments({
        apartmentType: category,
        sort,
        numberOfRooms,
        floor,
        totalCapacity,
      }),
  });

  useEffect(() => {
    refetch();
  }, [category, sort, refetch]);

  const onShowMap = () => {
    bottomSheetRef.current?.collapse();
  };

  //render the apartment card
  const renderApartmentCard = ({ item: apartment }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("HouseDetailsScreen", { apartment })}
      >
        <HouseCard
          navigation={navigation}
          apartment={apartment}
          userData={userData}
        />
      </TouchableOpacity>
    );
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      backgroundStyle={{
        backgroundColor: isDarkMode ? Color.darkTheme : Color.white,
      }}
      handleIndicatorStyle={
        isDarkMode
          ? { backgroundColor: Color.gray }
          : { backgroundColor: Color.darkTheme }
      }
      style={styles.sheetContainer}
    >
      {isErrorApartments && <ErrorMessage errorMessage={errorApartments} />}

      {isFetchingApartments ? (
        <View style={{ paddingTop: "80%" }}>
          <Loader color={isDarkMode ? Color.white : Color.darkTheme} />
        </View>
      ) : apartments?.apartments.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <MaterialIcons
            name="apartment"
            size={120}
            color={Color.buttomSheetDarkTheme}
          />
          <Text style={styles.noResultsText}>
            There's No {category} Apartments.
          </Text>
        </View>
      ) : (
        <BottomSheetFlatList
          data={apartments?.apartments}
          keyExtractor={(item) => item._id}
          renderItem={renderApartmentCard}
        />
      )}
      <View style={styles.absoluteView}>
        <TouchableOpacity onPress={onShowMap} style={styles.mapBtn}>
          <Text style={{ color: "#fff" }}>Map</Text>
          <Ionicons
            name="map"
            size={20}
            style={{ marginLeft: 10 }}
            color={"#fff"}
          />
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}

export default HouseList;

const styles = StyleSheet.create({
  absoluteView: {
    position: "absolute",
    bottom: 10,
    width: "100%",
    alignItems: "center",
  },
  mapBtn: {
    backgroundColor: Color.darkTheme,
    padding: 10,
    height: 40,
    borderRadius: 10,
    flexDirection: "row",
    marginHorizontal: "auto",
    alignItems: "center",
  },
  sheetContainer: {
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsText: {
    textAlign: "center",
    color: Color.gray,
    fontFamily: "varelaRound",
    fontSize: 17,
    letterSpacing: 0.3,
  },
});
