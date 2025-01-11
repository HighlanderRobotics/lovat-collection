import React, { useEffect, useState } from "react";
import { useReportStateStore } from "../reportStateStore";
import { router } from "expo-router";
import { PreMatchActions } from "./actions/PreMatchActions";
import { GameViewTemplate } from "./GameViewTemplate";
import { GamePhase } from "../ReportState";
import { Checkbox } from "../../components/Checkbox";
// import { MatchEventType } from "../MatchEventType";
import { HasNoteActions } from "./actions/HasNoteActions";
import { ExitWingAction } from "./actions/ExitWingAction";
import * as Haptics from "expo-haptics";
import { AutoCollectPieceActions } from "./actions/AutoCollectPieceActions";
import { Alert } from "react-native";
// import { AllianceColor } from "../../models/AllianceColor";
// import { GameAction } from "./GameAction";
// import {
//   FieldOrientation,
//   useFieldOrientationStore,
// } from "../../storage/userStores";
import { View, TouchableOpacity } from "react-native";
import { Icon } from "../../components/Icon";
import { colors } from "../../colors";

export function Game() {
  const reportState = useReportStateStore();

  // const addEvent = reportState.addEvent;

  const [autoTimeout, setAutoTimeout] = useState<NodeJS.Timeout | null>(null);

  const setPhase = reportState.setGamePhase;

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
            reportState.reset();
            if (autoTimeout) clearTimeout(autoTimeout);
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

  const gameStates: { [key: string]: GameState } = {
    preMatch: {
      gamePhaseMessage: "Pre-Match",
      field: <PreMatchActions />,
      topLeftReplacement: (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {router.canGoBack() && (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ padding: 8 }}
            >
              <Icon
                name="arrow_back_ios"
                size={24}
                color={colors.onBackground.default}
              />
            </TouchableOpacity>
          )}
          <Checkbox
            label="Loaded with a note"
            checked={reportState?.startPiece}
            onChange={reportState.setStartPiece}
          />
        </View>
      ),
      startEnabled: reportState.startPosition !== undefined,
    },
    autoExitedNote: {
      gamePhaseMessage: "Autonomous",
      field: <HasNoteActions />,
    },
    autoExitedNoNote: {
      gamePhaseMessage: "Autonomous",
      field: <AutoCollectPieceActions />,
    },
    autoNotExitedNote: {
      gamePhaseMessage: "Autonomous",
      field: (
        <>
          <HasNoteActions />,
          <ExitWingAction />
        </>
      ),
    },
    autoNotExitedNoNote: {
      gamePhaseMessage: "Autonomous",
      field: <ExitWingAction />,
    },
    teleopNote: {
      gamePhaseMessage: "Teleop",
      field: (
        <>
          {/* <FloatingActions feedEnabled /> */}
          {/* <HasNoteActions trap /> */}
        </>
      ),
    },
    teleopNoNote: {
      gamePhaseMessage: "Teleop",
      field: <>{/* <FloatingActions pickupEnabled /> */}</>,
    },
    unknown: {
      gamePhaseMessage: "Problem finding phase",
      field: <></>,
    },
  };

  const [
    gameState,
    // setGameState
  ] = useState<GameState>(gameStates.preMatch);

  // if (!reportState.startTimestamp) {
  //   setGameState(gameStates.preMatch);
  // } else {
  //   if (reportState.gamePhase === GamePhase.Auto) {
  //     if (reportState.getHasExited()) {
  //       setGameState(
  //         reportState.getHasNote()
  //           ? gameStates.autoExitedNote
  //           : gameStates.autoExitedNoNote,
  //       );
  //     } else {
  //       setGameState(
  //         reportState.getHasNote()
  //           ? gameStates.autoNotExitedNote
  //           : gameStates.autoNotExitedNoNote,
  //       );
  //     }
  //   } else {
  //     setGameState(
  //       reportState.getHasNote()
  //         ? gameStates.teleopNote
  //         : gameStates.teleopNoNote,
  //     );
  //   }
  // }

  return (
    <GameViewTemplate
      {...{
        onEnd: onEnd,
        onRestart: onRestart,
        ...gameState,
      }}
    />
  );
}

// const FloatingActions = () =>
// {
//   feedEnabled = false,
//   pickupEnabled = false,
// }: {
//   feedEnabled?: boolean;
//   pickupEnabled?: boolean;
// },
// {
// const reportState = useReportStateStore();
// const fieldOrientation = useFieldOrientationStore((state) => state.value);

// const [defenseHighlighted, setDefenseHighlighted] = useState(false);

// const addEvent = reportState.addEvent;

// return (
//   <View
//     style={{
//       position: "absolute",
//       top: 0,
//       right: 0,
//       bottom: 0,
//       left: 0,
//       flexDirection:
//         fieldOrientation === FieldOrientation.Auspicious
//           ? reportState.meta?.allianceColor === AllianceColor.Blue
//             ? "row"
//             : "row-reverse"
//           : reportState.meta?.allianceColor === AllianceColor.Blue
//             ? "row-reverse"
//             : "row",
//       padding: 4,
//       gap: 4,
//     }}
//   >
//     <View style={{ flex: 1.8 }}>
//       {pickupEnabled && (
//         <GameAction
//           color="#C1C337"
//           icon="upload"
//           iconSize={48}
//           onPress={() => {
//             addEvent({
//               type: MatchEventType.PickupNote
//             });
//           }}
//         />
//       )}
//     </View>

//     <View style={{ flex: 1, gap: 4 }}>
//       <TouchableOpacity
//         accessibilityLabel="Amplify"
//         style={{
//           flex: 1,
//           backgroundColor: isAmplified
//             ? colors.victoryPurple.default
//             : colors.secondaryContainer.default,
//           borderRadius: 7,
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//         activeOpacity={0.9}
//         onPress={() => {
//           Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//           if (isAmplified) {
//             addEvent({
//               type: MatchEventType.StopAmplifying,
//             });
//           } else {
//             addEvent({
//               type: MatchEventType.StartAmplfying,
//             });
//           }
//         }}
//       >
//         <Icon
//           name="campaign"
//           color={
//             isAmplified
//               ? colors.background.default
//               : colors.onBackground.default
//           }
//           size={40}
//         />
//       </TouchableOpacity>

//       <TouchableOpacity
//         accessibilityLabel="Defend"
//         style={{
//           flex: 1,
//           backgroundColor: defenseHighlighted
//             ? colors.danger.default
//             : colors.secondaryContainer.default,
//           borderRadius: 7,
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//         activeOpacity={0.9}
//         onPress={() => {
//           Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//           addEvent({
//             type: MatchEventType.Defend,
//           });

//           setDefenseHighlighted(true);
//           setTimeout(() => setDefenseHighlighted(false), 200);
//         }}
//       >
//         <Icon name="shield" color={colors.onBackground.default} size={40} />
//       </TouchableOpacity>

//       <View
//         style={{
//           flex: 1,
//         }}
//       >
//         {feedEnabled && (
//           <TouchableOpacity
//             accessibilityLabel="Feed note"
//             style={{
//               flex: 1,
//               backgroundColor: colors.secondaryContainer.default,
//               borderRadius: 7,
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//             activeOpacity={0.9}
//             onPress={() => {
//               Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//               addEvent({
//                 type: MatchEventType.FeedNote,
//               });
//             }}
//           >
//             <Icon
//               name="conveyor_belt"
//               color={colors.onBackground.default}
//               size={40}
//             />
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   </View>
// );
// };
