import * as React from "react";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, View, Text, TouchableOpacity, Modal } from "react-native";
import MusicScreen from "../screens/MusicScreen";
import BrowseScreen from "../screens/BrowseScreen";



const Stack = createStackNavigator();

const config = {
    animation: 'spring',
    config: {
        stiffness: 1000,
        damping: 50,
        mass: 3,
        overshootClamping: false,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
    }
}

export default MusicStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: "vertical",
        transitionSpec: {
            open: config,
            close: config,
        },
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
      }}
    >
      <Stack.Screen name="MusicScreen" component={MusicScreen} />
      <Stack.Screen name="BrowseScreen" component={BrowseScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({

});
