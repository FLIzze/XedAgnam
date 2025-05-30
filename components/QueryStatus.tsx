import { UseQueryResult } from "@tanstack/react-query";
import { ActivityIndicator, Dimensions, Text, View } from "react-native";

export function QueryStatus({ query, name }: { query: UseQueryResult<unknown>; name: string }) {
    const windowWidth = Dimensions.get("window").width;

    if (query.isLoading) {
        return (
            <View
                style={{
                    height: windowWidth * 1.5,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (query.isError || !query) {
        return (
            <View
                style={{
                    height: windowWidth * 1.5,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <Text>Error loading {name}</Text>
            </View>
        );
    }

    return null;
}
