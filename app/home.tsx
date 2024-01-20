import { View, LayoutAnimation, ScrollView, Pressable, ActivityIndicator } from "react-native";
import TitleMedium from "../lib/components/text/TitleMedium";
import TextField from "../lib/components/TextField";
import LabelSmall from "../lib/components/text/LabelSmall";
import Button from "../lib/components/Button";
import Heading1Small from "../lib/components/text/Heading1Small";

import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../lib/colors";
import BodyMedium from "../lib/components/text/BodyMedium";
import { Icon } from "../lib/components/Icon";
import { IconButton } from "../lib/components/IconButton";
import { Suspense, useContext, useEffect, useMemo, useState } from "react";
import { LoadServicesContext, ServicesContext } from "../lib/services";
import { DataSource } from "../lib/localCache";

import TimeAgo from "../lib/components/TimeAgo";
import { getTournament } from "../lib/storage/getTournament";
import { ButtonGroup } from "../lib/components/ButtonGroup";
import { MatchIdentity, MatchIdentityLocalizationFormat, MatchType, localizeMatchIdentity, matchTypes } from "../lib/models/match";
import { AllianceColor, allianceColors } from "../lib/models/AllianceColor";
import { ScoutReportMeta } from "../lib/models/ScoutReportMeta";
import { getScouter } from "../lib/storage/getScouter";
import { atom, useAtom, useAtomValue } from "jotai";
import { reportStateAtom } from "../lib/collection/reportStateAtom";
import { GamePhase, ReportState, RobotRole } from "../lib/collection/ReportState";
import { HighNote } from "../lib/collection/HighNote";
import { StageResult } from "../lib/collection/StageResult";
import { router, useNavigation } from "expo-router";
import { DriverAbility } from "../lib/collection/DriverAbility";
import { PickUp } from "../lib/collection/PickUp";
import 'react-native-get-random-values';
import { v4 } from "uuid";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScouterScheduleMatch, getVerionsColor, scouterScheduleAtom } from "../lib/storage/scouterSchedules";
import { loadable, unwrap } from "jotai/utils";
import { Picker } from "react-native-wheel-pick";
import { getTournaments, getTournamentsCached } from "../lib/lovatAPI/getTournaments";
import { historyAtom } from "../lib/storage/historyAtom";

enum MatchSelectionMode {
    Automatic,
    Manual,
}

export default function Home() {
    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [matchSelectionMode, setMatchSelectionMode] = useState(MatchSelectionMode.Automatic);
    const [meta, setMeta] = useState<ScoutReportMeta | null>(null);
    const [reportState, setReportState] = useAtom(reportStateAtom);

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
        }

        setReportState(report)
    }

    useEffect(() => {
        if (!reportState) return;

        router.push("/game");
    }, [reportState])

    useEffect(() => {
        const fetchTournament = async () => {
            const tournament = await getTournament();
            setTournament(tournament || null);
        };

        fetchTournament();
    }, []);

    return (
        <>
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

                    <MatchSelection matchSelectionMode={matchSelectionMode} onMetaChanged={setMeta} />

                    <View style={{ gap: 10 }}>
                        <Button variant="primary" disabled={!meta} onPress={() => {
                            if (!meta) return;

                            scoutMatch();
                        }}>Scout this match</Button>
                        <Button variant="primary" filled={false} onPress={toggleMatchSelectionMode}>
                            {matchSelectionMode === MatchSelectionMode.Automatic
                                ? "Enter details manually"
                                : "Use scouter schedule"}
                        </Button>
                    </View>
                </View>
            </SafeAreaView>
        </>
    );

    function toggleMatchSelectionMode() {
        setMeta(null);
        setMatchSelectionMode((mode) => mode === MatchSelectionMode.Automatic ? MatchSelectionMode.Manual : MatchSelectionMode.Automatic);
    }
}

type MatchSelectionProps = {
    matchSelectionMode: MatchSelectionMode;
    onMetaChanged: (meta: ScoutReportMeta | null) => void;
}

const MatchSelection = ({ matchSelectionMode, onMetaChanged }:  MatchSelectionProps) => {
    switch (matchSelectionMode) {
        case MatchSelectionMode.Automatic:
            return <Suspense fallback={<ActivityIndicator style={{ flex: 1 }} />}>
                <AutomaticMatchSelection onChanged={onMetaChanged} />
            </Suspense>;
        case MatchSelectionMode.Manual:
            return <ManualMatchSelection onChanged={onMetaChanged} />;
    }
}

const scouterAtom = atom(async () => {
    const scouter = await getScouter();
    return scouter;
});

const tournamentsAtom = atom(async () => {
    const tournaments = await getTournamentsCached();
    return tournaments;
});

const AutomaticMatchSelection = ({ onChanged }: { onChanged: (meta: ScoutReportMeta | null) => void }) => {
    const scouterSchedule = useAtomValue(scouterScheduleAtom);
    const scouter = useAtomValue(scouterAtom);
    const tournaments = useAtomValue(tournamentsAtom);
    const history = useAtomValue(historyAtom);

    const matchesWithScouter = useMemo(() => {
        if (!scouterSchedule) return [];

        return scouterSchedule.data.data.filter(match => scouter?.uuid in match.scouters);
    }, [scouterSchedule, scouter]);

    const nextMatch = useMemo(() => {
        console.log({history})
        if (!history || history.length === 0) return matchesWithScouter[0] ?? null;
        if (!scouterSchedule) return null;

        const matches = scouterSchedule.data.data.filter(match => scouter?.uuid in match.scouters);
        const matchesWithHistory = matches.filter(match => history.some(report => report.meta.matchIdentity.matchNumber === match.matchIdentity.matchNumber && report.meta.matchIdentity.matchType === match.matchIdentity.matchType && report.meta.matchIdentity.tournamentKey === match.matchIdentity.tournamentKey));
        matchesWithHistory.sort((a, b) => {
            // Put qual matches first and elim matches last
            if (a.matchIdentity.matchType === MatchType.Qualifier && b.matchIdentity.matchType !== MatchType.Qualifier) return -1;
            if (a.matchIdentity.matchType !== MatchType.Qualifier && b.matchIdentity.matchType === MatchType.Qualifier) return 1;

            // Put lower match numbers first
            if (a.matchIdentity.matchNumber < b.matchIdentity.matchNumber) return -1;
            if (a.matchIdentity.matchNumber > b.matchIdentity.matchNumber) return 1;

            return 0;
        });

        const latestMatch = matchesWithHistory[matchesWithHistory.length - 1];
        // Return match after latest match (lowest match number and match type still after latest match)
        matches.sort((a, b) => {
            // Put qual matches first and elim matches last
            if (a.matchIdentity.matchType === MatchType.Qualifier && b.matchIdentity.matchType !== MatchType.Qualifier) return -1;
            if (a.matchIdentity.matchType !== MatchType.Qualifier && b.matchIdentity.matchType === MatchType.Qualifier) return 1;

            // Put lower match numbers first
            if (a.matchIdentity.matchNumber < b.matchIdentity.matchNumber) return -1;
            if (a.matchIdentity.matchNumber > b.matchIdentity.matchNumber) return 1;

            return 0;
        });

        const latestMatchOrdinalNumber = matches.findIndex(match => JSON.stringify(match.matchIdentity) === JSON.stringify(latestMatch.matchIdentity));

        return matches[latestMatchOrdinalNumber + 1] ?? matchesWithScouter[0];
    }, [scouterSchedule, scouter, history]);

    const matchKeyOf = (match: MatchIdentity) => `${match.tournamentKey}_${matchTypes.find(t => t.type === match.matchType)?.shortName.toLowerCase()}${match.matchNumber}`;

    const [selectedMatch, setSelectedMatch] = useState<ScouterScheduleMatch | null>(null);

    useEffect(() => {
        if (!nextMatch || selectedMatch) return;
        console.log("Setting match", nextMatch?.matchIdentity.matchNumber);
        setSelectedMatch(nextMatch);
    }, [matchesWithScouter, nextMatch]);

    const tournament = useMemo(() => {
        if (!selectedMatch) return null;

        return tournaments.data.find((t) => t.key === selectedMatch.matchIdentity.tournamentKey);
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

    return (
        <View
            style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
            {tournament && (
                <Heading1Small color={colors.body.default}>{tournament.date.split('-')[0]} {tournament.name}</Heading1Small>
            )}

            {selectedMatch && (
                <TitleMedium>Scouting {selectedMatch.scouters[scouter.uuid].teamNumber}</TitleMedium>
            )}

            <View style={{ height: 200, width: "100%", justifyContent: "center", alignItems: "center" }}>
                {(matchesWithScouter.length >= 1 && selectedMatch != null) ? <Picker
                    style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
                    selectedValue={selectedMatch && matchKeyOf(selectedMatch.matchIdentity)}
                    pickerData={matchesWithScouter.map(match => ({
                        label: localizeMatchIdentity(match.matchIdentity, MatchIdentityLocalizationFormat.Long),
                        value: matchKeyOf(match.matchIdentity),
                    }))}
                    onValueChange={(val: string) => {
                        const match = matchesWithScouter.find(match => matchKeyOf(match.matchIdentity) === val);
                        setSelectedMatch(match ?? null);
                    }}
                    textColor={colors.onBackground.default}
                /> : <BodyMedium>No matches found</BodyMedium>}
            </View>
        </View>
    )
}

type ManualMatchSelectionProps = {
    onChanged: (meta: ScoutReportMeta | null) => void;
}

const ManualMatchSelection = (props: ManualMatchSelectionProps) => {
    const [matchType, setMatchType] = useState(MatchType.Qualifier);
    const [matchNumber, setMatchNumber] = useState("");
    const [teamNumber, setTeamNumber] = useState("");
    const [allianceColor, setAllianceColor] = useState(AllianceColor.Red);
    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [scouter, setScouter] = useState<Scouter | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const tournament = await getTournament();
            setTournament(tournament ?? null);

            const scouter = await getScouter();
            setScouter(scouter ?? null);
        };

        fetchData();
    }, []);

    useEffect(() => {
        const parsedTeamNumber = parseInt(teamNumber);
        const parsedMatchNumber = parseInt(matchNumber);

        if (isNaN(parsedTeamNumber)) {
            props.onChanged(null);
            return;
        };

        if (isNaN(parsedMatchNumber)) {
            props.onChanged(null);
            return;
        };

        if (!tournament) {
            props.onChanged(null);
            return;
        };

        if (!scouter) {
            props.onChanged(null);
            return;
        };

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
        <ScrollView style={{ flex: 1, paddingTop: 10 }}>
            <TitleMedium>Match details</TitleMedium>
            {tournament ? (
                <Heading1Small>{tournament.date.split("-")[0]} {tournament.name}</Heading1Small>
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
                buttons={matchTypes.map(type => ({ label: type.localizedDescription, value: type.type }))}
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
                buttons={allianceColors.map(color => ({ label: color.localizedDescription, value: color.color }))}
                selected={allianceColor}
                onChange={(val) => setAllianceColor(val)}
            />

            
        </ScrollView>
    )
};

const unwrappedScouterScheduleAtom = unwrap(scouterScheduleAtom, (prev) => prev);

const ScheduleColorGradient = () => {
    const scouterSchedule = useAtomValue(unwrappedScouterScheduleAtom);
    const [color, setColor] = useState("transparent");


    useEffect(() => {
        if (scouterSchedule?.data.hash) {
            setColor(getVerionsColor(scouterSchedule?.data.hash, 30, 30));
        } else {
            setColor(colors.danger.default);
        }
    }, [scouterSchedule]);

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
    )
}

enum ServicesStatus {
    Connected,
    Cached,
    Unavailable,
}

const ServiceStatus = () => {
    const [servicesStatus, setServicesStatus] = useState(ServicesStatus.Connected);

    const serviceValues = useContext(ServicesContext);
    const loadServices = useContext(LoadServicesContext);

    let status = ServicesStatus.Connected;

    if (Object.values(serviceValues)
            .some((service) => service?.source === DataSource.Cache)) {
        status = ServicesStatus.Cached;
    }

    if (Object.values(serviceValues).some((service) => !service)) {
        status = ServicesStatus.Unavailable;
    }

    if (status !== servicesStatus) {
        LayoutAnimation.configureNext({
            duration: 400,
            create: {
                type: LayoutAnimation.Types.linear,
                property: LayoutAnimation.Properties.opacity,
                duration: 200,
            },
            update: {
                type: LayoutAnimation.Types.spring,
                springDamping: 0.7,
                initialVelocity: 1,
                duration: 400,
            },
            delete: {
                type: LayoutAnimation.Types.linear,
                property: LayoutAnimation.Properties.opacity,
                duration: 200,
            },
        });

        setServicesStatus(status);
    }

    return (
        <Pressable
            onPress={loadServices}
            style={{
                alignItems: "center",
                flexDirection: "row",
                backgroundColor: colors.secondaryContainer.default,
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderRadius: 50,
                borderColor: colors.gray.default,
                borderWidth: 2,
                overflow: "hidden",
            }}
        >
            <View
                style={{
                    width: 7,
                    height: 7,
                    borderRadius: 3.5,
                    backgroundColor: {
                        [ServicesStatus.Connected]: "#44ca6c",
                        [ServicesStatus.Cached]: "#f5c518",
                        [ServicesStatus.Unavailable]: colors.danger.default,
                    }[servicesStatus],
                }}
            />
            <View style={{ width: 7 }} />
            {servicesStatus === ServicesStatus.Connected && (
                <BodyMedium>Connected</BodyMedium>
            )}

            {servicesStatus === ServicesStatus.Cached && (
                <BodyMedium>
                    Updated{" "}
                    <TimeAgo
                        date={
                            Object.values(serviceValues)
                                .filter((service) => service !== null)
                                .sort((a, b) => b!.sourcedAt - a!.sourcedAt)[0]!.sourcedAt
                        }
                    />
                </BodyMedium>
            )}

            {servicesStatus === ServicesStatus.Unavailable && (
                <BodyMedium color={colors.danger.default}>Unavailable</BodyMedium>
            )}
        </Pressable>
    );
};
