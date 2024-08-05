import {
  View,
  LayoutAnimation,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Platform,
} from "react-native";
import TitleMedium from "../lib/components/text/TitleMedium";
import TextField from "../lib/components/TextField";
import LabelSmall from "../lib/components/text/LabelSmall";
import Button from "../lib/components/Button";
import Heading1Small from "../lib/components/text/Heading1Small";

import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../lib/colors";
import BodyMedium from "../lib/components/text/BodyMedium";
import { IconButton } from "../lib/components/IconButton";
import {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

import { ErrorBoundary } from "react-error-boundary";

import TimeAgo from "../lib/components/TimeAgo";
import { getTournament, useTournamentKey } from "../lib/storage/getTournament";
import { ButtonGroup } from "../lib/components/ButtonGroup";
import {
  MatchIdentity,
  MatchIdentityLocalizationFormat,
  MatchType,
  localizeMatchIdentity,
  matchTypes,
} from "../lib/models/match";
import { AllianceColor, allianceColors } from "../lib/models/AllianceColor";
import { ScoutReportMeta } from "../lib/models/ScoutReportMeta";
import { getScouter } from "../lib/storage/getScouter";
import { atom, useAtom, useAtomValue } from "jotai";
import { reportStateAtom } from "../lib/collection/reportStateAtom";
import {
  GamePhase,
  ReportState,
  RobotRole,
} from "../lib/collection/ReportState";
import { HighNote } from "../lib/collection/HighNote";
import { StageResult } from "../lib/collection/StageResult";
import { Stack, router, useFocusEffect } from "expo-router";
import { DriverAbility } from "../lib/collection/DriverAbility";
import { PickUp } from "../lib/collection/PickUp";
import "react-native-get-random-values";
import { v4 } from "uuid";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScouterScheduleMatch,
  getScouterSchedule,
  getVerionsColor,
} from "../lib/storage/scouterSchedules";
import { unwrap } from "jotai/utils";
import { Picker } from "react-native-wheel-pick";
import { historyAtom } from "../lib/storage/historyAtom";
import { startMatchEnabledAtom } from "./_layout";
import {
  useQueries,
  useQuery,
  useSuspenseQueries,
  useSuspenseQuery,
} from "@tanstack/react-query";

enum MatchSelectionMode {
  Automatic,
  Manual,
}

export default function Home() {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [matchSelectionMode, setMatchSelectionMode] = useState(
    MatchSelectionMode.Automatic
  );
  const [meta, setMeta] = useState<ScoutReportMeta | null>(null);
  const [reportState, setReportState] = useAtom(reportStateAtom);

  const startMatchEnabled = useAtomValue(startMatchEnabledAtom);

  const scoutMatch = () => {
    const report: ReportState = {
      meta: meta!,
      events: [],
      startPiece: true,
      gamePhase: GamePhase.Auto,
      robotRole: RobotRole.Offense,
      driverAbility: DriverAbility.Average,
      stageResult: StageResult.Nothing,
      highNote: HighNote.None,
      pickUp: PickUp.Ground,
      notes: "",
      uuid: v4(),
    };

    setReportState(report);
  };

  useEffect(() => {
    if (!reportState) return;

    router.replace("/game");
  }, [reportState]);

  // useEffect(() => {
  //     const fetchTournament = async () => {
  //         const tournament = await getTournament();
  //         setTournament(tournament || null);
  //     };

  //     fetchTournament();
  // }, []);

  return (
    <>
      <Stack.Screen
        options={{
          animation: "fade",
        }}
      />
      <ScheduleColorGradient />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingVertical: 16, paddingHorizontal: 26 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <IconButton
              label="history"
              icon="history"
              color={colors.onBackground.default}
              onPress={() => router.push("/history")}
            />

            {/* <ServiceStatus /> */}

            <IconButton
              label="settings"
              icon="settings"
              color={colors.onBackground.default}
              onPress={() => router.push("/settings")}
            />
          </View>

          <View
            style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}
          >
            <View style={{ alignItems: "stretch", flex: 1, maxWidth: 450 }}>
              <View style={{ flex: 1 }}>
                <MatchSelection
                  matchSelectionMode={matchSelectionMode}
                  onMetaChanged={setMeta}
                />
              </View>
              <View style={{ gap: 10 }}>
                <Button
                  variant="primary"
                  disabled={!meta || !startMatchEnabled}
                  onPress={() => {
                    if (!meta) return;
                    scoutMatch();
                  }}
                >
                  Scout this match
                </Button>
                <Button
                  variant="primary"
                  filled={false}
                  onPress={toggleMatchSelectionMode}
                >
                  {matchSelectionMode === MatchSelectionMode.Automatic
                    ? "Enter details manually"
                    : "Use scouter schedule"}
                </Button>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );

  function toggleMatchSelectionMode() {
    setMeta(null);
    setMatchSelectionMode((mode) =>
      mode === MatchSelectionMode.Automatic
        ? MatchSelectionMode.Manual
        : MatchSelectionMode.Automatic
    );
  }
}

type MatchSelectionProps = {
  matchSelectionMode: MatchSelectionMode;
  onMetaChanged: (meta: ScoutReportMeta | null) => void;
};

const MatchSelection = ({
  matchSelectionMode,
  onMetaChanged,
}: MatchSelectionProps) => {
  const { key } = useTournamentKey();
  const scouterSchedule = useQuery({
    queryKey: ["scouterSchedule", key],
    queryFn: () => getScouterSchedule(key!),
  });

  // const scouterScheduleForTournament = (scouterSchedule?.data.data.length ?? 0) > 0 && scouterSchedule?.data.data[0].matchIdentity.tournamentKey === tournament?.key ? scouterSchedule : null;

  switch (matchSelectionMode) {
    case MatchSelectionMode.Automatic:
      return (
        <ErrorBoundary
          fallback={
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <BodyMedium>Automatic match selection not available</BodyMedium>
            </View>
          }
        >
          <Suspense fallback={<ActivityIndicator style={{ flex: 1 }} />}>
            <AutomaticMatchSelection
              onChanged={onMetaChanged}
              key={scouterSchedule.data?.hash}
            />
          </Suspense>
        </ErrorBoundary>
      );
    case MatchSelectionMode.Manual:
      return <ManualMatchSelection onChanged={onMetaChanged} />;
  }
};

const AutomaticMatchSelection = ({
  onChanged,
}: {
  onChanged: (meta: ScoutReportMeta | null) => void;
}) => {
  const history = useAtomValue(historyAtom);

  const tournamentKey = useTournamentKey().key;
  const [tournament, scouterSchedule, scouter] = useSuspenseQueries({
    queries: [
      {
        queryKey: ["tournament", tournamentKey],
        queryFn: () => getTournament(tournamentKey!),
      },
      {
        queryKey: ["scouterSchedule", tournamentKey],
        queryFn: () => getScouterSchedule(tournamentKey!),
      },
      {
        queryKey: ["scouter"],
        queryFn: () => getScouter(),
      },
    ],
  });

  if (tournament.data) console.log("tournament.data", tournament.data);

  const matchesWithScouter = scouterSchedule.data.data.filter(
    (match) => scouter.data.uuid in match.scouters
  );

  const nextMatch = useMemo(() => {
    console.log({ history });
    if (!history || history.length === 0) return matchesWithScouter[0] ?? null;

    const matchesWithHistory = matchesWithScouter.filter((match) =>
      history.some(
        (report) =>
          report.meta.matchIdentity.matchNumber ===
            match.matchIdentity.matchNumber &&
          report.meta.matchIdentity.matchType ===
            match.matchIdentity.matchType &&
          report.meta.matchIdentity.tournamentKey ===
            match.matchIdentity.tournamentKey
      )
    );
    matchesWithHistory.sort((a, b) => {
      // Put qual matches first and elim matches last
      if (
        a.matchIdentity.matchType === MatchType.Qualifier &&
        b.matchIdentity.matchType !== MatchType.Qualifier
      )
        return -1;
      if (
        a.matchIdentity.matchType !== MatchType.Qualifier &&
        b.matchIdentity.matchType === MatchType.Qualifier
      )
        return 1;

      // Put lower match numbers first
      if (a.matchIdentity.matchNumber < b.matchIdentity.matchNumber) return -1;
      if (a.matchIdentity.matchNumber > b.matchIdentity.matchNumber) return 1;

      return 0;
    });

    if (matchesWithHistory.length === 0) return matchesWithScouter[0];

    const latestMatch = matchesWithHistory[matchesWithHistory.length - 1];
    // Return match after latest match (lowest match number and match type still after latest match)
    matchesWithScouter.sort((a, b) => {
      // Put qual matches first and elim matches last
      if (
        a.matchIdentity.matchType === MatchType.Qualifier &&
        b.matchIdentity.matchType !== MatchType.Qualifier
      )
        return -1;
      if (
        a.matchIdentity.matchType !== MatchType.Qualifier &&
        b.matchIdentity.matchType === MatchType.Qualifier
      )
        return 1;

      // Put lower match numbers first
      if (a.matchIdentity.matchNumber < b.matchIdentity.matchNumber) return -1;
      if (a.matchIdentity.matchNumber > b.matchIdentity.matchNumber) return 1;

      return 0;
    });

    const latestMatchOrdinalNumber = matchesWithHistory.findIndex(
      (match) =>
        JSON.stringify(match.matchIdentity) ===
        JSON.stringify(latestMatch.matchIdentity)
    );

    return (
      matchesWithScouter[latestMatchOrdinalNumber + 1] ?? matchesWithScouter[0]
    );
  }, [scouterSchedule.data, scouter.data, history]);

  const matchKeyOf = (match: MatchIdentity) =>
    `${match.tournamentKey}_${matchTypes
      .find((t) => t.type === match.matchType)
      ?.shortName.toLowerCase()}${match.matchNumber}`;

  const [selectedMatch, setSelectedMatch] =
    useState<ScouterScheduleMatch | null>(null);

  useEffect(() => {
    if (!nextMatch || selectedMatch) return;
    console.log("Setting match", nextMatch?.matchIdentity.matchNumber);
    setSelectedMatch(nextMatch);
  }, [matchesWithScouter, nextMatch]);

  // const tournament = useMemo(() => {
  //   if (!selectedMatch || !tournaments) return null;

  //   return tournaments.data.find(
  //     (t) => t.key === selectedMatch.matchIdentity.tournamentKey
  //   );
  // }, [selectedMatch, tournaments]);

  useEffect(() => {
    if (!selectedMatch) {
      onChanged(null);
      return;
    }

    onChanged({
      scouterUUID: scouter.data.uuid,
      allianceColor: selectedMatch.scouters[scouter.data.uuid].allianceColor,
      teamNumber: selectedMatch.scouters[scouter.data.uuid].teamNumber,
      matchIdentity: selectedMatch.matchIdentity,
    });
  }, [selectedMatch]);

  useEffect(() => {
    if (matchesWithScouter.length === 0) {
      onChanged(null);
    }
  }, [matchesWithScouter]);

  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      {tournament.data && (
        <Heading1Small color={colors.body.default}>
          {tournament.data.date.split("-")[0]} {tournament.data.name}
        </Heading1Small>
      )}

      {selectedMatch && (
        <TitleMedium>
          Scouting {selectedMatch.scouters[scouter.data.uuid].teamNumber}
        </TitleMedium>
      )}

      <View
        style={{
          height: 200,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {matchesWithScouter && selectedMatch != null ? (
          <Picker
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "transparent",
            }}
            selectedValue={
              selectedMatch && matchKeyOf(selectedMatch.matchIdentity)
            }
            key={
              Platform.OS === "ios"
                ? selectedMatch && matchKeyOf(selectedMatch.matchIdentity)
                : undefined
            }
            pickerData={matchesWithScouter.map((match) => ({
              label: localizeMatchIdentity(
                match.matchIdentity,
                MatchIdentityLocalizationFormat.Long
              ),
              value: matchKeyOf(match.matchIdentity),
            }))}
            onValueChange={(val: string) => {
              const match = matchesWithScouter.find(
                (match) => matchKeyOf(match.matchIdentity) === val
              );
              setSelectedMatch(match ?? null);
            }}
            textColor={colors.onBackground.default}
          />
        ) : (
          <BodyMedium>No matches found</BodyMedium>
        )}
      </View>
    </View>
  );
};

type ManualMatchSelectionProps = {
  onChanged: (meta: ScoutReportMeta | null) => void;
};

const ManualMatchSelection = (props: ManualMatchSelectionProps) => {
  const [matchType, setMatchType] = useState(MatchType.Qualifier);
  const [matchNumber, setMatchNumber] = useState("");
  const [teamNumber, setTeamNumber] = useState("");
  const [allianceColor, setAllianceColor] = useState(AllianceColor.Red);

  const tournamentKey = useTournamentKey().key;
  const tournament = useQuery({
    queryKey: ["tournament", tournamentKey],
    queryFn: () => getTournament(tournamentKey!),
  });

  const scouter = useQuery({
    queryKey: ["scouter"],
    queryFn: () => getScouter(),
  });

  useEffect(() => {
    const parsedTeamNumber = parseInt(teamNumber);
    const parsedMatchNumber = parseInt(matchNumber);

    if (isNaN(parsedTeamNumber)) {
      props.onChanged(null);
      return;
    }

    if (isNaN(parsedMatchNumber)) {
      props.onChanged(null);
      return;
    }

    if (!tournament.data) {
      props.onChanged(null);
      return;
    }

    if (!scouter.data) {
      props.onChanged(null);
      return;
    }

    props.onChanged({
      scouterUUID: scouter.data.uuid,
      allianceColor,
      teamNumber: parsedTeamNumber,
      matchIdentity: {
        matchNumber: parsedMatchNumber,
        matchType,
        tournamentKey: tournament.data.key,
      },
    });
  }, [matchType, matchNumber, teamNumber, allianceColor]);

  return (
    <ScrollView style={{ flex: 1, paddingTop: 10 }}>
      <TitleMedium>Match details</TitleMedium>
      {tournament.data ? (
        <Heading1Small>
          {tournament.data.date.split("-")[0]} {tournament.data.name}
        </Heading1Small>
      ) : (
        <Heading1Small>--</Heading1Small>
      )}
      <View style={{ height: 7 }} />
      <LabelSmall>Match number</LabelSmall>
      <View style={{ height: 7 }} />
      <TextField
        placeholder="Match number"
        value={matchNumber}
        onChangeText={(text) => setMatchNumber(text)}
        keyboardType="number-pad"
      />
      <View style={{ height: 14 }} />

      <ButtonGroup
        buttons={matchTypes.map((type) => ({
          label: type.localizedDescription,
          value: type.type,
        }))}
        selected={matchType}
        onChange={(val) => setMatchType(val)}
      />

      <View style={{ height: 14 }} />
      <LabelSmall>Team number</LabelSmall>
      <View style={{ height: 7 }} />
      <TextField
        placeholder="Team number"
        value={teamNumber}
        onChangeText={(text) => setTeamNumber(text)}
        keyboardType="number-pad"
      />
      <View style={{ height: 14 }} />
      <ButtonGroup
        buttons={allianceColors.map((color) => ({
          label: color.localizedDescription,
          value: color.color,
        }))}
        selected={allianceColor}
        onChange={(val) => setAllianceColor(val)}
      />
    </ScrollView>
  );
};

// const unwrappedScouterScheduleAtom = unwrap(scouterScheduleAtom, (prev) => prev);

const ScheduleColorGradient = () => {
  const tournamentKey = useTournamentKey().key;

  const scouterSchedule = useQuery({
    queryKey: ["scouterSchedule", tournamentKey],
    queryFn: () => getScouterSchedule(tournamentKey!),
  });

  let color = "transparent";

  if (scouterSchedule.error) {
    color = colors.danger.default;
  } else if (scouterSchedule.data?.hash) {
    color = getVerionsColor(scouterSchedule.data.hash, 30, 30);
  }

  return (
    <LinearGradient
      colors={[color, "transparent"]}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: 400,
      }}
    />
  );
};

enum ServicesStatus {
  Connected,
  Cached,
  Unavailable,
}

// const ServiceStatus = () => {
//     const [servicesStatus, setServicesStatus] = useState(ServicesStatus.Connected);

//     const servicesLoading = useAtomValue(servicesLoadingAtom);
//     const [effectiveServicesLoading, setEffectiveServicesLoading] = useState(servicesLoading);

//     const serviceValues = useContext(ServicesContext);
//     const loadServices = useContext(LoadServicesContext);

//     let status = ServicesStatus.Connected;

//     if (Object.values(serviceValues)
//             .some((service) => service?.source === DataSource.Cache)) {
//         status = ServicesStatus.Cached;
//     }

//     if (Object.values(serviceValues).some((service) => !service)) {
//         status = ServicesStatus.Unavailable;
//     }

//     if (status !== servicesStatus || servicesLoading !== effectiveServicesLoading) {
//         LayoutAnimation.configureNext({
//             duration: 400,
//             create: {
//                 type: LayoutAnimation.Types.linear,
//                 property: LayoutAnimation.Properties.opacity,
//                 duration: 200,
//             },
//             update: {
//                 type: LayoutAnimation.Types.spring,
//                 springDamping: 0.7,
//                 initialVelocity: 1,
//                 duration: 400,
//             },
//             delete: {
//                 type: LayoutAnimation.Types.linear,
//                 property: LayoutAnimation.Properties.opacity,
//                 duration: 200,
//             },
//         });

//         setServicesStatus(status);
//         setEffectiveServicesLoading(servicesLoading);
//     }

//     return (
//         <Pressable
//             onPress={loadServices}
//             style={{
//                 alignItems: "center",
//                 flexDirection: "row",
//                 backgroundColor: colors.secondaryContainer.default,
//                 paddingRight: 14,
//                 paddingLeft: effectiveServicesLoading ? 8 : 14,
//                 paddingVertical: 6,
//                 borderRadius: 50,
//                 borderColor: colors.gray.default,
//                 borderWidth: 2,
//                 overflow: "hidden",
//             }}
//         >
//             {effectiveServicesLoading ? <ActivityIndicator /> : <View
//                 style={{
//                     width: 7,
//                     height: 7,
//                     borderRadius: 3.5,
//                     backgroundColor: {
//                         [ServicesStatus.Connected]: "#44ca6c",
//                         [ServicesStatus.Cached]: "#f5c518",
//                         [ServicesStatus.Unavailable]: colors.danger.default,
//                     }[servicesStatus],
//                 }}
//             />}
//             <View style={{ width: effectiveServicesLoading ? 2 : 9 }} />
//             {servicesStatus === ServicesStatus.Connected && (
//                 <BodyMedium>Connected</BodyMedium>
//             )}

//             {servicesStatus === ServicesStatus.Cached && (
//                 <BodyMedium>
//                     Updated{" "}
//                     <TimeAgo
//                         date={
//                             Object.values(serviceValues)
//                                 .filter((service) => service !== null)
//                                 .sort((a, b) => b!.sourcedAt - a!.sourcedAt)[0]!.sourcedAt
//                         }
//                     />
//                 </BodyMedium>
//             )}

//             {servicesStatus === ServicesStatus.Unavailable && (
//                 <BodyMedium color={colors.danger.default}>Unavailable</BodyMedium>
//             )}
//         </Pressable>
//     );
// };
