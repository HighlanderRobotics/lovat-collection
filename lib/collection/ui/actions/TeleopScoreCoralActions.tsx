import { TouchableOpacity, View } from "react-native";
import { FieldElement } from "../FieldElement";
import TitleLarge from "../../../components/text/TitleLarge";
import { useReportStateStore } from "../../reportStateStore";
import { MatchEventType } from "../../MatchEventType";
import { MatchEventPosition } from "../../MatchEventPosition";

export function TeleopScoreCoralActions() {
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
          <TeleopReefCoralLevel
            position={MatchEventPosition.LevelOneTeleop}
            label="L1"
          />
          <TeleopReefCoralLevel
            position={MatchEventPosition.LevelTwoTeleop}
            label="L2"
          />
        </View>
        <View
          style={{
            flexGrow: 1,
            flexDirection: "row",
            gap: 10,
          }}
        >
          <TeleopReefCoralLevel
            position={MatchEventPosition.LevelThreeTeleop}
            label="L3"
          />
          <TeleopReefCoralLevel
            position={MatchEventPosition.LevelFourTeleop}
            label="L4"
          />
        </View>
      </View>
    </FieldElement>
  );
}

function TeleopReefCoralLevel({
  position,
  label,
}: {
  position: MatchEventPosition;
  label: string;
}) {
  const addEvent = useReportStateStore((state) => state.addEvent);

  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#9cff9a4d",
        borderRadius: 7,
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
      onPress={() => {
        addEvent({
          type: MatchEventType.ScoreCoral,
          position: position,
        });
      }}
    >
      <TitleLarge color="#9cff9a">{label}</TitleLarge>
    </TouchableOpacity>
  );
}
