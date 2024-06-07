import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
} from "react-native-reanimated";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const moreFilters = [
  {
    name: "Rooms",
    text: "select number of bedrooms",
    count: 0,
  },
  {
    name: "Floor",
    text: "select floor number",
    count: 0,
  },
  {
    name: "Roomates",
    text: "select how many roomates",
    count: 0,
  },
];

const FilterScreen = () => {
  const { isDarkMode } = useDarkMode();
  const [openCard, setOpenCard] = useState(0);

  const [filters, setFilters] = useState(moreFilters);

  const onClearAll = () => {
    const resetFilters = filters.map((filter) => ({
      ...filter,
      count: 0,
    }));
    setFilters(resetFilters);
    setOpenCard(0);
  };

  useEffect(() => {
    const resetFilters = moreFilters.map((filter) => ({
      ...filter,
      count: 0,
    }));
    setFilters(resetFilters);
  }, []);

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
            <Text style={styles.previewText}>Sort</Text>
            <Text style={styles.previewdData}>select</Text>
          </AnimatedTouchableOpacity>
        )}

        {openCard === 0 && <Text style={styles.cardHeader}>Sort By</Text>}
        {openCard === 0 && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.cardBody}
          ></Animated.View>
        )}
      </View>

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
            <Text style={styles.previewText}>Fillters</Text>
            <Text style={styles.previewdData}>Select numbers</Text>
          </AnimatedTouchableOpacity>
        )}

        {openCard === 1 && <Text style={styles.cardHeader}>Filters</Text>}
        {openCard === 1 && (
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
    // gap: 20,
  },
  cardHeader: {
    fontWeight: "bold",
    fontSize: 24,
    padding: 20,
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
  btnText: {
    // color: "#fff",
    fontSize: 16,
  },
  btnIcon: {
    position: "absolute",
    left: 16,
  },
  footer: {
    position: "absolute",
    height: "7%",
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
