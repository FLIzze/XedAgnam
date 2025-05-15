import Text from "@/components/common/Text";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { View } from "react-native";

export default function ChapterPage() {
        const { mangaId, chapterId } = useLocalSearchParams<{
                mangaId: string;
                chapterId: string;
        }>();
        return (
                <View
                        style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                        }}>
                        <Text variant="header">
                                {mangaId}/{chapterId}
                        </Text>
                </View>
        );
}
