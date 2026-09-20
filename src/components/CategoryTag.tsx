import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';

export function CategoryTag({ label }: { label: string }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface2,
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.accent,
  },
});
