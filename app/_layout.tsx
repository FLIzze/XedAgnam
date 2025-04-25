import { queryClient } from "@/queries";
import theme from "@/theme";
import { ThemeProvider } from "@shopify/restyle";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

export default function RootLayout() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
    >
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
    </PersistQueryClientProvider>
  );
}
