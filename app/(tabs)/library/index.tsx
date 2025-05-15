import Text from "@/components/common/Text";
import { View } from "react-native";

export default function Library() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}>
            <Text variant="header">My Readings</Text>
        </View>
    );
}
