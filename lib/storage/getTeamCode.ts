import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getTeamCode() {
    return await AsyncStorage.getItem("team-code");
}
