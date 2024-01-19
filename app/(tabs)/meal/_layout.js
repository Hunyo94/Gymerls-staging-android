import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
        options={{
          // Set the presentation mode to modal for our modal route.
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="sunday"
        options={{
          // Set the presentation mode to modal for our modal route.
          // presentation: "modal",
          presentation: "transparentModal",
        }}
      />
      <Stack.Screen
        name="monday"
        options={{
          // Set the presentation mode to modal for our modal route.
          presentation: "transparentModal",
        }}
      />
      <Stack.Screen
        name="tuesday"
        options={{
          // Set the presentation mode to modal for our modal route.
          presentation: "transparentModal",
        }}
      />
      <Stack.Screen
        name="wednesday"
        options={{
          // Set the presentation mode to modal for our modal route.
          presentation: "transparentModal",
        }}
      />
      <Stack.Screen
        name="thursday"
        options={{
          // Set the presentation mode to modal for our modal route.
          presentation: "transparentModal",
        }}
      />
      <Stack.Screen
        name="friday"
        options={{
          // Set the presentation mode to modal for our modal route.
          presentation: "transparentModal",
        }}
      />
      <Stack.Screen
        name="saturday"
        options={{
          // Set the presentation mode to modal for our modal route.
          presentation: "transparentModal",
        }}
      />
    </Stack>
  );
}
