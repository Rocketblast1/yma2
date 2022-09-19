import React, { useState, useEffect, useRef } from "react";
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
import 'react-native-get-random-values';

const iconSize = 30;

const SongLst = ({ songs }) => {
    return (
        <ScrollView
            style={{}}
            nestedScrollEnabled
            contentContainerStyle={styles.ccs}
        >
            {songs.map((item, index) => (
                <TouchableOpacity key={index} style={{ margin: 10, }} activeOpacity={0.85} onPress={() => {
                    TrackPlayer.skip(index)
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
                            <FoundationIcon name={"x"} size={iconSize} color={"white"} onPress={()=>{
                                TrackPlayer.remove(index)
                                songs.splice(index, 1)
                            }} />
                            <IonIcon name={"heart-outline"} size={iconSize} color={"white"} />
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

// ------------------------TODO:

export default MusicScreen = ({ navigation }) => {
    const { position, buffered, duration } = useProgress()
    const [queuedSongs, setQueuedSongs] = useState()
    const [initializing, setInitializing] = useState(true)
    const [playing, setPlaying] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [volume, setVolume] = useState()
    const isSetup = useRef(false)
    const [tracks, setTracks] = useState([])
    const [ltracks, setLTracks] = useState([])
    const queueSong = async (title, filename, artwork) => {
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
        await TrackPlayer.add(song)
        setQueuedSongs(await TrackPlayer.getQueue())
    }

    const setUpTrackPlayer = async () => {
        try {
            await TrackPlayer.setupPlayer();
            await TrackPlayer.add(tracks);
            setQueuedSongs(await TrackPlayer.getQueue())
            setVolume(TrackPlayer.getVolume())
        } catch (e) {
            console.log(e)
        }
        isSetup.current = true;
        setInitializing(false)
    }

    const handlePlay = async () => {
        const state = await TrackPlayer.getState();
        if (state === State.Playing) {
            setPlaying(false)
            TrackPlayer.pause();
        };

        if (state === State.Paused) {
            setPlaying(true)
            TrackPlayer.play();
        };
    }


    useEffect(() => {
        if (!isSetup.current) {
            setUpTrackPlayer();
        }
        const subscriber = firestore()
            .collection('Songs')
            .onSnapshot((querySnapshot) => {
                try {
                    querySnapshot.forEach(documentSnapshot => {
                        ltracks.push({
                            ...documentSnapshot.data(),
                            key: documentSnapshot.id,
                        });
                    });
                } catch (e) {
                    console.log(e)
                }
            });

        return () => {
            isSetup.current = false
            TrackPlayer.destroy()
            subscriber();
        }
    }, [isSetup, tracks])

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
                <View >
                    {/* Song Selection Area */}
                    <FlatList
                        data={ltracks}
                        horizontal={true}
                        renderItem={({ item }) => (
                            <Button onPress={async () => {
                                queueSong(item.title, item.filename, item.artwork)
                            }} title={item.title} style={{ height: 50, flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: "green" }}>
                            </Button>
                        )}
                    />
                </View>
                {queuedSongs ? (<SongLst songs={queuedSongs} />) : (<></>)}
            </View>
            <Button title="Browse Music" onPress={() => {
                navigation.navigate("BrowseScreen")
            }} />
            <View style={styles.playerControlsContainer}>
                <Slider
                    style={{ height: 40, marginHorizontal: 40 }}
                    maximumValue={duration}
                    value={position}
                    onSlidingStart={() => {
                        TrackPlayer.pause()
                    }}
                    step={0.01}
                    onSlidingComplete={(value) => {
                        TrackPlayer.seekTo(value)
                        TrackPlayer.play()
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
                    <TouchableOpacity activeOpacity={0.85} style={styles.playerButton} onPress={() => TrackPlayer.seekTo(0)} onLongPress={() => TrackPlayer.skipToPrevious()} >
                        <IonIcon name={"ios-play-back"} size={iconSize} color={"white"} />
                    </TouchableOpacity>
                    {/* Play Button */}
                    <TouchableOpacity activeOpacity={0.85} style={styles.playerButton} onPress={handlePlay} >
                        {playing ? <IonIcon name={"ios-pause"} size={iconSize} color={"white"} /> : <IonIcon name={"ios-play"} size={iconSize} color={"white"} />}
                    </TouchableOpacity>
                    {/* Next Button */}
                    <TouchableOpacity activeOpacity={0.85} style={styles.playerButton} onPress={() => {
                        TrackPlayer.skipToNext();
                    }}>
                        <IonIcon name={"ios-play-forward"} size={iconSize} color={"white"} />
                    </TouchableOpacity>
                </View>
                <Slider
                    style={{ height: 40, marginHorizontal: 40, }}
                    value={0}
                    step={0.01}
                    onValueChange={(value) => {
                        TrackPlayer.setVolume(value)
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
