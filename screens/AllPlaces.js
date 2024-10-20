import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { collection, getDocs } from "firebase/firestore"; // Firestore functions
import { firestore } from "../util/firebase/firebaseConfig"; // Firebase config
import PlacesList from "../components/Places/PlacesList";

function AllPlaces({ route }) {
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const isFocused = useIsFocused();

  // Function to fetch places from Firebase Firestore
  async function fetchPlaces() {
    const placesCollectionRef = collection(firestore, "communalProblems"); // Firestore collection reference
    const querySnapshot = await getDocs(placesCollectionRef); // Get all documents in the collection
    const placesData = [];

    // Loop through each document in Firestore and add it to the array
    querySnapshot.forEach((doc) => {
      const placeData = {
        id: doc.id, // Firestore document ID
        ...doc.data(), // All the fields of the document (title, description, etc.)
      };
      placesData.push(placeData);
    });

    // Update the state with the fetched places
    setLoadedPlaces(placesData);
  }

  useEffect(() => {
    if (isFocused) {
      fetchPlaces(); // Fetch places when the screen is focused
    }
  }, [isFocused, route]);

  return <PlacesList places={loadedPlaces} />;
}

export default AllPlaces;
