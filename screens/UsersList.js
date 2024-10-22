import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore"; // Firestore functions
import { firestore } from "../util/firebase/firebaseConfig"; // Firebase config
import { ScrollView, StyleSheet, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import {
  Card,
  List,
  Avatar,
  Text,
  ActivityIndicator,
  Divider,
} from "react-native-paper";
import { Colors } from "../constants/colors";

function UsersList({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for better UX
  const isFocused = useIsFocused();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const usersCollection = collection(firestore, "users"); // Assuming you have a "users" collection in Firestore
        const querySnapshot = await getDocs(usersCollection);
        const usersData = [];
        querySnapshot.forEach((doc) => {
          usersData.push({ id: doc.id, ...doc.data() });
        });
        setUsers(usersData);
        setLoading(false); // Data is fetched, hide the loader
      } catch (error) {
        console.error("Error fetching users: ", error);
        setLoading(false); // Hide loader if there is an error
      }
    }

    fetchUsers();
  }, [isFocused]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          animating={true}
          size="large"
          color={Colors.primary500}
        />
        <Text style={styles.loadingText}>Loading Users...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {users.map((user, index) => (
        <View key={user.id}>
          <Card
            style={styles.card}
            onPress={() =>
              navigation.navigate("UserDetails", { userId: user.id })
            }
          >
            <List.Item
              title={user.name}
              description={`Email: ${user.email}`}
              left={() =>
                user.imageUri ? (
                  <Avatar.Image
                    size={50}
                    source={{ uri: user.imageUri }}
                    style={styles.avatar}
                  />
                ) : (
                  <Avatar.Text
                    size={50}
                    label={user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    style={styles.avatarText}
                  />
                )
              }
              right={() => (
                <List.Icon icon="chevron-right" color={Colors.primary500} />
              )}
              titleStyle={styles.title}
              descriptionStyle={styles.description}
            />
          </Card>
          {index < users.length - 1 && <Divider style={styles.divider} />}
        </View>
      ))}
    </ScrollView>
  );
}

export default UsersList;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f4f4f9", // Softer background to contrast with the card
  },
  card: {
    marginBottom: 8,
    borderRadius: 12,
    elevation: 3,
    backgroundColor: "#fff",
    paddingHorizontal: 8, // More padding inside the card
    paddingVertical: 12, // Add vertical padding for more breathable layout
  },
  avatar: {
    backgroundColor: Colors.primary500,
  },
  avatarText: {
    backgroundColor: Colors.primary500,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    color: Colors.primary700, // Make the title pop with primary color
  },
  description: {
    color: Colors.gray700,
    fontSize: 14, // Reduce the size for better hierarchy
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.gray700,
  },
  divider: {
    marginVertical: 8,
    backgroundColor: Colors.gray700,
  },
});
