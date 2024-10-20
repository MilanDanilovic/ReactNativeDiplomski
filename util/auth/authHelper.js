import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../firebase/firebaseConfig";

export async function registerUser(email, password) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;
  await AsyncStorage.setItem("user", JSON.stringify(user)); // Save user in AsyncStorage
  return user;
}

export async function loginUser(email, password) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;
  await AsyncStorage.setItem("user", JSON.stringify(user)); // Save user in AsyncStorage
  return user;
}

export async function logoutUser() {
  await signOut(auth);
  await AsyncStorage.removeItem("user"); // Clear user from AsyncStorage
}

export async function getStoredUser() {
  const user = await AsyncStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}
