import { ComponentProps } from "react";
import ReactTimeAgo from "react-time-ago";

import { Text } from "react-native";

type TimeProps = {
  date: number | Date;
  verboseDate?: string;
  tooltip: boolean;
  children: string;
};

export default function TimeAgo(props: ComponentProps<typeof ReactTimeAgo>) {
  return <ReactTimeAgo {...props} component={Time} />;
}

function Time({ children }: TimeProps) {
  return <Text>{children}</Text>;
}
