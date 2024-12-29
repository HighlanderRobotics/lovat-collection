import { useEffect, useState } from "react";
import { Text } from "react-native";

export const GameTimer = (props: { startTime?: Date }) => {
  const [time, setTime] = useState<number>(0);

  useEffect(() => {
    if (!props.startTime) {
      setTime(0);
    } else {
      const interval = setInterval(() => {
        setTime(
          (new Date().getTime() - (props.startTime?.getTime() ?? 0)) / 1000,
        );
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [props.startTime]);

  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  return (
    <Text>
      {minutes}:{seconds.toString().padStart(2, "0")}
    </Text>
  );
};
