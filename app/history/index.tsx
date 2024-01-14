import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavBar } from "../../lib/components/NavBar";
import { IconButton } from "../../lib/components/IconButton";
import { Link, router } from "expo-router";
import { colors } from "../../lib/colors";
import { useAtomValue } from "jotai";
import { HistoryEntry, historyAtom } from "../../lib/storage/historyAtom";
import { Suspense } from "react";
import LabelSmall from "../../lib/components/text/LabelSmall";
import TitleMedium from "../../lib/components/text/TitleMedium";
import { MatchIdentityLocalizationFormat, localizeMatchIdentity } from "../../lib/models/match";
import Heading1Small from "../../lib/components/text/Heading1Small";
import { Icon } from "../../lib/components/Icon";
import BodyMedium from "../../lib/components/text/BodyMedium";

export default function History() {
    return (
        <>
            <NavBar
                title="History"
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
            <Suspense fallback={<ActivityIndicator size="large" style={{ flex: 1 }} />}>
                <Matches />
            </Suspense>
        </>
    );
}

const Matches = () => {
    const history = useAtomValue(historyAtom);

    return (
        <ScrollView style={{ flex: 1, paddingVertical: 16, paddingHorizontal: 26, gap: 28 }}>
            <SafeAreaView edges={['bottom', 'left', 'right']} style={{ flex: 1, gap: 14, paddingBottom: 200 }}>
                {history.map((match) => (
                    <Match match={match} key={match.scoutReport.uuid} />
                ))}
            </SafeAreaView>
        </ScrollView>
    )
}

const Match = ({ match }: { match: HistoryEntry }) => {
    function localizeDate(date: Date) {
        const now = new Date();
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
    
        const isToday = date.toDateString() === now.toDateString();
        const isYesterday = date.toDateString() === yesterday.toDateString();
    
        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true } as const;
        const timeString = date.toLocaleTimeString('en-US', timeOptions);
    
        if (isToday) {
            return `Today at ${timeString}`;
        } else if (isYesterday) {
            return `Yesterday at ${timeString}`;
        } else {
            const dateOptions = { month: '2-digit', day: '2-digit', year: '2-digit' } as const;
            const dateString = date.toLocaleDateString('en-US', dateOptions);
            return `${dateString} at ${timeString}`;
        }
    }

    return (
        <Link
            asChild
            href={{
                pathname: '/history/[uuid]',
                params: {
                    uuid: match.scoutReport.uuid,
                },
            }}
        >
            <Pressable
                style={{
                    backgroundColor: colors.secondaryContainer.default,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: 10,
                    paddingHorizontal: 14,
                    borderRadius: 7,
                }}
            >
                <View>
                    <Heading1Small>{localizeMatchIdentity(match.meta.matchIdentity, MatchIdentityLocalizationFormat.Long)}</Heading1Small>
                    <BodyMedium>{match.meta.teamNumber} • {localizeDate(new Date(match.scoutReport.startTime))}</BodyMedium>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                    {!match.uploaded && <Icon name="error" size={24} color={colors.onBackground.default} />}
                    <Icon name="arrow_forward_ios" size={20} color={colors.onBackground.default} />
                </View>
            </Pressable>
        </Link>
    )
}
