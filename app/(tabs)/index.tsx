import Text from "@/components/common/Text";
import { useFetchByType } from "@/queries/fetch";
import { Link, router } from "expo-router";
import {
  StyleSheet,
  View,
  Image,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import {
  GestureHandlerRootView,
  Pressable,
  ScrollView,
} from "react-native-gesture-handler";
import { useHasOnBoarded } from "@/hooks/useHasOnBoarded";
import Box from "@/components/common/Box";
import MangaHorizontalList from "@/components/home/MangaHorizontalList";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomePage() {
  const followedCount = useFetchByType("followedCount");
  const latestUploadedChapter = useFetchByType("latestUploadedChapter");
  const relevance = useFetchByType("relevance");
  const { hasOnBoarded, checkedStorage } = useHasOnBoarded();
  const { width, height } = useWindowDimensions();

  // if (!checkedStorage || hasOnBoarded === null) return null;

  return (
    <SafeAreaView style={styles.container}>
      <Box gap={"md"} alignItems={"center"} justifyContent={"center"}>
        {followedCount.data === undefined ? (
          <ActivityIndicator />
        ) : (
          <MangaHorizontalList mangaList={followedCount.data} />
        )}

        {latestUploadedChapter.data === undefined ? (
          <ActivityIndicator />
        ) : (
          <MangaHorizontalList mangaList={latestUploadedChapter.data} />
        )}

        {relevance.data === undefined ? (
          <ActivityIndicator />
        ) : (
          <MangaHorizontalList mangaList={relevance.data} />
        )}

        <Link href={"/onboarding"}>
          <Text color={"textPrimary"}>Onboarding</Text>
        </Link>
      </Box>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  link: {
    textDecorationLine: "underline",
    color: "#90D5FF",
  },
  container: {
    flex: 1,
  },
});
