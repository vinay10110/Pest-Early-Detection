import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

const languages = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
];

export default function LanguageSelect() {
  const { i18n } = useTranslation();

  const selectLanguage = async (langCode: string) => {
    try {
      await AsyncStorage.setItem("userLanguage", langCode);
      await AsyncStorage.setItem("hasSelectedLanguage", "true");
      i18n.changeLanguage(langCode);
      router.replace("/(app)" as any);
    } catch (error) {
      console.error("Error saving language preference:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Language</Text>
      <Text style={styles.subtitle}>
        भाषा चुनें / மொழியை தேர்ந்தெடுக்கவும் / భాష ఎంచుకోండి
      </Text>

      {languages.map((lang) => (
        <TouchableOpacity
          key={lang.code}
          style={styles.languageButton}
          onPress={() => selectLanguage(lang.code)}
        >
          <Text style={styles.languageName}>{lang.name}</Text>
          <Text style={styles.nativeName}>{lang.nativeName}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: "#666",
    textAlign: "center",
  },
  languageButton: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 8,
    width: "80%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  languageName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  nativeName: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
});
