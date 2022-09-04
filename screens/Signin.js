import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Button,
  Keyboard,
} from "react-native";
import auth from "@react-native-firebase/auth";
import { Formik } from "formik";
import * as Yup from "yup";

export default Signin = ({ navigation }) => {

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, [user]);

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  const signOut = () => {
    auth().signOut();
  };

  if (initializing) return null;

  if (user) {
    return (<Text>
      Logged In
    </Text>)
  }

  if (!user) {
    return (
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values) => {
          try {
            auth().signInWithEmailAndPassword(values.email, values.password)
          } catch (e) {
            console.log(e);
          }

          // .catch((error) => {
          //   console.log(error.message);
          // });
        }}

      >
        {({
          handleChange,
          handleBlur,
          setTouched,
          handleSubmit,
          values,
          errors,
          touched,
          dirty,
          errorCode,
          errorMessage,
        }) => (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              <TextInput
                style={styles.signupTextInput}
                placeholder={"Email"}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                onPress={setTouched.email}
                value={values.email}
              />
              <Text>{touched.email ? errors.email : ""}</Text>

              <TextInput
                style={styles.signupTextInput}
                placeholder={"Password"}
                secureTextEntry={true}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                onPress={setTouched.password}
                value={values.password}
              />
              <Text>{touched.password ? errors.password : ""}</Text>

              <Button
                style={styles.signupButton}
                title={"Submit"}
                disabled={!dirty}
                onPress={handleSubmit}
              />
              <Text style={styles.profileText}>
                Dont have an account?{" "}
                <Text
                  style={{ color: "blue" }}
                  onPress={() => {
                    navigation.navigate("Signup");
                  }}
                >
                  Sign Up
                </Text>
              </Text>
            </View>
          </TouchableWithoutFeedback>
        )}
      </Formik>
    );
  }
  //Screen to show when the user is logged in
  return (
    <View>
      <Text> Welcome {user.email} </Text>
      <Button title={"Sign Out"} onPress={signOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "grey",
    padding: 20,
    justifyContent: "center",
  },
  signupTextInput: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#67ff4d",
    color: "black",
    padding: 10,
    borderColor: "transparent",
    borderRadius: 13,
    flexDirection: "row",
    borderWidth: 2,
    width: "100%",
    height: 45,
  },
  error: {
    color: "red",
    alignSelf: "center",
  },
  buttonContainer: {
    marginTop: 10,
    borderRadius: 10,
  },
  profileText: {
    marginTop: 10,
    alignSelf: "center",
  },
  signupButton: {
    marginTop: 10,
    flex: 1,
    flexDirection: "row",
  },
});
