import React, { useState, useEffect } from "react";
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

export default function BrowseScreen({trackPlayerInstance}) {
    const songs = [{id: 1, name: "Song 1"}, {id: 2, name: "Song 2"}]
    //Store songs array
    useEffect(() => {
        //get firebase info and store it into array
      return () => {

    }
    }, [])
const handleAddSong = () => {

}

  return (
    <ScrollView
    style={{}}
    nestedScrollEnabled
    contentContainerStyle={styles.ccs}
>
    {songs.map((item, index) => (
        <Card title={item.name} onPress={handleAddSong(index)}/>
    ))}
</ScrollView>
  );
}
const styles = StyleSheet.create({
    body: {
        flex: 1,
        justifyContent: "flex-start",
        backgroundColor: "#9cf18e",

    },
    ccs: {
        backgroundColor: "#53e639",
    },
    closeModal: {
        height: 100,
        width: 100,
        backgroundColor: "red"
    },
    playerButton: {
        height: 50,
        padding: 10,
    },
    playerControlsContainer: {
        flex: 1,
        filter: "blur",
    },
    playerTimerText: {
        fontSize: 15,
        flex: 0,
    },
    songContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-evenly",
        backgroundColor: "#53e639",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 100,
            height: 100,
        },
        shadowOpacity: 0.001,
        shadowRadius: 100,
        elevation: 15,
        // height: Dimensions.get("screen").height / 10,
        // width: Dimensions.get("screen").height / 22.2,
        borderRadius: Dimensions.get("screen").height / 20 / 6,
    },
    songImage: {
        flexDirection: "row",
        justifyContent: "center",
        marginHorizontal: 5,
        height: Dimensions.get("screen").height / 15,
        width: Dimensions.get("screen").height / 15,
        borderRadius: Dimensions.get("screen").height / 25 / 4,
    },
    songText: {
        flexGrow: 1,
        height: Dimensions.get("screen").height / 15,
        width: Dimensions.get("screen").height / 15,
        alignItems: "center",
        justifyContent: "center"
    },
    songButtonContainer: {
        marginHorizontal: 3,
        flex: 1,
        justifyContent: "space-evenly",
        flexDirection: "row"
    },

    queueContainer: {
        flex: 2,
        maxHeight: "65%"
    }
});
