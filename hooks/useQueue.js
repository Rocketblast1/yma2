import TrackPlayer, { State, useProgress } from 'react-native-track-player';
import React, { useState, useEffect, useRef } from "react";

export default useQueue = () => {
    // const queue = useRef([])
    const [queue, setQueue] = useState([]);

    const updateTrackQueue = async () => {
        // queue.current = (await TrackPlayer.getQueue())
        setQueue(await TrackPlayer.getQueue())
    }

    // return [queue.current, updateTrackQueue]
    return [queue, updateTrackQueue]

}

