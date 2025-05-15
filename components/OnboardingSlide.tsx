import { useWindowDimensions } from "react-native";
import Box from "./common/Box";
import Text from "./common/Text";
import theme from "@/theme";
import { router } from "expo-router";
import Button from "./common/Button";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Props {
        title: string;
        subtitle: string;
        index: number;
}

export default function OnBoardingSlide({ title, subtitle, index }: Props) {
        const { width, height } = useWindowDimensions();

        const redirectToHomeAfterOnboarding = () => {
                AsyncStorage.setItem("hasOnBoarded", "true");
                router.replace("/(tabs)");
        };

        return (
                <Box
                        width={width}
                        alignItems="center"
                        paddingVertical="xxl"
                        paddingHorizontal="md"
                >
                        <Box flex={3} alignItems="center" justifyContent="center"></Box>
                        <Box flex={1} alignItems="center" justifyContent="space-between">
                                <Text color="textPrimary">{title}</Text>
                                {index < 3 ? (
                                        <Text color="textSecondary">{subtitle}</Text>
                                ) : (
                                        <Button label={subtitle} onPress={redirectToHomeAfterOnboarding} />
                                )}
                                <Box flexDirection="row" gap="sm">
                                        {[...Array(4)].map((_, circleIndex) => {
                                                return (
                                                        <FontAwesome
                                                                name="circle"
                                                                size={8}
                                                                color={
                                                                        circleIndex === index
                                                                                ? theme.colors.accent
                                                                                : theme.colors.textSecondary
                                                                }
                                                                key={circleIndex}
                                                        />
                                                );
                                        })}
                                </Box>
                        </Box>
                </Box>
        );
}
