import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SliderBox } from "react-native-image-slider-box";
import HouseInfo from "../components/House/HouseInfo";
import { Paragraph } from "react-native-paper";
import { Color } from "../constants/colors";
import Carousel from "react-native-reanimated-carousel";
import Map from "../components/Map/Map";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import MapModal from "../modals/MapModal";
import HouseRoommates from "../components/House/HouseRoommates";
const DetailPage = ({ navigation, route }) => {
  const [mapPress, setMapPress] = useState(false);
  const images = [
    "https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/home-improvement/wp-content/uploads/2022/07/download-23.jpg",
    "https://www.bhg.com/thmb/3Vf9GXp3T-adDlU6tKpTbb-AEyE=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/white-modern-house-curved-patio-archway-c0a4a3b3-aa51b24d14d0464ea15d36e05aa85ac9.jpg",
    "https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/home-improvement/wp-content/uploads/2022/07/download-23.jpg",
  ];
  const ParagraphDeatails =
    "Discover the perfect three-bedroom rental nestled in a tranquil suburban setting. This charming house features an open-concept living area with ample natural light, a modern kitchen, and a master bedroom with an en-suite bathroom. Enjoy the peaceful backyard with a patio and fire pit. Conveniently located near parks and shopping, this home offers both comfort and convenience for your lifestyle.";

  const tabBarHeight = useBottomTabBarHeight();

  const handleMapPress = () => {
    setMapPress(!mapPress);
  };

  return (
    <ScrollView style={{ marginBottom: tabBarHeight }}>
      <View style={styles.images}>
        <SliderBox images={images} sliderBoxHeight={"100%"} />
      </View>
      <View style={styles.houseInfo}>
        <Text style={styles.price}>1000$</Text>
        <Text style={styles.city}>Beer Sheva</Text>
        <Text style={styles.street}>Avigdor hameiri 21/3</Text>
        <Text style={styles.distance}>2 kilometers away from SCE College</Text>
        <HouseRoommates />
        <Text style={styles.about}>About</Text>
        <Paragraph>{ParagraphDeatails}</Paragraph>
        <HouseInfo />
        <Map
          handleMapPress={handleMapPress}
          zoomEnabled={false}
          scrollEnabled={false}
        />
        {mapPress && <MapModal handleMapPress={handleMapPress} />}
      </View>
    </ScrollView>
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
  price: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#65B741",
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
    // color: Color.gray,
  },
  distance: {
    fontSize: 20,
    color: "#65B741",
  },
  about: {
    fontSize: 25,
    fontWeight: "bold",
  },
});
