import { StyleSheet, View } from 'react-native';
import { colors } from '../theme';

type Props = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: Props) {
  const fraction = total > 0 ? (current + 1) / total : 0;

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${Math.min(100, fraction * 100)}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 2, width: '100%', backgroundColor: colors.border },
  fill: { height: 2, backgroundColor: colors.accent },
});
