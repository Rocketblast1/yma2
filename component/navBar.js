import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";

export default function navBar({ navigation }) {
  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../greenhousekamehamehastill.png")}
        ImageResizeMode={"stretch"}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignSelf: "center",
    padding: 10,
  },
  logo: {
    position: "relative",
    height: 20,
    width: 200
  },
});

//really the yung men app logo title
