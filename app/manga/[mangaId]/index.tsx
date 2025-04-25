import Text from "@/components/common/Text";
import { useFetchCoverByManga, useFetchMangaById } from "@/queries/fetch";
import { Link } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { Image, StyleSheet, View } from "react-native";

export default function MangaPage() {
  const { mangaId } = useLocalSearchParams<{ mangaId: string }>();
  const { data } = useFetchMangaById(mangaId);
  const titleObj = data?.attributes.title
  let title: string = "";
  if (titleObj) {
          title = String(Object.entries(titleObj)[0][1]);
  }
  const cover = useFetchCoverByManga(data!);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
    <Image
    key={data?.id}
    source={{ uri: cover.data }}
    style={{width: 200, height: 200}}
    />
      <Text 
      variant="header"
      >
        title: {title + "\n"}
        id: {data?.id + "\n"}        
        demographic: {data?.attributes.publicationDemographic + "\n"}
        year: {data?.attributes.year + "\n"}
        status: {data?.attributes.status + "\n"}
        lastVolume: {data?.attributes.lastVolume + "\n"}
        description: {data?.attributes.description.en + "\n"}
        lastChapter: {data?.attributes.lastChapter + "\n"}
      </Text>

      <Link
        href={{
          pathname: "/manga/[mangaId]/chapter/[chapterId]/[pageId]",
          params: {
            mangaId: mangaId,
            chapterId: "testapap",
            pageId: "testopop",
          },
        }}
        style={styles.link}
      >
        Chapitre testapap
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
