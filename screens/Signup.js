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
import firestore from "@react-native-firebase/firestore";
import { Formik } from "formik";
import * as Yup from "yup";

export default Signup = ({navigation}) => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  const signOut = () => {
    auth().signOut();
  };

  if (initializing) return null;

  const loginEmailPassword = (email, password) => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        auth().signInWithEmailAndPassword(email, password);
        console.log("User account created & signed in!");
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          console.log("That email address is already in use!");
          console.log(error.code);
        } else if (error.code === "auth/invalid-email") {
          console.log("That email address is invalid!");
          console.log(error.code);
        } else {
          console.log(error.code)
        }
      });
  };
  const makeFsUser = async (uName, email) => {
    await firestore().collection("users").doc(`${uName}`).set({
      username: uName,
      email: email,
      firstTimeLogin: true,
    });
  };

  const ocap = RegExp(/(?=.*[A-Z])[A-Za-z\d@$!%*#?&\_\|\\]{8,}$/g);
  const osym = RegExp(/(?=.*[@$!%*#?&\_\|\\])[A-Za-z\d@$!%*#?&\_\|\\]{8,}$/g);
  const onum = RegExp(/(?=.*[\d])[A-Za-z\d@$!%*#?&\_\|\\]{8,}$/g);

  const SignupSchema = Yup.object().shape({
    username: Yup.string()
      .max(50, "Too Long!")
      .test("used-username", "Username is in use", async () => {
        return !(await firestore().collection("users").doc(username).get())
          .exists;
      })
      .required("Required"),
    email: Yup.string()
      .email("must be a valid email")
      .min(5, "Too Short!")
      .max(50, "Too Long!")
      .test("used-email", "Email is in use", async () => {
        return (
          await firestore()
            .collection("users")
            .where("email", "==", `${email}`)
            .get()
        ).empty;
      })
      .required("Required"),
    password: Yup.string()
      .min(8, "Must be at least 8 characters long")
      .matches(ocap, "Requires at least 1 capital")
      .matches(osym, "Requires at least 1 symbol")
      .matches(onum, "Requires at least 1 number")
      .required("Required"),
    confirmPass: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords Must Match")
      .required("Required"),
  });

  if (!user) {
    return (
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          confirmPass: "",
        }}
        validationSchema={SignupSchema}
        onSubmit={(values) => {
          loginEmailPassword(values.email, values.password);
          makeFsUser(values.username, values.email);
          auth().onAuthStateChanged(onAuthStateChanged);
        }}
      >
        {({
          handleChange,
          handleBlur,
          setFieldValue,
          setTouched,
          handleSubmit,
          values,
          errors,
          touched,
          isValid,
          dirty,
        }) => (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              <TextInput
                style={styles.signupTextInput}
                placeholder={"Username"}
                onChangeText={(e) => {
                  setUsername(e);
                  setFieldValue("username", e);
                }}
                onBlur={handleBlur("username")}
                onPress={setTouched.username}
              />
              <Text style={styles.error}>
                {touched.username ? errors.username : ""}
              </Text>

              <TextInput
                style={styles.signupTextInput}
                placeholder={"Email"}
                onChangeText={(e) => {
                  setEmail(e);
                  setFieldValue("email", e);
                }}
                onBlur={handleBlur("email")}
                onPress={setTouched.email}
              />
              <Text style={styles.error}>
                {touched.email ? errors.email : ""}
              </Text>

              <TextInput
                style={styles.signupTextInput}
                placeholder={"Password"}
                secureTextEntry={true}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                onPress={setTouched.password}
                value={values.password}
              />
              <Text style={styles.error}>
                {touched.password ? errors.password : ""}
              </Text>
              <TextInput
                style={styles.signupTextInput}
                placeholder={"Confirm Password"}
                secureTextEntry={true}
                onChangeText={handleChange("confirmPass")}
                onBlur={handleBlur("confirmPass")}
                onPress={setTouched.confirmPass}
                value={values.confirmPass}
              />
              <Text style={styles.error}>
                {touched.password ? errors.confirmPass : ""}
              </Text>
              <View style={styles.buttonContainer}>
                <Button
                  style={styles.signupButton}
                  title={"Submit"}
                  disabled={!isValid || !dirty }
                  onPress={handleSubmit}
                />
              </View>
              <Text style={styles.profileText}>
                Already have an account? {' '}
                <Text
                  style={{ color: "blue" }}
                  onPress={() => {
                    navigation.navigate("Signin");
                  }}
                >
                  Sign In
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
    <View style={styles.container}>
      <Text> Welcome {user.email} </Text>
      <Button title={"Sign Out"} onPress={signOut} />
    </View>
  );
};

const styles = {
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
    alignSelf: 'center'
  },
  buttonContainer: {
    marginTop: 10,
  },
  profileText:{
    marginTop: 10,
    alignSelf: 'center',
  },
  signupButton: {
    marginTop: 10,
    flex: 1,
    flexDirection: "row",
  },
}
