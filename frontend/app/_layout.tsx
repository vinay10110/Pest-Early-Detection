import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import "./translations/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  const checkLanguageSelection = useCallback(async () => {
    try {
      const hasSelectedLanguage = await AsyncStorage.getItem(
        "hasSelectedLanguage"
      );
      const currentSegment = segments[0] as string;
      if (!hasSelectedLanguage && currentSegment !== "(auth)") {
        router.replace("/(auth)/language-select" as any);
      }
    } catch (error) {
      console.error("Error checking language selection:", error);
    } finally {
      setIsLoading(false);
    }
  }, [router, segments]);

  useEffect(() => {
    checkLanguageSelection();
  }, [checkLanguageSelection]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return <Slot />;
}
