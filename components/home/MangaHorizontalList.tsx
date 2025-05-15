import {
  GestureHandlerRootView,
  Pressable,
} from "react-native-gesture-handler";
import Box from "../common/Box";
import { FlatList, Image } from "react-native";
import Text from "../common/Text";
import { router } from "expo-router";
import { HomeMangaResponse } from "@/interface";

interface Props {
  mangaList: HomeMangaResponse[];
}

export default function MangaHorizontalList({ mangaList }: Props) {
  return (
    <Box width={120} height={180} gap={"sm"}>
      <GestureHandlerRootView>
        <FlatList
          horizontal={true}
          data={mangaList}
          renderItem={({ item }) => (
            <Box key={item.id} width={120}>
              <Pressable onPress={() => router.push(`/manga/${item.id}`)}>
                <Image
                  key={item.id}
                  source={{ uri: item.coverUrl }}
                  style={{ width: 120, height: 180, objectFit: "contain" }}
                />
              </Pressable>
              <Text style={{ textOverflow: "ellipsis" }}>{item.title}</Text>
            </Box>
          )}
        ></FlatList>
      </GestureHandlerRootView>
    </Box>
  );
}
