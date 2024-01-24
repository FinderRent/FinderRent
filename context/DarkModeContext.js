import { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

const DarkModeContext = createContext();

function DarkModeProvider({ children }) {
  const colorSchema = useColorScheme();

  const darkMode = colorSchema === "dark" ? true : false;

  const [isDarkMode, setIsDarkMode] = useState(darkMode);
  const [theme, setTheme] = useState("SystemDefault");

  useEffect(() => {
    const fetchDarkMode = async () => {
      try {
        const appTheme = await AsyncStorage.getItem("appTheme");
        const isDarkMode = await AsyncStorage.getItem("darkMode");
        if (isDarkMode !== null) {
          setIsDarkMode(JSON.parse(isDarkMode));
        }
        if (appTheme !== null) {
          handleTheme(JSON.parse(appTheme));
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchDarkMode();
  }, [theme, colorSchema]);

  const toggleDarkMode = async (isDark) => {
    setIsDarkMode(isDark);

    try {
      await AsyncStorage.setItem("darkMode", JSON.stringify(isDark));
      setIsDarkMode(isDark);
    } catch (err) {
      console.log(err);
    }
  };

  const handleTheme = async (theme) => {
    try {
      await AsyncStorage.setItem("appTheme", JSON.stringify(theme));
      setTheme(theme);
    } catch (err) {
      console.log(err);
    }
    switch (theme) {
      case "SystemDefault":
        if (colorSchema === "dark") {
          setTheme("SystemDefault");
          toggleDarkMode(true);
        } else {
          setTheme("SystemDefault");
          toggleDarkMode(false);
        }
        break;
      case "Bright":
        setTheme("Bright");
        toggleDarkMode(false);
        break;
      case "Dark":
        setTheme("Dark");
        toggleDarkMode(true);
        break;
      default:
        break;
    }
  };

  return (
    <DarkModeContext.Provider
      value={{ isDarkMode, toggleDarkMode, theme, handleTheme }}
    >
      {children}
    </DarkModeContext.Provider>
  );
}

function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined)
    throw new Error("DarkModeContext was used outside of DarkModeProvider");
  return context;
}

export { DarkModeProvider, useDarkMode };
