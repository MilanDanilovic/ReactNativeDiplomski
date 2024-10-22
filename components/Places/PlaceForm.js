import { useState, useCallback } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { TextInput, Card, Button, Title, Text } from "react-native-paper";
import ImagePicker from "./ImagePicker";
import LocationPicker from "./LocationPicker";
import { Place } from "../../models/place";
import { Colors } from "../../constants/colors";
import { auth } from "../../util/firebase/firebaseConfig";

function PlaceForm({ onCreatePlace }) {
  const [enteredTitle, setEnteredTitle] = useState("");
  const [enteredDescription, setEnteredDescription] = useState(""); // Description state
  const [selectedImage, setSelectedImage] = useState();
  const [pickedLocation, setPickedLocation] = useState();

  function changeTitleHandler(enteredText) {
    setEnteredTitle(enteredText);
  }

  function changeDescriptionHandler(enteredText) {
    setEnteredDescription(enteredText); // Set description state
  }

  function takeImageHandler(imageUri) {
    setSelectedImage(imageUri);
  }

  const pickLocationHandler = useCallback((location) => {
    setPickedLocation(location);
  }, []);

  function savePlaceHandler() {
    const currentUser = auth.currentUser;

    const placeData = new Place(
      enteredTitle,
      enteredDescription,
      selectedImage,
      pickedLocation,
      null,
      currentUser?.uid, // Add the current user's email or name
      "Active" // Initial status of the problem
    );
    onCreatePlace(placeData);
  }

  return (
    <ScrollView contentContainerStyle={styles.form}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Add a New Place</Title>
          <TextInput
            label="Title"
            value={enteredTitle}
            onChangeText={changeTitleHandler}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Description"
            value={enteredDescription}
            onChangeText={changeDescriptionHandler}
            multiline
            numberOfLines={3}
            style={styles.input}
            mode="outlined"
          />
          <ImagePicker onTakeImage={takeImageHandler} />
          <LocationPicker onPickLocation={pickLocationHandler} />
          <Button
            mode="contained"
            onPress={savePlaceHandler}
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            Add Place
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

export default PlaceForm;

const styles = StyleSheet.create({
  form: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#f4f4f9", // Light background to contrast with the card
  },
  card: {
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: Colors.primary700,
    textAlign: "center",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#f9f9f9", // Slight contrast for input fields
  },
  button: {
    marginTop: 16,
    borderRadius: 25,
    backgroundColor: Colors.primary500,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    color: "#fff",
    fontWeight: "bold",
  },
});
