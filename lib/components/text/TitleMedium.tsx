import { Text } from 'react-native'
import { colors } from '../../colors'

const TitleMedium = ({ children, color }: { children: React.ReactNode, color?: string }) => {
    return <Text style={{
        fontFamily: 'Heebo_500Medium',
        fontSize: 30,
        fontWeight: '500',
        color: color ?? colors.onBackground.default,
    }}>
        {children}
    </Text>
}

export default TitleMedium