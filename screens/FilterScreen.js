import { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
} from "react-native-reanimated";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import { useUsers } from "../context/UserContext";
import DropDown from "../components/inputs/DropDown";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const categories = [
  {
    name: "All Categories",
    icon: "check-all",
  },
  {
    name: "Land House",
    icon: "home",
  },
  {
    name: "Houseing Unit",
    icon: "home-city",
  },
  {
    name: "Tower",
    icon: "city",
  },
  {
    name: "Penthouse",
    icon: "city-variant",
  },
];

const FilterScreen = ({ navigation, route }) => {
  const { userData } = useUsers();
  const filtersValues = route?.params;

  const moreFilters = [
    {
      name: "Rooms",
      text: "select number of bedrooms",
      count: filtersValues?.numberOfRooms ?? 0,
    },
    {
      name: "Floor",
      text: "select floor number",
      count: filtersValues?.floor ?? 0,
    },
    {
      name: "Roomates",
      text: "select how many roomates",
      count: filtersValues?.totalCapacity ?? 0,
    },
  ];

  const { isDarkMode } = useDarkMode();
  const [openCard, setOpenCard] = useState(0);
  const [sortApartments, setSort] = useState("");
  const [distance, setDistance] = useState(filtersValues?.distance ?? 1.0);
  const [selectedType, setSelectedType] = useState(0);
  const [filters, setFilters] = useState(moreFilters);

  const sortBy = [
    { label: "Low to High", value: "lowToHigh" },
    { label: "High to Low", value: "HighToLow" },
    { label: "New to Old", value: "NewToOld" },
    { label: "Old to New ", value: "OldToNew" },
  ];

  const onClearAll = () => {
    const resetFilters = filters.map((filter) => ({
      ...filter,
      count: 0,
    }));
    setSort("");
    setDistance(1.0);
    setFilters(resetFilters);
    setSelectedType(0);
    setOpenCard(0);
  };

  useEffect(() => {
    if (filtersValues) {
      switch (filtersValues?.sort) {
        case "price":
          setSort("lowToHigh");
          break;
        case "-price":
          setSort("lowToHigh");
          break;
        case "createdAt":
          setSort("NewToOld");
          break;
        case "-createdAt":
          setSort("OldToNew");
          break;
      }
      switch (filtersValues?.category) {
        case "Land House":
          setSelectedType(1);
          break;
        case "Houseing Unit":
          setSelectedType(2);
          break;
        case "Tower":
          setSelectedType(3);
          break;
        case "Penthouse":
          setSelectedType(4);
          break;
      }
    }
  }, [route?.params]);

  const handleAplly = () => {
    let category, sort;
    if (categories[selectedType].name === "All Categories") {
      category = [selectedType, ""];
    } else {
      category = [selectedType, categories[selectedType].name];
    }

    const apartmentFilters = filters?.map((filter) => [
      filter.name,
      filter.count,
    ]);
    switch (sortApartments) {
      case "lowToHigh":
        sort = "price";
        break;
      case "HighToLow":
        sort = "-price";
        break;
      case "NewToOld":
        sort = "createdAt";
        break;
      case "OldToNew":
        sort = "-createdAt";
        break;
    }

    navigation.navigate("HomeScreen", {
      sort,
      distance,
      category,
      apartmentFilters,
    });
  };

  return (
    <BlurView intensity={100} style={styles.container} tint="dark">
      <View
        style={
          isDarkMode
            ? { ...styles.card, backgroundColor: Color.buttomSheetDarkTheme }
            : styles.card
        }
      >
        {openCard !== 0 && (
          <AnimatedTouchableOpacity
            onPress={() => setOpenCard(0)}
            style={styles.cardPreview}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
          >
            <Text style={styles.previewText}>Sort By</Text>
            <Text style={styles.previewdData}>{sortApartments}</Text>
          </AnimatedTouchableOpacity>
        )}

        {openCard === 0 && <Text style={styles.cardHeader}>Sort By</Text>}
        {openCard === 0 && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={[styles.sortCardBody]}
          >
            <DropDown
              list={sortBy}
              label={sortApartments || "SortBy"}
              placeholder={sortApartments}
              searchable={false}
              listMode="SCROLLVIEW"
              onValueChange={(sortBy) => setSort(sortBy)}
            />
          </Animated.View>
        )}
      </View>

      {userData.token && (
        <View
          style={
            isDarkMode
              ? { ...styles.card, backgroundColor: Color.buttomSheetDarkTheme }
              : styles.card
          }
        >
          {openCard !== 1 && (
            <AnimatedTouchableOpacity
              onPress={() => setOpenCard(1)}
              style={styles.cardPreview}
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
            >
              <Text style={styles.previewText}>Distance</Text>
              <Text style={styles.previewdData}>{distance}km</Text>
            </AnimatedTouchableOpacity>
          )}

          {openCard === 1 && (
            <Text style={styles.cardHeader}>Distance From Academy</Text>
          )}
          {openCard === 1 && (
            <Animated.View style={styles.cardBody}>
              <View style={styles.filterItem}>
                <View>
                  <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                    Distance In Km
                  </Text>
                  <Text style={{ fontSize: 14, color: Color.extraGray }}>
                    select distance from academy
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    gap: 2,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      setDistance((prev) =>
                        Math.max(0.1, parseFloat((prev - 0.1).toFixed(1)))
                      )
                    }
                  >
                    <Ionicons
                      name="remove-circle-outline"
                      size={24}
                      color={
                        distance > 0.1
                          ? isDarkMode
                            ? Color.defaultTheme
                            : Color.darkTheme
                          : isDarkMode
                          ? "#2e2e2e"
                          : "#cdcdcd"
                      }
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 14,
                      minWidth: 18,
                      textAlign: "center",
                    }}
                  >
                    {`${distance.toFixed(1)}km`}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      setDistance((prev) => parseFloat((prev + 0.1).toFixed(1)))
                    }
                  >
                    <Ionicons
                      name="add-circle-outline"
                      size={24}
                      color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          )}
        </View>
      )}
      <View
        style={
          isDarkMode
            ? { ...styles.card, backgroundColor: Color.buttomSheetDarkTheme }
            : styles.card
        }
      >
        {openCard !== 2 && (
          <AnimatedTouchableOpacity
            onPress={() => setOpenCard(2)}
            style={styles.cardPreview}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
          >
            <Text style={styles.previewText}>Apartment Type</Text>
            <Text style={styles.previewdData}>
              {categories[selectedType].name}
            </Text>
          </AnimatedTouchableOpacity>
        )}

        {openCard === 2 && (
          <Text style={styles.cardHeader}>Apartment Type</Text>
        )}
        {openCard === 2 && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.cardBody}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.placesContainer}
            >
              {categories.map((item, index) => (
                <TouchableOpacity
                  onPress={() => setSelectedType(index)}
                  key={index}
                >
                  <MaterialCommunityIcons
                    style={
                      selectedType === index
                        ? styles.placeSelected
                        : styles.place
                    }
                    name={item.icon}
                    size={80}
                    color={
                      selectedType === index && isDarkMode
                        ? "#fff"
                        : selectedType === index && !isDarkMode
                        ? "#000"
                        : Color.gray
                    }
                  />
                  <Text
                    style={
                      selectedType === index
                        ? styles.categoryTextActive
                        : styles.categoryText
                    }
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        )}
      </View>

      <View
        style={
          isDarkMode
            ? { ...styles.card, backgroundColor: Color.buttomSheetDarkTheme }
            : styles.card
        }
      >
        {openCard !== 3 && (
          <AnimatedTouchableOpacity
            onPress={() => setOpenCard(3)}
            style={styles.cardPreview}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
          >
            <Text style={styles.previewText}>Fillters</Text>
            <Text style={styles.previewdData}>Select numbers</Text>
          </AnimatedTouchableOpacity>
        )}

        {openCard === 3 && (
          <Text style={styles.cardHeader}>Apartment Filters</Text>
        )}
        {openCard === 3 && (
          <Animated.View style={styles.cardBody}>
            {filters.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.filterItem,
                  index + 1 < moreFilters.length ? styles.itemBorder : null,
                ]}
              >
                <View>
                  <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                    {item.name}
                  </Text>
                  <Text style={{ fontSize: 14, color: Color.extraGray }}>
                    {item.text}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      const newFilters = [...filters];
                      newFilters[index].count =
                        newFilters[index].count > 0
                          ? newFilters[index].count - 1
                          : 0;
                      setFilters(newFilters);
                    }}
                  >
                    <Ionicons
                      name="remove-circle-outline"
                      size={26}
                      color={
                        filters[index].count > 0
                          ? isDarkMode
                            ? Color.defaultTheme
                            : Color.darkTheme
                          : isDarkMode
                          ? "#2e2e2e"
                          : "#cdcdcd"
                      }
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 16,
                      minWidth: 18,
                      textAlign: "center",
                    }}
                  >
                    {item.count}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      const newFilters = [...filters];
                      newFilters[index].count++;
                      setFilters(newFilters);
                    }}
                  >
                    <Ionicons
                      name="add-circle-outline"
                      size={26}
                      color={isDarkMode ? Color.defaultTheme : Color.darkTheme}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </Animated.View>
        )}
      </View>

      {/* Footer */}
      <Animated.View
        style={
          isDarkMode
            ? { ...styles.footer, backgroundColor: Color.buttomSheetDarkTheme }
            : styles.footer
        }
        entering={SlideInDown.delay(200)}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{ height: "100%", justifyContent: "center" }}
            onPress={onClearAll}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                textDecorationLine: "underline",
              }}
            >
              Clear all
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              isDarkMode
                ? { ...styles.btn, backgroundColor: Color.defaultTheme }
                : styles.btn
            }
            onPress={handleAplly}
          >
            <Text
              style={
                isDarkMode
                  ? { ...styles.btnText, color: Color.darkTheme }
                  : styles.btnText
              }
            >
              Apply
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
  },
  card: {
    backgroundColor: Color.white,
    borderRadius: 14,
    margin: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },
  cardHeader: {
    fontWeight: "bold",
    fontSize: 24,
    padding: 20,
  },
  sortCardBody: {
    paddingHorizontal: 20,
    paddingBottom: 220,
  },
  cardBody: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cardPreview: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  previewText: {
    fontWeight: "bold",
    fontSize: 14,
    color: Color.gray,
  },
  previewdData: {
    fontWeight: "bold",
    fontSize: 14,
  },
  filterItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  itemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Color.gray,
  },
  btn: {
    backgroundColor: Color.darkTheme,
    height: 35,
    paddingHorizontal: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: Color.defaultTheme,
    fontSize: 18,
  },
  btnIcon: {
    position: "absolute",
    left: 16,
  },
  placesContainer: {
    flexDirection: "row",
    gap: 25,
  },
  place: {
    padding: 10,
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  placeSelected: {
    padding: 10,
    borderColor: Color.extraGray,
    borderWidth: 2,
    borderRadius: 10,
    width: 100,
    height: 100,
  },
  categoryText: {
    fontSize: 14,
    textAlign: "center",
    paddingTop: 6,
    color: Color.gray,
  },
  categoryTextActive: {
    textAlign: "center",
    paddingTop: 6,
    fontSize: 15,
  },
  footer: {
    position: "absolute",
    height: "8%",
    bottom: "8%",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopColor: Color.gray,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
export default FilterScreen;
