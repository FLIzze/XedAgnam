import { useFetchPage as useFetchPage, useFetchPageResponse } from "@/queries/fetch";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { Dimensions, FlatList, Image } from "react-native";
import { GestureHandlerRootView, Pressable } from "react-native-gesture-handler";
import { QueryStatus } from "@/components/QueryStatus";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Box from "@/components/common/Box";
import Text from "@/components/common/Text";
import Skeleton from "@/components/common/Skeleton";

export default function ChapterPage() {
    const [headerShown, setHeaderShown] = useState(false);

    const { chapterId } = useLocalSearchParams<{ chapterId: string }>();
    const { chapterNumber } = useLocalSearchParams<{ chapterNumber: string }>();
    const pageResponseQuery = useFetchPageResponse(chapterId);

    const chapter = pageResponseQuery.data?.chapter;
    const pages = chapter?.dataSaver ?? [];
    const hash = chapter?.hash;

    const toggleHeader = () => {
        setHeaderShown(!headerShown);
    };

    return (
        <GestureHandlerRootView>
            {headerShown && (
                <Box
                    height={64}
                    flexDirection={"row"}
                    alignItems={"flex-end"}
                    justifyContent={"flex-start"}
                    gap={"lg"}
                    paddingHorizontal={"sm"}
                    zIndex={99}
                    marginBottom={"sm"}>
                    <Pressable onPress={router.back}>
                        <Ionicons name="chevron-back" size={28} color="white" />
                    </Pressable>
                    <Text fontSize={18}>Ch. {chapterNumber}</Text>
                </Box>
            )}
            <Pressable onPress={toggleHeader} style={{ flex: 1 }}>
                {hash && pages && (
                    <FlatList
                        data={pages}
                        renderItem={({ item }) => <PageImage pageUrl={item} hash={hash} />}
                        initialNumToRender={3}
                        windowSize={99}
                        maxToRenderPerBatch={3}
                    />
                )}
            </Pressable>
            {headerShown && (
                <Box
                    height={58}
                    flexDirection={"row"}
                    alignItems={"flex-start"}
                    justifyContent={"flex-end"}
                    paddingHorizontal={"sm"}
                    zIndex={99}
                    marginTop={"sm"}
                    gap={"lg"}>
                    <Pressable onPress={() => {}}>
                        <Ionicons name="chevron-back" size={28} color="white" />
                    </Pressable>
                    <Pressable onPress={() => {}}>
                        <Ionicons name="chevron-forward" size={28} color="white" />
                    </Pressable>
                </Box>
            )}
        </GestureHandlerRootView>
    );
}

function PageImage({ pageUrl: dataSaver, hash }: { pageUrl: string; hash: string }) {
    const pageQuery = useFetchPage(dataSaver, hash);
    const windowWidth = Dimensions.get("window").width;
    const [imageSize, setImageSize] = useState({ width: windowWidth, height: 400 });

    // Used to get the page image size
    useEffect(() => {
        if (pageQuery.data) {
            Image.getSize(pageQuery.data, (w, h) =>
                setImageSize({
                    width: windowWidth,
                    height: h * (windowWidth / w),
                })
            );
        }
    });

    return (
        <>
            {pageQuery.data ? (
                <Image
                    source={{ uri: pageQuery.data }}
                    style={{
                        width: imageSize.width,
                        height: imageSize.height,
                        resizeMode: "contain",
                    }}
                />
            ) : (
                <Skeleton width={imageSize.width} height={imageSize.height} />
            )}
        </>
    );
}
