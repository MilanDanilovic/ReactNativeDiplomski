import PlaceForm from "../components/Places/PlaceForm";

function AddPlace({ navigation }) {
  async function createPlaceHandler(place) {
    //upload place to firebase
    navigation.navigate("AllPlaces", { place });
  }

  return <PlaceForm onCreatePlace={createPlaceHandler} />;
}

export default AddPlace;
