import { figmaDimensionsToFieldInsets } from "../../util";
import { FieldElement } from "../FieldElement";
import { GameAction } from "../GameAction";

export function OutpostAction({
  setOverlay,
}: {
  setOverlay: (value: boolean) => void;
}) {
  return (
    <FieldElement
      edgeInsets={figmaDimensionsToFieldInsets({
        x: 9.5,
        y: 252.5,
        width: 78,
        height: 76,
      })}
    >
      <GameAction
        onPress={() => setOverlay(true)}
        color="#C1C337"
        icon="fort"
        iconSize={48}
      />
    </FieldElement>
  );
}
