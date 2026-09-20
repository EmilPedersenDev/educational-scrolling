import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react-native';
import { Day } from '../lib/days';
import { colors, fonts } from '../theme';

type Props = {
  days: Day[];
  selected: Day;
  onSelect: (day: Day) => void;
};

export function DayFilter({ days, selected, onSelect }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <View>
      <Pressable style={styles.trigger} onPress={() => setOpen(true)}>
        <Text style={styles.triggerText}>{selected.label}</Text>
        <ChevronDown size={14} color={colors.textSecondary} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.menu}>
            {days.map((day) => (
              <Pressable
                key={day.iso}
                style={styles.option}
                onPress={() => {
                  onSelect(day);
                  setOpen(false);
                }}
              >
                <Text style={[styles.optionText, day.iso === selected.iso && styles.optionTextSelected]}>
                  {day.label}
                </Text>
                {day.iso === selected.iso && <Check size={14} color={colors.textPrimary} />}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  triggerText: { fontSize: 13, fontFamily: fonts.sansSemiBold, color: colors.textPrimary },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  menu: {
    marginTop: 60,
    marginLeft: 16,
    width: 220,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 6,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionText: { fontSize: 15, fontFamily: fonts.sansRegular, color: colors.textSecondary },
  optionTextSelected: { fontFamily: fonts.sansSemiBold, color: colors.textPrimary },
});
