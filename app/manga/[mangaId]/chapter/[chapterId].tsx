import { useFetchPageByChapter, useFetchPageResponse } from "@/queries/fetch";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { Dimensions, FlatList, Image, View, ActivityIndicator, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ChapterInfo } from "@/interface";

const windowWidth = Dimensions.get("window").width;

export default function ChapterPage() {
    const { chapterId } = useLocalSearchParams<{ chapterId: string }>();
    const pageResponse = useFetchPageResponse(chapterId);
    const chapterInfo = pageResponse.data?.chapter;

    if (pageResponse.isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
                <Text>Loading chapter metadata...</Text>
            </View>
        );
    }

    if (!chapterInfo || pageResponse.isError) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Error loading chapter.</Text>
            </View>
        );
    }

    const pageCount = chapterInfo.data.length;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <FlatList
                data={Array.from({ length: pageCount }, (_, index) => index)}
                keyExtractor={index => index.toString()}
                renderItem={({ item: index }) => (
                    <PageImage chapterInfo={chapterInfo} index={index} />
                )}
            />
        </GestureHandlerRootView>
    );
}

function PageImage({ chapterInfo, index }: { chapterInfo: ChapterInfo; index: number }) {
    const { data, isLoading, isError } = useFetchPageByChapter(chapterInfo, index);

    if (isLoading) {
        return (
            <View
                style={{
                    height: windowWidth * 1.5,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (isError || !data) {
        return (
            <View
                style={{
                    height: windowWidth * 1.5,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <Text>Error loading page {index + 1}</Text>
            </View>
        );
    }

    return (
        <Image
            source={{ uri: data }}
            style={{
                marginTop: 10,
                width: windowWidth,
                height: windowWidth * 1.5,
                resizeMode: "contain",
            }}
        />
    );
}
