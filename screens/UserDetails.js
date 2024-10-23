import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore"; // Firestore functions
import { firestore } from "../util/firebase/firebaseConfig";
import { View, FlatList, StyleSheet } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { Card, List, Avatar, Text, Title, Divider } from "react-native-paper";
import { Colors } from "../constants/colors";

function UserDetails({ route, navigation }) {
  const { userId } = route.params;
  const [userProblems, setUserProblems] = useState([]);
  const [userName, setUserName] = useState("");
  const isFocused = useIsFocused();

  useEffect(() => {
    async function fetchUserDetails() {
      // Fetch user data from users collection
      const userRef = doc(firestore, "users", userId);
      const userSnap = await getDoc(userRef);
      let userData = undefined;
      if (userSnap.exists()) {
        userData = userSnap.data();
        setUserName(`${userData.name} ${userData.surname}`);
      }

      // Get problems posted by this user
      const q = query(
        collection(firestore, "communalProblems"),
        where("postedBy", "==", userData.uid)
      );
      const querySnapshot = await getDocs(q);
      const problems = [];
      querySnapshot.forEach((doc) => {
        problems.push({ id: doc.id, ...doc.data() });
      });
      setUserProblems(problems);
    }
    fetchUserDetails();
  }, [userId, isFocused]);

  function renderProblem({ item }) {
    return (
      <Card
        style={styles.card}
        onPress={() =>
          navigation.navigate("PlaceDetails", {
            placeId: item.id,
            place: item,
            returnScreen: "UserDetails",
          })
        }
      >
        <List.Item
          title={item.title}
          description={`Status: ${item.status}`}
          right={() => <List.Icon icon="chevron-right" />}
        />
        <Card.Content>
          <Text>{item.description}</Text>
        </Card.Content>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      <Title style={styles.title}>{userName}'s Problems</Title>
      <Text style={styles.subtitle}>Total Problems: {userProblems.length}</Text>
      <Divider style={styles.divider} />
      <FlatList
        data={userProblems}
        keyExtractor={(item) => item.id}
        renderItem={renderProblem}
        ItemSeparatorComponent={() => <Divider />}
      />
    </View>
  );
}

export default UserDetails;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f6f6f6",
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary700,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray700,
    marginBottom: 16,
  },
  divider: {
    marginBottom: 16,
    backgroundColor: Colors.gray700,
  },
  card: {
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    elevation: 3,
    paddingVertical: 8,
  },
  avatar: {
    backgroundColor: Colors.primary500,
  },
});
