import { useWindowDimensions } from "react-native";
import Box from "./common/Box";
import Text from "./common/Text";
import theme from "@/theme";
import { router } from "expo-router";
import Button from "./common/Button";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface Props {
  title: string;
  subtitle: string;
  index: number;
}

export default function OnBoardingSlide({ title, subtitle, index }: Props) {
  const { width, height } = useWindowDimensions();

  return (
    <Box
      width={width}
      alignItems="center"
      justifyContent="flex-end"
      gap="lg"
      paddingVertical="xxl"
      paddingHorizontal="md"
    >
      <Text color="textPrimary">{title}</Text>
      {index < 3 ? (
        <Text color="textSecondary">{subtitle}</Text>
      ) : (
        <Button label={subtitle} onPress={() => router.replace("/(tabs)")} />
      )}
      <Box flexDirection="row" gap="sm">
        {[...Array(4)].map((number, circleIndex) => {
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
  );
}
