import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CurrencyContext = createContext();

function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState({});

  useEffect(() => {
    const initializeCurrency = async () => {
      const currencyString = await AsyncStorage.getItem("currency");
      if (currencyString) {
        const storedCurrency = JSON.parse(currencyString);
        setCurrency(storedCurrency);
      }
    };
    initializeCurrency();
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export default CurrencyProvider;

function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined)
    throw new Error("CurrencyContext was used outside of CurrencyProvider");
  return context;
}

export { CurrencyProvider, useCurrency };
