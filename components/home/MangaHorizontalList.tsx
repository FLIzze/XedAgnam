import { FlatList, Pressable } from "react-native-gesture-handler";
import { Image } from "react-native";
import { router } from "expo-router";
import { useFetchByType, useFetchCoverByManga } from "@/queries/fetch";
import { Filter } from "@/types";
import { QueryStatus } from "../QueryStatus";
import { Manga } from "@/interface";

export default function MangaHorizontalList({ type }: { type: Filter }) {
    const mangaQuery = useFetchByType(type);

    return (
        <>
            <QueryStatus query={mangaQuery} name="mangaResponse" />
            {mangaQuery.data && (
                <FlatList
                    horizontal={true}
                    data={mangaQuery.data}
                    renderItem={({ item }) => <DisplayManga manga={item} />}
                />
            )}
        </>
    );
}

function DisplayManga({ manga }: { manga: Manga }) {
    const coverQuery = useFetchCoverByManga(manga);

    return (
        <Pressable onPress={() => router.push(`/manga/${manga.id}`)}>
            <QueryStatus query={coverQuery} name="mangaResponse" />
            {coverQuery.data && (
                <Image
                    source={{ uri: coverQuery.data }}
                    style={{ width: 120, height: 180, resizeMode: "cover" }}
                />
            )}
        </Pressable>
    );
}
