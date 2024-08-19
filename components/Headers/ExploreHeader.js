import { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash";
import * as Haptics from "expo-haptics";

import { Color } from "../../constants/colors";
import { useDarkMode } from "../../context/DarkModeContext";

const categories = [
  {
    key: "allCategories",
    icon: "check-all",
  },
  {
    key: "landHouse",
    icon: "home",
  },
  {
    key: "housingUnit",
    icon: "home-city",
  },
  {
    key: "tower",
    icon: "city",
  },
  {
    key: "penthouse",
    icon: "city-variant",
  },
];

const ExploreHeader = ({ onCategoryChanged, categoryIndex, filtersValues }) => {
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();

  const navigation = useNavigation();
  const scrollRef = useRef(null);
  const itemsRef = useRef([]);

  const [activeIndex, setActiveIndex] = useState(categoryIndex);

  const debouncedNavigate = debounce((navigation, filtersValues) => {
    navigation.navigate("FilterScreen", filtersValues);
  }, 200);

  useEffect(() => {
    setActiveIndex(categoryIndex ?? 0);
  }, [categoryIndex]);

  const selectCategory = (index) => {
    const selected = itemsRef.current[index];
    setActiveIndex(index);
    selected?.measure((x, y, width, height, pageX, pageY) => {
      scrollRef.current?.scrollTo({ x: pageX - 16, y: 0, animated: true });
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (categories[index].key === "allCategories") {
      onCategoryChanged(null);
    } else {
      onCategoryChanged(t(`${categories[index].key}`));
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
        <TouchableRipple
          // background={Color.defaultTheme}
          borderless={true}
          style={styles.filterBtn}
          onPress={() => debouncedNavigate(navigation, filtersValues)}
        >
          <Ionicons
            name="options-outline"
            size={22}
            color={isDarkMode ? "#fff" : "#000"}
          />
        </TouchableRipple>
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
              {t(`categories.${item.key}`)}
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
    color: Color.gray,
  },
  categoryTextActive: {
    fontSize: 15,
  },
  categoriesBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 1,
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
    padding: 10,
    borderWidth: 1,
    borderColor: Color.gray,
    borderRadius: 24,
  },
});

export default ExploreHeader;
