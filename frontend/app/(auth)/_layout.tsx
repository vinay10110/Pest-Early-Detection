import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="language-select"
        options={{ title: "Select Language" }}
      />
    </Stack>
  );
}
