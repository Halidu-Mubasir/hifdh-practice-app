import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function AppLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#ffffff',
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="configure" />
      <Stack.Screen name="trial" />
      <Stack.Screen name="summary" />
      <Stack.Screen name="test-session" />
      <Stack.Screen name="statistics" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="test-summary" />
      <Stack.Screen name="rank" />
      <Stack.Screen name="revision-mistakes" />
    </Stack>
  );
}
