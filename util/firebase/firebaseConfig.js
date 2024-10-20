import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyArIeA-KcGpSpmz0qFryuo_Kla8QqPiqz0",
  authDomain: "diplomski-elfak-react-native.firebaseapp.com",
  projectId: "diplomski-elfak-react-native",
  storageBucket: "diplomski-elfak-react-native.appspot.com",
  messagingSenderId: "327757589419",
  appId: "1:327757589419:web:9aa15a0e295d9bc7f1c0ee",
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, firestore, storage };
