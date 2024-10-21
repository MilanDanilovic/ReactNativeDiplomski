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
import { View, Text, FlatList } from "react-native";
import { useIsFocused } from "@react-navigation/native";
function UserDetails({ route }) {
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

  return (
    <View>
      <Text>{userName}'s Problems</Text>
      <Text>Total Problems: {userProblems.length}</Text>
      <FlatList
        data={userProblems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />
    </View>
  );
}

export default UserDetails;
