import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import axios from "axios";

const apiKey = "AIzaSyDYInyCvJ1WQjqJohhMx2OnxioXWAvy39s";
const baseUrl = "https://maps.googleapis.com/maps/api/place/textsearch/json";

export const fetchInstitutions = async (country, language) => {
  console.log(country);
  let results = [];
  let nextPageToken = null;
  let firstRequest = true;

  do {
    const url = firstRequest
      ? `${baseUrl}?query=universities+and+colleges+in+${country}&language=${language}&key=${apiKey}`
      : `${baseUrl}?pagetoken=${nextPageToken}&key=${apiKey}`;

    firstRequest = false;

    try {
      const response = await axios.get(url);
      results = [...results, ...response.data.results];

      nextPageToken = response.data.next_page_token;

      // If the next_page_token is not immediately available, wait for a short period
      if (nextPageToken) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      break;
    }
  } while (nextPageToken);

  return results.map((institution) => ({
    name: institution.name,
    address: institution.formatted_address,
    photo: institution.photos
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${institution.photos[0].photo_reference}&key=${apiKey}`
      : null,
    coordinates: {
      lat: institution.geometry.location.lat,
      lng: institution.geometry.location.lng,
    },
  }));
};

const AcademicApi = () => {
  const [institutions, setInstitutions] = useState([]);

  useEffect(() => {
    const getInstitutions = async () => {
      const country = "Israel";
      const institutionsInEnglish = await fetchInstitutions(country, "en");
      setInstitutions(institutionsInEnglish);
    };
    getInstitutions();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.name}</Text>
      <Text>{item.address}</Text>
      {item.photo && (
        <Image source={{ uri: item.photo }} style={styles.image} />
      )}
      <Text>
        Coordinates: {item.coordinates.lat}, {item.coordinates.lng}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={institutions}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  item: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 200,
    marginTop: 8,
  },
});

export default AcademicApi;
