import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { collection, getDocs } from "firebase/firestore"; // Firestore functions
import { firestore } from "../util/firebase/firebaseConfig"; // Firebase config
import PlacesList from "../components/Places/PlacesList";

function AllPlaces({ route }) {
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const isFocused = useIsFocused();

  async function fetchPlaces() {
    const placesCollectionRef = collection(firestore, "communalProblems");
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
  }

  useEffect(() => {
    if (isFocused) {
      fetchPlaces();
    }
  }, [isFocused, route]);

  return <PlacesList places={loadedPlaces} />;
}

export default AllPlaces;
