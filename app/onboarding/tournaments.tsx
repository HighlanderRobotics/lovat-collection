import { useNavigation } from "expo-router";
import { View } from "react-native";
import BodyMedium from "../../lib/components/text/BodyMedium";
import { SafeAreaView } from "react-native-safe-area-context";
import { CommonActions } from "@react-navigation/native";
import { atom, useAtomValue } from "jotai";
import { raceTournamentsCached } from "../../lib/lovatAPI/getTournaments";
import { useSetTournament } from "../../lib/storage/getTournament";
import { Suspense, useMemo, useState } from "react";
import { ActivityIndicator } from "react-native";
import Heading1Small from "../../lib/components/text/Heading1Small";

import TextField from "../../lib/components/TextField";

import { colors } from "../../lib/colors";
import { NavBar } from "../../lib/components/NavBar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OnboardingTournaments() {
  const [filter, setFilter] = useState("");

  return (
    <>
      <NavBar
        title="Your Tournament"
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
        <KeyboardAwareScrollView
          style={{ flex: 1, paddingVertical: 16, paddingHorizontal: 26 }}
        >
          <SafeAreaView
            edges={["bottom", "left", "right"]}
            style={{
              flex: 1,
              gap: 14,
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <TournamentSelector filter={filter} />
          </SafeAreaView>
        </KeyboardAwareScrollView>
      </Suspense>
    </>
  );
}

const tournamentsAtom = atom(raceTournamentsCached);

const TournamentSelector = ({ filter }: { filter: string }) => {
  const tournamentsCache = useAtomValue(tournamentsAtom);

  const tournaments = useMemo(() => {
    return tournamentsCache?.data ?? [];
  }, [tournamentsCache]);

  const filteredTournaments = useMemo(() => {
    if (!filter) return tournaments;
    return tournaments.filter((tournament) => {
      return `${tournament.date.split("-")[0]} ${tournament.name}`
        .toLowerCase()
        .includes(filter.toLowerCase());
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
        <TournamentItem key={tournament.key} tournament={tournament} />
      ))}
    </View>
  );
};

const TournamentItem = ({ tournament }: { tournament: Tournament }) => {
  const selectTournament = useSetTournament();
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      key={tournament.key}
      onPress={async () => {
        selectTournament(tournament);
        await AsyncStorage.setItem("onboarding-complete", "true");
        navigation.dispatch(
          CommonActions.reset({
            routes: [{ key: "index", name: "index" }],
          }),
        );
      }}
      style={{
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 7,
        backgroundColor: colors.secondaryContainer.default,
      }}
    >
      <Heading1Small>
        {tournament.date.split("-")[0]} {tournament.name}
      </Heading1Small>
      <BodyMedium>{tournament.location}</BodyMedium>
    </TouchableOpacity>
  );
};
