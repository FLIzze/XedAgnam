import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import theme from "@/theme";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: theme.colors.cardBackground },
        tabBarStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="library/index"
        options={{
          title: "Library",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="library" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
