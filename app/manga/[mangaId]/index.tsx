import Text from "@/components/common/Text";
import { useFetchCoverByManga, useFetchMangaById, useFetchVolumesByManga } from "@/queries/fetch";
import { Link } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { Image, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function MangaPage() {
    const { mangaId } = useLocalSearchParams<{ mangaId: string }>();
    const { data } = useFetchMangaById(mangaId);

    const titleObj = data?.attributes.title;
    let title: string = "";
    if (titleObj) {
        title = String(Object.entries(titleObj)[0][1]);
    }

    const cover = useFetchCoverByManga(data!);
    const volumesData = useFetchVolumesByManga(mangaId);
    const volumesArr = Object.values(volumesData.data?.volumes ?? {});

    return (
        <ScrollView>
            <Image
                key={data?.id}
                source={{ uri: cover.data }}
                style={{ width: 200, height: 200 }}
            />
            <Text variant="header">
                title: {title + "\n"}
                id: {data?.id + "\n"}
                demographic: {data?.attributes.publicationDemographic + "\n"}
                year: {data?.attributes.year + "\n"}
                status: {data?.attributes.status + "\n"}
                description: {data?.attributes.description.en + "\n"}
            </Text>

            {volumesArr.map((volume, volumeIndex) => {
                const chaptersArr = Object.values(volume.chapters);

                return (
                    <View key={volumeIndex}>
                        <Text>Volume: {volume.volume}</Text>

                        {chaptersArr.map((chapter, chapterIndex) => (
                            <Link
                                key={chapterIndex}
                                href={{
                                    params: {
                                        mangaId: "test2",
                                        chapterId: "testupup",
                                        pageId: "encore",
                                    },
                                    pathname: "/manga/[mangaId]/chapter/[chapterId]/[pageId]",
                                }}
                                style={{ paddingLeft: 40 }}>
                                Chapter: {chapter.chapter}
                            </Link>
                        ))}
                    </View>
                );
            })}
        </ScrollView>
    );
}
