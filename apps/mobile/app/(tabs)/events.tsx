import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function EventsScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.emptyState}>
          <Text style={styles.icon}>📅</Text>
          <Text style={styles.emptyTitle}>No Events Yet</Text>
          <Text style={styles.emptyText}>Events you're hosting or invited to will appear here</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  icon: { fontSize: 64 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: '#111827', marginTop: 16 },
  emptyText: { fontSize: 16, color: '#6b7280', textAlign: 'center', marginTop: 8 },
});
