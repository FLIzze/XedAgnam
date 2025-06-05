import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";

export function useHasOnBoarded() {
    const [hasOnBoarded, setHasOnBoarded] = useState<boolean | null>(null);
    const [checkedStorage, setCheckedStorage] = useState(false);

    useEffect(() => {
        if (!checkedStorage) {
            AsyncStorage.getItem("hasOnBoarded").then(value => {
                const onboarded = value === "true";
                setHasOnBoarded(onboarded);
                setCheckedStorage(true);
                if (!onboarded) {
                    router.replace("/onboarding");
                }
            });
        }
    }, [checkedStorage]);

    return { hasOnBoarded, checkedStorage };
}
