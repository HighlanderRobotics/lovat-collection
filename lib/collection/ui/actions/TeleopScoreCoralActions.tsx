import { TouchableOpacity, View } from "react-native";
import { FieldElement } from "../FieldElement";
import TitleLarge from "../../../components/text/TitleLarge";
import { useReportStateStore } from "../../reportStateStore";
import { MatchEventType } from "../../MatchEventType";
import { MatchEventPosition } from "../../MatchEventPosition";

export function TeleopScoreCoralActions() {
  const reportState = useReportStateStore();
  return (
    <FieldElement edgeInsets={[0.225, 0.59, 0.05, 0.025]}>
      <View
        style={{
          gap: 10,
          width: "100%",
          height: "100%",
          flexDirection: "column",
        }}
      >
        <View
          style={{
            flexGrow: 1,
            flexDirection: "row",
            gap: 10,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#9cff9a4d",
              borderRadius: 7,
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              reportState.addEvent({
                type: MatchEventType.ScoreCoral,
                position: MatchEventPosition.LevelOneTeleop,
              });
            }}
          >
            <TitleLarge color="#9cff9a">L1</TitleLarge>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#9cff9a4d",
              borderRadius: 7,
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              reportState.addEvent({
                type: MatchEventType.ScoreCoral,
                position: MatchEventPosition.LevelTwoTeleop,
              });
            }}
          >
            <TitleLarge color="#9cff9a">L2</TitleLarge>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexGrow: 1,
            flexDirection: "row",
            gap: 10,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#9cff9a4d",
              borderRadius: 7,
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              reportState.addEvent({
                type: MatchEventType.ScoreCoral,
                position: MatchEventPosition.LevelThreeTeleop,
              });
            }}
          >
            <TitleLarge color="#9cff9a">L3</TitleLarge>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#9cff9a4d",
              borderRadius: 7,
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              reportState.addEvent({
                type: MatchEventType.ScoreCoral,
                position: MatchEventPosition.LevelFourTeleop,
              });
            }}
          >
            <TitleLarge color="#9cff9a">L4</TitleLarge>
          </TouchableOpacity>
        </View>
      </View>
    </FieldElement>
  );
}
