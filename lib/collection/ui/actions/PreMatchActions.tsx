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
                        backgroundColor: "#e0e0e0",
                        opacity: reportState?.startPosition === MatchEventPosition.StartOne ? 0.8 : 0.3,
                        borderRadius: 7,
                    }}
                    activeOpacity={0.2}
                    onPress={() => {
                        setReportState({
                            ...reportState!,
                            startPosition: MatchEventPosition.StartOne,
                        });
                    }} />
            </FieldElement>

            <FieldElement edgeInsets={[0.47, 0.88, 0.35, 0.005]}>
                <TouchableOpacity
                    style={{
                        height: '100%',
                        width: '100%',
                        backgroundColor: "#e0e0e0",
                        opacity: reportState?.startPosition === MatchEventPosition.StartTwo ? 0.8 : 0.3,
                        borderRadius: 7,
                    }}
                    activeOpacity={0.2}
                    onPress={() => {
                        setReportState({
                            ...reportState!,
                            startPosition: MatchEventPosition.StartTwo,
                        });
                    }} />
            </FieldElement>

            <FieldElement edgeInsets={[0.66, 0.88, 0.15, 0.005]}>
                <TouchableOpacity
                    style={{
                        height: '100%',
                        width: '100%',
                        backgroundColor: "#e0e0e0",
                        opacity: reportState?.startPosition === MatchEventPosition.StartThree ? 0.8 : 0.3,
                        borderRadius: 7,
                    }}
                    activeOpacity={0.2}
                    onPress={() => {
                        setReportState({
                            ...reportState!,
                            startPosition: MatchEventPosition.StartThree,
                        });
                    }} />
            </FieldElement>
        </>
    );
};
