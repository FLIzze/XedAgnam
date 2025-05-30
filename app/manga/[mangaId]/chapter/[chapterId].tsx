import { useFetchPageByChapter, useFetchPageResponse } from "@/queries/fetch";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { Dimensions, FlatList, Image } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ChapterInfo } from "@/interface";
import { QueryStatus } from "@/components/QueryStatus";

export default function ChapterPage() {
    const { chapterId } = useLocalSearchParams<{ chapterId: string }>();
    const pageResponseQuery = useFetchPageResponse(chapterId);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <QueryStatus query={pageResponseQuery} name="pageResponse" />
            {pageResponseQuery.data && (
                <FlatList
                    data={Array.from(
                        { length: pageResponseQuery.data.chapter.data.length },
                        (_, index) => index
                    )}
                    keyExtractor={index => index.toString()}
                    renderItem={({ item: index }) => (
                        <PageImage chapterInfo={pageResponseQuery.data.chapter} index={index} />
                    )}
                />
            )}
        </GestureHandlerRootView>
    );
}

function PageImage({ chapterInfo, index }: { chapterInfo: ChapterInfo; index: number }) {
    const chapterQuery = useFetchPageByChapter(chapterInfo, index);
    const windowWidth = Dimensions.get("window").width;

    return (
        <>
            <QueryStatus query={chapterQuery} name="image" />;
            {chapterQuery.data && (
                <Image
                    source={{ uri: chapterQuery.data }}
                    style={{
                        marginTop: 10,
                        width: windowWidth,
                        height: windowWidth * 1.5,
                        resizeMode: "contain",
                    }}
                />
            )}
        </>
    );
}
