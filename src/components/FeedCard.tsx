import { useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowDown } from 'lucide-react-native';
import { DailyContent } from '../lib/supabase';
import { readTimeMinutes } from '../lib/readTime';
import { colors, fonts } from '../theme';

const EXCERPT_HEIGHT = 172;

type Props = {
  item: DailyContent;
  height: number;
  onExpand: () => void;
};

export function FeedCard({ item, height, onExpand }: Props) {
  const [naturalHeight, setNaturalHeight] = useState<number | null>(null);
  const truncated = naturalHeight !== null && naturalHeight > EXCERPT_HEIGHT;
  const minutes = readTimeMinutes(item.content);

  const handleLayout = (event: LayoutChangeEvent) => {
    if (naturalHeight === null) setNaturalHeight(event.nativeEvent.layout.height);
  };

  return (
    <View style={[styles.card, { height }]}>
      <View style={styles.spacer} />

      <Text style={styles.title}>{item.title}</Text>

      <View style={truncated ? { height: EXCERPT_HEIGHT, overflow: 'hidden' } : undefined}>
        <Text style={styles.excerpt} onLayout={handleLayout}>
          {item.content}
        </Text>
        {truncated && (
          <LinearGradient
            colors={[`${colors.bg}00`, colors.bg]}
            style={styles.fade}
            pointerEvents="none"
          />
        )}
      </View>

      <View style={[styles.actionRow, !truncated && styles.actionRowSingle]}>
        {truncated && (
          <Pressable style={styles.expandButton} onPress={onExpand}>
            <Text style={styles.expandLabel}>Expand</Text>
            <ArrowDown size={14} color={colors.bg} />
          </Pressable>
        )}
        <Text style={styles.readTime}>
          {truncated ? `${minutes} min read` : `${minutes} min read · fits on screen`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { paddingHorizontal: 20, gap: 16 },
  spacer: { height: 44 },
  title: {
    fontFamily: fonts.serifSemiBold,
    fontSize: 28,
    lineHeight: 28 * 1.2,
    color: colors.textPrimary,
  },
  excerpt: {
    fontFamily: fonts.sansRegular,
    fontSize: 15,
    lineHeight: 15 * 1.55,
    color: colors.textSecondary,
  },
  fade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 60 },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionRowSingle: { justifyContent: 'flex-start' },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.textPrimary,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  expandLabel: { fontFamily: fonts.sansSemiBold, fontSize: 14, color: colors.bg },
  readTime: { fontFamily: fonts.sansRegular, fontSize: 12, color: colors.textTertiary },
});
