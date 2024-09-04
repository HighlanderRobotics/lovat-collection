import { atom, useAtomValue, useSetAtom } from "jotai";
import { tournamentAtom, useSetTournament } from "../../lib/storage/getTournament";
import { Suspense, useMemo, useState, useEffect } from "react";
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
import { scouterScheduleAtom, getCurrentScouterScheduleCached, ScouterScheduleMatch } from "../../lib/storage/scouterSchedules";
import { getTeamScouters } from "../../lib/lovatAPI/getTeamScouters";
import { atomWithStorage } from "jotai/utils";
import { storage } from "../../lib/storage/jotaiStorage";

export const impersonatedAtom = atomWithStorage<ScouterId>("impersonated", {name:"", uuid:"",}, storage);

interface ScouterId {
    name: string;
    uuid: string;
}

export default function Scouter() {
    const [filter, setFilter] = useState('');

    return (
        <>
            <NavBar
                title="Scouters"
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
                
            />
            <Suspense fallback={<ActivityIndicator style={{ flex: 1 }} />}>
                <KeyboardAwareScrollView style={{ flex: 1, paddingVertical: 16, paddingHorizontal: 26 }}>
                    <SafeAreaView edges={['bottom', 'left', 'right']} style={{ flex: 1, gap: 14, flexDirection: "row", justifyContent: "center" }}>
                        <ScouterSelector />
                    </SafeAreaView>
                </KeyboardAwareScrollView>
            </Suspense>
        </>
    );
}

// Iterates through scoutersScheduleAtom to return an array of scouters
function useScoutersInSchedule() {
    // Returns schedule
    const scheduleCache = useAtomValue(scouterScheduleAtom);

    // Parses Usless Information from Schedule
    const scouterCache = scheduleCache?.data?.data;

    // Creates List of Useful information from Schedule (Scouter UUID: match scouting) as Stringified Json
    const scoutersList = () => {
        let scouterList: ScouterScheduleMatch["scouters"][] = [] ;
        scouterCache?.forEach(( item ) => {
            let scouter = item.scouters;
            scouterList.push(scouter);
        })
        return scouterList;
    };

    // Iterates Through Parsed Json to Find Scouter UUID's
    // const scouterUuids = Object.keys(scoutersList());
    const scouterUuids = scoutersList().reduce((prev, curr) => {
        return [...prev, ...(Object.keys(curr))];
    }, [] as string[]);
    
    // Declares Interface For uuid-name Pairs
    let scouterID: ScouterId[] = [];
    
    // Does Fancy Stuff to Get Other Interface
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [scouters, setScouters] = useState<Scouter[] | null>(null);

    useEffect(() => {
        const fetchScouters = async () => {
            try {
                const scouters = await getTeamScouters();
                setScouters(scouters);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }

        fetchScouters();
    }, []);

    if (error) {
        console.error(error);
    }

    // Iterates Through Scouters on Team to Create K-V List of Active Scouter's uuid-name
    scouters?.forEach((item) => {

        if (scouterUuids.includes(item.uuid)) {
            scouterID.push({
                uuid:item.uuid,
                name:item.name,
            });
        }
    })

    return scouterID;
}


const ScouterSelector = () => {
    const scouters = useScoutersInSchedule();

    if (scouters != null) {
        return (
            <View
                style={{
                    flex: 1,
                    gap: 14,
                    maxWidth: 800,
                }}
            >
            {scouters.map( (item)  => {
            return (<ScouterItem
                scouter={item}
            />)
            })}
            </View>
        )
    }   
}

const ScouterItem = ({scouter}: { scouter: ScouterId}) => {
    const setImpersonated = useSetAtom(impersonatedAtom);
    return (
        <TouchableOpacity
            key={scouter.uuid}
            onPress={() => {
                setImpersonated({name:scouter.name, uuid:scouter.uuid,});
            }}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: 7,
                backgroundColor: colors.secondaryContainer.default,
                minHeight: 50,
            }}
        >
            <View
                style={{
                    flex: 1,
                }}
            ><BodyMedium>{scouter.name}</BodyMedium>
            </View>
            <Suspense>
                <SelectedIndicator scouter={scouter} />
            </Suspense>
        </TouchableOpacity>
    )
}

const SelectedIndicator = ({ scouter }: { scouter: ScouterId }) => {
    const selectedScouter = useAtomValue(impersonatedAtom);

    if (selectedScouter.uuid === scouter.uuid) {
        return (
            <Icon name="check" color={colors.onBackground.default} />
        )
    } else {
        return null;
    }
}
