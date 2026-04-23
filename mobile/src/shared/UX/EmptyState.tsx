import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";

function EmptyState() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={{ fontSize: 40 }}>🚗</Text> 
      </View>

      <Text style={styles.title}>No cars yet</Text>
      <Text style={styles.subtitle}>Add one by clicking the button below.</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("CreateAd")}
        activeOpacity={0.7}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Add new</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f172a",
    padding: 20,
  },
  iconContainer: {
    backgroundColor: "#475569",
    borderRadius: 50,
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#94a3b8",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 8,
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#70FFE2",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default EmptyState;