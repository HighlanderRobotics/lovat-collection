import React, { useEffect, useState } from "react";
import { useReportStateStore } from "../reportStateStore";
import { router } from "expo-router";
import { PreMatchActions } from "./actions/PreMatchActions";
import { GameViewTemplate, OverlayState } from "./GameViewTemplate";
import { GamePhase } from "../ReportState";
import { HasAlgaeActions } from "./actions/HasAlgaeActions";
import { ExitWingAction } from "./actions/ExitWingAction";
import * as Haptics from "expo-haptics";
import {
  AutoCollectGroundPieceActions,
  AutoCoralStationActions,
} from "./actions/AutoCollectPieceActions";
import { Alert, TouchableOpacity, View } from "react-native";
import {
  FieldOrientation,
  useFieldOrientationStore,
} from "../../storage/userStores";
import { AllianceColor } from "../../models/AllianceColor";
import { colors } from "../../colors";
import { MatchEventType } from "../MatchEventType";
import { Icon } from "../../components/Icon";
import LabelSmall from "../../components/text/LabelSmall";
import { TeleopScoreCoralActions } from "./actions/TeleopScoreCoralActions";
import { MatchEventPosition } from "../MatchEventPosition";
import { AutoReefActions } from "./actions/AutoReefActions";
import { IconButton } from "../../components/IconButton";

export function Game() {
  const reportState = useReportStateStore();

  const [autoTimeout, setAutoTimeout] = useState<NodeJS.Timeout | null>(null);

  const setPhase = reportState.setGamePhase;

  useEffect(() => {
    if (!reportState.meta) {
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
    router.replace("/game/post-match");
  };
  const onRestart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      "Restart match?",
      "You will lose all of the data you recorded.",
      [
        { text: "Cancel" },
        {
          text: "Restart",
          style: "destructive",
          onPress: () => {
            if (autoTimeout) clearTimeout(autoTimeout);
            reportState.restartMatch();
          },
        },
      ],
    );
  };

  type GameState = {
    gamePhaseMessage: string;
    field: React.ReactNode;
    topLeftReplacement?: React.ReactNode;
    startEnabled?: boolean;
  };

  const gameStates: Record<string, GameState> = {
    preMatch: {
      gamePhaseMessage: "Pre-Match",
      field: <PreMatchActions />,
      startEnabled: reportState.startPosition !== undefined,
    },

    autoNoCoralNotExited: {
      gamePhaseMessage: "Auto",
      field: <ExitWingAction />,
    },

    autoHasCoralNotExited: {
      gamePhaseMessage: "Auto",
      field: (
        <>
          <ExitWingAction />
          <FloatingActions hasCoral gamePhase={GamePhase.Auto} />
        </>
      ),
    },

    autoNoPieceExited: {
      gamePhaseMessage: "Auto",
      field: (
        <>
          <AutoCollectGroundPieceActions
            setOverlay={(value) => setOverlay(value)}
            setOverlayPos={(value) => setOverlayPos(value)}
          />
          <AutoReefActions
            setOverlay={(value) => setOverlay(value)}
            setOverlayPos={(value) => setOverlayPos(value)}
          />
          <AutoCoralStationActions />
          <FloatingActions gamePhase={GamePhase.Auto} />
        </>
      ),
    },

    autoHasCoralExited: {
      gamePhaseMessage: "Auto",
      field: (
        <>
          <AutoReefActions
            setOverlay={(value) => setOverlay(value)}
            setOverlayPos={(value) => setOverlayPos(value)}
          />
          <AutoCollectGroundPieceActions
            setOverlay={(value) => setOverlay(value)}
            setOverlayPos={(value) => setOverlayPos(value)}
          />
          <FloatingActions hasCoral gamePhase={GamePhase.Auto} />
        </>
      ),
    },

    autoHasAlgaeExited: {
      gamePhaseMessage: "Auto",
      field: (
        <>
          <HasAlgaeActions setOverlay={(value) => setOverlay(value)} />
          <AutoCollectGroundPieceActions
            setOverlay={(value) => setOverlay(value)}
            setOverlayPos={(value) => setOverlayPos(value)}
          />
          <AutoCoralStationActions />
          <FloatingActions hasAlgae gamePhase={GamePhase.Auto} />
        </>
      ),
    },

    autoHasBothExited: {
      gamePhaseMessage: "Auto",
      field: (
        <>
          <AutoReefActions
            setOverlay={(value) => setOverlay(value)}
            setOverlayPos={(value) => setOverlayPos(value)}
          />
          <HasAlgaeActions setOverlay={(value) => setOverlay(value)} />
          <FloatingActions hasCoral hasAlgae gamePhase={GamePhase.Auto} />
        </>
      ),
    },

    teleopNoPiece: {
      gamePhaseMessage: "Teleop",
      field: (
        <>
          <FloatingActions gamePhase={GamePhase.Teleop} />
        </>
      ),
    },

    teleopHasCoral: {
      gamePhaseMessage: "Teleop",
      field: (
        <>
          <FloatingActions hasCoral gamePhase={GamePhase.Teleop} />
          <TeleopScoreCoralActions />
        </>
      ),
    },

    teleopHasAlgae: {
      gamePhaseMessage: "Teleop",
      field: (
        <>
          <FloatingActions hasAlgae gamePhase={GamePhase.Teleop} />
          <HasAlgaeActions setOverlay={(value) => setOverlay(value)} />
        </>
      ),
    },

    teleopHasBoth: {
      gamePhaseMessage: "Teleop",
      field: (
        <>
          <FloatingActions hasCoral hasAlgae gamePhase={GamePhase.Teleop} />
          <HasAlgaeActions setOverlay={(value) => setOverlay(value)} />
          <TeleopScoreCoralActions />
        </>
      ),
    },

    unknown: {
      gamePhaseMessage: "Problem finding phase",
      field: <></>,
    },

    testing: {
      gamePhaseMessage: "Testing",
      topLeftReplacement: (
        <IconButton
          icon="arrow_back_ios"
          onPress={() => {
            reportState.reset();
            router.push("../home");
          }}
          label=""
        />
      ),
      field: (
        <>
          <FloatingActions hasCoral hasAlgae gamePhase={GamePhase.Teleop} />
          <HasAlgaeActions setOverlay={(value) => setOverlay(value)} />
          {/* <TeleopScoreCoralActions /> */}
          <AutoReefActions
            setOverlay={(value) => setOverlay(value)}
            setOverlayPos={(value) => setOverlayPos(value)}
          />
          <AutoCollectGroundPieceActions
            setOverlay={(value) => setOverlay(value)}
            setOverlayPos={(value) => setOverlayPos(value)}
          />
          <AutoCoralStationActions />
        </>
      ),
    },
  } as const;

  const gameState: GameState = (() => {
    // return gameStates.testing;
    if (!reportState.startTimestamp) {
      return gameStates.preMatch;
    } else if (reportState.gamePhase === GamePhase.Auto) {
      return gameStates.autoNoPieceExited;
    } else if (reportState.gamePhase === GamePhase.Teleop) {
      return gameStates.teleopNoPiece;
    }
    return gameStates.unknown;
  })();

  const [overlay, setOverlay] = useState<OverlayState>(OverlayState.None);
  const [overlayPos, setOverlayPos] = useState<number>(-1);
  return (
    <GameViewTemplate
      {...{
        overlay: overlay,
        overlayPos: overlayPos,
        setOverlay: (value) => setOverlay(value),
        resetOverlayPos: () => setOverlayPos(MatchEventPosition.None),
        onEnd: onEnd,
        onRestart: onRestart,
        ...gameState,
      }}
    />
  );
}

const FloatingActions = ({
  hasCoral = false,
  hasAlgae = false,
  gamePhase = GamePhase.Auto,
}: {
  hasCoral?: boolean;
  hasAlgae?: boolean;
  gamePhase?: GamePhase;
}) => {
  const reportState = useReportStateStore();
  const fieldOrientation = useFieldOrientationStore((state) => state.value);

  const [defenseHighlighted, setDefenseHighlighted] = useState(false);

  const addEvent = reportState.addEvent;

  const coralActive = !(gamePhase === GamePhase.Auto && !hasCoral);
  const algaeActive = !(gamePhase === GamePhase.Auto && !hasAlgae);

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        flexDirection:
          fieldOrientation === FieldOrientation.Auspicious
            ? reportState.meta?.allianceColor === AllianceColor.Blue
              ? "row"
              : "row-reverse"
            : reportState.meta?.allianceColor === AllianceColor.Blue
              ? "row-reverse"
              : "row",
        padding: 4,
        gap: 4,
      }}
    >
      <View
        key={"This view is for spacing purposes"}
        pointerEvents="none"
        style={{
          flex: 1.8,
        }}
      />
      <View
        style={{
          flexDirection: "column",
          gap: 4,
          flex: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            gap: 4,
          }}
        >
          {/* Coral */}
          <TouchableOpacity
            disabled={!coralActive}
            accessibilityLabel={
              gamePhase === GamePhase.Teleop
                ? hasCoral
                  ? "Intake Coral"
                  : "Drop Coral"
                : hasCoral
                  ? ""
                  : "Drop Coral"
            }
            style={{
              flex: 1,
              width: "50%",
              backgroundColor: "#ffffff4d",
              opacity: coralActive ? 1 : 0,
              borderRadius: 7,
              borderColor: "#ffffff" + (coralActive && !hasCoral ? "ff" : "00"),
              borderWidth: 2,
              gap: 2,
              alignItems: "center",
              justifyContent: "center",
            }}
            activeOpacity={0.9}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              // TODO: Implement coral pickup/drop
            }}
          >
            <Icon
              name={coralActive && !hasCoral ? "frc_coral" : "output_circle"}
              color={"#ffffff"}
              size={40}
            />
            <LabelSmall color="#ffffff">
              {coralActive && !hasCoral ? "Intake Coral" : "Drop Coral"}
            </LabelSmall>
          </TouchableOpacity>
          {/* Algae */}
          <TouchableOpacity
            disabled={!algaeActive}
            accessibilityLabel={
              gamePhase === GamePhase.Teleop
                ? hasAlgae
                  ? "Intake Algae"
                  : "Drop Algae"
                : hasAlgae
                  ? ""
                  : "Drop Algae"
            }
            style={{
              flex: 1,
              width: "50%",
              backgroundColor: "#14ceac4d",
              opacity: algaeActive ? 1 : 0,
              borderRadius: 7,
              borderColor: "#14ceac" + (algaeActive && !hasAlgae ? "ff" : "00"),
              borderWidth: 2,
              gap: 2,
              alignItems: "center",
              justifyContent: "center",
            }}
            activeOpacity={0.9}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              // TODO: Implement algae pickup/drop
            }}
          >
            <Icon
              name={algaeActive && !hasAlgae ? "frc_algae" : "output_circle"}
              color={"#14ceac"}
              size={40}
            />
            <LabelSmall color="#14ceac">
              {algaeActive && !hasAlgae ? "Intake Algae" : "Drop Algae"}
            </LabelSmall>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          disabled={gamePhase === GamePhase.Auto}
          accessibilityLabel="Defend"
          style={{
            flex: 1,
            backgroundColor: defenseHighlighted
              ? colors.danger.default
              : colors.secondaryContainer.default,
            opacity: gamePhase === GamePhase.Teleop ? 1 : 0,
            borderRadius: 7,
            alignItems: "center",
            justifyContent: "center",
          }}
          activeOpacity={0.9}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            // TODO: Implement defend action

            setDefenseHighlighted(true);
            setTimeout(() => setDefenseHighlighted(false), 200);
          }}
        >
          <Icon name="shield" color={colors.onBackground.default} size={40} />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            gap: 4,
          }}
        >
          <TouchableOpacity
            disabled={reportState?.events.length === 0}
            accessibilityLabel="Undo"
            style={{
              flex: 1,
              backgroundColor: colors.secondaryContainer.default,
              opacity: reportState.events.length > 0 ? 1 : 0,
              borderRadius: 7,
              alignItems: "center",
              justifyContent: "center",
            }}
            activeOpacity={0.9}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              reportState.undoEvent();
            }}
          >
            <Icon name="undo" color={colors.onBackground.default} size={40} />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={!(hasAlgae && gamePhase === GamePhase.Teleop)}
            accessibilityLabel="Feed algae"
            style={{
              flex: 1,
              backgroundColor: colors.secondaryContainer.default,
              opacity: hasAlgae && gamePhase === GamePhase.Teleop ? 1 : 0,
              borderRadius: 7,
              alignItems: "center",
              justifyContent: "center",
            }}
            activeOpacity={0.9}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              // TODO: Implement feed algae action
            }}
          >
            <Icon name="feeder" color={colors.onBackground.default} size={40} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
