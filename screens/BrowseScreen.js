import React, { useState, useEffect, useContext } from "react";
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Button,
} from "react-native";
import Card from "../component/card";
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { TrackContext } from "../component/trackContext";
import useQueue from "../hooks/useQueue";


export default function BrowseScreen({route}) {
    const Player = useContext(TrackContext)
    const [initializing, setInitializing] = useState(true)
    const {updateTrackQueue} = route.params
    const [songs, setSongs] = useState([]);
    // const songs = []
    //Store songs array
    useEffect(() => {
        //get firebase info and store it into array
        const subscriber = firestore()
            .collection('Songs')
            .onSnapshot((querySnapshot) => {
                try {
                    querySnapshot.forEach(documentSnapshot => {
                        songs.push({
                            ...documentSnapshot.data(),
                            key: documentSnapshot.id,
                        })

                    });
                } catch (e) {
                    console.log(e)
                } finally {
                    console.log(songs)
                    setInitializing(false)
                }
            });
        return () => {
            subscriber();
        }
    }, [])

    const handleAddSong = async (title, filename, artwork) => {
        let song = {
            id: new Date().valueOf(),
            url: "",
            title: title,
            artwork: { uri: "" }
        }
        try {
            await storage().ref(filename).getDownloadURL().then((url) => {
                song.url = url

            })
            await storage().ref(artwork).getDownloadURL().then((url) => {
                song.artwork.uri = url
            })
        } catch (e) {
            console.log(e)
        }
        await Player.add(song).then(async () => {
            await updateTrackQueue()
        })
    }

    if (initializing) {
        return (<View style={{ flex: 1, backgroundColor: "#53e639" }}>
        </View>)
    }

    return (
        <ScrollView
            style={{}}
            nestedScrollEnabled
            contentContainerStyle={styles.ccs}
        >
            {songs.map((item, index) => (
                <Button key={index} title={item.title} onPress={async () => {
                    handleAddSong(item.title, item.filename, item.artwork)
                }} />
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
