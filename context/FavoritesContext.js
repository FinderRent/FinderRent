import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const FavoritesContext = createContext({
  ids: [],
  addFavorite: (id) => {},
  removeFavorite: (id) => {},
});

function FavoritesContextProvider({ children, userId }) {
  const [favoriteApartmentIds, setFavoriteApartmentIds] = useState([]);

  // AsyncStorage.getAllKeys((err, keys) => {
  //   AsyncStorage.multiGet(keys, (error, stores) => {
  //     stores.map((result, i, store) => {
  //       console.log({ [store[i][0]]: store[i][1] });
  //       return true;
  //     });
  //   });
  // });

  useEffect(() => {
    // Function to load favorites for the current user
    const loadFavorites = async () => {
      try {
        const userFavoritesKey = `favoriteApartments_${userId}`;
        const storedFavorites = await AsyncStorage.getItem(userFavoritesKey);
        if (storedFavorites) {
          setFavoriteApartmentIds(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error("Failed to load favorite apartments from storage", error);
      }
    };

    loadFavorites();
  }, [userId]);

  useEffect(() => {
    // Function to save favorites for the current user
    const saveFavorites = async () => {
      try {
        const userFavoritesKey = `favoriteApartments_${userId}`;
        await AsyncStorage.setItem(
          userFavoritesKey,
          JSON.stringify(favoriteApartmentIds)
        );
      } catch (error) {
        console.error("Failed to save favorite apartments to storage", error);
      }
    };

    if (userId) {
      saveFavorites();
    }
  }, [favoriteApartmentIds, userId]);

  function addFavorite(id) {
    setFavoriteApartmentIds((currentFavIds) => [...currentFavIds, id]);
  }

  function removeFavorite(id) {
    setFavoriteApartmentIds((currentFavIds) =>
      currentFavIds.filter((apartmentId) => apartmentId !== id)
    );
  }

  const value = {
    ids: favoriteApartmentIds,
    addFavorite: addFavorite,
    removeFavorite: removeFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export default FavoritesContextProvider;
