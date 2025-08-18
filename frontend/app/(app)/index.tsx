import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function Home() {
  const { t } = useTranslation();

  const navigateToChat = () => {
    router.push("/chat" as any);
  };

  const navigateToSettings = () => {
    router.push("/settings" as any);
  };

  const navigateToProfile = () => {
    console.log("Profile pressed");
  };

  return (
    <LinearGradient
      colors={["#0f2027", "#203a43", "#2c5364"]}
      style={styles.container}
    >
      <Text style={styles.title}>🌱 {t("pestDetectionSystem")}</Text>
      <Text style={styles.subtitle}>{t("smartFarmingAssistant")}</Text>

      {/* Decorative illustration (dummy image for aesthetics) */}
      <Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/4149/4149670.png",
        }}
        style={styles.image}
      />

      {/* Action buttons */}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && { transform: [{ scale: 0.96 }] },
        ]}
        onPress={navigateToChat}
      >
        <Text style={styles.buttonText}>{t("chat")}</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && { transform: [{ scale: 0.96 }] },
        ]}
        onPress={navigateToSettings}
      >
        <Text style={styles.buttonText}>{t("settings")}</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && { transform: [{ scale: 0.96 }] },
        ]}
        onPress={navigateToProfile}
      >
        <Text style={styles.buttonText}>{t("profile")}</Text>
      </Pressable>

      {/* Footer just for aesthetics */}
      <Text style={styles.footer}>🌿 Empowering Farmers with AI</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#ddd",
    marginBottom: 25,
    textAlign: "center",
  },
  image: {
    width: 140,
    height: 140,
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    paddingHorizontal: 35,
    borderRadius: 14,
    marginVertical: 12,
    width: "85%",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  footer: {
    marginTop: 40,
    fontSize: 14,
    color: "#aaa",
    fontStyle: "italic",
  },
});
