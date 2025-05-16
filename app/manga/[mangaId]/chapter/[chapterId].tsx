import React from "react";
import { useFetchPagesByChapter } from "@/queries/fetch";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { Image, FlatList, Dimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function ChapterPage() {
    const { chapterId } = useLocalSearchParams<{ chapterId: string }>();
    const imgs = useFetchPagesByChapter(chapterId);

    const windowHeight = Dimensions.get("window").height;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <FlatList
                data={imgs.data}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                    <Image
                        source={{ uri: item }}
                        style={{
                            marginTop: 10,
                            width: windowHeight,
                            height: windowHeight,
                            resizeMode: "contain",
                        }}
                    />
                )}
            />
        </GestureHandlerRootView>
    );
}
