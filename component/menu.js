import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Modal } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default menu = ({ navigation }) => {
  return (
    <TouchableOpacity
      style={styles.icon}
      onPress={() => {
        navigation.openDrawer();
      }}
    >
      <Icon name={"menu"} size={30} color={"white"} />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  icon: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    top: "0%",
    flex: 1,
    marginHorizontal: 20,
  },
});
