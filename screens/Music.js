import React, { useState, useEffect } from "react";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    Dimensions,
    Button,
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    LogBox,
} from "react-native";
import TrackPlayer, { State, useProgress } from 'react-native-track-player';
// import { 
// 	auth as SpotifyAuth, 
// 	remote as SpotifyRemote, 
// 	ApiScope, 
// 	ApiConfig
// } from 'react-native-spotify-remote';
const tracks = [
    {
        id: 1,
        url: require("../tracks/front.wav"),
        title: "FRONT"
    },
    {
        id: 2,
        url: require("../tracks/otg.wav"),
        title: "OTG"
    },
]
// const spotifyConfig = {
// 	clientID: "SPOTIFY_CLIENT_ID",
// 	redirectURL: "SPOTIFY_REDIRECT_URL",
// 	tokenRefreshURL: "SPOTIFY_TOKEN_REFRESH_URL",
// 	tokenSwapURL: "SPOTIFY_TOKEN_SWAP_URL",
// 	scopes: [ApiScope.AppRemoteControlScope, ApiScope.UserFollowReadScope]
// }

const SongLst = ({ songs }) => {
    return (
        <ScrollView
            style={styles.scrollList}
            nestedScrollEnabled
            contentContainerStyle={styles.ccs}
        >
            {songs.map((item, index) => (
                <TouchableOpacity key={index}>
                    <View style={styles.songBackground}>
                        <View style={styles.songCenter}>
                            <Text
                                style={{
                                    flex: 1,
                                    alignSelf: 'center',
                                    fontSize: 20
                                }}
                            >
                                {item.title}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

// ------------------------TODO:

export default Music = () => {
    const { position, buffered, duration } = useProgress()
    const [songs, setSongs] = useState();
    const setUpTrackPlayer = async () => {
        try {
            await TrackPlayer.setupPlayer();
            await TrackPlayer.add(tracks);
            setSongs(await TrackPlayer.getQueue())
        } catch (e) {
            console.log(e)
        }
    }
    

    useEffect(() => {
        setUpTrackPlayer();
        return () => TrackPlayer.destroy()
    }, [])

    return (
        <View style={{ flex: 1, alignContent: "center", justifyContent: "center" }}>
            <View style={{ alignSelf: "center", justifyContent: "center" }}>
                <Text>
                    {position}
                </Text>
                <Text>
                    {duration}
                </Text>
                <TouchableOpacity style={{ backgroundColor: "red", width: "100%", height: 50 }} onPress={() => {
                    TrackPlayer.play();
                }} >
                    <Text> Play </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: "red", width: "100%", height: 50 }} onPress={() => {
                    TrackPlayer.pause();
                }} >
                    <Text> Pause </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: "red", width: "100%", height: 50 }} onPress={() => {
                    TrackPlayer.skipToNext();
                }}>
                    <Text> Next Track </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: "red", width: "100%", height: 50 }} onPress={() => TrackPlayer.seekTo(0)} onLongPress={() => TrackPlayer.skipToPrevious()} >
                    <Text>Rewind / Previous Track </Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    {songs ? (<SongLst songs={songs} />) : (<></>)}
                </View>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    ccs: {
        backgroundColor: "green",
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
        borderRadius: Dimensions.get("screen").height / 20 / 6,
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
