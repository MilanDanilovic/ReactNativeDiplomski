import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore"; // Firestore functions
import { auth, firestore } from "../util/firebase/firebaseConfig"; // Firebase config
import PlacesList from "../components/Places/PlacesList"; // Reuse PlacesList component
import { useIsFocused } from "@react-navigation/native";

function MyProblems({ navigation }) {
  const [myPlaces, setMyPlaces] = useState([]);

  useEffect(() => {
    const currentUser = auth.currentUser;

    async function fetchMyPlaces() {
      const placesCollection = collection(firestore, "communalProblems");
      const q = query(
        placesCollection,
        where("postedBy", "==", currentUser.uid)
      ); // Query for user problems
      const querySnapshot = await getDocs(q);
      const placesData = [];
      querySnapshot.forEach((doc) => {
        placesData.push({ id: doc.id, ...doc.data() });
      });
      setMyPlaces(placesData);
    }

    fetchMyPlaces();
  }, []);

  function onSelectPlace(place) {
    navigation.navigate("EditProblemScreen", {
      problemId: place.id,
      problem: place,
    }); // Navigate to edit screen
  }

  return <PlacesList places={myPlaces} onSelectPlace={onSelectPlace} />;
}

export default MyProblems;
