import { useLayoutEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Paragraph, Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import { useUsers } from "../context/UserContext";
import HouseAssetsModal from "../modals/HouseAssetsModal";
import MapModal from "../modals/MapModal";
import Map from "../components/Map/Map";
import HouseInfo from "../components/House/HouseInfo";
import HouseRoommates from "../components/House/HouseRoommates";
import Seperator from "../components/ui/Seperator";
import HouseAssets from "../components/House/HouseAssets";
import RoommatesInfo from "../components/House/RoommatesInfo";

const IMG_HEIGHT = 300;
const { width } = Dimensions.get("window");

const LandlordHouseDetailsScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();
  const { userData } = useUsers();

  const { apartment } = route.params;

  const scrollRef = useAnimatedRef();
  const tabBarHeight = useBottomTabBarHeight();

  const [mapPress, setMapPress] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [apartmentContent, setApartmentContent] = useState([]);

  let images = [];
  if (apartment.images) {
    images = apartment.images;
  } else {
    images = [
      "https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/home-improvement/wp-content/uploads/2022/07/download-23.jpg",
      "https://www.bhg.com/thmb/3Vf9GXp3T-adDlU6tKpTbb-AEyE=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/white-modern-house-curved-patio-archway-c0a4a3b3-aa51b24d14d0464ea15d36e05aa85ac9.jpg",
    ];
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerTransparent: true,

      headerBackground: () => (
        <Animated.View
          style={[
            headerAnimatedStyle,
            isDarkMode
              ? { ...styles.header, backgroundColor: Color.darkTheme }
              : styles.header,
          ]}
        ></Animated.View>
      ),

      headerRight: () => (
        <View style={styles.bar}>
          {userData?.token && (
            <TouchableOpacity
              style={
                isDarkMode
                  ? {
                      ...styles.roundButton,
                      backgroundColor: Color.darkTheme,
                    }
                  : styles.roundButton
              }
            >
              <Ionicons
                name={"pencil"}
                size={22}
                color={isDarkMode ? "#fff" : "#000"}
                onPress={handleEditPress}
              />
            </TouchableOpacity>
          )}
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={
            isDarkMode
              ? {
                  ...styles.roundButton,
                  backgroundColor: Color.darkTheme,
                }
              : styles.roundButton
          }
          onPress={handleNavigation}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={isDarkMode ? "#fff" : "#000"}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isDarkMode]);

  function handleEditPress() {
    navigation.navigate("EditApartmentScreen", {
      apartment: apartment,
    });
  }
  const handleMapPress = () => {
    setMapPress(!mapPress);
  };
  const handleShowAllPress = () => {
    const trueKeys = Object.keys(apartment.apartmentContent).filter(
      (key) => apartment.apartmentContent[key]
    );
    const apartmentContent = trueKeys.filter((key) => key !== "_id");
    setApartmentContent(apartmentContent);
    setShowAll(!showAll);
  };

  const handleNavigation = () => {
    navigation.goBack();
  };

  const scrollOffset = useScrollViewOffset(scrollRef);
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1]),
    };
  }, []);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scaleX: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [2, 1, 1.1]
          ),
        },
      ],
    };
  });

  return (
    <View style={{ flex: 1 }}>
      <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
        <Animated.View style={[styles.images, imageAnimatedStyle]}>
          <View>
            <Carousel
              // mode="parallax"
              width={width}
              height={width}
              autoPlay={false}
              data={images}
              scrollAnimationDuration={1000}
              renderItem={({ item }) => (
                <View style={styles.container}>
                  <Image source={{ uri: item }} style={styles.images} />
                </View>
              )}
            />
          </View>
        </Animated.View>

        <View style={styles.houseInfo}>
          <Text style={styles.city}>{apartment?.address?.city}</Text>
          <Text style={styles.street}>
            {apartment?.address?.street} {apartment?.address?.buildingNumber}/
            {apartment?.address?.apartmentNumber}
          </Text>

          <HouseRoommates
            totalCapacity={apartment?.totalCapacity}
            realTimeCapacity={apartment?.realTimeCapacity}
          />
          <Text style={styles.about}>{t("about")}</Text>
          <Paragraph>{apartment?.about}</Paragraph>
          <HouseInfo
            numberOfRooms={apartment?.numberOfRooms}
            floor={apartment?.floor}
            totalCapacity={apartment?.totalCapacity}
          />
          {/* <Map
            handleMapPress={handleMapPress}
            zoomEnabled={false}
            scrollEnabled={false}
          />
          {mapPress && <MapModal handleMapPress={handleMapPress} />} */}
          <Seperator />
          <HouseAssets
            handleShowAllPress={handleShowAllPress}
            apartmentContent={apartment?.apartmentContent}
          />
          {showAll && (
            <HouseAssetsModal
              handleShowAllPress={handleShowAllPress}
              apartmentContent={apartmentContent}
            />
          )}
          <Seperator />
          {apartment.tenants.length > 0 && (
            <Text style={styles.about}>{t("currentTenants")}</Text>
          )}
          {apartment?.tenants?.map((tenant) => (
            <TouchableOpacity
              key={tenant}
              onPress={() =>
                navigation.navigate("StudentProfileScreen", { tenant })
              }
            >
              <RoommatesInfo tenant={tenant} />
            </TouchableOpacity>
          ))}
        </View>
        <View style={[styles.footer, { height: tabBarHeight + 10 }]}></View>
      </Animated.ScrollView>
    </View>
  );
};

export default LandlordHouseDetailsScreen;

const styles = StyleSheet.create({
  images: {
    height: IMG_HEIGHT,
    width: width,
  },
  houseInfo: {
    flexDirection: "col",
    marginHorizontal: "4%",
  },

  city: {
    fontSize: 35,
    marginBottom: 5,
    fontWeight: "bold",
  },
  street: {
    fontSize: 25,
    marginBottom: 5,
    fontWeight: "bold",
  },
  distance: {
    fontSize: 20,
    color: "#65B741",
  },
  about: {
    fontSize: 25,
    fontWeight: "bold",
  },
  footerText: {
    height: "100%",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    // color: Color.darkTheme,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  header: {
    backgroundColor: "#fff",
    height: 100,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Color.gray,
  },
});
