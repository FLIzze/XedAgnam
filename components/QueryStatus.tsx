import { UseQueryResult } from "@tanstack/react-query";
import { ActivityIndicator, Dimensions } from "react-native";
import Box from "./common/Box";
import Text from "./common/Text";
import Skeleton from "./common/Skeleton";

export function QueryStatus({ query, name }: { query: UseQueryResult<unknown>; name: string }) {
    const windowWidth = Dimensions.get("window").width;

    if (query.isLoading) {
        return (
            // <Box alignItems={"center"} justifyContent={"center"} height={180}>
            //     <ActivityIndicator size="large" />
            // </Box>
            <Skeleton width={120} height={180} />
        );
    }

    if (query.isError || !query) {
        return (
            <Text
                style={{
                    height: windowWidth * 1.5,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                Error loading {name}
            </Text>
        );
    }

    return null;
}
