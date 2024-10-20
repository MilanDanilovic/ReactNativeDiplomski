import { useState, useEffect } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { loginUser, getStoredUser } from "../util/auth/authHelper";

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    async function checkUser() {
      const storedUser = await getStoredUser();
      if (storedUser) {
        navigation.navigate("AllPlaces"); // Redirect to main screen if logged in
      }
    }
    checkUser();
  }, []);

  async function loginHandler() {
    try {
      await loginUser(email, password);
      navigation.navigate("AllPlaces");
    } catch (error) {
      Alert.alert("Login failed", error.message);
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
      <Button title="Login" onPress={loginHandler} />
      <Text onPress={() => navigation.navigate("Register")}>
        Don't have an account? Register
      </Text>
    </View>
  );
}

export default LoginScreen;
