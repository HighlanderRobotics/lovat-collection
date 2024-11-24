import React, { useEffect, useState } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  gamePhaseAtom,
  hasPiece,
  reportStateAtom,
  useAddEvent,
} from "../reportStateAtom";
import { router } from "expo-router";
import { PreMatchActions } from "./actions/PreMatchActions";
import { GameViewTemplate } from "./GameViewTemplate";
import { GamePhase, GamePiece } from "../ReportState";
import { Checkbox } from "../../components/Checkbox";
import { MatchEventType } from "../MatchEventType";
import { HasNoteActions } from "./actions/HasNoteActions";
import { ExitWingAction } from "./actions/ExitWingAction";
import * as Haptics from "expo-haptics";
import { AutoCollectPieceActions } from "./actions/AutoCollectPieceActions";
import { TouchableOpacity, View } from "react-native";
import { colors } from "../../colors";
import { Icon } from "../../components/Icon";
import { AllianceColor } from "../../models/AllianceColor";
import { GameAction } from "./GameAction";
import {
  FieldOrientation,
  fieldOrientationAtom,
} from "../../models/FieldOrientation";

type MatchStateType = {
  field: React.ReactNode,
  gamePhaseMessage: string,
  topLeftReplacement?: React.ReactNode,
}

export function Game() {
    const [reportState, setReportState] = useAtom(reportStateAtom);

    const addEvent = useAddEvent(); 
    const matchStates: Record<string, MatchStateType> = {
    preMatch: {
        field: <PreMatchActions />, 
        gamePhaseMessage: "Pre-match", 
        topLeftReplacement: <Checkbox 
            label="Loaded with a note" 
            checked={reportState?.startPiece !== GamePiece.None} 
            // onChange={(checked) => { setReportState({ ...reportState!, startPiece: checked, }); }} 
        />
    },
    AutoExitedNote: {
        field: <HasNoteActions />, 
        gamePhaseMessage: "Autonomous"
    },
    AutoNotExitedNote: {
        field: <>
            <HasNoteActions /> 
            <ExitWingAction />
        </>,
        gamePhaseMessage: "Autonomous"
    },
    AutoExitedNoNote: {
        field: <AutoCollectPieceActions />, 
        gamePhaseMessage: "Autonomous"
    },
    AutoNotExitedNoNote: {
        field: <ExitWingAction/>,
        gamePhaseMessage: "Autonomous"
    },
    TeleopNote: {
        field: <>
            <FloatingActions feedEnabled />,
            <HasNoteActions trap />
        </>,
        gamePhaseMessage: "Teleop"
    },
    TeleopNoNote: {
        field: <FloatingActions pickupEnabled />, 
        gamePhaseMessage: "Teleop"
    },
    UnknownPhase: {
        field: <></>, 
        gamePhaseMessage: "Problem finding phase"
    }
    }
    const [gameViewParams, setGameViewParams] = useState<MatchStateType>(matchStates.preMatch)
    const [autoTimeout, setAutoTimeout] = useState<NodeJS.Timeout | null>(null);
    const [amplificationTimeout, setAmplificationTimeout] =
    useState<NodeJS.Timeout | null>(null);

    const setPhase = useSetAtom(gamePhaseAtom);

    useEffect(() => {
    if (!reportState) {
        router.replace("/home");
    }
    }, [reportState]);

    useEffect(() => {
    if (
        reportState?.gamePhase === GamePhase.Auto &&
        reportState.startTimestamp &&
        !autoTimeout
    ) {
        setAutoTimeout(
        setTimeout(() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setPhase(GamePhase.Teleop);
        }, 18 * 1000),
        );

        return () => {
        if (autoTimeout) {
            clearTimeout(autoTimeout);
        }
        };
    } else {
        if (autoTimeout) {
        clearTimeout(autoTimeout);
        }
        setAutoTimeout(null);
    }
    }, [reportState?.gamePhase, reportState?.startTimestamp]);

    const onEnd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (autoTimeout) clearTimeout(autoTimeout);
    if (amplificationTimeout) clearTimeout(amplificationTimeout);
    router.replace("/game/post-match");
    };

    if (!reportState?.startTimestamp) {
    return (
        <GameViewTemplate
        {...gameViewParams}
        onEnd={onEnd}
        />
    );
    }

    if (reportState.gamePhase === GamePhase.Auto) {
    const hasExited = reportState.events.some(
        (event) => event.type === MatchEventType.LeaveWing,
    );
        if (hasPiece(reportState)) {
            setGameViewParams( hasExited ? matchStates.AutoExitedNote : matchStates.AutoNotExitedNote )
        } else {
            setGameViewParams( hasExited ? matchStates.AutoExitedNoNote : matchStates.AutoNotExitedNoNote )
        }
    } else if (reportState.gamePhase === GamePhase.Teleop) {
        setGameViewParams( hasPiece(reportState) ? matchStates.TeleopNote : matchStates.TeleopNoNote )
    }
    setGameViewParams(matchStates.UnknownPhase)
}

const FloatingActions = ({
  feedEnabled = false,
  pickupEnabled = false,
}: {
  feedEnabled?: boolean;
  pickupEnabled?: boolean;
}) => {
  const reportState = useAtomValue(reportStateAtom);
  const fieldOrientation = useAtomValue(fieldOrientationAtom);

  const [defenseHighlighted, setDefenseHighlighted] = useState(false);

  const addEvent = useAddEvent();

  return (
    <View
        style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        flexDirection:
            fieldOrientation === FieldOrientation.Auspicious
            ? (reportState?.meta.allianceColor === AllianceColor.Blue ? "row" : "row-reverse")
            : (reportState?.meta.allianceColor === AllianceColor.Blue ? "row-reverse" : "row"),
        padding: 4,
        gap: 4,
        }}
    >
      {/* <View style={{ flex: 1.8 }}>
        {pickupEnabled && (
          <GameAction
            color="#C1C337"
            icon="upload"
            iconSize={48}
            onPress={() => {
              addEvent({
                type: MatchEventType.PickupNote,
              });
            }}
          />
        )}
      </View>

      <View style={{ flex: 1, gap: 4 }}>
        {/* <TouchableOpacity
          accessibilityLabel="Amplify"
          style={{
            flex: 1,
            backgroundColor: isAmplified
              ? colors.victoryPurple.default
              : colors.secondaryContainer.default,
            borderRadius: 7,
            alignItems: "center",
            justifyContent: "center",
          }}
          activeOpacity={0.9}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            if (isAmplified) {
              addEvent({
                type: MatchEventType.StopAmplifying,
              });
            } else {
              addEvent({
                type: MatchEventType.StartAmplfying,
              });
            }
          }}
        >
          <Icon
            name="campaign"
            color={
              isAmplified
                ? colors.background.default
                : colors.onBackground.default
            }
            size={40}
          />
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityLabel="Defend"
          style={{
            flex: 1,
            backgroundColor: defenseHighlighted
              ? colors.danger.default
              : colors.secondaryContainer.default,
            borderRadius: 7,
            alignItems: "center",
            justifyContent: "center",
          }}
          activeOpacity={0.9}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            addEvent({
              type: MatchEventType.Defend,
            });

            setDefenseHighlighted(true);
            setTimeout(() => setDefenseHighlighted(false), 200);
          }}
        >
          <Icon name="shield" color={colors.onBackground.default} size={40} />
        </TouchableOpacity>

         <View
          style={{
            flex: 1,
          }}
        >
          {feedEnabled && (
            <TouchableOpacity
              accessibilityLabel="Feed note"
              style={{
                flex: 1,
                backgroundColor: colors.secondaryContainer.default,
                borderRadius: 7,
                alignItems: "center",
                justifyContent: "center",
              }}
              activeOpacity={0.9}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                addEvent({
                  type: MatchEventType.FeedNote,
                });
              }}
            >
              <Icon
                name="conveyor_belt"
                color={colors.onBackground.default}
                size={40}
              />
            </TouchableOpacity>
          )}
        </View> 
      </View> */}
    </View>
  );
};