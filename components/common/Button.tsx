import { TouchableOpacity } from "react-native";
import Box from "./Box";
import Text from "./Text";

interface Props {
  label: string;
  onPress: () => void;
}

export default function Button({ label, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Box
        backgroundColor="accent"
        borderRadius="lg"
        paddingHorizontal="md"
        paddingVertical="sm"
        alignItems="center"
      >
        <Text variant="button">{label}</Text>
      </Box>
    </TouchableOpacity>
  );
}
