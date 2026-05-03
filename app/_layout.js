import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#b0ad00" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "TOLONG Disaster Assistant" }}
      />
      <Stack.Screen
        name="assistant"
        options={{ title: "TOL AI Assistant" }}
      />
    </Stack>
  );
}