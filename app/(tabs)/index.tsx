import Text from "@/components/common/Text";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router, useRootNavigationState } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function HomePage() {
  const [hasOnBoarded, setHasOnBoarded] = useState<boolean | null>(null);
  const [checkedStorage, setCheckedStorage] = useState(false);
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (!checkedStorage && rootNavigationState?.key) {
      AsyncStorage.getItem("hasOnBoarded").then((value) => {
        const onboarded = value === "true";
        setHasOnBoarded(onboarded);
        setCheckedStorage(true);
        if (!onboarded) {
          router.replace("/onboarding");
        }
      });
    }
  }, [rootNavigationState?.key, checkedStorage]);

  if (!checkedStorage || hasOnBoarded === null) return null;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text variant="header">Home Page</Text>
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
