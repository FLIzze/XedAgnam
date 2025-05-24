import Text from "@/components/common/Text";
import { FeedData } from "@/interface";
import {
    useFetchCoverByManga,
    useFetchMangaById as useFetchMangaMetadataById,
    useFetchMangaFeed,
} from "@/queries/fetch";
import { Link } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { Dispatch, SetStateAction } from "react";
import { Image, View } from "react-native";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";

export default function MangaPage() {
    const { mangaId } = useLocalSearchParams<{ mangaId: string }>();
    const mangaMetadata = useFetchMangaMetadataById(mangaId);
    const mangaAttributes = mangaMetadata.data?.attributes;

    const titleObj = mangaMetadata.data?.attributes.title;
    let title: string = "";
    if (titleObj) {
        title = String(Object.entries(titleObj)[0][1]);
    }

    const cover = useFetchCoverByManga(mangaMetadata.data!);
    const feedDataArr = useFetchMangaFeed(mangaId);

    return (
        <View></View>
        // <GestureHandlerRootView>
        //     <ScrollView>
        //         <Image
        //             key={mangaMetadata.data?.id}
        //             source={{ uri: cover.data }}
        //             style={{ width: 200, height: 200 }}
        //         />
        //         <Text variant="header">
        //             title: {title + "\n"}
        //             id: {mangaMetadata.data?.id + "\n"}
        //             demographic: {mangaAttributes?.publicationDemographic + "\n"}
        //             year: {mangaAttributes?.year + "\n"}
        //             status: {mangaAttributes?.status + "\n"}
        //             description: {mangaAttributes?.description.en + "\n"}
        //         </Text>

        //         {feedDataArr.data?.map((feedData, index) => {
        //             if (feedData.attributes.volume !== previousVolume) {
        //                 setPreviousVolume(feedData.attributes.volume);

        //                 return (
        //                     <Text key={index}>
        //                         Volume {previousVolume + "\n"}
        //                         <ChaptersDisplay
        //                             index={index}
        //                             mangaId={mangaId!}
        //                             chapter={feedData}
        //                             previousChapter={previousChapter}
        //                             setPreviousChapter={setPreviousChapter}
        //                         />
        //                     </Text>
        //                 );
        //             }

        //             return (
        //                 <ChaptersDisplay
        //                     index={index}
        //                     mangaId={mangaId!}
        //                     chapter={feedData}
        //                     key={index}
        //                     previousChapter={previousChapter}
        //                     setPreviousChapter={setPreviousChapter}
        //                 />
        //             );
        //         })}
        //     </ScrollView>
        // </GestureHandlerRootView>
    );
}

function ChaptersDisplay({
    index,
    mangaId,
    chapter,
    previousChapter,
    setPreviousChapter,
}: {
    index: number;
    mangaId: string;
    chapter: FeedData;
    previousChapter: string;
    setPreviousChapter: Dispatch<SetStateAction<string>>;
}) {
    if (previousChapter !== chapter.attributes.chapter) {
        setPreviousChapter(chapter.attributes.chapter);

        return (
            <Text style={{ marginLeft: 80 }}>
                Chapter {chapter.attributes.chapter}
                <ChapterLink index={index} mangaId={mangaId} chapter={chapter} />
            </Text>
        );
    }

    return <ChapterLink index={index} mangaId={mangaId} chapter={chapter} />;
}

function ChapterLink({
    index,
    mangaId,
    chapter,
}: {
    index: number;
    mangaId: string;
    chapter: FeedData;
}) {
    return (
        <Link
            key={index}
            href={{
                params: {
                    mangaId: mangaId,
                    chapterId: chapter.id,
                },
                pathname: "/manga/[mangaId]/chapter/[chapterId]",
            }}
            style={{ paddingLeft: 40, color: "red" }}>
            {chapter.attributes.translatedLanguage}
        </Link>
    );
}
