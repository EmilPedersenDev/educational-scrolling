import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ContentCard } from './src/components/ContentCard';
import { DayFilter } from './src/components/DayFilter';
import { buildDays } from './src/lib/days';
import { useDailyContent } from './src/hooks/useDailyContent';

function Screen() {
  const days = useMemo(buildDays, []);
  const [selected, setSelected] = useState(days[0]);
  const { items, loading, refreshing, error, refresh, retry } = useDailyContent(selected.iso);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <DayFilter days={days} selected={selected} onSelect={setSelected} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Couldn't load content: {error}</Text>
          <Pressable style={styles.retryButton} onPress={retry}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <ContentCard item={item} />}
          contentContainerStyle={items.length === 0 ? styles.emptyContainer : styles.listContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No content for this day yet.</Text>
          }
        />
      )}

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Screen />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { paddingHorizontal: 16, paddingVertical: 12 },
  listContainer: { paddingBottom: 24 },
  emptyContainer: { flexGrow: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 15, color: '#777' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  errorText: { fontSize: 15, color: '#b00020', textAlign: 'center', marginBottom: 12 },
  retryButton: { backgroundColor: '#111', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  retryText: { color: '#fff', fontWeight: '600' },
});
