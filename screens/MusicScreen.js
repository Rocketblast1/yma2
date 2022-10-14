import React, { useState, useEffect, useRef, useContext } from "react";
import { Button, StyleSheet, View, ImageBackground, } from "react-native";
import TrackPlayer, { State, useProgress } from 'react-native-track-player';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { TrackContext } from "../component/trackContext";
import useQueue from "../hooks/useQueue";
import SongLst from "../component/SongLst";
import PlayerControls from "../component/PlayerControls";

export default MusicScreen = ({ navigation }) => {
    const [queuedSongs, updateTrackQueue] = useQueue()
    const [initializing, setInitializing] = useState(true)
    const isSetup = useRef(false)
    const Player = useContext(TrackContext)
    const setUpTrackPlayer = async () => {
        try {
            await Player.setupPlayer().then(() => {
                isSetup.current = true;
                setInitializing(false)
            });
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        if (!isSetup.current) {
            setUpTrackPlayer();
        }
        setInitializing(false)
        return () => {
            isSetup.current = false
            Player.destroy()
        }
    }, [isSetup])

    if (initializing) {
        return (<View style={{ flex: 1, backgroundColor: "red" }}>
        </View>)
    }

    return (
        <ImageBackground
            resizeMode="cover"
            source={{ uri: "https://picsum.photos/500" }}
            style={styles.body}
            blurRadius={6}>
            {/* Queue */}
            <View style={styles.queueContainer}>
                {queuedSongs ? (<SongLst songs={queuedSongs} update={updateTrackQueue} />) : (<></>)}
            </View>
            <Button title="Browse Music" onPress={() => {
                navigation.navigate("BrowseScreen", { updateTrackQueue })
            }} />
            <Button title="Browse Music" onPress={() => {
                navigation.navigate("BrowseScreen", { updateTrackQueue })
            }} />
            <PlayerControls Player={Player} />
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
