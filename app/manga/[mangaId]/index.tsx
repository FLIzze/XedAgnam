import Text from "@/components/common/Text";
import { Chapters, Translation, Volumes } from "@/interface";
import {
    useFetchCoverByManga,
    useFetchMangaMetadataById,
    useFetchMangaFeed,
} from "@/queries/fetch";
import { Link } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { useEffect, useState } from "react";
import { Image } from "react-native";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";

export default function MangaPage() {
    const { mangaId } = useLocalSearchParams<{ mangaId: string }>();
    const mangaMetadata = useFetchMangaMetadataById(mangaId);
    const cover = useFetchCoverByManga(mangaMetadata.data!);
    const feed = useFetchMangaFeed(mangaId);

    const mangaAttributes = mangaMetadata.data?.attributes;

    const [volumes, setOrderedFeedDataArr] = useState<Volumes[]>();

    const titleObj = mangaMetadata.data?.attributes.title;
    let title: string = "";
    if (titleObj) {
        title = String(Object.entries(titleObj)[0][1]);
    }

    useEffect(() => {
        if (!feed.data || feed.data.length === 0) {
            return;
        }

        const feedDataArr = feed.data;

        let volumes: Volumes[] = [];
        let chapters: Chapters[] = [];
        let translations: Translation[] = [];

        let previousVolume = feedDataArr[0].attributes.volume;
        let previousChapter = feedDataArr[0].attributes.chapter;

        feedDataArr.forEach(feedData => {
            if (previousVolume !== feedData.attributes.volume) {
                volumes.push({
                    volume: previousVolume,
                    chapters: chapters,
                });

                previousVolume = feedData.attributes.volume;
                chapters = [];
            }

            if (previousChapter !== feedData.attributes.chapter) {
                chapters.push({
                    chapter: previousChapter,
                    translations: translations,
                });

                previousChapter = feedData.attributes.chapter;
                translations = [];
            }

            translations.push({
                lang: feedData.attributes.translatedLanguage,
                title: feedData.attributes.title,
                id: feedData.id,
            });
        });

        volumes.push({
            volume: "None",
            chapters: chapters,
        });
        setOrderedFeedDataArr(volumes);
    }, [feed.data]);

    return (
        <GestureHandlerRootView>
            <ScrollView>
                <Image
                    key={mangaMetadata.data?.id}
                    source={{ uri: cover.data }}
                    style={{ width: 200, height: 200 }}
                />
                <Text variant="header">
                    title: {title + "\n"}
                    id: {mangaMetadata.data?.id + "\n"}
                    demographic: {mangaAttributes?.publicationDemographic + "\n"}
                    year: {mangaAttributes?.year + "\n"}
                    status: {mangaAttributes?.status + "\n"}
                    description: {mangaAttributes?.description.en + "\n"}
                </Text>

                {volumes?.map((volume, index) => {
                    return (
                        <Text key={index}>
                            Volume: {volume.volume + "\n"}
                            {volume.chapters.map((chapter, index) => {
                                return (
                                    <Text key={index} style={{ marginLeft: 40 }}>
                                        Chapter: {chapter.chapter + "\n"}
                                        {chapter.translations.map((translation, index) => {
                                            return (
                                                <Link
                                                    key={index}
                                                    style={{ marginLeft: 80, color: "red" }}
                                                    href={{
                                                        params: {
                                                            mangaId: mangaId,
                                                            chapterId: translation.id,
                                                        },
                                                        pathname:
                                                            "/manga/[mangaId]/chapter/[chapterId]",
                                                    }}>
                                                    {translation.lang + "\n"}
                                                </Link>
                                            );
                                        })}
                                    </Text>
                                );
                            })}
                        </Text>
                    );
                })}
            </ScrollView>
        </GestureHandlerRootView>
    );
}
