import { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { registerUser } from "../util/auth/authHelper";

function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function registerHandler() {
    try {
      await registerUser(email, password);
      navigation.navigate("AllPlaces");
    } catch (error) {
      Alert.alert("Registration failed", error.message);
    }
  }

  return (
    <View>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Register" onPress={registerHandler} />
    </View>
  );
}

export default RegisterScreen;
