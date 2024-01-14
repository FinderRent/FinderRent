import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { SlideInDown } from "react-native-reanimated";
import { SliderBox } from "react-native-image-slider-box";
import HouseInfo from "../components/House/HouseInfo";
import { Paragraph, Text } from "react-native-paper";
import Map from "../components/Map/Map";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import MapModal from "../modals/MapModal";
import HouseRoommates from "../components/House/HouseRoommates";
import Seperator from "../components/Seperator";
import HouseAssets from "../components/House/HouseAssets";
import HouseAssetsModal from "../modals/HouseAssetsModal";
import RoommatesInfo from "../components/House/RoommatesInfo";

const DetailPage = ({ navigation, route }) => {
  const [mapPress, setMapPress] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const images = [
    "https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/home-improvement/wp-content/uploads/2022/07/download-23.jpg",
    "https://www.bhg.com/thmb/3Vf9GXp3T-adDlU6tKpTbb-AEyE=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/white-modern-house-curved-patio-archway-c0a4a3b3-aa51b24d14d0464ea15d36e05aa85ac9.jpg",
    "https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/home-improvement/wp-content/uploads/2022/07/download-23.jpg",
  ];

  const Assets = [
    {
      name: "TV",
    },
    {
      name: "Balcony",
    },
    {
      name: "Beds",
    },
    {
      name: "Wifi",
    },
    {
      name: "Oven",
    },
    {
      name: "Microwave",
    },
    {
      name: "Couch",
    },
    {
      name: "Coffee Table",
    },
    {
      name: "Water Heater",
    },
    {
      name: "Washer",
    },
    {
      name: "Dryer",
    },
    {
      name: "Iron",
    },
    {
      name: "Refrigirator",
    },
    {
      name: "freezer",
    },
  ];

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

  const tabBarHeight = useBottomTabBarHeight();

  const handleMapPress = () => {
    setMapPress(!mapPress);
  };
  const handleShowAllPress = () => {
    setShowAll(!showAll);
  };

  return (
    <View style={{ flex: 1 }}>
      <Animated.ScrollView style={{ marginBottom: 10 }}>
        <View style={styles.images}>
          <SliderBox images={images} sliderBoxHeight={"100%"} />
        </View>
        <View style={styles.houseInfo}>
          <Text style={styles.city}>Beer Sheva</Text>
          <Text style={styles.street}>Avigdor hameiri 21/3</Text>
          <Text style={styles.distance}>
            2 kilometers away from SCE College
          </Text>
          <HouseRoommates />
          <Text style={styles.about}>About</Text>
          <Paragraph>{ParagraphDeatails}</Paragraph>
          <HouseInfo />
          {/* <Map
            handleMapPress={handleMapPress}
            zoomEnabled={false}
            scrollEnabled={false}
          />
          {mapPress && <MapModal handleMapPress={handleMapPress} />} */}
          <Seperator />
          <HouseAssets
            handleShowAllPress={handleShowAllPress}
            Assets={Assets}
          />
          {showAll && (
            <HouseAssetsModal
              handleMapPress={handleShowAllPress}
              Assets={Assets}
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
            <Text style={styles.price}>1000$</Text>
            <Text style={styles.monthPerson}>Month / Person</Text>
          </View>
          <TouchableOpacity style={styles.ReserveBtn}>
            <Text style={styles.BtnText}>Reserve</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default DetailPage;

const styles = StyleSheet.create({
  images: {
    height: 300,
    marginBottom: 10,
  },
  houseInfo: {
    flex: 1,
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#9ADE7B",
    borderRadius: 10,
  },
  BtnText: {
    color: "white",
    fontWeight: "bold",
  },
});
