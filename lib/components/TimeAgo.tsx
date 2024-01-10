import React from 'react'
import ReactTimeAgo from 'react-time-ago'

import { Text } from 'react-native'

type TimeProps = {
    date: number | Date;
    verboseDate?: string;
    tooltip: boolean;
    children: string;
}

export default function TimeAgo(props: any) {
  return <ReactTimeAgo {...props} component={Time}/>
}

function Time({ date, verboseDate, tooltip, children }: TimeProps) {
  return <Text>{children}</Text>
}