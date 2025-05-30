import Text from "@/components/common/Text";
import { useFetchByType } from "@/queries/fetch";
import { Link } from "expo-router";
import { useHasOnBoarded } from "@/hooks/useHasOnBoarded";
import Box from "@/components/common/Box";
import MangaHorizontalList from "@/components/home/MangaHorizontalList";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";

export default function HomePage() {
    const followedCount = useFetchByType("followedCount");
    const latestUploadedChapter = useFetchByType("latestUploadedChapter");
    const relevance = useFetchByType("relevance");

    const { hasOnBoarded, checkedStorage } = useHasOnBoarded();

    // if (!checkedStorage || hasOnBoarded === null) return null;

    return (
        <GestureHandlerRootView>
            <ScrollView nestedScrollEnabled={true}>
                <Box gap={"md"}>
                    <MangaHorizontalList type="Most Followed" mangaList={followedCount.data} />
                    <MangaHorizontalList
                        type="Latest Updates"
                        mangaList={latestUploadedChapter.data}
                    />
                    <MangaHorizontalList type="Recommanded for you" mangaList={relevance.data} />

                    <Link href={"/onboarding"}>
                        <Text color={"accent"}>Onboarding</Text>
                    </Link>
                </Box>
            </ScrollView>
        </GestureHandlerRootView>
    );
}
