import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { DailyContent } from '../lib/supabase';

export function ContentCard({ item }: { item: DailyContent }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.content}>{item.content}</Text>
      {item.read_more_link && (
        <Pressable onPress={() => WebBrowser.openBrowserAsync(item.read_more_link!)}>
          <Text style={styles.link}>Read more →</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: { fontSize: 17, fontWeight: '700', color: '#111', marginBottom: 6 },
  content: { fontSize: 15, lineHeight: 21, color: '#333' },
  link: { fontSize: 14, fontWeight: '600', color: '#2563eb', marginTop: 10 },
});
