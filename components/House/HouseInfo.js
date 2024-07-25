import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { useTranslation } from "react-i18next";

const HouseInfo = (props) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.innerInfo}>
        <Text style={styles.numberInfo}>{props.numberOfRooms}</Text>
        <Text style={styles.headerInfo}>{t("rooms")}</Text>
      </View>
      <View style={styles.line}></View>
      <View style={styles.innerInfo}>
        <Text style={styles.numberInfo}>{props.floor}</Text>
        <Text style={styles.headerInfo}>{t("floor")}</Text>
      </View>
      <View style={styles.line}></View>
      <View style={styles.innerInfo}>
        <Text style={styles.numberInfo}>{props.totalCapacity}</Text>
        <Text style={styles.headerInfo}>{t("roommates")}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 15,
    height: 75,
    marginVertical: 10,
    flexDirection: "row",
  },
  innerInfo: {
    flex: 1,
    margin: 4,
    flexDirection: "col",
    marginVertical: 10,
  },
  numberInfo: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerInfo: {
    textAlign: "center",
  },
  line: {
    borderWidth: 1,
    margin: 8,
    borderColor: "#ccc",
  },
});

export default HouseInfo;
