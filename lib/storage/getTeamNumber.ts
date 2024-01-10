import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getTeamNumber() {
  const teamNumberString = await AsyncStorage.getItem("team-number");

  if (!teamNumberString) {
    throw new Error("Team number not set");
  }

  const teamNumber = parseInt(teamNumberString);

  if (isNaN(teamNumber)) {
    throw new Error("Invalid team number set");
  }
  return teamNumber;
}
