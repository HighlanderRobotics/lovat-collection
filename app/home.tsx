import {
  View,
  ScrollView,
  ActivityIndicator,
  Platform,
  Pressable,
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
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import {
  getServiceLoader,
  useServiceErrorStore,
  useServicesLoadingStore,
  useTeamScoutersStore,
} from "../lib/services";
import { useScouterStore, useTournamentStore } from "../lib/storage/userStores";
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
import { Stack, router, useFocusEffect } from "expo-router";
import "react-native-get-random-values";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScouterScheduleMatch,
  getVerionsColor,
} from "../lib/lovatAPI/getScouterSchedule";
import { Picker } from "react-native-wheel-pick";
import { useHistoryStore } from "../lib/storage/historyStore";
import { useStartMatchEnabledStore } from "../lib/storage/userStores";
import React from "react";
import { useReportStateStore } from "../lib/collection/reportStateStore";
import { useScouterScheduleStore, useTournamentsStore } from "../lib/services";
import TimeAgo from "../lib/components/TimeAgo";
import {
  MatchSelectionMode,
  useMatchSelectionModeStore,
} from "../lib/storage/userStores";
import { createGenericPersistantStore } from "../lib/storage/zustandStorage";

export default function Home() {
  const { value: matchSelectionMode, setValue: setMatchSelectionMode } =
    useMatchSelectionModeStore();
  const toggleMatchSelectionMode = () =>
    setMatchSelectionMode(
      matchSelectionMode === MatchSelectionMode.Automatic
        ? MatchSelectionMode.Manual
        : MatchSelectionMode.Automatic,
    );
  const [meta, setMeta] = useState<ScoutReportMeta | null>(null);
  const reportState = useReportStateStore();

  const startMatchEnabled = useStartMatchEnabledStore((state) => state.value);
  const loadServices = getServiceLoader();

  useFocusEffect(
    useCallback(() => {
      loadServices();
    }, []),
  );

  useEffect(() => {
    if (!reportState.meta) return;

    router.replace("/game");
  }, [reportState.meta]);

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

            <ServiceStatus />

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
                    reportState.scoutMatch(meta);
                  }}
                >
                  Scout this match
                </Button>
                <Button
                  variant="primary"
                  filled={false}
                  onPress={onSwitchMatchSelectionMode}
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

  function onSwitchMatchSelectionMode() {
    setMeta(null);
    toggleMatchSelectionMode();
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
  const scouterSchedule = useScouterScheduleStore((state) => state.data);

  const tournament = useTournamentStore((state) => state.value);

  const scouterScheduleForTournament =
    (scouterSchedule?.data.length ?? 0) > 0 &&
    scouterSchedule?.data[0].matchIdentity.tournamentKey === tournament?.key
      ? scouterSchedule
      : null;
  switch (matchSelectionMode) {
    case MatchSelectionMode.Automatic:
      return (
        <Suspense fallback={<ActivityIndicator style={{ flex: 1 }} />}>
          <AutomaticMatchSelection
            onChanged={onMetaChanged}
            key={scouterScheduleForTournament?.hash}
          />
        </Suspense>
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
  const history = useHistoryStore((state) => state.history);

  const scouterSchedule = useScouterScheduleStore((state) => state.data);
  const tournaments = useTournamentsStore((state) => state.data);

  const scouter = useScouterStore((state) => state.value);

  const selectedTournament = useTournamentStore((state) => state.value);
  const scouterScheduleForTournament =
    (scouterSchedule?.data.length ?? 0) > 0 &&
    scouterSchedule?.data[0].matchIdentity.tournamentKey ===
      selectedTournament?.key
      ? scouterSchedule
      : null;

  const matchesWithScouter = useMemo(() => {
    if (!scouterScheduleForTournament || !scouter) return [];

    return scouterScheduleForTournament.data.filter(
      (match) => scouter?.uuid in match.scouters,
    );
  }, [scouterScheduleForTournament, scouter]);

  const nextMatch = useMemo(() => {
    console.log({ history });
    if (!history || history.length === 0) return matchesWithScouter[0] ?? null;
    if (!scouterScheduleForTournament) return null;

    const matches = scouterScheduleForTournament.data.filter(
      (match) => scouter && scouter?.uuid in match.scouters,
    );
    const matchesWithHistory = matches.filter((match) =>
      history.some(
        (report) =>
          report.meta.matchIdentity.matchNumber ===
            match.matchIdentity.matchNumber &&
          report.meta.matchIdentity.matchType ===
            match.matchIdentity.matchType &&
          report.meta.matchIdentity.tournamentKey ===
            match.matchIdentity.tournamentKey,
      ),
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
    matches.sort((a, b) => {
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

    const latestMatchOrdinalNumber = matches.findIndex(
      (match) =>
        JSON.stringify(match.matchIdentity) ===
        JSON.stringify(latestMatch.matchIdentity),
    );

    return matches[latestMatchOrdinalNumber + 1] ?? matchesWithScouter[0];
  }, [scouterScheduleForTournament, scouter, history]);

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

  const tournament = useMemo(() => {
    if (!selectedMatch || !tournaments) return null;

    return tournaments.find(
      (t) => t.key === selectedMatch.matchIdentity.tournamentKey,
    );
  }, [selectedMatch, tournaments]);

  useEffect(() => {
    if (!selectedMatch) {
      onChanged(null);
      return;
    }

    onChanged({
      scouterUUID: scouter!.uuid,
      allianceColor: selectedMatch.scouters[scouter!.uuid].allianceColor,
      teamNumber: selectedMatch.scouters[scouter!.uuid].teamNumber,
      matchIdentity: selectedMatch.matchIdentity,
    });
  }, [selectedMatch]);

  useEffect(() => {
    if (matchesWithScouter.length === 0) {
      onChanged(null);
    }
  }, [matchesWithScouter]);

  if (!scouter || !tournaments) return null;

  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      {tournament && (
        <Heading1Small color={colors.body.default}>
          {tournament.date.split("-")[0]} {tournament.name}
        </Heading1Small>
      )}

      {selectedMatch && (
        <TitleMedium>
          Scouting {selectedMatch.scouters[scouter.uuid].teamNumber}
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
        {matchesWithScouter.length >= 1 && selectedMatch != null ? (
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
                MatchIdentityLocalizationFormat.Long,
              ),
              value: matchKeyOf(match.matchIdentity),
            }))}
            onValueChange={(val: string) => {
              const match = matchesWithScouter.find(
                (match) => matchKeyOf(match.matchIdentity) === val,
              );
              setSelectedMatch(match ?? null);
            }}
            textColor={colors.onBackground.default}
          />
        ) : (
          <View style={{ width: 250, alignItems: "center" }}>
            <Heading1Small>No matches found</Heading1Small>
            <BodyMedium style={{ textAlign: "center" }}>
              You haven&apos;t been assigned a scouter schedule by a scouting
              lead. Tap below to enter a match&apos;s details manually.
            </BodyMedium>
          </View>
        )}
      </View>
    </View>
  );
};

type ManualMatchSelectionProps = {
  onChanged: (meta: ScoutReportMeta | null) => void;
};

const useAllianceColorChoice = createGenericPersistantStore<AllianceColor>(
  "allianceColorChoice",
  AllianceColor.Red,
);

const ManualMatchSelection = (props: ManualMatchSelectionProps) => {
  const [matchType, setMatchType] = useState(MatchType.Qualifier);
  const [matchNumber, setMatchNumber] = useState("");
  const [teamNumber, setTeamNumber] = useState("");
  const { value: allianceColor, setValue: setAllianceColor } =
    useAllianceColorChoice();
  const tournament = useTournamentStore((state) => state.value);
  const scouter = useScouterStore((state) => state.value);

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

    if (!tournament) {
      props.onChanged(null);
      return;
    }

    if (!scouter) {
      props.onChanged(null);
      return;
    }

    props.onChanged({
      scouterUUID: scouter.uuid,
      allianceColor,
      teamNumber: parsedTeamNumber,
      matchIdentity: {
        matchNumber: parsedMatchNumber,
        matchType,
        tournamentKey: tournament.key,
      },
    });
  }, [matchType, matchNumber, teamNumber, allianceColor]);

  return (
    <ScrollView style={{ flex: 1, paddingTop: 14 }}>
      {tournament ? (
        <Heading1Small>
          {tournament.date.split("-")[0]} {tournament.name}
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
        placeholder="8033"
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

const ScheduleColorGradient = () => {
  const scouterSchedule = useScouterScheduleStore((state) => state.data);
  const tournament = useTournamentStore((state) => state.value);

  const scouterScheduleForTournament =
    (scouterSchedule?.data.length ?? 0) > 0 &&
    scouterSchedule?.data[0].matchIdentity.tournamentKey === tournament?.key
      ? scouterSchedule
      : null;

  const [color, setColor] = useState("transparent");

  useEffect(() => {
    if (scouterScheduleForTournament?.hash) {
      setColor(getVerionsColor(scouterScheduleForTournament?.hash, 30, 30));
    } else {
      setColor("transparent");
    }
  }, [scouterScheduleForTournament]);

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

const ServiceStatus = () => {
  const servicesLoading = useServicesLoadingStore((state) => state.value);

  const loadServices = getServiceLoader();

  const servicesCached = [
    useTeamScoutersStore.getState(),
    useScouterScheduleStore.getState(),
    useTournamentsStore.getState(),
  ];

  const serviceCacheTimes = servicesCached.map((item) => item.timestamp);

  const serviceError = useServiceErrorStore((state) => state.value);

  let status = ServicesStatus.Connected;

  if (serviceError) {
    status = ServicesStatus.Cached;
  }

  if (!servicesCached.some((item) => item !== null)) {
    status = ServicesStatus.Unavailable;
  }

  return (
    <Pressable
      onPress={loadServices}
      style={{
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: colors.secondaryContainer.default,
        paddingRight: 14,
        paddingLeft: servicesLoading ? 8 : 14,
        paddingVertical: 6,
        borderRadius: 50,
        borderColor: colors.gray.default,
        borderWidth: 2,
        overflow: "hidden",
      }}
    >
      {servicesLoading ? (
        <ActivityIndicator />
      ) : (
        <View
          style={{
            width: 7,
            height: 7,
            borderRadius: 3.5,
            backgroundColor: {
              [ServicesStatus.Connected]: "#44ca6c",
              [ServicesStatus.Cached]: "#f5c518",
              [ServicesStatus.Unavailable]: colors.danger.default,
            }[status],
          }}
        />
      )}
      <View style={{ width: servicesLoading ? 2 : 9 }} />
      {status === ServicesStatus.Connected && (
        <BodyMedium>Connected</BodyMedium>
      )}

      {status === ServicesStatus.Cached && (
        <BodyMedium>
          Updated{" "}
          <TimeAgo
            date={
              serviceCacheTimes.reduce((acc, curr) => {
                if (curr && curr < acc!) {
                  return curr;
                } else {
                  return acc;
                }
              }, Date.now()) ?? 0
            }
          />
        </BodyMedium>
      )}

      {status === ServicesStatus.Unavailable && (
        <BodyMedium color={colors.danger.default}>Unavailable</BodyMedium>
      )}
    </Pressable>
  );
};
