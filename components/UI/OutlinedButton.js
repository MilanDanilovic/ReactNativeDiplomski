import { Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";

function OutlinedButton({ onPress, icon, children }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        pressed && styles.buttonPressed,
      ]}
      onPress={onPress}
    >
      <Ionicons
        style={styles.icon}
        name={icon}
        size={20}
        color={Colors.primary500}
      />
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
}

export default OutlinedButton;

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginVertical: 10,
    marginHorizontal: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.primary500,
    borderRadius: 25, // Rounded corners for a modern look
    backgroundColor: "#fff", // White background
    elevation: 3, // Add a slight shadow for depth
  },
  pressed: {
    backgroundColor: "#f2f2f2", // Light grey background when pressed
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }], // Slight scaling effect for feedback
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: Colors.primary500,
    fontSize: 16, // Larger text for readability
  },
});
