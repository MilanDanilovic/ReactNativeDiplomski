import { Alert, Image, StyleSheet, Text, View } from "react-native";
import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
} from "expo-image-picker";
import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../util/firebase/firebaseConfig"; // Import Firebase storage
import { Colors } from "../../constants/colors";
import OutlinedButton from "../UI/OutlinedButton";

function ImagePicker({ onTakeImage }) {
  const [pickedImage, setPickedImage] = useState();
  const [cameraPermissionInformation, requestPermission] =
    useCameraPermissions();

  async function verifyPermissions() {
    if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient Permissions!",
        "You need to grant camera permissions to use this app."
      );
      return false;
    }

    return true;
  }

  async function uploadImageToStorage(imageUri) {
    // Convert the image to a blob and upload to Firebase storage
    const imageRef = ref(storage, `images/${Date.now()}.jpg`); // Set a unique name for the image
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Upload the blob to Firebase Storage
    await uploadBytes(imageRef, blob);

    // Get the download URL for the uploaded image
    const downloadUrl = await getDownloadURL(imageRef);
    return downloadUrl;
  }

  async function takeImageHandler() {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    const image = await launchCameraAsync({
      allowsEditing: true,
      // aspect: [16, 9],
      quality: 0.5,
    });

    if (!image.canceled) {
      const imageUri = image.assets[0].uri;
      setPickedImage(imageUri);

      try {
        // Upload the image to Firebase Storage and get the download URL
        const downloadUrl = await uploadImageToStorage(imageUri);

        // Pass the download URL via the onTakeImage callback
        onTakeImage(downloadUrl);
      } catch (error) {
        Alert.alert("Upload failed", "Could not upload the image. Try again!");
      }
    }
  }

  let imagePreview = <Text>No image taken yet.</Text>;

  if (pickedImage) {
    imagePreview = <Image style={styles.image} source={{ uri: pickedImage }} />;
  }

  return (
    <View>
      <View style={styles.imagePreview}>{imagePreview}</View>
      <OutlinedButton icon="camera" onPress={takeImageHandler}>
        Take Image
      </OutlinedButton>
    </View>
  );
}

export default ImagePicker;

const styles = StyleSheet.create({
  imagePreview: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary100,
    borderRadius: 4,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
