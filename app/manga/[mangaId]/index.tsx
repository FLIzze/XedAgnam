import Box from "@/components/common/Box";
import Skeleton from "@/components/common/Skeleton";
import Text from "@/components/common/Text";
import { FeedData, Manga } from "@/interface";
import {
    useFetchAuthor,
    useFetchCoverByManga,
    useFetchMangaFeed,
    useFetchMangaMetadataById,
} from "@/queries/fetch";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { Image, ActivityIndicator, FlatList, StyleSheet } from "react-native";
import { GestureHandlerRootView, Pressable } from "react-native-gesture-handler";
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInLeft,
    FadeInRight,
    FadeInUp,
} from "react-native-reanimated";

export default function MangaPage() {
    const { mangaId } = useLocalSearchParams<{ mangaId: string }>();
    const metadataQuery = useFetchMangaMetadataById(mangaId);

    return (
        <GestureHandlerRootView>
            {metadataQuery.data && (
                <>
                    <Box
                        height={64}
                        flexDirection={"row"}
                        alignItems={"flex-end"}
                        justifyContent={"space-between"}
                        paddingHorizontal={"sm"}
                        zIndex={99}>
                        <Pressable hitSlop={32} onPress={() => router.replace(`/`)}>
                            <Ionicons name="chevron-back" size={28} color="white" />
                        </Pressable>
                        <Pressable
                            hitSlop={32}
                            onPress={() =>
                                router.push({
                                    pathname: `/manga/[mangaId]/about`,
                                    params: {
                                        mangaId: mangaId,
                                        status: metadataQuery.data.attributes.status,
                                        description: metadataQuery.data.attributes.description.en,
                                    },
                                })
                            }>
                            <Ionicons name="information-circle" size={28} color="white" />
                        </Pressable>
                    </Box>

                    <DisplayCover manga={metadataQuery.data} />
                    <DisplayChapters metadata={metadataQuery.data} mangaId={mangaId} />
                </>
            )}
        </GestureHandlerRootView>
    );
}

function DisplayCover({ manga }: { manga: Manga }) {
    const coverQuery = useFetchCoverByManga(manga);

    return (
        <>
            <Animated.View style={styles.container} entering={FadeIn.duration(700)}>
                {coverQuery.isLoading && <Skeleton width={"100%"} height={"100%"} />}
                {coverQuery.data && (
                    <Image
                        source={{ uri: coverQuery.data }}
                        resizeMode="cover"
                        style={styles.image}
                    />
                )}
            </Animated.View>
            <Animated.View style={styles.gradientContainer} />
        </>
    );
}

function DisplayAuthor({ authorId }: { authorId: string }) {
    const author = useFetchAuthor(authorId);

    return (
        <>
            {author.isLoading && <Skeleton width={"40%"} height={20} />}
            {author.data && (
                <Animated.Text
                    style={{ fontSize: 14, color: "white" }}
                    entering={FadeInLeft.duration(700)}>
                    {author.data.attributes.name}
                </Animated.Text>
            )}
        </>
    );
}

function DisplayMetadata({ metadata }: { metadata: Manga }) {
    const mangaAttributes = metadata.attributes;

    const title = mangaAttributes.title.en ?? mangaAttributes.altTitles.find(el => el.en)?.en;
    const author = metadata.relationships.find(el => el.type === "author");
    const artist = metadata.relationships.find(el => el.type === "artist");

    return (
        <Box paddingHorizontal={"lg"} gap={"sm"} height={240}>
            <Box flexDirection={"row"} gap={"sm"}>
                <Animated.View
                    entering={FadeInUp.duration(700)}
                    style={{ flexDirection: "row", gap: 8 }}>
                    {mangaAttributes.tags.slice(0, 3).map(attribute => (
                        <Text fontSize={12} key={attribute.id} style={styles.textWithShadow}>
                            {attribute.attributes.name.en}
                        </Text>
                    ))}
                </Animated.View>
            </Box>
            <Animated.Text
                style={{
                    color: "white",
                    fontSize: 18,
                }}
                entering={FadeInRight.duration(700)}
                numberOfLines={2}>
                {title}
            </Animated.Text>
            {author && artist && (
                <>
                    {author.id !== artist.id ? (
                        <Box flexDirection={"row"} columnGap={"xs"} flexWrap={"wrap"}>
                            <DisplayAuthor authorId={author.id} />
                            <Text fontSize={14} style={styles.textWithShadow}>
                                /
                            </Text>
                            <DisplayAuthor authorId={artist.id} />
                        </Box>
                    ) : (
                        <DisplayAuthor authorId={artist.id} />
                    )}
                </>
            )}
            <Animated.Text
                style={{ fontSize: 13, color: "white" }}
                entering={FadeInDown.duration(700)}>
                {mangaAttributes.publicationDemographic}
            </Animated.Text>
        </Box>
    );
}

function DisplayChapters({ mangaId, metadata }: { mangaId: string; metadata: Manga }) {
    const limit = 40;
    const chapterQuery = useFetchMangaFeed(mangaId, limit);
    const chapters = chapterQuery.data?.pages.flat() ?? [];

    return (
        <Animated.View entering={FadeIn.duration(700)}>
            {chapterQuery.data && (
                <FlatList
                    data={chapters}
                    keyExtractor={item => item.id}
                    overScrollMode="never"
                    renderItem={({ item, index }) => (
                        <DisplayChaptersLink item={item} index={index} mangaId={mangaId} />
                    )}
                    onEndReached={() => {
                        if (chapterQuery.hasNextPage && !chapterQuery.isFetchingNextPage) {
                            chapterQuery.fetchNextPage();
                        }
                    }}
                    onEndReachedThreshold={0.5}
                    ListHeaderComponent={() => <DisplayMetadata metadata={metadata} />}
                    ListFooterComponent={
                        chapterQuery.isFetchingNextPage ? <ActivityIndicator size="large" /> : null
                    }
                    ListEmptyComponent={() => <EmptyComponent isLoading={chapterQuery.isLoading} />}
                    ItemSeparatorComponent={() => <Box height={1} backgroundColor={"border"}></Box>}
                    style={{ marginTop: 12 }}
                />
            )}
        </Animated.View>
    );
}

function DisplayChaptersLink({
    item,
    index,
    mangaId,
}: {
    item: FeedData;
    index: number;
    mangaId: string;
}) {
    return (
        <Pressable
            key={item.id}
            onPress={() =>
                router.replace({
                    pathname: "/manga/[mangaId]/chapter/[chapterId]",
                    params: {
                        mangaId,
                        chapterId: item.id,
                    },
                })
            }>
            <Box
                height={60}
                alignItems={"center"}
                justifyContent={"space-between"}
                width={"100%"}
                backgroundColor={"background"}
                flexDirection={"row"}
                paddingHorizontal={"md"}>
                <Text style={{ fontSize: 13, color: "white" }}>Ch. {item.attributes.chapter}</Text>
                <Text style={{ fontSize: 13, color: "white" }}>#{index + 1}</Text>
            </Box>
        </Pressable>
    );
}

function EmptyComponent({ isLoading }: { isLoading: boolean }) {
    if (!isLoading) {
        return (
            <Box backgroundColor={"background"}>
                <Text
                    style={{
                        fontSize: 13,
                        color: "white",
                        alignItems: "center",
                    }}>
                    No chapters available.
                </Text>
            </Box>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 312,
        width: "100%",
        overflow: "hidden",
        position: "absolute",
    },
    gradientContainer: {
        height: 312,
        width: "100%",
        position: "absolute",
        backgroundColor: "#000000",
        opacity: 0.3,
    },
    image: {
        height: "180%",
        opacity: 0.8,
    },
    textWithShadow: {
        textShadowColor: "rgba(0, 0, 0, 0.75)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 10,
    },
});
