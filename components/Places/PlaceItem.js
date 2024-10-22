import { Pressable, StyleSheet, View, Image } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Button,
  Chip,
  IconButton,
} from "react-native-paper";
import { Colors } from "../../constants/colors";
import { useNavigation } from "@react-navigation/native";

function PlaceItem({ place, onSelect }) {
  const navigation = useNavigation();

  function showOnMapHandler() {
    navigation.navigate("Map", {
      initialLat: place.location.lat,
      initialLng: place.location.lng,
    });
  }

  return (
    <Pressable onPress={onSelect.bind(this, place.id, place)}>
      <Card style={styles.card}>
        {/* Image of the place */}
        <Card.Cover source={{ uri: place.imageUri }} style={styles.image} />

        {/* Content: Title, Address, Status */}
        <Card.Content style={styles.cardContent}>
          <Title style={styles.title}>{place.title}</Title>
          <Chip
            icon="information"
            mode="outlined"
            style={[
              styles.chip,
              place.status === "Active"
                ? styles.activeChip
                : place.status === "Resolved"
                ? styles.resolvedChip
                : styles.staleChip,
            ]}
          >
            {place.status}
          </Chip>
          <Paragraph style={styles.address}>{place.description}</Paragraph>
          <Paragraph style={styles.address}>{place.address}</Paragraph>
        </Card.Content>

        {/* Actions: View Details & Map Icon */}
        <Card.Actions style={styles.actions}>
          <Button
            mode="contained"
            onPress={onSelect.bind(this, place.id, place)}
            style={styles.detailsButton}
          >
            View Details
          </Button>
          <IconButton
            icon="map-marker"
            color={Colors.primary700}
            size={28}
            onPress={showOnMapHandler}
          />
        </Card.Actions>
      </Card>
    </Pressable>
  );
}

export default PlaceItem;

const styles = StyleSheet.create({
  card: {
    marginVertical: 12,
    borderRadius: 12,
    elevation: 5,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  cardContent: {
    padding: 16, // Add padding for better spacing inside the card content
  },
  image: {
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    color: Colors.primary700,
    marginBottom: 8, // Adds some space between the title and the chip
  },
  chip: {
    marginBottom: 12, // Adds spacing between chip and other elements
    alignSelf: "flex-start", // Align the chip to the left
    paddingVertical: 4,
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  activeChip: {
    backgroundColor: "#DFF2BF",
    borderColor: "#27AE60",
    color: "#27AE60",
  },
  resolvedChip: {
    backgroundColor: "#C9DAF8",
    borderColor: "#2980B9",
    color: "#2980B9",
  },
  staleChip: {
    backgroundColor: "#FBE3E4",
    borderColor: "#C0392B",
    color: "#C0392B",
  },
  address: {
    fontSize: 14,
    color: Colors.gray700,
    marginVertical: 8,
  },
  actions: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  detailsButton: {
    backgroundColor: Colors.primary500,
    borderRadius: 25,
    paddingHorizontal: 12,
  },
});
