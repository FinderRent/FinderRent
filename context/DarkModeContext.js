import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const DarkModeContext = createContext();

function DarkModeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchDarkMode = async () => {
      try {
        const isDarkMode = await AsyncStorage.getItem('darkMode');
        if (isDarkMode !== null) {
          setIsDarkMode(JSON.parse(isDarkMode));
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchDarkMode();
  }, []);

  async function toggleDarkMode() {
    try {
      const isDark = !isDarkMode;
      await AsyncStorage.setItem('darkMode', JSON.stringify(isDark));
      setIsDarkMode(isDark);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined)
    throw new Error('DarkModeContext was used outside of DarkModeProvider');
  return context;
}

export { DarkModeProvider, useDarkMode };
