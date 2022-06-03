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
import Slider from '@react-native-community/slider';
import Icon from "react-native-vector-icons/Ionicons";
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
                <TouchableOpacity key={index} style={{margin: 10}} onPress={()=>{
                    TrackPlayer.skip(index)
                }}>
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
    const [playing, setPlaying] = useState(false)
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
        <View style={{ flex: 1, alignContent: "center", justifyContent: "center", backgroundColor: "pink", }}>
            <Text style={{ textAlign: "center" }}>
                {position}
            </Text>
            <Text style={{ textAlign: "center" }}>
                {duration}
            </Text>
            <Slider
                style={{ height: 40, marginHorizontal: 40 }}
                maximumValue={duration}
                value={position}
                onSlidingStart={()=>{
                    TrackPlayer.pause()
                }}
                onSlidingComplete={(value)=>{
                    TrackPlayer.play()
                    TrackPlayer.seekTo(value)
                }}
                thumbTintColor="#53e639"
                minimumTrackTintColor="#53e639"
                maximumTrackTintColor="#FFFFFF"
            />
            <View style={{ alignSelf: "center", justifyContent: "center", flexDirection: "row" }}>
                {/* Rewind Button */}
                <TouchableOpacity style={{ backgroundColor: "red", height: 50, padding: 10 }} onPress={() => TrackPlayer.seekTo(0)} onLongPress={() => TrackPlayer.skipToPrevious()} >
                    <Icon name={"ios-play-back"} size={25} color={"white"} />
                </TouchableOpacity>
                {/* Play Button */}
                <TouchableOpacity style={{ backgroundColor: "red", height: 50, padding: 10 }} onPress={async () => {
                    const state = await TrackPlayer.getState();
                    if (state === State.Playing) {
                        setPlaying(false)
                        TrackPlayer.pause();
                    };

                    if (state === State.Paused) {
                        setPlaying(true)
                        TrackPlayer.play();
                    };
                }} >
                    {playing ? <Icon name={"ios-pause"} size={25} color={"white"} /> : <Icon name={"ios-play"} size={25} color={"white"} />}
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: "red", height: 50, padding: 10 }} onPress={() => {
                    TrackPlayer.skipToNext();
                }}>
                    <Icon name={"ios-play-forward"} size={25} color={"white"} />
                </TouchableOpacity>

            </View>
            <View style={{ flex: 1 }}>
                {songs ? (<SongLst songs={songs} />) : (<></>)}
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
        marginVertical: 10,
        backgroundColor: "orange",
        alignItems: "center",
        justifyContent: "center",
        // height: Dimensions.get("screen").height / 10,
        // width: Dimensions.get("screen").height / 22.2,
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
        // width: Dimensions.get("screen").height / 20,
        borderRadius: Dimensions.get("screen").height / 25 / 4,
    },
});
