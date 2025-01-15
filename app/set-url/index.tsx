import { useGlobalSearchParams, useRouter } from "expo-router";
import { useUrlPrefix } from "../../lib/lovatAPI/lovatAPI";
import { Alert } from "react-native";

export default function SetUrlPage() {
  const params = useGlobalSearchParams();
  const setUrlPrefix = useUrlPrefix((state) => state.setUrlPrefix);
  const router = useRouter();

  if (params.u && typeof params.u === "string") {
    setUrlPrefix(params.u);
    Alert.alert("API URL updated", "You can view this or reset to production in settings.");
  }

  router.back();
}