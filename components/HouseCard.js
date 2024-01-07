import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";

const HouseCard = () => {
  return (
    <View style={styles.card}>
      <Image
        source={require("../assets/images/house.jpg")}
        style={styles.image}
      />
      <View style={styles.detailsContainer}>
        <View style={styles.addressContainer}>
          <Text style={styles.city}>Beer Sheva</Text>
          <Text style={styles.street}>Avigdor hameiri 21/3</Text>
        </View>
        <Text style={styles.price}>1000$</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
    margin: 10,
    borderColor: "#ccc",
    borderWidth: 1, // You can adjust the width of the border as needed

    elevation: 3,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },
  addressContainer: {
    flex: 1,
  },
  city: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  street: {
    fontSize: 16,
    marginBottom: 5,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2ecc71",
  },
});

export default HouseCard;
