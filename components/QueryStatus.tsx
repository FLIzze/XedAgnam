import { UseQueryResult } from "@tanstack/react-query";
import { Dimensions, DimensionValue } from "react-native";
import Text from "./common/Text";
import Skeleton from "./common/Skeleton";

export function QueryStatus({
    query,
    name,
    width,
    height,
}: {
    query: UseQueryResult<unknown>;
    name: string;
    width: DimensionValue;
    height: DimensionValue;
}) {
    const windowWidth = Dimensions.get("window").width;

    if (query.isLoading) {
        return <Skeleton width={width} height={height} />;
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
