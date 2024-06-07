import { useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";

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

  // {
  //   name: "Price Down",
  //   icon: "arrow-down-bold-circle",
  // },
  // {
  //   name: "Price Up",
  //   icon: "arrow-up-bold-circle",
  // },
];

const ExploreHeader = ({ onCategoryChanged }) => {
  const navigation = useNavigation();
  const { isDarkMode } = useDarkMode();
  const scrollRef = useRef(null);
  const itemsRef = useRef([]);

  const [activeIndex, setActiveIndex] = useState(0);

  const selectCategory = (index) => {
    const selected = itemsRef.current[index];
    setActiveIndex(index);
    selected?.measure((x, y, width, height, pageX, pageY) => {
      scrollRef.current?.scrollTo({ x: pageX - 16, y: 0, animated: true });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (categories[index].name === "All Categories") {
      onCategoryChanged(null);
    } else {
      onCategoryChanged(categories[index].name);
    }
  };

  return (
    <View
      style={
        isDarkMode
          ? { ...styles.container, backgroundColor: Color.darkTheme }
          : styles.container
      }
    >
      <ScrollView
        horizontal
        ref={scrollRef}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          gap: 20,
          paddingHorizontal: 16,
        }}
      >
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => navigation.navigate("FilterScreen")}
        >
          <Ionicons
            name="options-outline"
            size={22}
            color={isDarkMode ? "#fff" : "#000"}
          />
        </TouchableOpacity>
        {categories.map((item, index) => (
          <TouchableOpacity
            ref={(el) => (itemsRef.current[index] = el)}
            key={index}
            style={
              activeIndex === index
                ? isDarkMode
                  ? { ...styles.categoriesBtnActive, borderBottomColor: "#fff" }
                  : styles.categoriesBtnActive
                : styles.categoriesBtn
            }
            onPress={() => selectCategory(index)}
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={24}
              color={
                activeIndex === index && isDarkMode
                  ? "#fff"
                  : activeIndex === index && !isDarkMode
                  ? "#000"
                  : Color.gray
              }
            />
            <Text
              style={
                activeIndex === index
                  ? styles.categoryTextActive
                  : styles.categoryText
              }
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: 60,
    elevation: 2,
    shadowColor: Color.gray,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
  categoryText: {
    fontSize: 14,
    // fontFamily: "Merienda",
    color: Color.gray,
  },
  categoryTextActive: {
    fontSize: 15,
    // fontFamily: "Merienda",
  },
  categoriesBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 8,
  },
  categoriesBtnActive: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderBottomColor: "#000",
    borderBottomWidth: 2,
    paddingBottom: 8,
  },
  filterBtn: {
    marginLeft: -5,
    // marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: Color.gray,
    borderRadius: 24,
  },
});

export default ExploreHeader;
