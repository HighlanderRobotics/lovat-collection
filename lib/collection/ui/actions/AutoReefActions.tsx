import React from "react";
import { FieldElement } from "../FieldElement";
import { GameAction } from "../GameAction";
import { OverlayState } from "../GameViewTemplate";
import { MatchEventPosition } from "../../MatchEventPosition";

export const AutoReefActions = (props: {
  setOverlay: (value: OverlayState) => void;
  setOverlayPos: (value: MatchEventPosition) => void;
}) => {
  // const addEvent = useReportStateStore((state) => state.addEvent);
  return (
    <>
      <FieldElement edgeInsets={[0, 0.435, 0, 0.435]}>
        <GameAction
          color="#9cff9a"
          backgroundPath="M1.80241 10.7928C-0.889723 6.12989 2.47056 0.300326 7.85481 0.292805L87.9559 0.180916C90.8414 0.176885 93.5055 1.71003 94.9447 4.20282L134.884 73.3792C137.576 78.0421 134.216 83.8717 128.831 83.8792L44.0672 83.9976L1.80241 10.7928Z"
          onPress={() => {
            props.setOverlay(OverlayState.Reef);
          }}
        />
      </FieldElement>
    </>
  );
};
