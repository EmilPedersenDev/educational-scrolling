import { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { SourceSerif4_600SemiBold } from '@expo-google-fonts/source-serif-4';

import { ArticleExpanded } from './src/components/ArticleExpanded';
import { DayFilter } from './src/components/DayFilter';
import { FeedCard } from './src/components/FeedCard';
import { HistoryButton } from './src/components/HistoryButton';
import { PageDots } from './src/components/PageDots';
import { ProgressBar } from './src/components/ProgressBar';
import { useDailyContent } from './src/hooks/useDailyContent';
import { Day, buildDays } from './src/lib/days';
import { DailyContent } from './src/lib/supabase';
import { colors, fonts } from './src/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 60 };

type FeedProps = {
  days: Day[];
  selected: Day;
  onSelectDay: (day: Day) => void;
  items: DailyContent[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  onRefresh: () => void;
  onRetry: () => void;
  onExpand: (item: DailyContent) => void;
};

function Feed({
  days,
  selected,
  onSelectDay,
  items,
  loading,
  refreshing,
  error,
  onRefresh,
  onRetry,
  onExpand,
}: FeedProps) {
  const [pagerHeight, setPagerHeight] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const first = viewableItems[0];
    if (first && first.index !== null && first.index !== undefined) {
      setCurrentIndex(first.index);
    }
  }).current;

  return (
    <View style={styles.flex}>
      <ProgressBar current={items.length > 0 ? currentIndex : 0} total={items.length} />

      <View style={styles.topBar}>
        <DayFilter days={days} selected={selected} onSelect={onSelectDay} />
        <HistoryButton />
      </View>

      <View style={styles.pager} onLayout={(e) => setPagerHeight(e.nativeEvent.layout.height)}>
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={colors.accent} />
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>Couldn't load content: {error}</Text>
            <Pressable style={styles.retryButton} onPress={onRetry}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : items.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No content for this day yet.</Text>
          </View>
        ) : pagerHeight > 0 ? (
          <>
            <FlatList
              data={items}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <FeedCard item={item} height={pagerHeight} onExpand={() => onExpand(item)} />
              )}
              pagingEnabled
              showsVerticalScrollIndicator={false}
              getItemLayout={(_, index) => ({
                length: pagerHeight,
                offset: pagerHeight * index,
                index,
              })}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={VIEWABILITY_CONFIG}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
              }
            />
            <PageDots count={items.length} current={currentIndex} />
          </>
        ) : null}
      </View>
    </View>
  );
}

function Screen() {
  const days = useMemo(buildDays, []);
  const [selected, setSelected] = useState(days[0]);
  const { items, loading, refreshing, error, refresh, retry } = useDailyContent(selected.iso);
  const [expandedItem, setExpandedItem] = useState<DailyContent | null>(null);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      {expandedItem ? (
        <ArticleExpanded item={expandedItem} onBack={() => setExpandedItem(null)} />
      ) : (
        <Feed
          days={days}
          selected={selected}
          onSelectDay={(day) => setSelected(day)}
          items={items}
          loading={loading}
          refreshing={refreshing}
          error={error}
          onRefresh={refresh}
          onRetry={retry}
          onExpand={setExpandedItem}
        />
      )}
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    SourceSerif4_600SemiBold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider style={styles.appRoot} onLayout={onLayoutRootView}>
      <Screen />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  appRoot: { flex: 1, backgroundColor: colors.bg },
  safeArea: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pager: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  emptyText: { fontFamily: fonts.sansRegular, fontSize: 15, color: colors.textTertiary },
  errorText: {
    fontFamily: fonts.sansRegular,
    fontSize: 15,
    color: '#e08a8a',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: colors.textPrimary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryText: { fontFamily: fonts.sansSemiBold, color: colors.bg },
});
