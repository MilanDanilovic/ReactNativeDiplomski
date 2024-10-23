import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { auth } from "./util/firebase/firebaseConfig"; // Firebase Auth config
import { onAuthStateChanged } from "firebase/auth";
import { logoutUser } from "./util/auth/authHelper";

import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

// Import screens
import AllPlaces from "./screens/AllPlaces";
import AddPlace from "./screens/AddPlace";
import IconButton from "./components/UI/IconButton";
import { Colors } from "./constants/colors";
import Map from "./screens/Map";
import PlaceDetails from "./screens/PlaceDetails";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import UserDetails from "./screens/UserDetails";
import MyProblems from "./screens/MyProblems";
import UsersList from "./screens/UsersList";
import EditProblemScreen from "./screens/EditProblemScreen";
import ProblemMapScreen from "./screens/ProblemMapScreen";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "#58D68D",
      accent: "#105238",
      background: "#f6f6f6",
      surface: "#ffffff",
      text: "#000000",
      placeholder: "#C1F3D3",
    },
  };

  // Check if user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser); // If authenticated, set user state
      setInitializing(false); // Set to false after check is done
    });

    return unsubscribe; // Clean up the listener on component unmount
  }, []);

  if (initializing) return null;

  const logoutHandler = async () => {
    try {
      await logoutUser();

      Alert.alert("Logout successful", "You have been logged out.");
    } catch (error) {
      Alert.alert("Logout failed", error.message);
    }
  };

  function CustomDrawerContent(props) {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem label="Logout" onPress={() => logoutHandler(props)} />
      </DrawerContentScrollView>
    );
  }

  function PlacesStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: Colors.primary500 },
          headerTintColor: Colors.primary50,
          contentStyle: { backgroundColor: Colors.primary50 },
        }}
      >
        <Stack.Screen
          name="AllPlaces"
          component={AllPlaces}
          options={({ navigation }) => ({
            title: "All Places",
            headerRight: ({ tintColor }) => (
              <IconButton
                icon="add"
                size={24}
                color={tintColor}
                onPress={() => navigation.navigate("AddPlace")}
              />
            ),
          })}
        />
        <Stack.Screen
          name="AddPlace"
          component={AddPlace}
          options={{ title: "Add a new Place" }}
        />
        <Stack.Screen name="Map" component={Map} options={{ title: "Map" }} />
        <Stack.Screen
          name="EditProblemScreen"
          component={EditProblemScreen}
          options={{ title: "Edit Problem" }}
        />

        <Stack.Screen
          name="PlaceDetails"
          component={PlaceDetails}
          options={{ title: "Loading Place..." }}
        />

        <Stack.Screen
          name="UserDetails"
          component={UserDetails}
          options={{ title: "User Details" }}
        />
      </Stack.Navigator>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <StatusBar style="dark" />
      <NavigationContainer>
        {user ? (
          <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
          >
            <Drawer.Screen name="Places Table" component={PlacesStack} />
            <Drawer.Screen name="Map Screen" component={ProblemMapScreen} />
            <Drawer.Screen name="MyProblems" component={MyProblems} />
            <Drawer.Screen name="UsersList" component={UsersList} />
          </Drawer.Navigator>
        ) : (
          <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </PaperProvider>
  );
}
