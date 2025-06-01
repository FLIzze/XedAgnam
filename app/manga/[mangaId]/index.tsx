import Text from "@/components/common/Text";
import { QueryStatus } from "@/components/QueryStatus";
import { Manga } from "@/interface";
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
            Tags: {"\n"}
            {mangaAttributes.tags.map(attribute => (
                <Text key={attribute.id}>{attribute.attributes.name.en + "\n"}</Text>
            ))}
        </Text>
    );
}

function DisplayChapters({ mangaId }: { mangaId: string }) {
    const feedQuery = useFetchMangaFeed(mangaId);

    return (
        <>
            <QueryStatus query={feedQuery} name="feed" />

            {feedQuery.data && feedQuery.data.length === 0 && (
                <Text style={{ padding: 20, textAlign: "center" }}>No chapters available.</Text>
            )}

            {feedQuery.data &&
                feedQuery.data.map(feed => (
                    <Link
                        key={feed.id}
                        style={{ marginLeft: 80, color: "red", textAlign: "center" }}
                        href={{
                            params: {
                                mangaId: mangaId,
                                chapterId: feed.id,
                            },
                            pathname: "/manga/[mangaId]/chapter/[chapterId]",
                        }}>
                        {feed.attributes.chapter + "\n"}
                    </Link>
                ))}
        </>
    );
}
