import Box from "@/components/common/Box";
import Text from "@/components/common/Text";
import { QueryStatus } from "@/components/QueryStatus";
import { FeedData, Manga } from "@/interface";
import {
    useFetchAuthor,
    useFetchCoverByManga,
    useFetchMangaFeed,
    useFetchMangaMetadataById,
} from "@/queries/fetch";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Image, ActivityIndicator, FlatList, StyleSheet, View, Button } from "react-native";
import { GestureHandlerRootView, Pressable } from "react-native-gesture-handler";

export default function MangaPage() {
    const { mangaId } = useLocalSearchParams<{ mangaId: string }>();
    const metadataQuery = useFetchMangaMetadataById(mangaId);

    return (
        <GestureHandlerRootView>
            <QueryStatus query={metadataQuery} name="metadata" />
            {metadataQuery.data && (
                <>
                    <Box
                        height={64}
                        flexDirection={"row"}
                        alignItems={"flex-end"}
                        justifyContent={"space-between"}
                        paddingHorizontal={"sm"}
                        zIndex={99}>
                        <Pressable onPress={router.back}>
                            <Ionicons name="chevron-back" size={28} color="white" />
                        </Pressable>
                        <Pressable
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
            <QueryStatus query={coverQuery} name="cover" />
            {coverQuery.data && (
                <View style={styles.container}>
                    <Image
                        source={{ uri: coverQuery.data }}
                        resizeMode="cover"
                        style={styles.image}
                    />
                </View>
            )}
        </>
    );
}

function DisplayAuthor({ authorId }: { authorId: string }) {
    const author = useFetchAuthor(authorId);

    return (
        <>
            <QueryStatus query={author} name="author" />
            {author.data && <Text>{author.data.attributes.name}</Text>}
        </>
    );
}

function DisplayMetadata({ metadata }: { metadata: Manga }) {
    const mangaAttributes = metadata.attributes;

    const title = metadata.attributes.title.en;
    const author = metadata.relationships.find(el => el.type === "author");
    const artist = metadata.relationships.find(el => el.type === "artist");

    return (
        <Box paddingHorizontal={"lg"} gap={"sm"} height={240}>
            <Box flexDirection={"row"} gap={"sm"}>
                {mangaAttributes.tags.slice(0, 3).map(attribute => (
                    <Text fontSize={12} key={attribute.id} style={styles.textWithShadow}>
                        {attribute.attributes.name.en}
                    </Text>
                ))}
            </Box>
            <Text color={"textPrimary"} fontSize={18} style={styles.textWithShadow}>
                {title}
            </Text>
            <Text color={"textPrimary"} style={styles.textWithShadow}>
                {mangaAttributes.publicationDemographic + "\n"}
                {author && artist && (
                    <>
                        {author.id !== artist.id ? (
                            <>
                                Author: <DisplayAuthor authorId={author.id} />
                                Artist: <DisplayAuthor authorId={artist.id} />
                            </>
                        ) : (
                            <>
                                Author and Artist:
                                <DisplayAuthor authorId={artist.id} />
                            </>
                        )}
                    </>
                )}
            </Text>
        </Box>
    );
}

function DisplayChapters({ mangaId, metadata }: { mangaId: string; metadata: Manga }) {
    const limit = 40;
    const chapterQuery = useFetchMangaFeed(mangaId, limit);
    const chapters = chapterQuery.data?.pages.flat() ?? [];

    const [invertedChapterList, setInvertedChapterList] = useState<boolean>(false);

    return (
        <>
            <Button
                title="filter"
                onPress={() => {
                    setInvertedChapterList(!invertedChapterList);
                }}
            />
            <FlatList
                data={invertedChapterList ? [...chapters].reverse() : chapters}
                keyExtractor={item => item.id}
                overScrollMode="never"
                renderItem={({ item, index }) => {
                    const displayIndex = invertedChapterList ? chapters.length - 1 - index : index;
                    return (
                        <DisplayChaptersLink item={item} index={displayIndex} mangaId={mangaId} />
                    );
                }}
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
            <QueryStatus query={chapterQuery} name="chapters" />
        </>
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
                router.push({
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
                <Text fontSize={13}>Ch. {item.attributes.chapter}</Text>
                <Text fontSize={13}>#{index}</Text>
            </Box>
        </Pressable>
    );
}

function EmptyComponent({ isLoading }: { isLoading: boolean }) {
    if (!isLoading) {
        return (
            <Box backgroundColor={"background"}>
                <Text color={"textPrimary"}>No chapters available.</Text>
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
