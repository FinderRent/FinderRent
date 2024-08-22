import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CurrencyContext = createContext();

function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState({});

  useEffect(() => {
    const initializeCurrency = async () => {
      try {
        const currencyString = await AsyncStorage.getItem("currency");
        if (currencyString) {
          const storedCurrency = JSON.parse(currencyString);
          setCurrency(storedCurrency);
        }
      } catch (error) {
        console.error("Error initializing currency:", error);
      }
    };
    initializeCurrency();
  }, []); // Remove currency dependency

  const updateCurrency = useCallback(async (newCurrency) => {
    try {
      await AsyncStorage.setItem("currency", JSON.stringify(newCurrency));
      setCurrency(newCurrency);
    } catch (error) {
      console.error("Error updating currency:", error);
    }
  }, []);

  const value = useMemo(
    () => ({ currency, updateCurrency }),
    [currency, updateCurrency]
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}

export { CurrencyProvider, useCurrency };
