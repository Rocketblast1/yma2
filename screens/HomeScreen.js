import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Card from "../component/card";
// import Videos from "./videos";

export default function HomeScreen() {
  const [cards, setCards] = useState([
    {
      title: "Boom Box Bois",
      intro: "These bois just cant get enough of their anime",
      uri: require("../assets/gg.png"),
      key: "1",
    },
    {
      title: "Girl Problems",
      intro: "Why the bois need boi days",
      // uri: require("../assets/GreenhouseGaming.jpg"),
      key: "2",
    },
    {
      title: "Yung Men Lifestyle",
      intro: "Take an inside look at the Yung Men",
      uri: require("../assets/gg.png"),
      key: "3",
    },
  ]);


  return (
    <FlatList
      style={styles.scrollList}
      contentContainerStyle={styles.cc}
      data={cards}
      renderItem={({ item }) => (
        <View style={styles.tc}>
          <Card title={item.title} intro={item.intro} />
        </View>
      )}
    />
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollList: {
    backgroundColor: "violet",
  },
  songList: {
    backgroundColor: "brown",
    position: "relative",
  },
  cc: {
    backgroundColor: "blue",
  },
  ccs: {
    backgroundColor: "red",
  },
  tc: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "yellow",
  },
  text: {
    alignSelf: "center",
  },
  songBackground: {
    flex: 1,
    flexDirection: "column",
    margin: 10,
    backgroundColor: "orange",
    alignItems: "center",
    justifyContent: "center",
    height: Dimensions.get("screen").height / 22.2,
    width: Dimensions.get("screen").height / 22.2,
    borderRadius: Dimensions.get("screen").height / 20/ 6,
  },
  songCenter: {
    flex: 1,
    position: "relative",
    flexDirection: "column",
    backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center",
    height: Dimensions.get("screen").height / 20,
    width: Dimensions.get("screen").height / 20,
    borderRadius: Dimensions.get("screen").height / 25 / 4,
  },
});
