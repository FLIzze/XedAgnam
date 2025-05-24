import { fetchPageByChapter, useFetchPageResponse } from "@/queries/fetch";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { Dimensions, FlatList, Image, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useQueries } from "@tanstack/react-query";

export default function ChapterPage() {
    const { chapterId } = useLocalSearchParams<{ chapterId: string }>();
    const pageResponse = useFetchPageResponse(chapterId);
    const chapterInfo = pageResponse.data?.chapter;

    const nbrPage = pageResponse.data?.chapter.data.length;
    const windowHeight = Dimensions.get("window").width;

    const pageQueries = useQueries({
        queries:
            chapterInfo?.data.map((_, index) => ({
                queryKey: ["chapterPage", chapterInfo?.hash, index],
                queryFn: () => fetchPageByChapter(chapterInfo, index),
                enabled: !chapterInfo,
            })) ?? [],
    });

    console.log(pageQueries);

    return (
        <View></View>
        // <GestureHandlerRootView style={{ flex: 1 }}>
        //     <FlatList
        //         data={images}
        //         keyExtractor={item => item}
        //         renderItem={({ item }) => (
        //             <Image
        //                 source={{ uri: item }}
        //                 style={{
        //                     marginTop: 10,
        //                     width: windowHeight,
        //                     height: windowHeight,
        //                     resizeMode: "contain",
        //                 }}
        //             />
        //         )}
        //     />
        // </GestureHandlerRootView>
    );
}
