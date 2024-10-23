import React, { useState, useEffect, useCallback } from "react";
import { View, Alert, StyleSheet, Text } from "react-native";
import MapView, { Marker, Callout, Circle } from "react-native-maps";
import {
  getCurrentPositionAsync,
  watchPositionAsync,
  Accuracy,
} from "expo-location";
import { doc, getDocs, collection, updateDoc } from "firebase/firestore";
import { firestore } from "../util/firebase/firebaseConfig";
import { Button, TextInput, Chip, Searchbar } from "react-native-paper";
import { getDistance } from "geolib"; // To calculate distance between two points
import { useIsFocused, useNavigation } from "@react-navigation/native";

function ProblemMapScreen() {
  const [userLocation, setUserLocation] = useState(null);
  const [problems, setProblems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [range, setRange] = useState(100); // Default range: 100m

  const isFocused = useIsFocused();
  const navigation = useNavigation();

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

      startTracking();
      fetchProblems();
    }
  }, [isFocused]);

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

  // // Resolve problem and refresh list
  // const resolveProblem = async (problemId) => {
  //   const problemRef = doc(firestore, "communalProblems", problemId);
  //   await updateDoc(problemRef, { status: "Resolved" });
  //   Alert.alert("Success", "Problem marked as resolved.");

  //   const updatedProblems = problems.map((p) =>
  //     p.id === problemId ? { ...p, status: "Resolved" } : p
  //   );
  //   setProblems(updatedProblems);
  //   searchProblems(); // Re-filter problems
  // };

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
        {/* Markers for Problems */}
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

          // Color the marker based on whether it's within range or not
          const pinColor = distance <= 100 ? "green" : "red";
          const isInRange = distance <= 100;

          return (
            <Marker
              key={problem.id}
              coordinate={{
                latitude: problem.location.lat,
                longitude: problem.location.lng,
              }}
              pinColor={pinColor} // Change color based on range
            >
              <Callout
                onPress={() =>
                  navigation.navigate("PlaceDetails", {
                    placeId: problem.id,
                    place: problem,
                    isInRange: isInRange,
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

        {/* User radius (100m circle) */}
        {userLocation && (
          <Circle
            center={userLocation}
            radius={100}
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
