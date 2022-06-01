import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, View, Text, TouchableOpacity, Modal } from "react-native";
import SignIn from "../screens/Signin";
import SignUp from "../screens/Signup";

const Stack = createStackNavigator();

export default ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Signin" component={SignIn} />
      <Stack.Screen name="Signup" component={SignUp} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({});
