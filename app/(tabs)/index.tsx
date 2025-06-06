import { useHasOnBoarded } from "@/hooks/useHasOnBoarded";
import Box from "@/components/common/Box";
import MangaHorizontalList from "@/components/home/MangaHorizontalList";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";

export default function HomePage() {
    useHasOnBoarded();
    // const { checkedStorage, hasOnBoarded } = useHasOnBoarded();

    return (
        <GestureHandlerRootView>
            <ScrollView nestedScrollEnabled={true}>
                <Box gap={"md"}>
                    <MangaHorizontalList listTitle="Most Followed" type="followedCount" />
                    <MangaHorizontalList listTitle="Latest Updates" type="latestUploadedChapter" />
                    <MangaHorizontalList listTitle="Recommanded for you" type="relevance" />
                    <Box marginBottom={"xs"} />
                </Box>
            </ScrollView>
        </GestureHandlerRootView>
    );
}
