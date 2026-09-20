import { useState } from 'react';
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { ArrowLeft } from 'lucide-react-native';
import { DailyContent } from '../lib/supabase';
import { labelForIso } from '../lib/days';
import { readTimeMinutes } from '../lib/readTime';
import { colors, fonts } from '../theme';

type Props = {
  item: DailyContent;
  onBack: () => void;
};

export function ArticleExpanded({ item, onBack }: Props) {
  const [progress, setProgress] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [layoutHeight, setLayoutHeight] = useState(0);

  const updateProgress = (contentHeight: number, viewHeight: number, offsetY: number) => {
    const scrollable = contentHeight - viewHeight;
    if (scrollable <= 0) {
      setProgress(100);
      return;
    }
    setProgress(Math.max(0, Math.min(100, Math.round((offsetY / scrollable) * 100))));
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    updateProgress(scrollHeight, layoutHeight, event.nativeEvent.contentOffset.y);
  };

  const handleContentSizeChange = (_width: number, height: number) => {
    setScrollHeight(height);
    updateProgress(height, layoutHeight, 0);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    setLayoutHeight(event.nativeEvent.layout.height);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <ArrowLeft size={16} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.progressLabel}>{progress}%</Text>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        onScroll={handleScroll}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleLayout}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{item.title}</Text>

        <View style={styles.meta}>
          <Text style={styles.metaText}>{readTimeMinutes(item.content)} min read</Text>
          <Text style={styles.metaText}>·</Text>
          <Text style={styles.metaText}>{labelForIso(item.date)}</Text>
        </View>

        <Text style={styles.bodyText}>{item.content}</Text>

        {item.read_more_link && (
          <Pressable
            style={styles.sourceLink}
            onPress={() => WebBrowser.openBrowserAsync(item.read_more_link!)}
          >
            <Text style={styles.sourceLinkText}>View original source</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  progressLabel: { fontFamily: fonts.sansSemiBold, fontSize: 12, color: colors.textTertiary },
  body: { flex: 1 },
  bodyContent: { paddingHorizontal: 20, paddingBottom: 40, gap: 18 },
  title: {
    fontFamily: fonts.serifSemiBold,
    fontSize: 26,
    lineHeight: 26 * 1.2,
    color: colors.textPrimary,
  },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText: { fontFamily: fonts.sansRegular, fontSize: 12, color: colors.textTertiary },
  bodyText: {
    fontFamily: fonts.sansRegular,
    fontSize: 16,
    lineHeight: 16 * 1.65,
    color: colors.textSecondary,
  },
  sourceLink: { paddingVertical: 4 },
  sourceLinkText: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.textTertiary,
    textDecorationLine: 'underline',
  },
});
