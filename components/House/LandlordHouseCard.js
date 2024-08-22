import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Card } from "react-native-paper";
import { useTranslation } from "react-i18next";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { useDarkMode } from "../../context/DarkModeContext";
import { Color } from "../../constants/colors";
import { convertCurrency, iconName } from "../../utils/features";
import { useCurrency } from "../../context/CurrencyContext";

const LandlordHouseCard = ({ navigation, apartment }) => {
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();
  const { currency } = useCurrency();

  return (
    <Card
      style={[
        styles.card,
        isDarkMode && {
          backgroundColor: Color.buttomSheetDarkTheme,
          borderColor: Color.Blue500,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() =>
          navigation.navigate("LandlordHouseDetailsScreen", {
            apartment,
          })
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
              <Text style={styles.price}>
                {currency?.symbol || apartment?.currency?.symbol}
                {convertCurrency(
                  apartment?.currency?.currency,
                  currency?.code,
                  apartment?.price
                )}
              </Text>
              <View style={styles.typeAndRooms}>
                <View style={styles.iconTextContainer}>
                  <Icon
                    name={iconName(apartment?.apartmentType)}
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
    backgroundColor: Color.white,
    borderColor: Color.Blue100,
    // borderRightWidth: 3,
    borderBottomWidth: 3,
    // borderTopWidth: 3,
  },
  contentContainer: {
    flexDirection: "row",
    height: 100,
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 2,
    marginLeft: 10,
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
    fontSize: 18,
    fontWeight: "bold",
  },
  street: {
    fontSize: 13,
    color: Color.extraGray,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  price: {
    fontSize: 17,
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
    fontSize: 11,
    color: Color.extraGray,
    marginLeft: 4,
  },
});

export default LandlordHouseCard;
