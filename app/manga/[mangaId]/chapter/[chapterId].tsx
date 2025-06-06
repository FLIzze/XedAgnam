import {
    useFetchPage as useFetchPage,
    useFetchPageResponse,
    useFetchWholeFeed,
} from "@/queries/fetch";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { Dimensions, FlatList, Image, StyleSheet } from "react-native";
import { GestureHandlerRootView, Pressable } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Text from "@/components/common/Text";
import Skeleton from "@/components/common/Skeleton";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import theme from "@/theme";

export default function ChapterPage() {
    const [headersShown, setHeadersShown] = useState(false);

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
        setHeadersShown(!headersShown);
    };

    return (
        <GestureHandlerRootView style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
            {headersShown && (
                <Animated.View style={styles.topHeader} entering={FadeInUp.duration(300)}>
                    <Pressable hitSlop={32} onPress={() => router.push(`/manga/${mangaId}`)}>
                        <Ionicons name="chevron-back" size={28} color="white" />
                    </Pressable>
                    <Text fontSize={18}>Ch. {chapterIndex + 1}</Text>
                </Animated.View>
            )}
            <Pressable onPress={toggleHeader} style={{ flex: 1 }}>
                {hash && pages && (
                    <FlatList
                        data={pages}
                        renderItem={({ item }) => <PageImage pageUrl={item} hash={hash} />}
                        initialNumToRender={3}
                        windowSize={60}
                        maxToRenderPerBatch={3}
                    />
                )}
            </Pressable>
            {headersShown && (
                <Animated.View entering={FadeInDown.duration(300)} style={styles.bottomHeader}>
                    {previousChapterId && (
                        <Pressable
                            hitSlop={32}
                            onPress={() =>
                                router.push(`/manga/${mangaId}/chapter/${previousChapterId}`)
                            }>
                            <Ionicons name="chevron-back" size={28} color="white" />
                        </Pressable>
                    )}
                    {nextChapterId && (
                        <Pressable
                            hitSlop={32}
                            onPress={() =>
                                router.push(`/manga/${mangaId}/chapter/${nextChapterId}`)
                            }>
                            <Ionicons name="chevron-forward" size={28} color="white" />
                        </Pressable>
                    )}
                </Animated.View>
            )}
        </GestureHandlerRootView>
    );
}

function PageImage({ pageUrl: dataSaver, hash }: { pageUrl: string; hash: string }) {
    const pageQuery = useFetchPage(dataSaver, hash);
    const windowWidth = Dimensions.get("window").width;
    const [imageSize, setImageSize] = useState({ width: windowWidth, height: 400 });

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
            {pageQuery.data ? (
                <Image
                    source={{ uri: pageQuery.data }}
                    style={{
                        width: imageSize.width,
                        height: imageSize.height,
                        resizeMode: "contain",
                    }}
                />
            ) : (
                <Skeleton width={imageSize.width} height={imageSize.height} />
            )}
        </>
    );
}

const styles = StyleSheet.create({
    topHeader: {
        height: 80,
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "flex-start",
        gap: theme.spacing.lg,
        paddingHorizontal: theme.spacing.sm,
        paddingBottom: theme.spacing.sm,
        backgroundColor: theme.colors.background,
    },
    bottomHeader: {
        height: 74,
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        paddingHorizontal: theme.spacing.sm,
        paddingTop: theme.spacing.sm,
        gap: theme.spacing.lg,
        backgroundColor: theme.colors.background,
    },
});
