import { StyleSheet, View } from "react-native";
import { colors } from "../colors";
import BodyMedium from "./text/BodyMedium";

/**
 * A horizontal rule with a break in the middle for a small, centered label —
 * e.g. "Asked by your team". Muted gray hairlines flank the text.
 */
export default function LabeledDivider({ label }: { label: string }) {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <BodyMedium style={styles.label}>{label}</BodyMedium>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.gray.hover,
  },
  label: {
    color: colors.body.default,
  },
});
