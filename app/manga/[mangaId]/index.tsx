import Text from "@/components/common/Text";
import { QueryStatus } from "@/components/QueryStatus";
import { FeedData, Manga } from "@/interface";
import {
    useFetchCoverByManga,
    useFetchMangaMetadataById,
    useFetchMangaFeed,
} from "@/queries/fetch";
import { Link, useLocalSearchParams } from "expo-router";
import { Image } from "react-native";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";

export default function MangaPage() {
    const { mangaId } = useLocalSearchParams<{ mangaId: string }>();
    const metadataQuery = useFetchMangaMetadataById(mangaId);

    return (
        <GestureHandlerRootView>
            <QueryStatus query={metadataQuery} name="metadata" />
            {metadataQuery.data && (
                <ScrollView>
                    <DisplayCover manga={metadataQuery.data} />
                    <DisplayMetadata metadata={metadataQuery.data} />
                    <DisplayChapters mangaId={mangaId} />
                </ScrollView>
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
                <Image
                    key={manga.id}
                    source={{ uri: coverQuery.data }}
                    style={{ width: 200, height: 200 }}
                />
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
        </Text>
    );
}

function DisplayChapters({ mangaId }: { mangaId: string }) {
    const feedQuery = useFetchMangaFeed(mangaId);

    let chapter = "";

    return (
        <>
            <QueryStatus query={feedQuery} name="feed" />

            {feedQuery.data && feedQuery.data.length === 0 && (
                <Text style={{ padding: 20, textAlign: "center" }}>No chapters available.</Text>
            )}

            {feedQuery.data &&
                feedQuery.data.map((feed, index) => {
                    if (chapter !== feed.attributes.chapter) {
                        chapter = feed.attributes.chapter;
                        return (
                            <Text key={feed.id}>
                                Chapter: {chapter + "\n"}
                                <ChapterLink mangaId={mangaId} data={feed} />
                            </Text>
                        );
                    }

                    return (
                        <Text key={index}>
                            <ChapterLink mangaId={mangaId} data={feed} />
                        </Text>
                    );
                })}
        </>
    );
}

function ChapterLink({ mangaId, data }: { mangaId: string; data: FeedData }) {
    return (
        <Link
            style={{ marginLeft: 80, color: "red" }}
            href={{
                params: {
                    mangaId: mangaId,
                    chapterId: data.id,
                },
                pathname: "/manga/[mangaId]/chapter/[chapterId]",
            }}>
            {data.attributes.translatedLanguage + "\n"}
        </Link>
    );
}
