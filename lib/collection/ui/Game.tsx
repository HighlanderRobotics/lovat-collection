import React, { useEffect, useRef, useState } from "react";
import { useReportStateStore } from "../reportStateStore";
import { router } from "expo-router";
import { PreMatchActions } from "./actions/PreMatchActions";
import { GameViewTemplate } from "./GameViewTemplate";
import { GamePhase } from "../ReportState";
import * as Haptics from "expo-haptics";
import { Alert } from "react-native";
import { colors } from "../../colors";
import { IconButton } from "../../components/IconButton";
import {
  AutoFeedAction,
  ScoreFuelInHubAction,
  TeleopFeedAction,
} from "./actions/FuelActions";
import {
  DepotIntakeAction,
  NeutralZoneAutoIntakeAction,
} from "./actions/AutoIntakeActions";
import TraversalActions from "./actions/TraversalActions";
import { ClimbAction } from "./actions/ClimbAction";
import { AutoDisruptAction } from "./actions/AutoDisruptAction";
import { OutpostAction } from "./actions/OutpostAction";
import { CampAction } from "./actions/CampAction";
import { DefendAction } from "./actions/DefendAction";
import { MatchEventType } from "../MatchEventType";
import { FieldTraversal } from "../FieldTraversal";
import { IntakeType } from "../IntakeType";

export function Game() {
  const reportState = useReportStateStore();

  const timeoutsRef = useRef<{
    teleop?: NodeJS.Timeout;
    endgame?: NodeJS.Timeout;
  }>({});

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
      !timeoutsRef.current.teleop &&
      !timeoutsRef.current.endgame
    ) {
      timeoutsRef.current.teleop = setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setPhase(GamePhase.Teleop);
      }, 18 * 1000);

      timeoutsRef.current.endgame = setTimeout(
        () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setPhase(GamePhase.Endgame);
        },
        18 * 1000 + 102 * 1000,
      ); // 18s auto + 102s teleop = last 30 seconds of match
    }
  }, [reportState?.gamePhase, reportState?.startTimestamp]);

  const clearTimeouts = () => {
    if (timeoutsRef.current.teleop) {
      clearTimeout(timeoutsRef.current.teleop);
      timeoutsRef.current.teleop = undefined;
    }
    if (timeoutsRef.current.endgame) {
      clearTimeout(timeoutsRef.current.endgame);
      timeoutsRef.current.endgame = undefined;
    }
  };

  const onEnd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    clearTimeouts();

    // Auto-set traversal type based on auto events
    const autoTraversalTypes = reportState.getAutoTraversalTypes();

    if (autoTraversalTypes.trench || autoTraversalTypes.bump) {
      let newSelection = reportState.fieldTraversal;

      if (autoTraversalTypes.trench && autoTraversalTypes.bump) {
        newSelection = FieldTraversal.Both;
      } else if (autoTraversalTypes.trench) {
        newSelection = FieldTraversal.Trench;
      } else if (autoTraversalTypes.bump) {
        newSelection = FieldTraversal.Bump;
      }

      if (newSelection !== reportState.fieldTraversal) {
        reportState.setFieldTraversal(newSelection);
      }
    }

    // Set default intake type values
    if (reportState.hasOutpostIntakeEvent()) {
      if (reportState.intakeType === IntakeType.Ground) {
        reportState.setIntakeType(IntakeType.Both);
      } else if (reportState.intakeType === IntakeType.Neither) {
        reportState.setIntakeType(IntakeType.Outpost);
      }
    }

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
            clearTimeouts();
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

  const gameStates = {
    preMatch: {
      gamePhaseMessage: "Pre-Match",
      field: (
        <>
          <PreMatchActions />
        </>
      ),
      startEnabled: reportState.startPosition !== undefined,
    },
    autoAllianceZone: {
      gamePhaseMessage: "Auto",
      field: (
        <>
          <ScoreFuelInHubAction />
          <DepotIntakeAction />
          <ClimbAction phase={GamePhase.Auto} />
          <OutpostAction setOverlay={(value) => setOverlay(value)} />
          <TraversalActions />
        </>
      ),
    },
    autoNeutralZone: {
      gamePhaseMessage: "Auto",
      field: (
        <>
          <TraversalActions />
          <NeutralZoneAutoIntakeAction />
          <AutoDisruptAction />
          <AutoFeedAction />
        </>
      ),
    },
    teleop: {
      gamePhaseMessage: "Teleop",
      field: (
        <>
          <ScoreFuelInHubAction />
          <OutpostAction setOverlay={(value) => setOverlay(value)} />
          <TeleopFeedAction />
          <CampAction />
          <DefendAction />
        </>
      ),
    },
    endgame: {
      gamePhaseMessage: "Teleop",
      field: (
        <>
          <ScoreFuelInHubAction />
          <OutpostAction setOverlay={(value) => setOverlay(value)} />
          <TeleopFeedAction />
          <CampAction />
          <DefendAction />
          <ClimbAction phase={GamePhase.Endgame} />
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
          color={colors.onBackground.default}
          onPress={() => {
            reportState.reset();
            router.push("../home");
          }}
          label=""
        />
      ),
      field: (
        <>
          {/* <ScoreFuelInHubAction />
          <DepotIntakeAction />
          <TraversalActions />
          <AutoClimbAction />
          <AutoDisruptAction />
          <NeutralZoneAutoIntakeAction />
          <AutoFeedAction />
          <OutpostAction setOverlay={(value) => setOverlay(value)} /> */}
          <CampAction />
        </>
      ),
    },
  } as const satisfies Record<string, GameState>;

  const gameState: GameState = (() => {
    if (!reportState.startTimestamp) {
      return gameStates.preMatch;
    } else if (reportState.gamePhase === GamePhase.Auto) {
      if (
        reportState.events.filter(
          (event) => event.type === MatchEventType.Cross,
        ).length %
          2 ==
        0
      ) {
        return gameStates.autoAllianceZone;
      } else {
        return gameStates.autoNeutralZone;
      }
    } else if (reportState.gamePhase === GamePhase.Teleop) {
      return gameStates.teleop;
    } else if (reportState.gamePhase === GamePhase.Endgame) {
      return gameStates.endgame;
    }
    return gameStates.unknown;
  })();

  const [overlay, setOverlay] = useState(false);
  return (
    <GameViewTemplate
      {...{
        overlay: overlay,
        setOverlay: (value) => setOverlay(value),
        onEnd: onEnd,
        onRestart: onRestart,
        ...gameState,
      }}
    />
  );
}

// const FloatingActions = ({
//   hasCoral = false,
//   hasAlgae = false,
//   gamePhase = GamePhase.Auto,
// }: {
//   hasCoral?: boolean;
//   hasAlgae?: boolean;
//   gamePhase?: GamePhase;
// }) => {
//   const reportState = useReportStateStore();
//   const fieldOrientation = useFieldOrientationStore((state) => state.value);

//   const [defenseHighlighted, setDefenseHighlighted] = useState(false);

//   const addEvent = reportState.addEvent;

//   const coralActive = !(gamePhase === GamePhase.Auto && !hasCoral);
//   const algaeActive = !(gamePhase === GamePhase.Auto && !hasAlgae);

//   return (
//     <View
//       pointerEvents="box-none"
//       style={{
//         position: "absolute",
//         top: 0,
//         right: 0,
//         bottom: 0,
//         left: 0,
//         flexDirection:
//           fieldOrientation === FieldOrientation.Auspicious
//             ? reportState.meta?.allianceColor === AllianceColor.Blue
//               ? "row"
//               : "row-reverse"
//             : reportState.meta?.allianceColor === AllianceColor.Blue
//               ? "row-reverse"
//               : "row",
//         padding: 4,
//         gap: 4,
//       }}
//     >
//       <View
//         key={"This view is for spacing purposes"}
//         pointerEvents="none"
//         style={{
//           flex: 1.8,
//         }}
//       />
//       <View
//         style={{
//           flexDirection: "column",
//           gap: 4,
//           flex: 1,
//         }}
//       >
//         <View
//           style={{
//             flexDirection: "row",
//             flex: 1,
//             gap: 4,
//           }}
//         >
//           {/* Coral */}
//           <TouchableOpacity
//             disabled={!coralActive}
//             accessibilityLabel={
//               gamePhase === GamePhase.Teleop
//                 ? hasCoral
//                   ? "Intake Coral"
//                   : "Drop Coral"
//                 : hasCoral
//                   ? ""
//                   : "Drop Coral"
//             }
//             style={{
//               flex: 1,
//               width: "50%",
//               backgroundColor: "#ffffff4d",
//               opacity: coralActive ? 1 : 0,
//               borderRadius: 7,
//               borderColor: "#ffffff" + (coralActive && !hasCoral ? "ff" : "00"),
//               borderWidth: 2,
//               gap: 2,
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//             activeOpacity={0.9}
//             onPress={() => {
//               Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//               // TODO: Implement coral pickup/drop
//             }}
//           >
//             <Icon
//               name={coralActive && !hasCoral ? "frc_coral" : "output_circle"}
//               color={"#ffffff"}
//               size={40}
//             />
//             <LabelSmall color="#ffffff">
//               {coralActive && !hasCoral ? "Intake Coral" : "Drop Coral"}
//             </LabelSmall>
//           </TouchableOpacity>
//           {/* Algae */}
//           <TouchableOpacity
//             disabled={!algaeActive}
//             accessibilityLabel={
//               gamePhase === GamePhase.Teleop
//                 ? hasAlgae
//                   ? "Intake Algae"
//                   : "Drop Algae"
//                 : hasAlgae
//                   ? ""
//                   : "Drop Algae"
//             }
//             style={{
//               flex: 1,
//               width: "50%",
//               backgroundColor: "#14ceac4d",
//               opacity: algaeActive ? 1 : 0,
//               borderRadius: 7,
//               borderColor: "#14ceac" + (algaeActive && !hasAlgae ? "ff" : "00"),
//               borderWidth: 2,
//               gap: 2,
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//             activeOpacity={0.9}
//             onPress={() => {
//               Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//               // TODO: Implement algae pickup/drop
//             }}
//           >
//             <Icon
//               name={algaeActive && !hasAlgae ? "frc_algae" : "output_circle"}
//               color={"#14ceac"}
//               size={40}
//             />
//             <LabelSmall color="#14ceac">
//               {algaeActive && !hasAlgae ? "Intake Algae" : "Drop Algae"}
//             </LabelSmall>
//           </TouchableOpacity>
//         </View>
//         <TouchableOpacity
//           disabled={gamePhase === GamePhase.Auto}
//           accessibilityLabel="Defend"
//           style={{
//             flex: 1,
//             backgroundColor: defenseHighlighted
//               ? colors.danger.default
//               : colors.secondaryContainer.default,
//             opacity: gamePhase === GamePhase.Teleop ? 1 : 0,
//             borderRadius: 7,
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//           activeOpacity={0.9}
//           onPress={() => {
//             Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//             // TODO: Implement defend action

//             setDefenseHighlighted(true);
//             setTimeout(() => setDefenseHighlighted(false), 200);
//           }}
//         >
//           <Icon name="shield" color={colors.onBackground.default} size={40} />
//         </TouchableOpacity>
//         <View
//           style={{
//             flexDirection: "row",
//             flex: 1,
//             gap: 4,
//           }}
//         >
//           <TouchableOpacity
//             disabled={reportState?.events.length === 0}
//             accessibilityLabel="Undo"
//             style={{
//               flex: 1,
//               backgroundColor: colors.secondaryContainer.default,
//               opacity: reportState.events.length > 0 ? 1 : 0,
//               borderRadius: 7,
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//             activeOpacity={0.9}
//             onPress={() => {
//               Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//               reportState.undoEvent();
//             }}
//           >
//             <Icon name="undo" color={colors.onBackground.default} size={40} />
//           </TouchableOpacity>
//           <TouchableOpacity
//             disabled={!(hasAlgae && gamePhase === GamePhase.Teleop)}
//             accessibilityLabel="Feed algae"
//             style={{
//               flex: 1,
//               backgroundColor: colors.secondaryContainer.default,
//               opacity: hasAlgae && gamePhase === GamePhase.Teleop ? 1 : 0,
//               borderRadius: 7,
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//             activeOpacity={0.9}
//             onPress={() => {
//               Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//               // TODO: Implement feed algae action
//             }}
//           >
//             <Icon name="feeder" color={colors.onBackground.default} size={40} />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// };
