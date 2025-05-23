import React, { useEffect, useState } from "react";
import { fetchPageByChapter, useFetchPageResponse } from "@/queries/fetch";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { Dimensions, FlatList, Image } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function ChapterPage() {
    const [images, setImages] = useState<string[]>([]);

    const { chapterId } = useLocalSearchParams<{ chapterId: string }>();
    const pageResponse = useFetchPageResponse(chapterId);

    const nbrPage = pageResponse.data?.chapter.data.length;
    const windowHeight = Dimensions.get("window").width;

    useEffect(() => {
        const loadImg = async () => {
            for (let i = 0; i < nbrPage!; i++) {
                const chapter = await fetchPageByChapter(pageResponse.data!, i);

                setImages(images => [...images, chapter]);
            }
        };

        loadImg();
    }, [nbrPage, pageResponse.data]);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <FlatList
                data={images}
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
