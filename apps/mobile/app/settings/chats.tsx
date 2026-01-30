import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../components/Header';
import BottomTabBar from '../../components/BottomTabBar';

export default function ChatsSettingsScreen() {
  const router = useRouter();
  const [saveToCameraRoll, setSaveToCameraRoll] = useState(false);

  return (
    <View style={styles.container}>
      <Header showBack />

      <ScrollView style={styles.content}>
        {/* Wallpaper */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowLabel}>Change Wallpaper</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Save to Camera Roll */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Save to Camera Roll</Text>
            <Switch
              value={saveToCameraRoll}
              onValueChange={setSaveToCameraRoll}
              trackColor={{ false: '#e5e5ea', true: '#34c759' }}
            />
          </View>
        </View>
        <Text style={styles.hint}>
          Automatically save photos and videos you receive to your iPhone's Camera Roll.
        </Text>

        {/* Chat Backup */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowLabel}>Chat Backup</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.blueLabel}>Archive All Chats</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.row}>
            <Text style={styles.dangerLabel}>Clear All Chats</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.row}>
            <Text style={styles.dangerLabel}>Delete All Chats</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
      <BottomTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f7f7f7',
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#c8c8c8',
  },
  backButton: { flexDirection: 'row', alignItems: 'center', width: 100 },
  backIcon: { fontSize: 32, color: '#007aff', marginTop: -4 },
  backText: { fontSize: 17, color: '#007aff' },
  headerTitle: { fontSize: 17, fontWeight: '600', color: '#000' },
  headerPlaceholder: { width: 100 },
  content: { flex: 1, paddingTop: 20 },
  section: { backgroundColor: '#fff', marginBottom: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowLabel: { fontSize: 16, color: '#000' },
  blueLabel: { fontSize: 16, color: '#007aff' },
  dangerLabel: { fontSize: 16, color: '#ff3b30' },
  chevron: { fontSize: 22, color: '#c7c7cc' },
  divider: { height: 0.5, backgroundColor: '#e5e5ea', marginLeft: 16 },
  hint: {
    fontSize: 13,
    color: '#8e8e93',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
});
