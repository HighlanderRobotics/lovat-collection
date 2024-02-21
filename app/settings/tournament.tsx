import { atom, useAtomValue } from "jotai";
import { raceTournamentsCached } from "../../lib/lovatAPI/getTournaments";
import { tournamentAtom, useSetTournament } from "../../lib/storage/getTournament";
import { Suspense, useMemo, useState } from "react";
import { ActivityIndicator } from "react-native";
import Heading1Small from "../../lib/components/text/Heading1Small";
import { View } from "react-native";
import TextField from "../../lib/components/TextField";
import { router } from "expo-router";
import { colors } from "../../lib/colors";
import { IconButton } from "../../lib/components/IconButton";
import { NavBar } from "../../lib/components/NavBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Icon } from "../../lib/components/Icon";
import BodyMedium from "../../lib/components/text/BodyMedium";

const tournamentsAtom = atom(raceTournamentsCached);

export default function Tournament() {
    const [filter, setFilter] = useState('');

    return (
        <>
            <NavBar
                title="Tournament"
                left={
                    <IconButton
                        icon="arrow_back_ios"
                        label="Back"
                        onPress={() => {
                            router.back();
                        }}
                        color={colors.onBackground.default}
                    />
                }
                bottom={
                    <View
                        style={{
                            paddingTop: 14,
                            paddingHorizontal: 10,
                            flexDirection: "row",
                            justifyContent: "center",
                        }}
                    >
                        <View style={{ maxWidth: 800, flex: 1 }}>
                            <TextField
                                placeholder="Search"
                                value={filter}
                                onChangeText={setFilter}
                                returnKeyType="search"
                            />
                        </View>
                    </View>
                }
            />
            <Suspense fallback={<ActivityIndicator style={{ flex: 1 }} />}>
                <KeyboardAwareScrollView style={{ flex: 1, paddingVertical: 16, paddingHorizontal: 26 }}>
                    <SafeAreaView edges={['bottom', 'left', 'right']} style={{ flex: 1, gap: 14, flexDirection: "row", justifyContent: "center" }}>
                        <TournamentSelector filter={filter} />
                    </SafeAreaView>
                </KeyboardAwareScrollView>
            </Suspense>
        </>
    );
}

const TournamentSelector = ({ filter }: { filter: string }) => {
    const tournamentsCache = useAtomValue(tournamentsAtom);

    const tournaments = useMemo(() => {
        return tournamentsCache?.data ?? [];
    }, [tournamentsCache]);

    const filteredTournaments = useMemo(() => {
        if (!filter) return tournaments;
        return tournaments.filter((tournament) => {
            return tournament.name.toLowerCase().includes(filter.toLowerCase());
        });
    }, [tournaments, filter]);

    return (
        <View
            style={{
                flex: 1,
                gap: 14,
                maxWidth: 800,
            }}
        >
            {filteredTournaments.map((tournament) => (
                <TournamentItem
                    key={tournament.key}
                    tournament={tournament}
                />
            ))}
        </View>
    )
}

const TournamentItem = ({ tournament }: { tournament: Tournament }) => {
    const selectTournament = useSetTournament();

    return (
        <TouchableOpacity
            key={tournament.key}
            onPress={() => {
                selectTournament(tournament);
            }}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: 7,
                backgroundColor: colors.secondaryContainer.default,
            }}
        >
            <View
                style={{
                    flex: 1,
                }}
            >
                <Heading1Small>{tournament.date.split('-')[0]} {tournament.name}</Heading1Small>
                <BodyMedium>{tournament.location}</BodyMedium>
            </View>
            <Suspense>
                <SelectedIndicator tournament={tournament} />
            </Suspense>
        </TouchableOpacity>
    )
}

const SelectedIndicator = ({ tournament }: { tournament: Tournament }) => {
    const selectedTournament = useAtomValue(tournamentAtom);

    if (selectedTournament?.key === tournament.key) {
        return (
            <Icon name="check" color={colors.onBackground.default} />
        )
    } else {
        return null;
    }
}
