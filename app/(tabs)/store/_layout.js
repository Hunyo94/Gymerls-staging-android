import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="entrymodal"
        options={{
          presentation: "transparentModal",
        }}
      />
      {/* <Stack.Screen name="index" options={{}} /> */}
    </Stack>
  );
}
