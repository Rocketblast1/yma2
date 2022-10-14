import React, { useState } from "react";
import { TouchableOpacity, Text, View, StyleSheet} from "react-native";
import { State, useProgress } from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import IonIcon from "react-native-vector-icons/Ionicons";
const iconSize = 30;
export default PlayerControls = ({ Player }) => {
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

const styles = StyleSheet.create({
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
})