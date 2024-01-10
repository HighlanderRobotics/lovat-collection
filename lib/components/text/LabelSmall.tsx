import { Text } from 'react-native'
import { colors } from '../../colors'

const LabelSmall = ({ children, color }: { children: React.ReactNode, color?: string }) => {
    return <Text style={{
        fontFamily: 'Heebo_400Regular',
        fontSize: 14,
        color: color ?? colors.onBackground.default,
    }}>
        {children}
    </Text>
}

export default LabelSmall