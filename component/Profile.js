import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Modal } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
export default Profile = ({ navigation, auth }) => {
  return (
    <TouchableOpacity
      style={styles.icon}
      onPress={() => {
        // navigation.navigate("Profile");
        auth().signOut()
      }}
    >
      <Icon name={"person-outline"} size={25} color={"white"} />
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
