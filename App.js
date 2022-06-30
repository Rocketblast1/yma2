import React, { useState, useEffect } from "react";
import "react-native-gesture-handler"
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Dimensions,
  Button,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  LogBox,
} from "react-native";
import { useDimensions, useDeviceOrientation } from "@react-native-community/hooks";
LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
]);

//Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";

//Firebase
import auth from "@react-native-firebase/auth";

//Screens
import Menu from "./component/menu";
import Nav from "./component/navBar";
import Videos from "./screens/Videos";
import Music from "./screens/Music";
import Profile from "./component/Profile";
import HomeStack from "./stacks/HomeStack";
import LOGIN_SIGNUP_STACK from "./stacks/ProfileStack";
const SubsciberContext = React.createContext();



export default App = () => {
  const Drawer = createDrawerNavigator();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [fullscreen, setFullscreen] = useState();
  const { width, height } = useDimensions().screen
  const orientation = useDeviceOrientation()
  const handleFullscreen = async () => {
    if (orientation.landscape === true) {
      setFullscreen(true)
      StatusBar.setHidden(true)
    } 
    if(orientation.portrait === true){
      setFullscreen(false)
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    handleFullscreen();
    return subscriber; // unsubscribe on unmount
  }, [orientation]);

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  //Loading Screen
  if (initializing) return <ActivityIndicator size="large" color="#53e639" />;

  //Login Navigator
  if (!user)
    return (
      <NavigationContainer style={{}}>
        <LOGIN_SIGNUP_STACK />
      </NavigationContainer>
    );

  return (
    <>
      <NavigationContainer style={{ flex: 1, height: height, width: width }}>
        <StatusBar
          animated={true}
          backgroundColor={"#53e639"}
        />
        <Drawer.Navigator
          screenOptions={({ navigation }) => ({
            headerShown: !fullscreen,
            initialRouteName: "Home",
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#53e639",
              height: 40,
            },
            drawerStyle: {
              backgroundColor: "#53e639",
            },
            drawerContentOptions: {
              activeTintColor: "#8eff7a",
              itemStyle: {
                marginTop: 10,
                justifyContent: "center",
              },
              labelStyle: {
                fontSize: 25,
                color: "white",
              },
            },
            headerLeft: () => <Menu navigation={navigation} />,
            headerTitle: () => <Nav navigation={navigation} />,
            headerRight: () => (
              <Profile navigation={navigation} auth={auth} />
            ),
          })}
          headerMode="screen"
        >
          {/* <Drawer.Screen name="Home" component={HomeStack} /> */}
          <Drawer.Screen name="Music" component={Music} />
          {/* <Drawer.Screen name="Videos" component={Videos} initialParams={{ fullscreen: fullscreen }} /> */}
          {/* <Drawer.Screen name="Profile" component={ProfileStack} /> */}
        </Drawer.Navigator>
      </NavigationContainer>
    </>
  );
};

const styles = StyleSheet.create({
  loginpage: {
    display: "flex",
    flex: 1,
    backgroundColor: "#53e639",
  },
  signupTextInput: {
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    borderColor: "black",
    flexDirection: "row",
    borderWidth: 2,
    width: "100%",
    height: 45,
  },
  button: {},
  signupButton: {
    marginTop: 10,
  },
});

