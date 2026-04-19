import { StyleSheet, Text, View } from "react-native";

/** Placeholder — тук ще дойде истинският списък с коли. */
export default function CarListScreen() {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>Cars</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "600" },
});
