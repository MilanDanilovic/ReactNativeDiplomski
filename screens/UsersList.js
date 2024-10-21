import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore"; // Firestore functions
import { firestore } from "../util/firebase/firebaseConfig"; // Firebase config
import { View, Text, Pressable } from "react-native";
import { useIsFocused } from "@react-navigation/native";

function UsersList({ navigation }) {
  const [users, setUsers] = useState([]);
  const isFocused = useIsFocused();
  useEffect(() => {
    async function fetchUsers() {
      const usersCollection = collection(firestore, "users"); // Assuming you have a "users" collection in Firestore
      const querySnapshot = await getDocs(usersCollection);
      const usersData = [];
      querySnapshot.forEach((doc) => {
        usersData.push({ id: doc.id, ...doc.data() });
      });
      setUsers(usersData);
    }
    fetchUsers();
  }, [isFocused]);

  return (
    <View>
      {users.map((user) => (
        <Pressable
          key={user.id}
          onPress={() =>
            navigation.navigate("UserDetails", { userId: user.id })
          }
        >
          <Text>{user.name}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export default UsersList;
