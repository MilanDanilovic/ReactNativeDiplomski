import { FlatList, StyleSheet, Text, View } from "react-native";
import PlaceItem from "./PlaceItem";
import { Colors } from "../../constants/colors";

function PlacesList({ places }) {
  if (!places || places.length === 0) {
    return (
      <View style={style.fallBackContainer}>
        <Text style={style.fallBackText}>No problems added yet!</Text>
      </View>
    );
  }
  return (
    <FlatList
      data={places}
      renderItem={({ item }) => <PlaceItem place={item} />}
      keyExtractor={(item) => item.id}
    />
  );
}

export default PlacesList;

const style = StyleSheet.create({
  fallBackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fallBackText: {
    fontSize: 20,
    color: Colors.gray700,
  },
});
