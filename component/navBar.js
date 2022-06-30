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
        source={require("../assets/YM_Logo-White.png")}
        ImageResizeMode={"contain"}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignSelf: "center",
    paddingHorizontal: 10,
  },
  logo: {
    position: "relative",
    height: 30,
    width: 60,
  },
});
