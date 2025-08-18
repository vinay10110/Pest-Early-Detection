import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    checkLanguageSelection();
  }, []);

  const checkLanguageSelection = async () => {
    try {
      const hasSelectedLanguage = await AsyncStorage.getItem(
        "hasSelectedLanguage"
      );
      setInitialRoute(
        hasSelectedLanguage ? "/(app)" : "/(auth)/language-select"
      );
    } catch (error) {
      console.error("Error checking language selection:", error);
      setInitialRoute("/(auth)/language-select");
    }
  };

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return <Redirect href={initialRoute as any} />;
}
