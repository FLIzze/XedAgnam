import { useFetchPage as useFetchPage, useFetchPageResponse } from "@/queries/fetch";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { Dimensions, FlatList, Image } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryStatus } from "@/components/QueryStatus";

export default function ChapterPage() {
    const { chapterId } = useLocalSearchParams<{ mangaId: string; chapterId: string }>();
    const pageResponseQuery = useFetchPageResponse(chapterId);

    const chapter = pageResponseQuery.data?.chapter;
    const pages = chapter?.dataSaver ?? [];
    const hash = chapter?.hash;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <QueryStatus query={pageResponseQuery} name="pageResponse" />
            {hash && pages && (
                <FlatList
                    data={pages}
                    renderItem={({ item }) => <PageImage pageUrl={item} hash={hash} />}
                />
            )}
        </GestureHandlerRootView>
    );
}

function PageImage({ pageUrl: dataSaver, hash }: { pageUrl: string; hash: string }) {
    const pageQuery = useFetchPage(dataSaver, hash);
    const windowWidth = Dimensions.get("window").width;

    return (
        <>
            <QueryStatus query={pageQuery} name="image" />
            {pageQuery.data && (
                <Image
                    source={{ uri: pageQuery.data }}
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
