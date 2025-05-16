import React from "react";
import { useFetchPagesByChapter } from "@/queries/fetch";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { Image, FlatList, Dimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function ChapterPage() {
    const { chapterId } = useLocalSearchParams<{ chapterId: string }>();
    const imgs = useFetchPagesByChapter(chapterId);

    const screenWidth = Dimensions.get("window").width;
    const baseAspectRatio = 1.5; // example: width:height ratio

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <FlatList
                data={imgs.data}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                    <Image
                        source={{ uri: item }}
                        style={{
                            width: screenWidth,
                            height: screenWidth * baseAspectRatio,
                            resizeMode: "cover",
                            marginBottom: 16,
                        }}
                    />
                )}
            />
        </GestureHandlerRootView>
    );
}
