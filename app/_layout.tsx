import { queryClient } from "@/queries";
import { logo } from "@/assets/images";
import theme from "@/theme";
import { ThemeProvider } from "@shopify/restyle";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "react-native";

const asyncStoragePersister = createAsyncStoragePersister({
    storage: AsyncStorage,
});

function LogoTitle() {
    return <Image source={logo} style={{ width: 70, height: 70 }} />;
}

export default function RootLayout() {
    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister: asyncStoragePersister }}>
            <ThemeProvider theme={theme}>
                <Stack
                    screenOptions={{
                        contentStyle: { backgroundColor: theme.colors.background },
                        headerStyle: {
                            backgroundColor: theme.colors.cardBackground,
                        },
                        headerTitleStyle: {
                            color: theme.colors.accent,
                        },
                    }}>
                    <Stack.Screen
                        name="(tabs)"
                        options={{
                            headerShown: true,
                            title: "Home",
                            headerTitle: props => <LogoTitle />,
                            headerBackVisible: false,
                        }}
                    />

                    <Stack.Screen name="onboarding/index" options={{ headerShown: false }} />
                    <Stack.Screen
                        name="manga/[mangaId]/index"
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="manga/[mangaId]/about/index"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="manga/[mangaId]/chapter/[chapterId]"
                        options={{ headerShown: false }}
                    />
                </Stack>
            </ThemeProvider>
        </PersistQueryClientProvider>
    );
}
