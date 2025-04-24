import theme from "@/theme";
import { ThemeProvider } from "@shopify/restyle";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ThemeProvider theme={theme}>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="onboarding/index"
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen
            name="manga/[mangaId]/index"
            options={}
          /> */}
      </Stack>
    </ThemeProvider>
  );
}
