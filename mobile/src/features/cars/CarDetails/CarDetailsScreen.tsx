import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import type { RootStackParamList } from "../../../navigation/types";
import type { RootState } from "../../../stores/store";
import Navbar from "../../../shared/Navbar/Navbar";

type HomeNav = NativeStackNavigationProp<RootStackParamList, "Home">;

export default function CarDetails() {
  const navigation = useNavigation<HomeNav>();
  const insets = useSafeAreaInsets();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);

  const ctaLabel = isAuthenticated ? "Browse Cars" : "Look around";

  return (
    <LinearGradient colors={["#0f172a", "#1e3a8a", "#0f172a"]} style={styles.root}>
      <Navbar />
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top + 32,
            paddingBottom: insets.bottom + 48,
            paddingHorizontal: 20,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          Find the perfect{" "}
          <Text style={styles.titleAccent}>CAR</Text> for you
        </Text>

        <Text style={styles.subtitle}>
          Autovibe — your journey to the perfect car. Browse our collection of
          high-quality vehicles at affordable prices.
        </Text>

        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate("CarList")}
          style={({ pressed }) => [pressed && styles.btnPressed]}
        >
          <LinearGradient
            colors={["#2563eb", "#70FFE2"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.btnGradient}
          >
            <Text style={styles.btnLabel}>{ctaLabel}</Text>
          </LinearGradient>
        </Pressable>
      </ScrollView>

      <LinearGradient
        colors={["transparent", "#0f172a"]}
        style={[styles.bottomFade, { height: 56 + insets.bottom }]}
        pointerEvents="none"
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 42,
    marginBottom: 20,
  },
  titleAccent: {
    color: "#70FFE2",
  },
  subtitle: {
    textAlign: "center",
    color: "#cbd5e1",
    fontSize: 18,
    lineHeight: 28,
    maxWidth: 360,
    marginBottom: 32,
  },
  btnGradient: {
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 14,
    minWidth: 220,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  btnLabel: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  btnPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  bottomFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
});
