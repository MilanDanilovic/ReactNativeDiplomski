import React, { useEffect, useState, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Alert,
  View,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import { Card, Title, Paragraph, Button, Text } from "react-native-paper";
import OutlinedButton from "../components/UI/OutlinedButton";
import { Colors } from "../constants/colors";
import { firestore } from "../util/firebase/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";

function PlaceDetails({ route, navigation }) {
  const [fetchedPlace, setFetchedPlace] = useState();
  const { place, returnScreen, isInRange } = route.params;
  const [problemStatus, setProblemStatus] = useState(place.status);
  function showOnMapHandler() {
    navigation.navigate("Map", {
      initialLat: fetchedPlace.location.lat,
      initialLng: fetchedPlace.location.lng,
    });
  }

  useEffect(() => {
    async function loadPlaceData() {
      setFetchedPlace(place);
      navigation.setOptions({
        title: place.title,
      });
    }

    loadPlaceData();
  }, [place]);

  const handleGoBack = () => {
    if (returnScreen) {
      navigation.navigate(returnScreen);
    } else {
      navigation.goBack();
    }
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleGoBack();
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [handleGoBack])
  );

  async function markAsResolvedHandler() {
    try {
      const problemRef = doc(firestore, "communalProblems", place.id);
      await updateDoc(problemRef, {
        status: "Resolved",
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
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Cover
          source={{ uri: fetchedPlace.imageUri }}
          style={styles.image}
        />
        <Card.Content>
          <Title style={styles.title}>{fetchedPlace.title}</Title>
          <Paragraph style={styles.address}>{fetchedPlace.address}</Paragraph>
          <Paragraph style={styles.description}>
            {fetchedPlace.description}
          </Paragraph>
        </Card.Content>

        <View style={styles.buttonContainer}>
          <OutlinedButton
            icon="map"
            onPress={showOnMapHandler}
            style={styles.mapButton}
          >
            View on Map
          </OutlinedButton>
          {problemStatus !== "Resolved" && isInRange && (
            <Button
              mode="contained"
              onPress={markAsResolvedHandler}
              style={styles.resolveButton}
            >
              Resolve it
            </Button>
          )}
        </View>
      </Card>
    </ScrollView>
  );
}

export default PlaceDetails;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f6f6f6",
  },
  card: {
    borderRadius: 12,
    elevation: 4,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  image: {
    height: 300,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary700,
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    color: Colors.gray700,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  mapButton: {
    flex: 1,
    marginRight: 10, // Adds space between the two buttons
  },
  resolveButton: {
    flex: 1,
    backgroundColor: Colors.primary500,
  },
  fallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
