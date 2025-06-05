import { useEffect } from "react";
import { DimensionValue } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";

interface Props {
    width: DimensionValue;
    height: DimensionValue;
}

export default function Skeleton({ width, height }: Props) {
    const opacity = useSharedValue(1);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(withTiming(0.6, { duration: 500 }), withTiming(1, { duration: 500 })),
            -1
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                { width: width, height: height, borderRadius: 8, backgroundColor: "#3B4454" },
                animatedStyle,
            ]}></Animated.View>
    );
}
