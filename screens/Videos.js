import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Button,
  Modal,
} from "react-native";
import Video from "react-native-video";
import Slider from '@react-native-community/slider';
import Icon from "react-native-vector-icons/Ionicons";
import SystemNavigationBar from "react-native-system-navigation-bar";
import { useDimensions, useDeviceOrientation } from "@react-native-community/hooks";
import {
  // Orientation,
  PORTRAIT,
  LANDSCAPE,
} from "react-native-orientation-locker";
import Orientation from "react-native-orientation-locker";
import { LogBox } from "react-native";

// ------------------------T-------------TO DO---------------------------------------------------:
// 2) Build video player UI [] (Get time of playback and build seekbar)

export default Videos = ({ route }) => {
  const video = require("../Its-A-Show-4.mp4");
  const height = Dimensions.get("screen").height;
  const width = Dimensions.get("screen").width;
  const [paused, setPaused] = useState(false);
  const [ref, setRef] = useState();
  const [vidPlayer, setPlayer] = useState();
  const [fullscreen, setFullscreen] = useState()
  const [controlsVisible, setControlsVisible] = useState(false)
  const [initializing, setInitializing] = useState(true)
  const iconSize = Dimensions.get("screen").height / 20
  const orientation = useDeviceOrientation();
  const handleFullscreen = async () => {
    if (orientation.landscape === true) {
      setFullscreen(true)
      StatusBar.setHidden(true)
    }
    if (orientation.portrait === true) {
      setFullscreen(false)
      StatusBar.setHidden(false)
    }
  }
  const handleShowControls = () => {
    clearTimeout(this.timer);
    setControlsVisible(true)
    this.timer = setTimeout(() => {
      setControlsVisible(false)
    }, 2000)
  }

  useEffect(() => {
    LogBox.ignoreLogs(["Animated: `useNativeDriver`"]);
    load();
    handleFullscreen();
  }, [orientation]);


  const handlePlay = () => {
    setPaused(!paused);
  };
  const handleForward10 = () => {
    ref.seek(vidPlayer.currentTime + 10);
  };
  const handleBackward10 = () => {
    ref.seek(vidPlayer.currentTime - 10);
  };

  const load = () => {
    if (initializing) setInitializing(false);
  }

  return (
    <>
      {initializing ? <></> : <View style={styles.container}>
        <View
          style={{
            flex: 1,
            position: fullscreen ? "absolute" : "relative",
            height: fullscreen ? height : height / 3,
            width: "100%",
          }}
        >
          <TouchableOpacity style={{
            flex: 1,
            backgroundColor: "green",
            justifyContent: 'center',
          }}
            onPress={handleShowControls} >
            <Video
              ref={(ref) => {
                setRef(ref);
              }}
              onReadyForDisplay={(player) => {
                setPlayer(player);
              }}
              onProgress={(player) => {
                setPlayer(player);
              }}
              onSeek={(player) => {
                setPlayer(player);
              }}
              bufferConfig={{
                minBufferMs: 15000,
                maxBufferMs: 50000,
                bufferForPlaybackMs: 2500,
                bufferForPlaybackAfterRebufferMs: 5000,
              }}
              source={video}
              paused={paused}
              fullscreenOrientation="landscape"
              resizeMode={fullscreen ? "cover" : "contain"}
              style={styles.backgroundVideo}
            />
            {controlsVisible ? <View style={{
              position: "absolute",
              flex: 1,
              width: "100%",
              height: "100%",
              justifyContent: 'center',
              alignSelf: "center",
            }}>
              <View style={{
                position: "absolute",
                flex: 1,
                flexDirection: 'row',
                width: "60%",
                height: "30%",
                justifyContent: 'center',
                alignSelf: "center",
              }} >
                <TouchableOpacity style={styles.ivb} onPress={() => {
                  handleShowControls();
                  handleBackward10();
                }} >
                  <Icon name={"ios-play-back"} size={iconSize} color={"white"} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.ivb} onPress={() => {
                  handleShowControls();
                  handlePlay();
                }} >
                  {!paused ? <Icon name={"ios-pause"} size={iconSize} color={"white"} /> : <Icon name={"ios-play"} size={iconSize} color={"white"} />}
                </TouchableOpacity>
                <TouchableOpacity style={styles.ivb} onPress={() => {
                  handleShowControls();
                  handleForward10();
                }} >
                  <Icon name={"ios-play-forward"} size={iconSize} color={"white"} />
                </TouchableOpacity>
              </View>
              <Slider
                style={{ position: "absolute", bottom: "3%", width: "100%", height: 40 }}
                minimumValue={0}
                maximumValue={vidPlayer.seekableDuration}
                value={vidPlayer.currentTime}
                onSlidingStart={() => {
                  setPaused(true)
                  clearTimeout(this.timer)
                  setControlsVisible(true)
                }}
                onSlidingComplete={(value) => {
                  ref.seek(value)
                  handleShowControls();
                  setPaused(false)
                }}
                thumbTintColor="#53e639"
                minimumTrackTintColor="#53e639"
                maximumTrackTintColor="#FFFFFF"
              />
              <View />
            </View> : <></>}
          </TouchableOpacity>
        </View>
        <View style={{ flex: 2 }}>
          {initializing ? <Text>{toString(paused)}</Text> : <></>}
          <Text> {JSON.stringify(vidPlayer)}</Text>
        </View>
      </View>}
    </>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "orange",
    justifyContent: "center",
  },
  button: {},
  ivb: {
    position: "relative",
    padding: '5%',
    marginHorizontal: '5%',
    alignSelf: "center"
  },
  backgroundVideo: {
    display: "flex",
    flex: 1,
  },
});
