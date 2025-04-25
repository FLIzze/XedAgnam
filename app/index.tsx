import { View } from "react-native";
import { FetchBy, FetchType } from "./fetch";

export default function Index() {
        // FetchBy(FetchType.Relevance);
        FetchBy(FetchType.FollowedCount);
        // FetchBy(FetchType.LatestUploadedChapter);

        return (
                <View
                style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                }}
                >
                </View>
        );
}
