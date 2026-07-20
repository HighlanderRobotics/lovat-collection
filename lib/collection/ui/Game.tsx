import React, { useEffect, useRef } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { GamePhase } from "../ReportState";
import { useReportStateStore } from "../reportStateStore";
import { GameViewTemplate } from "./GameViewTemplate";

export function Game() {
  const reportState = useReportStateStore();
  const timeoutsRef = useRef<{
    teleop?: NodeJS.Timeout;
    endgame?: NodeJS.Timeout;
  }>({});

  useEffect(() => {
    if (!reportState.meta) router.replace("/home");
  }, [reportState.meta]);

  useEffect(() => {
    if (
      reportState.gamePhase !== GamePhase.Auto ||
      !reportState.startTimestamp ||
      timeoutsRef.current.teleop ||
      timeoutsRef.current.endgame
    ) {
      return;
    }

    timeoutsRef.current.teleop = setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      reportState.setGamePhase(GamePhase.Teleop);
    }, 23_000);
    timeoutsRef.current.endgame = setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      reportState.setGamePhase(GamePhase.Endgame);
    }, 133_000);

    return clearTimeouts;
  }, [reportState.gamePhase, reportState.startTimestamp]);

  const clearTimeouts = () => {
    if (timeoutsRef.current.teleop) clearTimeout(timeoutsRef.current.teleop);
    if (timeoutsRef.current.endgame) clearTimeout(timeoutsRef.current.endgame);
    timeoutsRef.current = {};
  };

  const onEnd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    clearTimeouts();
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

  const gamePhaseMessage = !reportState.startTimestamp
    ? "Pre-Match"
    : reportState.gamePhase === GamePhase.Auto
      ? "Auto"
      : "Teleop";

  return (
    <GameViewTemplate
      gamePhaseMessage={gamePhaseMessage}
      startEnabled
      onEnd={onEnd}
      onRestart={onRestart}
    />
  );
}
