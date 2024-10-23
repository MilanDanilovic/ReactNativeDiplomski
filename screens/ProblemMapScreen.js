import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Text } from "react-native";
import MapView, { Marker, Callout, Circle } from "react-native-maps";
import {
  getCurrentPositionAsync,
  watchPositionAsync,
  Accuracy,
} from "expo-location";
import { getDocs, collection } from "firebase/firestore";
import { firestore } from "../util/firebase/firebaseConfig";
import { Button, TextInput, Chip, Searchbar } from "react-native-paper";
import { getDistance } from "geolib";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import * as Device from "expo-device";

function ProblemMapScreen() {
  const [userLocation, setUserLocation] = useState(null);
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [range, setRange] = useState(100);
  const [notifiedProblems, setNotifiedProblems] = useState([]);

  const isFocused = useIsFocused();
  const navigation = useNavigation();

  // Set notification handler to ensure notifications are displayed
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  // Register for push notifications
  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      let token;
      if (Device.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          alert("Failed to get push token for push notification!");
          return;
        }
        try {
          const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ??
            Constants?.easConfig?.projectId;
          if (!projectId) {
            throw new Error("Project ID not found");
          }
          token = (
            await Notifications.getExpoPushTokenAsync({
              projectId,
            })
          ).data;
          console.log("Notification Token:", token);
        } catch (e) {
          console.log("Error getting token:", e);
        }
      } else {
        alert("Must use physical device for Push Notifications");
      }
    };

    registerForPushNotificationsAsync();
  }, []);

  // Fetch problems from Firestore
  const fetchProblems = async () => {
    const problemsCollection = collection(firestore, "communalProblems");
    const problemSnapshot = await getDocs(problemsCollection);
    const problemData = [];

    problemSnapshot.forEach((doc) => {
      const problem = { id: doc.id, ...doc.data() };
      problemData.push(problem);
    });

    setProblems(problemData);
    setFilteredProblems(problemData);
  };

  // Start tracking user location and fetch problems on component focus
  useEffect(() => {
    if (isFocused) {
      const startTracking = async () => {
        const location = await getCurrentPositionAsync();
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        await watchPositionAsync(
          { accuracy: Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
          (location) => {
            setUserLocation({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });
          }
        );
      };

      startTracking();
      fetchProblems();

      const intervalId = setInterval(fetchProblems, 10000); // Fetch problems every 10 seconds
      return () => clearInterval(intervalId);
    }
  }, [isFocused]);

  // Search and filter problems
  const searchProblems = useCallback(() => {
    if (!userLocation) return;
    let filtered = problems.filter((problem) => {
      const matchesStatus =
        selectedStatus === "All" || problem.status === selectedStatus;

      const matchesQuery =
        searchQuery === "" ||
        problem.title.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesQuery;
    });

    setFilteredProblems(filtered);
  }, [problems, searchQuery, selectedStatus]);

  useEffect(() => {
    searchProblems();
  }, [searchQuery, selectedStatus, problems]);

  // Check if new problems are in range and send notification
  useEffect(() => {
    if (userLocation) {
      filteredProblems.forEach((problem) => {
        const distance = getDistance(
          {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          },
          {
            latitude: problem.location.lat,
            longitude: problem.location.lng,
          }
        );

        const isInRange = distance <= range;

        if (isInRange && !notifiedProblems.includes(problem.id)) {
          sendNotification(problem);
          setNotifiedProblems((prev) => [...prev, problem.id]); // Track notified problems
        }
      });
    }
  }, [userLocation, filteredProblems]);

  // Send notification when problem is in range
  const sendNotification = async (problem) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "New Problem in Your Area!",
        body: `${problem.title} is within ${range} meters of your location.`,
        sound: true,
      },
      trigger: null,
    });
  };

  const addProblemHandler = (coords) => {
    navigation.navigate("AddPlace", {
      pickedLat: coords.latitude,
      pickedLng: coords.longitude,
    });
  };

  if (!userLocation) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading user location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Searchbar for filtering */}
      <Searchbar
        placeholder="Search by name"
        value={searchQuery}
        onChangeText={(query) => setSearchQuery(query)}
        style={styles.searchbar}
      />

      {/* Status Filter */}
      <View style={styles.filterContainer}>
        {["All", "Active", "Resolved", "Stale"].map((status) => (
          <Chip
            key={status}
            selected={selectedStatus === status}
            onPress={() => setSelectedStatus(status)}
            style={styles.chip}
          >
            {status}
          </Chip>
        ))}

        <TextInput
          label="Range (m)"
          value={range.toString()}
          onChangeText={(value) => setRange(parseInt(value) || 1000)}
          style={styles.rangeInput}
        />
      </View>

      {/* Map */}
      <MapView
        style={styles.map}
        showsUserLocation={true}
        region={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.05,
        }}
        onLongPress={(event) => addProblemHandler(event.nativeEvent.coordinate)}
      >
        {filteredProblems.map((problem) => {
          const distance = getDistance(
            {
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            },
            {
              latitude: problem.location.lat,
              longitude: problem.location.lng,
            }
          );

          const pinColor = distance <= range ? "green" : "red";

          return (
            <Marker
              key={`${problem.id}-${pinColor}`} // Add unique key to ensure re-render
              coordinate={{
                latitude: problem.location.lat,
                longitude: problem.location.lng,
              }}
              pinColor={pinColor}
            >
              <Callout
                onPress={() =>
                  navigation.navigate("PlaceDetails", {
                    placeId: problem.id,
                    place: problem,
                    isInRange: distance <= range,
                    returnScreen: "Map Screen",
                  })
                }
              >
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutTitle}>{problem.title}</Text>
                  <Text>Status: {problem.status}</Text>
                  <Text>{problem.description}</Text>
                </View>
              </Callout>
            </Marker>
          );
        })}

        {userLocation && (
          <Circle
            center={userLocation}
            radius={range}
            strokeColor="rgba(0, 150, 255, 0.5)"
            fillColor="rgba(0, 150, 255, 0.2)"
          />
        )}
      </MapView>
    </View>
  );
}

export default ProblemMapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchbar: {
    margin: 10,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  chip: {
    marginHorizontal: 5,
  },
  rangeInput: {
    marginHorizontal: 10,
    width: 80,
  },
  map: {
    flex: 1,
  },
  calloutContainer: {
    alignItems: "center",
    width: 200,
  },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
