import { ScrollView, View } from "react-native";
import { NavBar } from "../../lib/components/NavBar";
import { IconButton } from "../../lib/components/IconButton";
import { router, useNavigation } from "expo-router";
import { colors } from "../../lib/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import TitleMedium from "../../lib/components/text/TitleMedium";
import BodyMedium from "../../lib/components/text/BodyMedium";
import Button from "../../lib/components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from '@react-navigation/native'


export default function Reset() {
    const navigation = useNavigation();

    const reset = async () => {
        console.log('resetting');
        await AsyncStorage.clear();

        navigation.dispatch(CommonActions.reset({
            routes: [{key: "index", name: "index"}]
        }))
    }

    return (
        <>
            <NavBar
                title="Reset all data"
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
            <SafeAreaView edges={['bottom', 'left', 'right']} style={{ flex: 1, gap: 7 }}>
                <View style={{ flex: 1, paddingVertical: 16, paddingHorizontal: 26 }}>
                    <TitleMedium>Are you sure?</TitleMedium>
                    <BodyMedium>
                        You're about to permanently delete all Lovat Collection data stored on this device. This includes all settings, cached data, and match history.
                    </BodyMedium>

                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'flex-end',
                            gap: 7,
                        }}
                    >
                        <Button
                            variant="danger"
                            onPress={() => {
                                reset();
                            }}
                        >
                            Reset
                        </Button>
                        <Button
                            variant="secondary"
                            onPress={() => {
                                router.back();
                            }}
                        >
                            Cancel
                        </Button>
                    </View>
                </View>
            </SafeAreaView>
        </>
    );
}
