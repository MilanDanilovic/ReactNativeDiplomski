import { useState } from "react";
import { View, Alert } from "react-native";
import { TextInput, Button, Card } from "react-native-paper";
import { registerUser } from "../util/auth/authHelper";

function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function registerHandler() {
    try {
      await registerUser(email, password);
      // navigation.navigate("AllPlaces");
    } catch (error) {
      Alert.alert("Registration failed", error.message);
    }
  }

  return (
    <View style={{ padding: 16 }}>
      <Card>
        <Card.Title title="Register" />
        <Card.Content>
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
          <Button
            mode="contained"
            onPress={registerHandler}
            labelStyle={{ color: "white" }}
          >
            Register
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

export default RegisterScreen;
