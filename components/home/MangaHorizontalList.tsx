import { Pressable } from "react-native-gesture-handler";
import Box from "../common/Box";
import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet } from "react-native";
import Text from "../common/Text";
import { router } from "expo-router";
import { HomeMangaResponse } from "@/interface";
import { useFetchByType } from "@/queries/fetch";
import { Filter } from "@/types";
import { QueryStatus } from "../QueryStatus";

export default function MangaHorizontalList({ type }: { type: Filter }) {
    return (
        <Box gap={"sm"}>
            <ScrollView horizontal={true}>
                {Array.from({ length: 10 }, (_, index) => (
                    <DisplayCover type={type} index={index} key={index} />
                ))}
            </ScrollView>
        </Box>
    );
}

function DisplayCover({ type, index }: { type: Filter; index: number }) {
    const mangaResponseQuery = useFetchByType(type, index);

    return (
        <>
            <QueryStatus query={mangaResponseQuery} name="cover" />
            {mangaResponseQuery.data && (
                <Text>
                    <Image
                        key={mangaResponseQuery.data.id}
                        source={{ uri: mangaResponseQuery.data.coverUrl }}
                        style={{ width: 120, height: 180, objectFit: "cover" }}
                    />
                </Text>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    outlinedText: {
        fontWeight: "bold",
        textShadowColor: "#000000",
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 1,
    },
});

// <FlatList
//     horizontal={true}
//     showsHorizontalScrollIndicator={false}
//     ListHeaderComponent={<Box paddingLeft={"md"} />}
//     ListFooterComponent={<Box paddingRight={"md"} />}
//     ItemSeparatorComponent={() => <Box paddingLeft={"sm"} />}
//     bounces={false}
//     overScrollMode="never"
//     data={mangaList}
//     renderItem={({ item, index }) => (
//         <Box key={item.id} width={120}>
//             <Pressable onPress={() => router.push(`/manga/${item.id}`)}>
//                 <Image
//                     key={item.id}
//                     source={{ uri: item.coverUrl }}
//                     style={{ width: 120, height: 180, objectFit: "cover" }}
//                 />
//             </Pressable>
//             <Text
//                 color={"textPrimary"}
//                 fontSize={26}
//                 marginTop={"-md"}
//                 style={styles.outlinedText}>
//                 {index + 1}
//             </Text>
//             <Text color={"textPrimary"} fontSize={11} numberOfLines={2}>
//                 {item.title}
//             </Text>
//         </Box>
//     )}
// />
