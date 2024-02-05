import { router } from 'expo-router';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import BodyMedium from '../../lib/components/text/BodyMedium';
import Button from '../../lib/components/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconButton } from '../../lib/components/IconButton';
import { useAtom, useAtomValue } from 'jotai';
import { FieldOrientation, fieldOrientationAtom } from '../../lib/models/FieldOrientation';
import { ButtonGroup } from '../../lib/components/ButtonGroup';
import { colors } from '../../lib/colors';
import { FieldImage, fieldHeight, fieldWidth } from '../../lib/components/FieldImage';
import Heading1Small from '../../lib/components/text/Heading1Small';
import { Suspense } from 'react';
import { NavBar } from '../../lib/components/NavBar';
import { tournamentAtom } from '../../lib/storage/getTournament';

export default function Settings() {
    return (
        <>
            <NavBar
                title="Settings"
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
                <ScrollView style={{ flex: 1, paddingVertical: 16, paddingHorizontal: 26 }}>
                    <SafeAreaView edges={['bottom', 'left', 'right']} style={{ flex: 1, gap: 14 }}>
                            <FieldOrientationEditor />

                            <TournamentSelector />

                            <View
                                style={{
                                    marginTop: 112,
                                }}
                            >
                                <Button
                                    variant="secondary"
                                    onPress={() => {
                                        router.push('/settings/reset');
                                    }}
                                >
                                    Reset all settings and data
                                </Button>
                            </View>
                    </SafeAreaView>
                </ScrollView>
            </Suspense>
        </>
    );
}

const FieldOrientationEditor = () => {
    const [fieldOrientation, setFieldOrientation] = useAtom(fieldOrientationAtom);

    return (
        <View>
            <Heading1Small>Field orientation</Heading1Small>
                <View
                    style={{
                        marginTop: 7,
                        padding: 7,
                        borderRadius: 10,
                        backgroundColor: colors.secondaryContainer.default,
                        gap: 7,
                    }}
                >
                    <View
                        style={{
                            aspectRatio: fieldWidth / fieldHeight,
                        }}
                    >
                        <FieldImage />
                    </View>
                    <ButtonGroup
                        buttons={[
                            {
                                label: 'Auspicious',
                                value: FieldOrientation.Auspicious,
                            },
                            {
                                label: 'Sinister',
                                value: FieldOrientation.Sinister,
                            },
                        ]}
                        selected={fieldOrientation}
                        onChange={(value) => {
                            setFieldOrientation(value);
                        }}
                    />
                </View>
        </View>
    )
}

const TournamentSelector = () => {
    const tournament = useAtomValue(tournamentAtom);

    return (
        <View>
            <Heading1Small>Tournament</Heading1Small>
            <View
                style={{
                    marginTop: 7,
                    padding: 7,
                    borderRadius: 10,
                    backgroundColor: colors.secondaryContainer.default,
                    gap: 7,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 7,
                    }}
                >
                    <View
                        style={{
                            padding: 7,
                        }}
                    >
                        <BodyMedium>{tournament ? `${tournament.date.split('-')[0]} ${tournament.name}` : "No tournament selected"}</BodyMedium>
                    </View>
                    <Button
                        onPress={() => {
                            router.push('/settings/tournament');
                        }}
                    >
                        {tournament ? "Change" : "Select a tournament"}
                    </Button>
                </View>
            </View>
        </View>
    );
}
