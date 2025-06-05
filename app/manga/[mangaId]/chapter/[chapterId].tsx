import {
    useFetchPage as useFetchPage,
    useFetchPageResponse,
    useFetchWholeFeed,
} from "@/queries/fetch";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { Dimensions, FlatList, Image } from "react-native";
import { GestureHandlerRootView, Pressable } from "react-native-gesture-handler";
import { QueryStatus } from "@/components/QueryStatus";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Box from "@/components/common/Box";
import Text from "@/components/common/Text";

export default function ChapterPage() {
    const [headerShown, setHeaderShown] = useState(false);

    const { chapterId, mangaId } = useLocalSearchParams<{ chapterId: string; mangaId: string }>();

    const pageResponseQuery = useFetchPageResponse(chapterId);
    const feedQuery = useFetchWholeFeed(mangaId);

    let chapterIndex: number = -1;

    if (!feedQuery.data) {
        return;
    }

    // for some reason findIndex was not working if index is 0?
    for (let i = 0; i < feedQuery.data.length; i++) {
        if (feedQuery.data[i].id === chapterId) {
            chapterIndex = i;
            break;
        }
    }

    let previousChapterId: string | null = null;
    let nextChapterId: string | null = null;

    if (chapterIndex > 0) {
        previousChapterId = feedQuery.data[chapterIndex - 1]?.id ?? null;
    }
    if (chapterIndex < (feedQuery.data?.length ?? 0) - 1) {
        nextChapterId = feedQuery.data[chapterIndex + 1]?.id ?? null;
    }

    const chapter = pageResponseQuery.data?.chapter;
    const pages = chapter?.dataSaver ?? [];
    const hash = chapter?.hash;

    const toggleHeader = () => {
        setHeaderShown(!headerShown);
    };

    return (
        <GestureHandlerRootView>
            {headerShown && (
                <Box
                    height={64}
                    flexDirection={"row"}
                    alignItems={"flex-end"}
                    justifyContent={"flex-start"}
                    gap={"lg"}
                    paddingHorizontal={"sm"}
                    zIndex={99}
                    marginBottom={"sm"}>
                    <Pressable onPress={() => router.push(`/manga/${mangaId}`)}>
                        <Ionicons name="chevron-back" size={28} color="white" />
                    </Pressable>
                    <Text fontSize={18}>Ch. {chapterIndex}</Text>
                </Box>
            )}
            <Pressable onPress={toggleHeader} style={{ flex: 1 }}>
                <QueryStatus query={pageResponseQuery} name="pageResponse" />
                {hash && pages && (
                    <FlatList
                        data={pages}
                        renderItem={({ item }) => <PageImage pageUrl={item} hash={hash} />}
                        initialNumToRender={3}
                        windowSize={pages.length}
                        maxToRenderPerBatch={3}
                    />
                )}
            </Pressable>
            {headerShown && (
                <Box
                    height={58}
                    flexDirection={"row"}
                    alignItems={"flex-start"}
                    justifyContent={"flex-end"}
                    paddingHorizontal={"sm"}
                    zIndex={99}
                    marginTop={"sm"}
                    gap={"lg"}>
                    {previousChapterId && (
                        <Pressable
                            onPress={() =>
                                router.push(`/manga/${mangaId}/chapter/${previousChapterId}`)
                            }>
                            <Ionicons name="chevron-back" size={28} color="white" />
                        </Pressable>
                    )}
                    {nextChapterId && (
                        <Pressable
                            onPress={() =>
                                router.push(`/manga/${mangaId}/chapter/${nextChapterId}`)
                            }>
                            <Ionicons name="chevron-forward" size={28} color="white" />
                        </Pressable>
                    )}
                </Box>
            )}
        </GestureHandlerRootView>
    );
}

function PageImage({ pageUrl: dataSaver, hash }: { pageUrl: string; hash: string }) {
    const pageQuery = useFetchPage(dataSaver, hash);
    const windowWidth = Dimensions.get("window").width;
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (pageQuery.data) {
            Image.getSize(pageQuery.data, (w, h) =>
                setImageSize({
                    width: windowWidth,
                    height: h * (windowWidth / w),
                })
            );
        }
    });

    return (
        <>
            <QueryStatus query={pageQuery} name="image" />
            {pageQuery.data && (
                <Image
                    source={{ uri: pageQuery.data }}
                    style={{
                        width: imageSize.width,
                        height: imageSize.height,
                        resizeMode: "contain",
                    }}
                />
            )}
        </>
    );
}
