import { useAtom } from 'jotai';
import { reportStateAtom } from '../../reportStateAtom';
import { TouchableOpacity } from 'react-native';
import { MatchEventPosition } from '../../MatchEventPosition';
import { FieldElement } from '../FieldElement';

export const PreMatchActions = () => {
    const [reportState, setReportState] = useAtom(reportStateAtom);

    return (
        <>
            <FieldElement edgeInsets={[0.07, 0.88, 0.8, 0.005]}>
                <TouchableOpacity
                    style={{
                        height: '100%',
                        width: '100%',
                        backgroundColor: reportState?.startPosition === MatchEventPosition.WingNearAmp ? "rgba(200, 200, 200, 0.5)" : "rgba(200, 200, 200, 0.2)",
                        borderRadius: 7,
                    }}
                    activeOpacity={0.8}
                    onPress={() => {
                        setReportState({
                            ...reportState!,
                            startPosition: MatchEventPosition.WingNearAmp,
                        });
                    }} />
            </FieldElement>

            <FieldElement edgeInsets={[0.21, 0.88, 0.54, 0.06]}>
                <TouchableOpacity
                    style={{
                        height: '100%',
                        width: '100%',
                        backgroundColor: reportState?.startPosition === MatchEventPosition.WingFrontOfSpeaker ? "rgba(200, 200, 200, 0.5)" : "rgba(200, 200, 200, 0.2)",
                        borderRadius: 7,
                    }}
                    activeOpacity={0.8}
                    onPress={() => {
                        setReportState({
                            ...reportState!,
                            startPosition: MatchEventPosition.WingFrontOfSpeaker,
                        });
                    }} />
            </FieldElement>

            <FieldElement edgeInsets={[0.47, 0.88, 0.35, 0.005]}>
                <TouchableOpacity
                    style={{
                        height: '100%',
                        width: '100%',
                        backgroundColor: reportState?.startPosition === MatchEventPosition.WingCenter ? "rgba(200, 200, 200, 0.5)" : "rgba(200, 200, 200, 0.2)",
                        borderRadius: 7,
                    }}
                    activeOpacity={0.8}
                    onPress={() => {
                        setReportState({
                            ...reportState!,
                            startPosition: MatchEventPosition.WingCenter,
                        });
                    }} />
            </FieldElement>

            <FieldElement edgeInsets={[0.66, 0.88, 0.15, 0.005]}>
                <TouchableOpacity
                    style={{
                        height: '100%',
                        width: '100%',
                        backgroundColor: reportState?.startPosition === MatchEventPosition.WingNearSource ? "rgba(200, 200, 200, 0.5)" : "rgba(200, 200, 200, 0.2)",
                        borderRadius: 7,
                    }}
                    activeOpacity={0.8}
                    onPress={() => {
                        setReportState({
                            ...reportState!,
                            startPosition: MatchEventPosition.WingNearSource,
                        });
                    }} />
            </FieldElement>
        </>
    );
};
