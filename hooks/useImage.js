import TrackPlayer, { State, useProgress } from 'react-native-track-player';
import React, { useState, useEffect, useRef } from "react";

export default useTrack = () => {
    const [track, setTrack] = useState({
        id: "",
        url: "",
        title: title,
        artwork: { uri: "" }
    });

    
    const updateTrack = async () => {
        setTrack(await TrackPlayer.getCurrentTrack())
    }

    return {track, }

}