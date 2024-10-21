import { useNavigation } from "@react-navigation/native";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { Colors } from "../../constants/colors";
import PlaceItem from "./PlaceItem";

function PlacesList({ places, onSelectPlace }) {
  const navigation = useNavigation();

  function selectPlaceHandler(id, place) {
    navigation.navigate("PlaceDetails", {
      placeId: id,
      place: place, //remove place when firebase is implemented
    });
  }

  if (!places || places.length === 0) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackText}>
          No places added yet - start adding some!
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      data={places}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <PlaceItem
          place={item}
          onSelect={() =>
            onSelectPlace
              ? onSelectPlace(item.id, item)
              : selectPlaceHandler(item.id, item)
          }
        />
      )}
    />
  );
}

export default PlacesList;

const styles = StyleSheet.create({
  list: {
    margin: 24,
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fallBackText: {
    fontSize: 20,
    color: Colors.gray700,
  },
});
