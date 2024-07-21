import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, Button } from "react-native-paper";
import FavoritesContextProvider, {
  FavoritesContext,
} from "../../context/FavoritesContext";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe("FavoritesContextProvider", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should load favorites from AsyncStorage on mount", async () => {
    const mockFavorites = ["1", "2"];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockFavorites));

    const { getByTestId } = render(
      <FavoritesContextProvider userId="user1">
        <FavoritesContext.Consumer>
          {(value) => <Text testID="favoritesCount">{value.ids.length}</Text>}
        </FavoritesContext.Consumer>
      </FavoritesContextProvider>
    );

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(
        "favoriteApartments_user1"
      );
      expect(getByTestId("favoritesCount").props.children).toBe(
        mockFavorites.length
      );
    });
  });

  it("should add a favorite and save it to AsyncStorage", async () => {
    const mockFavorites = ["1"];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockFavorites));

    const { getByTestId } = render(
      <FavoritesContextProvider userId="user1">
        <FavoritesContext.Consumer>
          {(value) => (
            <>
              <Text testID="favoritesCount">{value.ids.length}</Text>
              <Button
                testID="addFavorite"
                onPress={() => value.addFavorite("2")}
              >
                Add Favorite
              </Button>
            </>
          )}
        </FavoritesContext.Consumer>
      </FavoritesContextProvider>
    );

    await waitFor(() => {
      expect(getByTestId("favoritesCount").props.children).toBe(
        mockFavorites.length
      );
    });

    const addFavoriteButton = getByTestId("addFavorite");
    fireEvent.press(addFavoriteButton);

    await waitFor(() => {
      expect(getByTestId("favoritesCount").props.children).toBe(2);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "favoriteApartments_user1",
        JSON.stringify(["1", "2"])
      );
    });
  });

  it("should remove a favorite and save it to AsyncStorage", async () => {
    const mockFavorites = ["1", "2"];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockFavorites));

    const { getByTestId } = render(
      <FavoritesContextProvider userId="user1">
        <FavoritesContext.Consumer>
          {(value) => (
            <>
              <Text testID="favoritesCount">{value.ids.length}</Text>
              <Button
                testID="removeFavorite"
                onPress={() => value.removeFavorite("1")}
              >
                Remove Favorite
              </Button>
            </>
          )}
        </FavoritesContext.Consumer>
      </FavoritesContextProvider>
    );

    await waitFor(() => {
      expect(getByTestId("favoritesCount").props.children).toBe(
        mockFavorites.length
      );
    });

    const removeFavoriteButton = getByTestId("removeFavorite");
    fireEvent.press(removeFavoriteButton);

    await waitFor(() => {
      expect(getByTestId("favoritesCount").props.children).toBe(1);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "favoriteApartments_user1",
        JSON.stringify(["2"])
      );
    });
  });
});
