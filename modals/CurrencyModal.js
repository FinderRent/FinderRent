import { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Modal,
  View,
  Pressable,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";
import { useCurrency } from "../context/CurrencyContext";

const CurrencyModal = ({ showVisible, handleCurrencyChange }) => {
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();
  const { currency, updateCurrency } = useCurrency();

  const [visible, setVisible] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState(currency);

  const currencyList = [
    {
      code: "",
      symbol: "",
      name: "   " + t("Default"),
      flag: "",
    },
    {
      code: "USD",
      symbol: "$",
      name: t("USDollar"),
      flag: require("../assets/images/usa.png"),
    },
    {
      code: "ILS",
      symbol: "₪",
      name: t("IsraeliShekel"),
      flag: require("../assets/images/israel.png"),
    },
    {
      code: "EUR",
      symbol: "€",
      name: t("Euro"),
      flag: require("../assets/images/eu.jpg"),
    },
  ];
  const handleCurrencySelect = async (newCurrency) => {
    setSelectedCurrency(newCurrency);
    const currencyString = JSON.stringify(newCurrency);
    await AsyncStorage.setItem("currency", currencyString);
    handleCurrencyChange(newCurrency.code);
    updateCurrency(newCurrency);
  };

  const handleCancel = () => {
    showVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal visible={visible} onRequestClose={handleCancel} transparent={true}>
        <View
          style={
            isDarkMode
              ? { ...styles.modalContent, backgroundColor: Color.darkTheme }
              : styles.modalContent
          }
        >
          <Pressable onPress={handleCancel} style={styles.closeButton}>
            <Image
              source={require("../assets/images/close.png")}
              style={styles.closeIcon}
            />
          </Pressable>
          <FlatList
            data={currencyList}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.currencyItem,
                  selectedCurrency?.code === item.code && [
                    styles.selectedCurrency,
                    isDarkMode && { backgroundColor: Color.Blue900 },
                  ],
                ]}
                onPress={() => handleCurrencySelect(item)}
              >
                {selectedCurrency?.code === item.code && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={isDarkMode ? Color.Blue10 : Color.Blue500}
                    style={styles.checkmarkIcon}
                  />
                )}

                <Image source={item.flag} style={styles.currencyFlag} />
                <Text style={styles.currencySymbol}>{item.symbol}</Text>
                <Text style={styles.currencyName}>
                  {item.name} {item.code ? `(${item.code})` : ""}
                </Text>
              </TouchableOpacity>
            )}
          />
          <View style={styles.confirmation}>
            <TouchableOpacity onPress={() => showVisible(false)}>
              <Text
                style={{
                  color: Color.Blue500,
                  fontSize: 23,
                  marginBottom: 10,
                }}
              >
                {t("confirm")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CurrencyModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: Color.white,
    padding: 30,
    paddingTop: "25%",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  closeIcon: {
    height: 35,
    width: 35,
  },
  currencyItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomColor: Color.gray,
    borderBottomWidth: 1,
  },
  selectedCurrency: {
    backgroundColor: Color.Blue10,
  },
  currencyFlag: {
    width: 25,
    height: 15,
    marginRight: 12,
  },
  currencySymbol: {
    fontSize: 18,
    marginRight: 12,
  },
  currencyName: {
    fontSize: 16,
  },
  checkmarkIcon: {
    position: "absolute",
    bottom: "50%",
    right: 10,
  },
  confirmation: {
    flexDirection: "row",
    marginTop: 100,
    justifyContent: "flex-end",
  },
});
