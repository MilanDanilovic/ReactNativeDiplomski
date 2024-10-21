import { useEffect, useState } from "react";
import { ScrollView, Image, View, Text, StyleSheet, Alert } from "react-native";
import { Button } from "react-native-paper";
import OutlinedButton from "../components/UI/OutlinedButton";
import { Colors } from "../constants/colors";
import { Place } from "../models/place";
import { firestore } from "../util/firebase/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

// import { fetchPlaceDetails } from "../util/database";

function PlaceDetails({ route, navigation }) {
  const [fetchedPlace, setFetchedPlace] = useState();
  const { place } = route.params;

  const [problemStatus, setProblemStatus] = useState(place.status);

  function showOnMapHandler() {
    navigation.navigate("Map", {
      initialLat: fetchedPlace.location.lat,
      initialLng: fetchedPlace.location.lng,
    });
  }

  const selectedPlaceId = route.params.placeId;
  //delete this place when firebase is implemented
  const selectedPlace = route.params.place;

  useEffect(() => {
    async function loadPlaceData() {
      //   const place = await fetchPlaceDetails(selectedPlaceId); // fetch place from firebase
      //   setFetchedPlace(place);
      setFetchedPlace(selectedPlace);

      navigation.setOptions({
        title: place.title,
      });
    }

    loadPlaceData();
  }, [selectedPlaceId]);

  async function markAsResolvedHandler() {
    try {
      const problemRef = doc(firestore, "communalProblems", place.id);
      await updateDoc(problemRef, {
        status: "Resolved", // Update the status to Resolved
      });

      setProblemStatus("Resolved");
      navigation.goBack();
      Alert.alert("Success", "Problem marked as resolved.");
    } catch (error) {
      console.log("Error marking problem as resolved: ", error);
      Alert.alert("Error", "Could not update the problem.");
    }
  }

  if (!fetchedPlace) {
    return (
      <View style={styles.fallback}>
        <Text>Loading place data...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: fetchedPlace.imageUri }} />
      <View style={styles.locationContainer}>
        <View style={styles.addressContainer}>
          <Text style={styles.address}>{fetchedPlace.address}</Text>
          <Text style={styles.description}>{fetchedPlace.description}</Text>
        </View>
        <OutlinedButton icon="map" onPress={showOnMapHandler}>
          View on Map
        </OutlinedButton>
        {problemStatus !== "Resolved" && (
          <Button mode="contained" onPress={markAsResolvedHandler}>
            Mark as Resolved
          </Button>
        )}
      </View>
    </ScrollView>
  );
}

export default PlaceDetails;

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: "35%",
    minHeight: 300,
    width: "100%",
  },
  locationContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  addressContainer: {
    padding: 20,
  },
  address: {
    color: Colors.primary500,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  description: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
  },
});
