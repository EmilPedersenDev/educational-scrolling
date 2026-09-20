import { useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowDown } from 'lucide-react-native';
import { CategoryTag } from './CategoryTag';
import { DailyContent } from '../lib/supabase';
import { parseTitle } from '../lib/parseTitle';
import { readTimeMinutes } from '../lib/readTime';
import { colors, fonts } from '../theme';

const OUTER_GAP = 16;
const BOTTOM_BREATHING_ROOM = 8;
const MIN_EXCERPT_HEIGHT = 60;

type Props = {
  item: DailyContent;
  height: number;
  onExpand: () => void;
};

export function FeedCard({ item, height, onExpand }: Props) {
  const { category, title } = parseTitle(item.title);
  const [headerHeight, setHeaderHeight] = useState<number | null>(null);
  const [footerHeight, setFooterHeight] = useState<number | null>(null);
  const [naturalExcerptHeight, setNaturalExcerptHeight] = useState<number | null>(null);
  const minutes = readTimeMinutes(item.content);

  const measured = headerHeight !== null && footerHeight !== null && naturalExcerptHeight !== null;
  const chromeHeight = (headerHeight ?? 0) + (footerHeight ?? 0) + OUTER_GAP * 2 + BOTTOM_BREATHING_ROOM;
  const availableExcerptHeight = Math.max(MIN_EXCERPT_HEIGHT, height - chromeHeight);
  const truncated = measured && naturalExcerptHeight! > availableExcerptHeight;

  const handleHeaderLayout = (event: LayoutChangeEvent) => {
    if (headerHeight === null) setHeaderHeight(event.nativeEvent.layout.height);
  };

  const handleFooterLayout = (event: LayoutChangeEvent) => {
    if (footerHeight === null) setFooterHeight(event.nativeEvent.layout.height);
  };

  const handleExcerptLayout = (event: LayoutChangeEvent) => {
    if (naturalExcerptHeight === null) setNaturalExcerptHeight(event.nativeEvent.layout.height);
  };

  return (
    <View style={[styles.card, { height }]}>
      <View style={styles.header} onLayout={handleHeaderLayout}>
        <View style={styles.topSpacer} />
        {category && <CategoryTag label={category} />}
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={truncated ? { height: availableExcerptHeight, overflow: 'hidden' } : undefined}>
        <Text style={styles.excerpt} onLayout={handleExcerptLayout}>
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

      <View
        style={[styles.actionRow, !truncated && styles.actionRowSingle]}
        onLayout={handleFooterLayout}
      >
        {truncated && (
          <Pressable style={styles.expandLink} onPress={onExpand} hitSlop={8}>
            <Text style={styles.expandLabel}>Expand</Text>
            <ArrowDown size={12} color={colors.accent} />
          </Pressable>
        )}
        <Text style={styles.readTime}>{minutes} min read</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { paddingHorizontal: 20, gap: OUTER_GAP },
  header: { gap: 10 },
  topSpacer: { height: 8 },
  title: {
    fontFamily: fonts.serifSemiBold,
    fontSize: 22,
    lineHeight: 22 * 1.25,
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
  expandLink: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  expandLabel: { fontFamily: fonts.sansSemiBold, fontSize: 13, color: colors.accent },
  readTime: { fontFamily: fonts.sansRegular, fontSize: 12, color: colors.textTertiary },
});
