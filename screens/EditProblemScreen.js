import { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../util/firebase/firebaseConfig"; // Firestore setup

function EditProblemScreen({ route, navigation }) {
  const { problemId, problem } = route.params; // Retrieve the passed problem data

  const [title, setTitle] = useState(problem.title);
  const [description, setDescription] = useState(problem.description);

  async function saveChangesHandler() {
    try {
      const problemRef = doc(firestore, "communalProblems", problemId);
      await updateDoc(problemRef, {
        title: title,
        description: description,
      });

      Alert.alert("Success", "Problem updated successfully.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Could not update the problem.");
    }
  }

  return (
    <View>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Problem Title"
        style={{ marginBottom: 16 }}
      />
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Problem Description"
        style={{ marginBottom: 16 }}
      />
      <Button title="Save Changes" onPress={saveChangesHandler} />
    </View>
  );
}

export default EditProblemScreen;
