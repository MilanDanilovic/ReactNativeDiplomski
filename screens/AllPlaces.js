import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore"; // Firestore functions
import { firestore } from "../util/firebase/firebaseConfig"; // Firebase config
import PlacesList from "../components/Places/PlacesList";
import { Picker } from "@react-native-picker/picker";
import { Card, Button, ActivityIndicator, Text } from "react-native-paper";

function AllPlaces({ route }) {
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  async function fetchPlaces() {
    setLoading(true);
    let placesCollectionRef = collection(firestore, "communalProblems");

    // Apply a filter based on the selected status if it's not "All"
    if (selectedStatus !== "All") {
      placesCollectionRef = query(
        placesCollectionRef,
        where("status", "==", selectedStatus),
        orderBy("createdAt", "desc") // Sort by most recent
      );
    } else {
      placesCollectionRef = query(
        placesCollectionRef,
        orderBy("createdAt", "desc")
      );
    }

    try {
      const querySnapshot = await getDocs(placesCollectionRef);
      const placesData = [];

      querySnapshot.forEach((doc) => {
        const placeData = {
          id: doc.id,
          ...doc.data(),
        };
        placesData.push(placeData);
      });

      setLoadedPlaces(placesData);
    } catch (error) {
      console.log("Error fetching places: ", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isFocused) {
      fetchPlaces();
    }
  }, [isFocused, route, selectedStatus]); // Fetch when status changes

  return (
    <View style={styles.container}>
      <Card style={styles.filterCard}>
        <Card.Title title="Filter by Problem Status" />
        <Card.Content>
          <Picker
            selectedValue={selectedStatus}
            onValueChange={(itemValue) => setSelectedStatus(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="All Problems" value="All" />
            <Picker.Item label="Active" value="Active" />
            <Picker.Item label="Resolved" value="Resolved" />
            <Picker.Item label="Stale" value="Stale" />
          </Picker>
          <Button mode="contained" onPress={fetchPlaces}>
            Apply Filter
          </Button>
        </Card.Content>
      </Card>

      {/* Show loading spinner when fetching */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text>Loading places...</Text>
        </View>
      ) : (
        <PlacesList places={loadedPlaces} />
      )}
    </View>
  );
}

export default AllPlaces;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f6f6f6",
  },
  filterCard: {
    marginBottom: 16,
  },
  picker: {
    marginVertical: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});
