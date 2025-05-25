import { Pressable } from "react-native-gesture-handler";
import Box from "../common/Box";
import { ActivityIndicator, FlatList, Image, StyleSheet } from "react-native";
import Text from "../common/Text";
import { router } from "expo-router";
import { HomeMangaResponse } from "@/interface";

interface Props {
    type: string;
    mangaList: HomeMangaResponse[] | undefined;
}

export default function MangaHorizontalList({ type, mangaList }: Props) {
    return (
        <Box gap={"sm"}>
            <Text color={"textPrimary"} fontSize={18} paddingHorizontal={"md"}>
                {type}
            </Text>
            {mangaList === undefined ? (
                <Box alignItems={"center"} justifyContent={"center"} height={180}>
                    <ActivityIndicator size={"large"} />
                </Box>
            ) : (
                <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    ListHeaderComponent={<Box paddingLeft={"md"} />}
                    ListFooterComponent={<Box paddingRight={"md"} />}
                    ItemSeparatorComponent={() => <Box paddingLeft={"sm"} />}
                    bounces={false}
                    overScrollMode="never"
                    data={mangaList}
                    renderItem={({ item, index }) => (
                        <Box key={item.id} width={120}>
                            <Pressable onPress={() => router.push(`/manga/${item.id}`)}>
                                <Image
                                    key={item.id}
                                    source={{ uri: item.coverUrl }}
                                    style={{ width: 120, height: 180, objectFit: "cover" }}
                                />
                            </Pressable>
                            <Text
                                color={"textPrimary"}
                                fontSize={26}
                                marginTop={"-md"}
                                style={styles.outlinedText}>
                                {index + 1}
                            </Text>
                            <Text color={"textPrimary"} fontSize={11} numberOfLines={2}>
                                {item.title}
                            </Text>
                        </Box>
                    )}
                />
            )}
        </Box>
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
