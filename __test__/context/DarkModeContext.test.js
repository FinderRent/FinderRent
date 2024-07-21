import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, Button, useColorScheme } from "react-native";
import { DarkModeProvider, useDarkMode } from "../../context/DarkModeContext";

// Mock the SettingsManager native module
jest.mock("react-native/Libraries/Settings/Settings", () => ({
  SettingsManager: {
    settings: {},
    setValues: jest.fn(),
  },
  Settings: {
    settings: {},
    setValues: jest.fn(),
  },
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock("react-native", () => ({
  ...jest.requireActual("react-native"),
  useColorScheme: jest.fn(),
}));

const DarkModeConsumerComponent = () => {
  const { isDarkMode, toggleDarkMode, theme, handleTheme } = useDarkMode();

  return (
    <>
      <Text testID="isDarkMode">{isDarkMode ? "true" : "false"}</Text>
      <Text testID="theme">{theme}</Text>
      <Button
        testID="toggleDarkMode"
        onPress={() => toggleDarkMode(!isDarkMode)}
        title="Toggle Dark Mode"
      />
      <Button
        testID="handleThemeBright"
        onPress={() => handleTheme("Bright")}
        title="Bright Theme"
      />
      <Button
        testID="handleThemeDark"
        onPress={() => handleTheme("Dark")}
        title="Dark Theme"
      />
      <Button
        testID="handleThemeSystem"
        onPress={() => handleTheme("SystemDefault")}
        title="System Default Theme"
      />
    </>
  );
};

describe("DarkModeProvider", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should initialize with system default theme and dark mode based on color scheme", async () => {
    useColorScheme.mockReturnValue("dark");

    const { getByTestId } = render(
      <DarkModeProvider>
        <DarkModeConsumerComponent />
      </DarkModeProvider>
    );

    await waitFor(() => {
      expect(getByTestId("isDarkMode").props.children).toBe("true");
      expect(getByTestId("theme").props.children).toBe("SystemDefault");
    });
  });

  test("should toggle dark mode and save to AsyncStorage", async () => {
    const { getByTestId } = render(
      <DarkModeProvider>
        <DarkModeConsumerComponent />
      </DarkModeProvider>
    );

    const toggleDarkModeButton = getByTestId("toggleDarkMode");
    fireEvent.press(toggleDarkModeButton);

    await waitFor(() => {
      expect(getByTestId("isDarkMode").props.children).toBe("false");
      expect(AsyncStorage.setItem).toHaveBeenCalledWith("darkMode", "false");
    });

    fireEvent.press(toggleDarkModeButton);

    await waitFor(() => {
      expect(getByTestId("isDarkMode").props.children).toBe("true");
      expect(AsyncStorage.setItem).toHaveBeenCalledWith("darkMode", "true");
    });
  });

  test("should handle theme changes and save to AsyncStorage", async () => {
    useColorScheme.mockReturnValue("light");

    const { getByTestId } = render(
      <DarkModeProvider>
        <DarkModeConsumerComponent />
      </DarkModeProvider>
    );

    const handleThemeBrightButton = getByTestId("handleThemeBright");
    fireEvent.press(handleThemeBrightButton);

    await waitFor(() => {
      expect(getByTestId("theme").props.children).toBe("Bright");
      expect(getByTestId("isDarkMode").props.children).toBe("false");
      expect(AsyncStorage.setItem).toHaveBeenCalledWith("appTheme", '"Bright"');
    });

    const handleThemeDarkButton = getByTestId("handleThemeDark");
    fireEvent.press(handleThemeDarkButton);

    await waitFor(() => {
      expect(getByTestId("theme").props.children).toBe("Dark");
      expect(getByTestId("isDarkMode").props.children).toBe("true");
      expect(AsyncStorage.setItem).toHaveBeenCalledWith("appTheme", '"Dark"');
    });

    const handleThemeSystemButton = getByTestId("handleThemeSystem");
    fireEvent.press(handleThemeSystemButton);

    await waitFor(() => {
      expect(getByTestId("theme").props.children).toBe("SystemDefault");
      expect(getByTestId("isDarkMode").props.children).toBe("false");
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "appTheme",
        '"SystemDefault"'
      );
    });
  });

  test("should load dark mode and theme from AsyncStorage on mount", async () => {
    AsyncStorage.getItem.mockImplementation((key) => {
      if (key === "appTheme") {
        return Promise.resolve('"Dark"');
      }
      return Promise.resolve(null);
    });

    const { getByTestId } = render(
      <DarkModeProvider>
        <DarkModeConsumerComponent />
      </DarkModeProvider>
    );

    await waitFor(() => {
      expect(getByTestId("theme").props.children).toBe("Dark");
      expect(getByTestId("isDarkMode").props.children).toBe("true");
      expect(AsyncStorage.getItem).toHaveBeenCalledWith("appTheme");
    });
  });
});
