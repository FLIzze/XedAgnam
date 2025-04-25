import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useRootNavigationState } from "expo-router";
import { useEffect, useState } from "react";

export function useHasOnBoarded() {
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

  return { hasOnBoarded, checkedStorage };
}
