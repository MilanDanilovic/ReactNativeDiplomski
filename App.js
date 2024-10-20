import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { auth } from "./util/firebase/firebaseConfig"; // Firebase Auth config
import { onAuthStateChanged } from "firebase/auth";

// Import screens
import AllPlaces from "./screens/AllPlaces";
import AddPlace from "./screens/AddPlace";
import IconButton from "./components/UI/IconButton";
import { Colors } from "./constants/colors";
import Map from "./screens/Map";
import PlaceDetails from "./screens/PlaceDetails";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Check if user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser); // If authenticated, set user state
      setInitializing(false); // Set to false after check is done
    });

    return unsubscribe; // Clean up the listener on component unmount
  }, []);

  if (initializing) return null; // Display nothing while Firebase is initializing

  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: Colors.primary500 },
            headerTintColor: Colors.primary50,
            contentStyle: { backgroundColor: Colors.primary50 },
          }}
        >
          {user ? (
            <>
              {/* Protected Routes for authenticated users */}
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
              <Stack.Screen
                name="Map"
                component={Map}
                options={{ title: "Map" }}
              />
              <Stack.Screen
                name="PlaceDetails"
                component={PlaceDetails}
                options={{ title: "Loading Place..." }}
              />
            </>
          ) : (
            <>
              {/* Auth Screens for unauthenticated users */}
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
