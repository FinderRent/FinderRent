import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Modal,
  View,
  Pressable,
  Image,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Color } from "../constants/colors";
import { useDarkMode } from "../context/DarkModeContext";

const CurrencyModal = ({ showVisible }) => {
  const { isDarkMode } = useDarkMode();
  const { t } = useTranslation();

  const [visible, setVisible] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState(null);

  const currencyList = [
    {
      code: "USD",
      symbol: "$",
      name: "US Dollar",
      flag: require("../assets/images/usa.png"),
    },
    {
      code: "ILS",
      symbol: "₪",
      name: "Israeli Shekel",
      flag: require("../assets/images/israel.png"),
    },
    // { code: "EUR", symbol: "€", name: "Euro", flag: require("../assets/images/flags/eu.png") },
  ];

  const handleCancel = () => {
    showVisible(false);
  };

  const handleCurrencySelect = (currency) => {
    setSelectedCurrency(currency);
    // Perform any additional logic, such as updating the app's currency
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
                  selectedCurrency?.code === item.code &&
                    styles.selectedCurrency,
                ]}
                onPress={() => handleCurrencySelect(item)}
              >
                <Image source={item.flag} style={styles.currencyFlag} />
                <Text style={styles.currencySymbol}>{item.symbol}</Text>
                <Text style={styles.currencyName}>
                  {item.name} ({item.code})
                </Text>
              </TouchableOpacity>
            )}
          />
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
    backgroundColor: Color.Blue300,
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
});
