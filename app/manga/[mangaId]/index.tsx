import Text from "@/components/common/Text";
import { QueryStatus } from "@/components/QueryStatus";
import { FeedData, Manga } from "@/interface";
import {
    useFetchCoverByManga,
    useFetchMangaFeed,
    useFetchMangaMetadataById,
} from "@/queries/fetch";
import { Link, useLocalSearchParams } from "expo-router";
import { Image, ActivityIndicator, FlatList } from "react-native";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";

export default function MangaPage() {
    const { mangaId } = useLocalSearchParams<{ mangaId: string }>();
    const metadataQuery = useFetchMangaMetadataById(mangaId);

    return (
        <GestureHandlerRootView>
            <QueryStatus query={metadataQuery} name="metadata" />
            {metadataQuery.data && (
                <>
                    <ScrollView>
                        <DisplayCover manga={metadataQuery.data} />
                        <DisplayMetadata metadata={metadataQuery.data} />
                    </ScrollView>
                    <DisplayChapters mangaId={mangaId} />
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
                <Image source={{ uri: coverQuery.data }} style={{ width: 200, height: 200 }} />
            )}
        </>
    );
}

function DisplayMetadata({ metadata }: { metadata: Manga }) {
    const mangaAttributes = metadata.attributes;
    const titleObj = metadata.attributes.title;
    let title: string = "";
    if (titleObj) {
        title = String(Object.entries(titleObj)[0][1]);
    }

    return (
        <Text variant="header">
            title: {title + "\n"}
            id: {metadata.id + "\n"}
            demographic: {mangaAttributes.publicationDemographic + "\n"}
            year: {mangaAttributes.year + "\n"}
            status: {mangaAttributes.status + "\n"}
            description: {mangaAttributes.description.en + "\n"}
            Tags: {"\n"}
            {mangaAttributes.tags.map(attribute => (
                <Text key={attribute.id}>{attribute.attributes.name.en + "\n"}</Text>
            ))}
        </Text>
    );
}

function DisplayChapters({ mangaId }: { mangaId: string }) {
    const limit = 40;
    const chapterQuery = useFetchMangaFeed(mangaId, limit);
    const chapters = chapterQuery.data?.pages.flat() ?? [];

    return (
        <>
            <QueryStatus query={chapterQuery} name="chapters" />
            <FlatList
                data={chapters}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <DisplayChaptersLink item={item} mangaId={mangaId} />}
                onEndReached={() => {
                    if (chapterQuery.hasNextPage && !chapterQuery.isFetchingNextPage) {
                        chapterQuery.fetchNextPage();
                    }
                }}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    chapterQuery.isFetchingNextPage ? <ActivityIndicator size="large" /> : null
                }
                ListEmptyComponent={<Text>No chapters available.</Text>}
            />
        </>
    );
}

function DisplayChaptersLink({ item, mangaId }: { item: FeedData; mangaId: string }) {
    return (
        <Link
            key={item.id}
            style={{
                marginVertical: 10,
                marginLeft: 80,
                color: "red",
                textAlign: "center",
            }}
            href={{
                params: {
                    mangaId,
                    chapterId: item.id,
                },
                pathname: "/manga/[mangaId]/chapter/[chapterId]",
            }}>
            {item.attributes.chapter}
        </Link>
    );
}
