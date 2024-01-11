import { SafeAreaView, View, LayoutAnimation, ScrollView } from "react-native";
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
import { useContext, useEffect, useState } from "react";
import { ServicesContext } from "../lib/services";
import { DataSource } from "../lib/localCache";

import TimeAgo from "../lib/components/TimeAgo";
import { getTournament } from "../lib/storage/getTournament";
import { ButtonGroup } from "../lib/components/ButtonGroup";
import { MatchType, matchTypes } from "../lib/models/match";
import { AllianceColor, allianceColors } from "../lib/models/AllianceColor";
import { ScoutReportMeta } from "../lib/models/ScoutReportMeta";
import { getScouter } from "../lib/storage/getScouter";
import { useAtom } from "jotai";
import { reportStateAtom } from "../lib/collection/reportStateAtom";
import { GamePhase, ReportState } from "../lib/collection/ReportState";
import { router, useNavigation } from "expo-router";

enum MatchSelectionMode {
    Automatic,
    Manual,
}

export default function Home() {
    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [matchSelectionMode, setMatchSelectionMode] = useState(MatchSelectionMode.Automatic);
    const [meta, setMeta] = useState<ScoutReportMeta | null>(null);
    const [reportState, setReportState] = useAtom(reportStateAtom);

    const navigation = useNavigation()

    const scoutMatch = () => {
        const report: ReportState = {
            meta: meta!,
            events: [],
            startPiece: false,
            gamePhase: GamePhase.Auto,
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
            <LinearGradient
                colors={["#335544", "transparent"]}
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    height: 400,
                }}
            />

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
                        />

                        <ServiceStatus />

                        <IconButton
                            label="settings"
                            icon="settings"
                            color={colors.onBackground.default}
                        />
                    </View>

                    <MatchSelection matchSelectionMode={matchSelectionMode} onMetaChanged={setMeta} />

                    <View style={{ gap: 14 }}>
                        <Button variant="secondary" onPress={toggleMatchSelectionMode}>
                            {matchSelectionMode === MatchSelectionMode.Automatic
                                ? "Enter details manually"
                                : "Use scouter schedule"}
                        </Button>
                        <Button variant="primary" disabled={!meta} onPress={() => {
                            if (!meta) return;

                            scoutMatch();
                        }}>Scout this match</Button>
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
            return <AutomaticMatchSelection />;
        case MatchSelectionMode.Manual:
            return <ManualMatchSelection onChanged={onMetaChanged} />;
    }
}

const AutomaticMatchSelection = () => {
    return (
        <View
            style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
            {/* <BodyMedium>{tournament?.date.split("-")[0]} {tournament?.name}</BodyMedium> */}
            <BodyMedium>2023 Galileo</BodyMedium>
            <View style={{ height: 7 }} />
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 7,
                paddingLeft: 7 + 24,
            }}>
                <TitleMedium>Qualifier 8</TitleMedium>
                <Icon name="edit" color={colors.body.default} />
            </View>
            <Heading1Small>Scouting 8033</Heading1Small>
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

enum ServicesStatus {
    Connected,
    Cached,
    Unavailable,
}

const ServiceStatus = () => {
    const [servicesStatus, setServicesStatus] = useState(ServicesStatus.Connected);

    const serviceValues = useContext(ServicesContext);

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
        <View
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
        </View>
    );
};
