import Text from "@/components/common/Text";
import { useFetchByType } from "@/queries/fetch";
import { Link } from "expo-router";
import { useHasOnBoarded } from "@/hooks/useHasOnBoarded";
import Box from "@/components/common/Box";
import MangaHorizontalList from "@/components/home/MangaHorizontalList";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import { QueryStatus } from "@/components/QueryStatus";

export default function HomePage() {
    const { hasOnBoarded, checkedStorage } = useHasOnBoarded();

    // if (!checkedStorage || hasOnBoarded === null) return null;

    return (
        <GestureHandlerRootView>
            <ScrollView nestedScrollEnabled={true}>
                <Box gap={"md"}>
                    <MangaHorizontalList type="followedCount" />
                    <MangaHorizontalList type="latestUploadedChapter" />
                    <MangaHorizontalList type="relevance" />

                    <Link href={"/onboarding"}>
                        <Text color={"accent"}>Onboarding</Text>
                    </Link>
                </Box>
            </ScrollView>
        </GestureHandlerRootView>
    );
}
