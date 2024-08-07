import AsyncStorage from "@react-native-async-storage/async-storage";
import { Scouter } from "../models/scouter";

export async function getScouter() {
  const scouterString = await AsyncStorage.getItem("scouter");

  if (!scouterString) {
    throw new Error("Scouter not set");
  }

  const scouter = JSON.parse(scouterString);

  return scouter as Scouter;
}
