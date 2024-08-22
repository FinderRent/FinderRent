import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DarkModeContext = createContext();

const STORAGE_KEY = {
  THEME: "appTheme",
  DARK_MODE: "darkMode",
};

function DarkModeProvider({ children }) {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === "dark");
  const [theme, setTheme] = useState("SystemDefault");

  useEffect(() => {
    const fetchDarkMode = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(STORAGE_KEY.THEME);
        if (storedTheme) {
          const parsedTheme = JSON.parse(storedTheme);
          setTheme(parsedTheme);
          if (parsedTheme !== "SystemDefault") {
            const storedDarkMode = await AsyncStorage.getItem(
              STORAGE_KEY.DARK_MODE
            );
            setIsDarkMode(
              storedDarkMode
                ? JSON.parse(storedDarkMode)
                : colorScheme === "dark"
            );
          }
        }
      } catch (err) {
        console.error("Error fetching dark mode:", err);
      }
    };

    fetchDarkMode();
  }, [colorScheme]);

  const toggleDarkMode = useCallback(async (isDark) => {
    setIsDarkMode(isDark);
    try {
      await AsyncStorage.setItem(STORAGE_KEY.DARK_MODE, JSON.stringify(isDark));
    } catch (err) {
      console.error("Error setting dark mode:", err);
    }
  }, []);

  const handleTheme = useCallback(
    async (newTheme) => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY.THEME, JSON.stringify(newTheme));
        setTheme(newTheme);

        switch (newTheme) {
          case "SystemDefault":
            toggleDarkMode(colorScheme === "dark");
            break;
          case "Bright":
            toggleDarkMode(false);
            break;
          case "Dark":
            toggleDarkMode(true);
            break;
        }
      } catch (err) {
        console.error("Error handling theme:", err);
      }
    },
    [colorScheme, toggleDarkMode]
  );

  const contextValue = useMemo(
    () => ({
      isDarkMode,
      toggleDarkMode,
      theme,
      handleTheme,
    }),
    [isDarkMode, toggleDarkMode, theme, handleTheme]
  );

  return (
    <DarkModeContext.Provider value={contextValue}>
      {children}
    </DarkModeContext.Provider>
  );
}

function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
}

export { DarkModeProvider, useDarkMode };
