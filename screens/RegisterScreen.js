import { useState } from "react";
import { View, Alert, ScrollView } from "react-native";
import { TextInput, Button, Card } from "react-native-paper";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { auth, firestore } from "../util/firebase/firebaseConfig";
import ImagePicker from "../components/Places/ImagePicker"; // Import the updated ImagePicker

function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [profileImage, setProfileImage] = useState(null); // State for profile image URL

  // Function to handle the registration process
  async function registerHandler() {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save user information to Firestore with profile image URL
      await addDoc(collection(firestore, "users"), {
        uid: user.uid,
        name: name,
        surname: surname,
        email: user.email,
        imageUri: profileImage, // Store the image URL
      });

      // Navigate to the AllPlaces screen after registration
      // navigation.navigate("AllPlaces");
    } catch (error) {
      Alert.alert("Registration failed", error.message);
    }
  }

  // Function to handle the image selection (coming from ImagePicker)
  function onImagePicked(imageUri) {
    setProfileImage(imageUri); // Set the picked image URL
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Card>
        <Card.Title title="Register" />
        <Card.Content>
          <TextInput
            label="Name"
            value={name}
            onChangeText={setName}
            style={{ marginBottom: 16 }}
          />
          <TextInput
            label="Surname"
            value={surname}
            onChangeText={setSurname}
            style={{ marginBottom: 16 }}
          />
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={{ marginBottom: 16 }}
          />
          <TextInput
            label="Password"
            value={password}
            secureTextEntry
            onChangeText={setPassword}
            style={{ marginBottom: 16 }}
          />

          {/* Use the ImagePicker component here */}
          <ImagePicker onTakeImage={onImagePicked} />

          <Button
            mode="contained"
            onPress={registerHandler}
            style={{ marginTop: 16 }}
          >
            Register
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

export default RegisterScreen;
