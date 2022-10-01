import TrackPlayer, { State, useProgress } from 'react-native-track-player';
import React, { useState, useEffect, useRef } from "react";

export default useQueue = () => {
    // const [queuedSongs, setQueuedSongs] = useState([])
    const queue = useRef([])

    const updateTrackQueue = async () => {
        //  setQueuedSongs(await TrackPlayer.getQueue())
         queue.current = (await TrackPlayer.getQueue())
         console.log(queue.current)
    }

    return [queue.current, updateTrackQueue]
}

