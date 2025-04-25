import Text from "@/components/common/Text";
import { FetchType } from "@/enum";
import { useFetchByType } from "@/queries/fetch";
import { Link, router } from "expo-router";
import { StyleSheet, View, Image } from "react-native";
import { GestureHandlerRootView, Pressable, ScrollView } from "react-native-gesture-handler";

export default function HomePage() {
        const {data} = useFetchByType(FetchType.FollowedCount);
        
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text variant="header">Home Page</Text>

      <GestureHandlerRootView>
              <ScrollView
                      horizontal={true}
              >
              {data?.map((manga) => (
                      <View
                              key={manga.id}
                      >
                              <Pressable onPress={() => router.push(`/manga/${manga.id}`)}
                                >
                                      <Image
                                              key={manga.id}
                                              source={{ uri: manga.coverUrl }}
                                              style={{width: 300, height: 300}}
                                      />
                              </Pressable>

                              <Text>{manga.title}</Text>
                       </View>
              ))}
              </ScrollView>
      </GestureHandlerRootView>

      <Link
        href={{
          pathname: "/manga/[mangaId]",
          params: { mangaId: "testupup" },
        }}
        style={styles.link}
      >
        Manga testupup
      </Link>

      <Link
        href={{
          pathname: "/onboarding",
        }}
        style={styles.link}
      >
        Onboarding
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  link: {
    textDecorationLine: "underline",
    color: "#90D5FF",
  },
});
