import React, { useState, useEffect, useRef, useContext, createContext } from "react";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    Dimensions,
    Button,
    Image,
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    FlatList,
    ImageBackground,
    Modal,
} from "react-native";
import TrackPlayer, { State, useProgress } from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import IonIcon from "react-native-vector-icons/Ionicons";
import FoundationIcon from "react-native-vector-icons/Foundation";
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { TrackContext } from "../component/trackContext";
import useQueue from "../hooks/useQueue";
const iconSize = 30;

const SongLst = ({ songs }) => {
    const Player = useContext(TrackContext)
    return (
        <FlatList
            data={songs}
            renderItem={({ item, index }) => (
                <TouchableOpacity key={index} style={{ margin: 10, }} activeOpacity={0.85} onPress={() => {
                    Player.skip(index)
                }}>
                    {/* Song Container */}
                    <View style={styles.songContainer}>
                        {/* Image */}
                        <Image style={styles.songImage} source={item.artwork} />
                        <View style={styles.songText}>
                            <Text>
                                {item.title}
                            </Text>
                        </View>
                        <View style={styles.songButtonContainer}>
                            <FoundationIcon name={"x"} size={iconSize} color={"white"} onPress={() => {
                                Player.remove(index)
                            }} />
                            <IonIcon name={"heart-outline"} size={iconSize} color={"white"} />
                        </View>
                    </View>
                </TouchableOpacity>
            )}
        />
    );
};

const PlayerControls = ({ Player }) => {
    const { position, buffered, duration } = useProgress()
    const [playing, setPlaying] = useState(false)
    const handlePlay = async () => {
        const state = await Player.getState();
        if (state === State.Playing) {
            setPlaying(false)
            Player.pause();
        };

        if (state === State.Paused) {
            setPlaying(true)
            Player.play();
        };
    }

    return (
        <View style={styles.playerControlsContainer}>
            <Slider
                style={{ height: 40, marginHorizontal: 40 }}
                maximumValue={duration}
                value={position}
                onSlidingStart={() => {
                    setPlaying(false)
                    Player.pause()
                }}
                step={0.01}
                onSlidingComplete={(value) => {
                    Player.seekTo(value)
                    setPlaying(true)
                    Player.play()
                }}
                thumbTintColor="#53e639"
                minimumTrackTintColor="#53e639"
                maximumTrackTintColor="#FFFFFF"
            />
            <View style={{
                flexDirection: "row",
                marginHorizontal: 40,
                justifyContent: "space-between"
            }}>
                <Text style={styles.playerTimerText}>
                    {new Date(Math.floor(position) * 1000).toISOString().substring(14, 19)}
                </Text>
                <Text style={styles.playerTimerText}>
                    {new Date(Math.floor(duration) * 1000).toISOString().substring(14, 19)}
                </Text>
            </View>
            {/* Player Controls */}
            <View style={{
                flex: 1,
                justifyContent: "space-evenly",
                flexDirection: "row"
            }}>
                {/* Rewind Button */}
                <TouchableOpacity activeOpacity={0.85} style={styles.playerButton} onPress={() => Player.seekTo(0)} onLongPress={() => Player.skipToPrevious()} >
                    <IonIcon name={"ios-play-back"} size={iconSize} color={"white"} />
                </TouchableOpacity>
                {/* Play Button */}
                <TouchableOpacity activeOpacity={0.85} style={styles.playerButton} onPress={handlePlay} >
                    {playing ? <IonIcon name={"ios-pause"} size={iconSize} color={"white"} /> : <IonIcon name={"ios-play"} size={iconSize} color={"white"} />}
                </TouchableOpacity>
                {/* Next Button */}
                <TouchableOpacity activeOpacity={0.85} style={styles.playerButton} onPress={() => {
                    Player.skipToNext();
                }}>
                    <IonIcon name={"ios-play-forward"} size={iconSize} color={"white"} />
                </TouchableOpacity>
            </View>
            <Slider
                style={{ height: 40, marginHorizontal: 40, }}
                value={0}
                step={0.01}
                onValueChange={(value) => {
                    Player.setVolume(value)
                }}
                thumbTintColor="#53e639"
                minimumTrackTintColor="#53e639"
                maximumTrackTintColor="#FFFFFF"
            />
            <View style={{
                flex: 1,
                justifyContent: "space-between",
                marginHorizontal: 40,
                flexDirection: "row"
            }}>
                {/* Volume Buttons */}
                <TouchableOpacity style={styles.playerButton}>
                    <IonIcon name={"ios-volume-off"} size={iconSize} color={"white"} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.playerButton} onPress={() => {
                }}>
                    <IonIcon name={"ios-volume-high"} size={iconSize} color={"white"} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

// ------------------------TODO:

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
    }, [isSetup, queuedSongs])

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
                {queuedSongs ? (<SongLst songs={queuedSongs} />) : (<></>)}
            </View>
            <Button title="Browse Music" onPress={() => {
                navigation.navigate("BrowseScreen", { queuedSongs, updateTrackQueue })
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
