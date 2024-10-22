import { useState, useEffect } from "react";
import { ScrollView, Alert, View, StyleSheet, Image } from "react-native";
import { TextInput, Button, Card, Title } from "react-native-paper";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firestore, storage } from "../util/firebase/firebaseConfig"; // Firestore and Storage setup
import { Picker } from "@react-native-picker/picker";
import ImagePicker from "../components/Places/ImagePicker"; // Reusing ImagePicker for image editing

function EditProblemScreen({ route, navigation }) {
  const { problemId, returnScreen } = route.params;

  const [problem, setProblem] = useState(null);
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [status, setStatus] = useState();
  const [imageUri, setImageUri] = useState();

  useEffect(() => {
    async function fetchProblem() {
      try {
        const problemRef = doc(firestore, "communalProblems", problemId);
        const problemSnap = await getDoc(problemRef);

        if (problemSnap.exists()) {
          const problemData = problemSnap.data();
          setProblem(problemData);
          setTitle(problemData.title);
          setDescription(problemData.description);
          setStatus(problemData.status);
          setImageUri(problemData.imageUri);
        } else {
          Alert.alert("Error", "Problem not found.");
          navigation.goBack();
        }
      } catch (error) {
        Alert.alert("Error", "Could not fetch the problem." + error);
      }
    }

    fetchProblem();
  }, [problemId]);

  // Status options for picker
  const statusOptions = ["Active", "Resolved", "Stale"];

  // Handle saving changes
  async function saveChangesHandler() {
    try {
      console.log("saving img uri ", imageUri);
      const problemRef = doc(firestore, "communalProblems", problemId);
      await updateDoc(problemRef, {
        title: title,
        description: description,
        status: status,
        imageUri: imageUri, // Save edited image
      });

      Alert.alert("Success", "Problem updated successfully.");
      navigation.navigate(returnScreen); // Go back to the correct screen
    } catch (error) {
      Alert.alert("Error", "Could not update the problem.");
    }
  }

  // Handle image selection and upload to Firebase Storage
  async function onImagePicked(imageUri) {
    try {
      const imageRef = ref(storage, `communalProblems/${problemId}.jpg`);
      const response = await fetch(imageUri);
      const blob = await response.blob();

      await uploadBytes(imageRef, blob); // Upload image to Firebase Storage

      const downloadUrl = await getDownloadURL(imageRef); // Get download URL of uploaded image
      setImageUri(downloadUrl); // Update state with new image URL
      console.log("image uri uploaded ", downloadUrl);
    } catch (error) {
      Alert.alert("Error", "Could not upload the image.");
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <Card.Content>
          <Title>Edit Problem</Title>
          <TextInput
            label="Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            style={styles.input}
          />

          {/* Picker for status */}
          <Picker
            selectedValue={status}
            onValueChange={(itemValue) => setStatus(itemValue)}
            style={styles.input}
          >
            {statusOptions.map((option) => (
              <Picker.Item key={option} label={option} value={option} />
            ))}
          </Picker>

          {/* Image Picker for editing the image */}
          {imageUri && (
            <ImagePicker
              onTakeImage={onImagePicked}
              initialImageUri={imageUri}
            />
          )}

          <Button
            mode="contained"
            onPress={saveChangesHandler}
            style={styles.button}
          >
            Save Changes
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

export default EditProblemScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  button: {
    marginTop: 16,
  },
});
