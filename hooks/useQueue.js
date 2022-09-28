import TrackPlayer, { State, useProgress } from 'react-native-track-player';
import React, { useState, useEffect } from "react";

export default useQueue = () => {
    const [queuedSongs, setQueuedSongs] = useState([])

    const updateTrackQueue = async () => {
         setQueuedSongs(await TrackPlayer.getQueue())
    }

    return [queuedSongs, updateTrackQueue]
}

