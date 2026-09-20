import { StyleSheet, View } from 'react-native';
import { colors } from '../theme';

type Props = {
  count: number;
  current: number;
};

export function PageDots({ count, current }: Props) {
  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: count }, (_, index) => (
        <View key={index} style={index === current ? styles.dotActive : styles.dot} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textTertiary,
    opacity: 0.5,
  },
  dotActive: {
    width: 4,
    height: 14,
    borderRadius: 2,
    backgroundColor: colors.accent,
  },
});
