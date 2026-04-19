import { StyleSheet, Text, View } from "react-native";

export default function LoginScreen() {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>Login</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "600" },
});
