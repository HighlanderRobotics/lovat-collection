import { Text } from 'react-native'
import { colors } from '../../colors'

const Heading1Small = ({ children, color }: { children: React.ReactNode, color?: string }) => {
    return <Text style={{
        fontFamily: 'Heebo_500Medium',
        fontSize: 20,
        fontWeight: '500',
        lineHeight: 32,
        color: color ?? colors.onBackground.default,
    }}>
        {children}
    </Text>
}

export default Heading1Small