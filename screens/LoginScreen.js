import { useState, useEffect } from "react";
import { Alert, View, Text } from "react-native";
import { loginUser, getStoredUser } from "../util/auth/authHelper";
import { TextInput, Button, Card } from "react-native-paper";

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    async function checkUser() {
      const storedUser = await getStoredUser();
      if (storedUser) {
        try {
          navigation.navigate("AllPlaces"); // Redirect to main screen if logged in
        } catch (error) {
          console.log(error);
        }
      }
    }
    checkUser();
  }, []);

  async function loginHandler() {
    try {
      await loginUser(email, password);
    } catch (error) {
      Alert.alert("Login failed", error.message);
    }
  }

  return (
    <View
      style={{
        padding: 16,
      }}
    >
      <Card>
        <Card.Title title="Login" />
        <Card.Content>
          <TextInput
            label="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={{ marginBottom: 16 }}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
            style={{ marginBottom: 16 }}
          />
          <Button
            mode="contained"
            onPress={loginHandler}
            labelStyle={{ color: "white" }}
          >
            Login
          </Button>
          <Text
            onPress={() => navigation.navigate("Register")}
            style={{ marginTop: 16 }}
          >
            Don't have an account? Register
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
}

export default LoginScreen;
