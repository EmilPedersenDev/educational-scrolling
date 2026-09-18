import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { Day } from '../lib/days';

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
        <Text style={styles.caret}>▾</Text>
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
                {day.iso === selected.iso && <Text style={styles.check}>✓</Text>}
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
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    gap: 6,
  },
  triggerText: { fontSize: 15, fontWeight: '600', color: '#111' },
  caret: { fontSize: 12, color: '#555' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)' },
  menu: {
    marginTop: 60,
    marginLeft: 16,
    width: 220,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionText: { fontSize: 15, color: '#222' },
  optionTextSelected: { fontWeight: '700', color: '#000' },
  check: { fontSize: 14, color: '#000' },
});
