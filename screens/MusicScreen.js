import React, { useState, useEffect, useRef, useContext } from "react";
import { Button, StyleSheet, View, ImageBackground, Text, } from "react-native";
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { TrackContext,  } from "../component/trackContext";
import useQueue from "../hooks/useQueue";
import SongLst from "../component/SongLst";
import PlayerControls from "../component/PlayerControls";

export default MusicScreen = ({ navigation }) => {
    const [queuedSongs, updateTrackQueue, currentTrack] = useQueue()
    // const [initializing, setInitializing] = useState(true)
    // const isSetup = useRef(false)
    const Player = useContext(TrackContext)
    // const setUpTrackPlayer = async () => {
    //     try {
    //         await Player.setupPlayer().then(() => {
    //             isSetup.current = true;
    //             setInitializing(false)
    //         });
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }

    useEffect(() => {
        // if (!isSetup.current) {
        //     setUpTrackPlayer();
        // }
        // setInitializing(false)
        return () => {
            // isSetup.current = false
            // Player.destroy()
        }
    }, [currentTrack])

    // if (initializing) {
    //     return (<View style={{ flex: 1, backgroundColor: "red" }}>
    //     </View>)
    // }

    const RefreshImgBg = (props) => {
        return(
            <ImageBackground >
                {props.children}
            </ImageBackground>
        )
    }

    return (
        <ImageBackground
            resizeMode="cover"
            source={{uri: "https://forms.gle/BY7X15tYrHU3pJWaA"}}
            style={styles.body}
            onLayout={() => {
              
            }}
            blurRadius={6}>
            {/* Queue */}
            <View style={styles.queueContainer}>
                {queuedSongs ? (<SongLst songs={queuedSongs} update={updateTrackQueue} />) : (<></>)}
            </View>
            <Text>
                {JSON.stringify(currentTrack)}
            </Text>
            <PlayerControls Player={Player} />
            <Button title="Browse Music" onPress={() => {
                navigation.navigate("BrowseScreen", { updateTrackQueue })
            }} />
        </ImageBackground>
    )
};

const styles = StyleSheet.create({
    body: {
        flex: 1,
        justifyContent: "flex-start",
        backgroundColor: "#9cf18e",
    },
    queueContainer: {
        flex: 2,
        maxHeight: "65%"
    }
});
