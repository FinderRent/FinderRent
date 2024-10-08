import { useContext, useLayoutEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Platform,
} from "react-native";
import Animated, {
  SlideInDown,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Paragraph, Text } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import { FavoritesContext } from "../context/FavoritesContext";
import {
  capitalizeWords,
  convertCurrency,
  generateTemplateMessage,
} from "../utils/features";
import { useUsers } from "../context/UserContext";
import { useCurrency } from "../context/CurrencyContext";
import HouseAssetsModal from "../modals/HouseAssetsModal";
import MapModal from "../modals/MapModal";
import Map from "../components/Map/Map";
import HouseInfo from "../components/House/HouseInfo";
import HouseRoommates from "../components/House/HouseRoommates";
import Seperator from "../components/ui/Seperator";
import HouseAssets from "../components/House/HouseAssets";
import RoommatesInfo from "../components/House/RoommatesInfo";
import fetchChats from "../api/chats/fetchChats";
import getUser from "../api/users/getUser";

const IMG_HEIGHT = 300;
const { width } = Dimensions.get("window");

const HouseDetailsScreen = ({ navigation, route }) => {
  const { t, i18n } = useTranslation();
  const { isDarkMode } = useDarkMode();
  const { userData } = useUsers();
  const { currency } = useCurrency();
  const favoriteApartmentsCtx = useContext(FavoritesContext);

  const { apartmentWithDistance: apartment } = route.params;
  const routes = navigation.getState()?.routes;
  const prevRoute = routes[routes.length - 1];

  const scrollRef = useAnimatedRef();
  const tabBarHeight = useBottomTabBarHeight();

  const city = capitalizeWords(apartment?.address.city);
  const street = capitalizeWords(apartment?.address.street);
  const templateMessage = generateTemplateMessage(
    i18n.language,
    apartment?.address
  );

  let chatId = null;
  let firstChat = true;
  const ouid = apartment?.owner[0];
  const coordinates = apartment?.address?.coordinates;
  const [mapPress, setMapPress] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const [apartmentContent, setApartmentContent] = useState([]);
  const apartmentIsFavorite = favoriteApartmentsCtx.ids.includes(apartment._id);

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
                name={apartmentIsFavorite ? "heart" : "heart-outline"}
                size={22}
                color={isDarkMode ? "#fff" : "#000"}
                onPress={changeFavoriteStatusHandler}
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
  }, [navigation, isDarkMode, changeFavoriteStatusHandler]);

  const { data: ownerData, isLoading } = useQuery({
    queryKey: ["chats", ouid],
    queryFn: () => fetchChats(ouid),
  });

  const { data: studentData, isLoading: studentDataIsLoading } = useQuery({
    queryKey: ["chats", userData.id],
    queryFn: () => getUser(userData.id),
  });

  const userChats = studentData?.data?.chats;
  const foundObject = userChats?.find((chat) => chat?.userID === ouid);
  chatId = foundObject?.chatID;

  function interestedHandler() {
    navigation.goBack();
    navigation.navigate("ChatStackScreen", {
      screen: "ChatScreen",
      params: {
        firstChat,
        chatId,
        templateMessage,
        ouid,
        pushToken: ownerData?.data?.pushToken,
        image: ownerData?.data?.avatar?.url,
        title: `${ownerData?.data?.firstName} ${ownerData?.data?.lastName}`,
      },
    });
  }

  function changeFavoriteStatusHandler() {
    if (apartmentIsFavorite) {
      favoriteApartmentsCtx.removeFavorite(apartment._id);
    } else {
      favoriteApartmentsCtx.addFavorite(apartment._id);
    }
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
    if (prevRoute.params.favorite) {
      navigation.pop();
      navigation.navigate("FavoritesScreen");
    } else {
      navigation.goBack();
    }
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
              data={apartment.images}
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
          <Text style={styles.city}>{city}</Text>
          <Text style={styles.street}>
            {street} {apartment?.address?.buildingNumber}/
            {apartment?.address?.apartmentNumber}
          </Text>
          {userData.token && !prevRoute?.params?.favorite && (
            <Text style={styles.distance}>
              {t("houseDetails.distance", {
                distance: apartment?.distance,
                academic: userData?.academic,
              })}
            </Text>
          )}
          <HouseRoommates
            totalCapacity={apartment.totalCapacity}
            realTimeCapacity={apartment.realTimeCapacity}
          />
          <Text style={styles.about}>{t("houseDetails.about")}</Text>
          <Paragraph>{apartment.about}</Paragraph>
          <HouseInfo
            numberOfRooms={apartment.numberOfRooms}
            floor={apartment.floor}
            totalCapacity={apartment.totalCapacity}
          />
          <Map
            handleMapPress={handleMapPress}
            apartment={apartment}
            coordinates={coordinates}
            zoomEnabled={false}
            scrollEnabled={false}
          />
          {mapPress && (
            <MapModal
              handleMapPress={handleMapPress}
              coordinates={coordinates}
              apartment={apartment}
            />
          )}
          <Seperator />
          <HouseAssets
            handleShowAllPress={handleShowAllPress}
            apartmentContent={apartment.apartmentContent}
          />
          {showAll && (
            <HouseAssetsModal
              handleShowAllPress={handleShowAllPress}
              apartmentContent={apartmentContent}
            />
          )}
          <Seperator />
          {apartment.tenants && (
            <Text style={styles.about}>{t("houseDetails.currentTenants")}</Text>
          )}
          {userData.token ? (
            apartment?.tenants?.map((tenant) => (
              <RoommatesInfo key={tenant} tenant={tenant} />
            ))
          ) : (
            <TouchableWithoutFeedback
              style={
                isDarkMode
                  ? {
                      ...styles.customView,
                      backgroundColor: Color.defaultTheme,
                    }
                  : styles.customView
              }
            >
              <Text
                style={
                  isDarkMode
                    ? { ...styles.customText, color: Color.darkTheme }
                    : styles.customText
                }
              >
                {t("houseDetails.loginToViewTenants")}
              </Text>
            </TouchableWithoutFeedback>
          )}
          <View style={{ height: tabBarHeight - 20 }}></View>
        </View>
      </Animated.ScrollView>

      <Animated.View
        style={[styles.BottomTab, { marginBottom: tabBarHeight }]}
        entering={SlideInDown.delay(400)}
      >
        <View style={styles.BottomTabView}>
          <View style={styles.PriceView}>
            <Text style={styles.price}>
              {currency?.symbol || apartment?.currency?.symbol}
              {convertCurrency(
                apartment?.currency?.currency,
                currency?.code,
                apartment?.price
              )}
            </Text>
            <Text style={styles.monthPerson}>
              {t("houseDetails.monthPerson")}
            </Text>
          </View>
          {userData?.token && !isLoading && !studentDataIsLoading && (
            <TouchableOpacity
              style={styles.ReserveBtn}
              onPress={interestedHandler}
            >
              <Text style={styles.BtnText}>{t("houseDetails.interested")}</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

export default HouseDetailsScreen;

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
    fontSize: 40,
    fontWeight: "bold",
  },
  street: {
    fontSize: 25,
    marginTop: Platform.OS === "android" ? -5 : 0,
    fontWeight: "bold",
  },
  distance: {
    fontSize: 15,
  },
  about: {
    fontSize: 25,
    fontWeight: "bold",
  },
  customView: {
    marginTop: 25,
    padding: 20,
    backgroundColor: Color.darkTheme,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  customText: {
    color: Color.defaultTheme,
    fontSize: 18,
    fontWeight: "bold",
  },
  footerText: {
    height: "100%",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  footerPrice: {
    fontSize: 18,
  },
  BottomTab: {
    height: 60,
    borderTopWidth: 1,
    borderColor: "black",
  },
  BottomTabView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
  },
  PriceView: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  price: {
    fontSize: 35,
    fontWeight: "bold",
  },
  monthPerson: {
    marginHorizontal: 5,
  },
  ReserveBtn: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#9ADE7B",
    borderRadius: 10,
  },
  BtnText: {
    color: "white",
    fontWeight: "bold",
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

  description: {
    fontSize: 16,
    marginTop: 10,
  },
});
