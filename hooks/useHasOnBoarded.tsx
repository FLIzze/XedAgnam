import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";

export function useHasOnBoarded() {
<<<<<<< HEAD
    const [hasOnBoarded, setHasOnBoarded] = useState<boolean | null>(null);
    const [checkedStorage, setCheckedStorage] = useState(false);
    // const rootNavigationState = useRootNavigationState();

    // useEffect(() => {
    //         if (!checkedStorage && rootNavigationState?.key) {
    //                 AsyncStorage.getItem("hasOnBoarded").then((value) => {
    //                         const onboarded = value === "true";
    //                         setHasOnBoarded(onboarded);
    //                         setCheckedStorage(true);
    //                         if (!onboarded) {
    //                                 router.replace("/onboarding");
    //                         }
    //                 });
    //         }
    // }, [rootNavigationState?.key, checkedStorage]);

    return { hasOnBoarded, checkedStorage };
=======
  const [hasOnBoarded, setHasOnBoarded] = useState<boolean | null>(null);
  const [checkedStorage, setCheckedStorage] = useState(false);

  useEffect(() => {
    if (!checkedStorage) {
      AsyncStorage.getItem("hasOnBoarded").then((value) => {
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
>>>>>>> 46ea4c88475b231a2102621b5593732a5987b91a
}
