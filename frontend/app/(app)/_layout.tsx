import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export default function AppLayout() {
  const { t } = useTranslation();
  
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: t("pestDetectionSystem"),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="chat"
        options={{
          title: t("chatTitle"),
          headerShown: true,
          headerBackTitle: t("back"),
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: t("settings"),
          headerShown: true,
          headerBackTitle: t("back"),
        }}
      />
    </Stack>
  );
}
