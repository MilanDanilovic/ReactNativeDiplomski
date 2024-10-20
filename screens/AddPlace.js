import { firestore } from "../util/firebase/firebaseConfig"; // Import your Firebase config
import { collection, addDoc } from "firebase/firestore";
import PlaceForm from "../components/Places/PlaceForm";

function AddPlace({ navigation }) {
  async function createPlaceHandler(place) {
    try {
      // Upload place (communal problem) to Firestore
      await addDoc(collection(firestore, "communalProblems"), {
        title: place.title,
        description: place.description, // Include description
        imageUri: place.imageUri,
        location: place.location, // lat and lng
        address: place.address,
        createdAt: new Date(), // Add timestamp
      });

      navigation.navigate("AllPlaces");
    } catch (error) {
      console.error("Error adding place: ", error);
    }
  }

  return <PlaceForm onCreatePlace={createPlaceHandler} />;
}

export default AddPlace;
