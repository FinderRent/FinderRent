import { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
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
import { Paragraph, Text } from "react-native-paper";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import { FavoritesContext } from "../context/FavoritesContext";
import { useUsers } from "../context/UserContext";
import HouseAssetsModal from "../modals/HouseAssetsModal";
import MapModal from "../modals/MapModal";
import Map from "../components/Map/Map";
import HouseInfo from "../components/House/HouseInfo";
import HouseRoommates from "../components/House/HouseRoommates";
import Seperator from "../components/Seperator";
import HouseAssets from "../components/House/HouseAssets";
import RoommatesInfo from "../components/House/RoommatesInfo";
import Loader from "../components/ui/Loader";
import fetchChats from "../api/chats/fetchChats";
import fetchChatsList from "../api/chats/fetchChatsList";

const IMG_HEIGHT = 300;
const { width } = Dimensions.get("window");

const Roommates = [
  {
    name: "Maor Saadia",
    avatar_url: "../assets/images/profile-cartoon.png",
    subtitle: "President",
  },
  {
    name: "Amir Fukman",
    avatar_url: "../assets/images/profile-cartoon.png",
    subtitle: "Vice President",
  },
];

const ParagraphDeatails =
  "Discover the perfect three-bedroom rental nestled in a tranquil suburban setting. This charming house features an open-concept living area with ample natural light, a modern kitchen, and a master bedroom with an en-suite bathroom. Enjoy the peaceful backyard with a patio and fire pit. Conveniently located near parks and shopping, this home offers both comfort and convenience for your lifestyle.";

const HouseDetailsScreen = ({ navigation, route }) => {
  const favoriteApartmentsCtx = useContext(FavoritesContext);
  const { isDarkMode } = useDarkMode();
  const { userData } = useUsers();

  const routes = navigation.getState()?.routes;
  const { apartment } = route.params;
  const prevRoute = routes[routes.length - 1];

  const scrollRef = useAnimatedRef();
  const tabBarHeight = useBottomTabBarHeight();

  let chatId = null;
  const ouid = apartment?.owner[0];
  const [mapPress, setMapPress] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [apartmentContent, setApartmentContent] = useState([]);
  const images = [
    "https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/home-improvement/wp-content/uploads/2022/07/download-23.jpg",
    "https://www.bhg.com/thmb/3Vf9GXp3T-adDlU6tKpTbb-AEyE=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/white-modern-house-curved-patio-archway-c0a4a3b3-aa51b24d14d0464ea15d36e05aa85ac9.jpg",
  ];
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

  const { data: userChatsList } = useQuery({
    queryKey: ["chatList", userData.id],
    queryFn: () => fetchChatsList(userData.id),
  });

  if (isLoading) {
    return <Loader />;
  }

  useEffect(() => {
    if (userChatsList && userChatsList.chat && userChatsList.chat.length > 0) {
      const chat = userChatsList.chat.find(
        (chat) =>
          chat.members.includes(userData.id) && chat.members.includes(ouid)
      );

      if (chat) {
        chatId = chat._id;
      } else {
        chatId = null;
      }
    }
  }, []);

  function interestedHandler() {
    navigation.navigate("ChatStackScreen", {
      screen: "ChatScreen",
      params: {
        chatId,
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
  const handleShowAllPress = (apartmentContent) => {
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
          <Text style={styles.city}>{apartment.address.city}</Text>
          <Text style={styles.street}>
            {apartment.address.street} {apartment.address.buildingNumber}/
            {apartment.address.apartmentNumber}
          </Text>
          <Text style={styles.distance}>
            {apartment.distanceFromAcademy} kilometers away from SCE College
          </Text>
          <HouseRoommates
            totalCapacity={apartment.totalCapacity}
            realTimeCapacity={apartment.realTimeCapacity}
          />
          <Text style={styles.about}>About</Text>
          <Paragraph>{apartment.about}</Paragraph>
          <HouseInfo
            numberOfRooms={apartment.numberOfRooms}
            floor={apartment.floor}
            totalCapacity={apartment.totalCapacity}
          />
          <Map
            handleMapPress={handleMapPress}
            zoomEnabled={false}
            scrollEnabled={false}
          />
          {mapPress && <MapModal handleMapPress={handleMapPress} />}
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
          <RoommatesInfo Roommates={Roommates} />
        </View>
      </Animated.ScrollView>

      <Animated.View
        style={[styles.BottomTab, { marginBottom: tabBarHeight }]}
        entering={SlideInDown.delay(200)}
      >
        <View style={styles.BottomTabView}>
          <View style={styles.PriceView}>
            <Text style={styles.price}>{apartment.price}$</Text>
            <Text style={styles.monthPerson}>Month / Person</Text>
          </View>
          {userData?.token && (
            <TouchableOpacity
              style={styles.ReserveBtn}
              onPress={interestedHandler}
            >
              <Text style={styles.BtnText}>Interested</Text>
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
