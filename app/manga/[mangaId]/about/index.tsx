import Box from "@/components/common/Box";
import Text from "@/components/common/Text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { GestureHandlerRootView, Pressable } from "react-native-gesture-handler";
export default function MangaAboutPage() {
    const params = useLocalSearchParams();

    return (
        <GestureHandlerRootView>
            <Box
                height={72}
                flexDirection={"row-reverse"}
                alignItems={"flex-end"}
                justifyContent={"space-between"}
                paddingHorizontal={"sm"}
                zIndex={99}
                backgroundColor={"cardBackground"}>
                <Pressable onPress={router.back}>
                    <Ionicons name="close" size={36} color="white" />
                </Pressable>
            </Box>
            <Box
                flex={1}
                backgroundColor={"cardBackground"}
                gap={"md"}
                paddingHorizontal={"lg"}
                paddingVertical={"md"}>
                <Text color={"accent"} fontSize={14}>
                    {params.status}
                </Text>
                <Text color={"textSecondary"} fontSize={14}>
                    {params.description}
                </Text>
            </Box>
        </GestureHandlerRootView>
    );
}
