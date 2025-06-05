import { FlatList, Pressable } from "react-native-gesture-handler";
import { Image, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useFetchByType, useFetchCoverByManga } from "@/queries/fetch";
import { Filter } from "@/types";
import { QueryStatus } from "../QueryStatus";
import { Manga } from "@/interface";
import Text from "../common/Text";
import Box from "../common/Box";

export default function MangaHorizontalList({
    type,
    listTitle,
}: {
    type: Filter;
    listTitle: string;
}) {
    const mangaQuery = useFetchByType(type);

    return (
        <Box gap={"sm"}>
            <Text color={"textPrimary"} fontSize={18} paddingHorizontal={"md"}>
                {listTitle}
            </Text>
            <QueryStatus query={mangaQuery} name="mangaResponse" />
            {mangaQuery.data && (
                <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    ListHeaderComponent={<Box paddingLeft={"md"} />}
                    ListFooterComponent={<Box paddingRight={"md"} />}
                    ItemSeparatorComponent={() => <Box paddingLeft={"sm"} />}
                    bounces={false}
                    overScrollMode="never"
                    maxToRenderPerBatch={4}
                    windowSize={4}
                    initialNumToRender={4}
                    data={mangaQuery.data}
                    renderItem={({ item, index }) => <DisplayManga manga={item} index={index} />}
                />
            )}
        </Box>
    );
}

function DisplayManga({ manga, index }: { manga: Manga; index: number }) {
    const coverQuery = useFetchCoverByManga(manga);

    return (
        <Box key={manga.id} width={120}>
            <Pressable onPress={() => router.push(`/manga/${manga.id}`)}>
                <QueryStatus query={coverQuery} name="mangaResponse" />
                {coverQuery.data && (
                    <Box>
                        <Image source={{ uri: coverQuery.data }} style={styles.mangaCover} />
                    </Box>
                )}
            </Pressable>
            <Text color={"textPrimary"} fontSize={26} marginTop={"-md"} style={styles.outlinedText}>
                {index + 1}
            </Text>
            <Text color={"textPrimary"} fontSize={11} numberOfLines={2}>
                {manga.attributes.title.en}
            </Text>
        </Box>
    );
}

const styles = StyleSheet.create({
    mangaCover: {
        width: 120,
        height: 180,
        objectFit: "cover",
        borderRadius: 4,
    },
    outlinedText: {
        fontWeight: "bold",
        textShadowColor: "#000000",
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 1,
    },
});
