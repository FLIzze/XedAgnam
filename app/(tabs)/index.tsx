import Text from "@/components/common/Text";
import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function HomePage() {
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
