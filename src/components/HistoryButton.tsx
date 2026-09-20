import { Pressable, StyleSheet } from 'react-native';
import { HistoryIcon } from './icons/HistoryIcon';
import { colors } from '../theme';

export function HistoryButton() {
  return (
    <Pressable style={styles.button} onPress={() => {}}>
      <HistoryIcon size={16} color={colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
