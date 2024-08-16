import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Card } from "react-native-paper";
import { useTranslation } from "react-i18next";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { useDarkMode } from "../../context/DarkModeContext";
import { Color } from "../../constants/colors";

const LandlordHouseCard = ({ navigation, apartment }) => {
  const { isDarkMode } = useDarkMode();
  const { t } = useTranslation();

  return (
    <Card
      style={[
        styles.card,
        isDarkMode && { backgroundColor: Color.buttomSheetDarkTheme },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() =>
          navigation.navigate("LandlordHouseDetailsScreen", { apartment })
        }
      >
        <View style={styles.contentContainer}>
          <Card.Cover
            source={{ uri: apartment.images[0] }}
            style={styles.image}
          />
          <View style={styles.detailsContainer}>
            <View style={styles.addressContainer}>
              <Text style={styles.city}>{apartment.address.city}</Text>
              <Text style={styles.street} numberOfLines={1}>
                {apartment.address.street} {apartment.address.buildingNumber}/
                {apartment.address.apartmentNumber}
              </Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.price}>₪{apartment.price}</Text>
              <View style={styles.typeAndRooms}>
                <View style={styles.iconTextContainer}>
                  <Icon
                    name="home-variant-outline"
                    size={16}
                    color={Color.extraGray}
                  />
                  <Text style={styles.infoText}>
                    {t(apartment?.apartmentType)}
                  </Text>
                </View>
                <View style={styles.iconTextContainer}>
                  <Icon name="door" size={16} color={Color.extraGray} />
                  <Text style={styles.infoText}>
                    {apartment?.numberOfRooms} {t("rooms")}
                  </Text>
                </View>
                <View style={styles.iconTextContainer}>
                  <Icon
                    name="account-group-outline"
                    size={16}
                    color={Color.extraGray}
                  />
                  <Text style={styles.infoText}>
                    {t("capacity")}: {apartment?.realTimeCapacity}/
                    {apartment?.totalCapacity}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: Color.defaultTheme,
    borderColor: Color.red500,
    // borderRightWidth: 3,
    borderBottomWidth: 3,
    // borderTopWidth: 3,
  },
  contentContainer: {
    flexDirection: "row",
    height: 120,
  },
  image: {
    width: 120,
    height: 120,
    marginLeft: -2,
  },
  detailsContainer: {
    flex: 1,
    padding: 8,
    justifyContent: "space-between",
  },
  addressContainer: {
    flex: 1,
  },
  city: {
    fontSize: 19,
    fontWeight: "bold",
  },
  street: {
    fontSize: 14,
    color: Color.extraGray,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  price: {
    fontSize: 19,
    fontWeight: "bold",
    // color: Color.green100,
  },
  typeAndRooms: {
    alignItems: "flex-end",
  },
  iconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  infoText: {
    fontSize: 12,
    color: Color.extraGray,
    marginLeft: 4,
  },
});

export default LandlordHouseCard;
