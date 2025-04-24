import Text from "@/components/common/Text";
import { Link } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { StyleSheet, View } from "react-native";

export default function MangaPage() {
  const { mangaId } = useLocalSearchParams<{ mangaId: string }>();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text variant="header">{mangaId}</Text>
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
