import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';

export default function DataStorageSettingsScreen() {
  const router = useRouter();
  const [lowDataUsage, setLowDataUsage] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>‹</Text>
          <Text style={styles.backText}>Settings</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Data and Storage Usage</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Media Auto-Download */}
        <Text style={styles.sectionLabel}>MEDIA AUTO-DOWNLOAD</Text>
        <View style={styles.section}>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowLabel}>Photos</Text>
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>Wi-Fi and Cellular</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowLabel}>Audio</Text>
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>Wi-Fi</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowLabel}>Videos</Text>
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>Wi-Fi</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowLabel}>Documents</Text>
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>Wi-Fi</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowLabel}>Reset Auto-Download Settings</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.hint}>
          Voice Messages are always automatically downloaded for the best communication experience.
        </Text>

        {/* Call Settings */}
        <Text style={styles.sectionLabel}>CALL SETTINGS</Text>
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Low Data Usage</Text>
            <Switch
              value={lowDataUsage}
              onValueChange={setLowDataUsage}
              trackColor={{ false: '#e5e5ea', true: '#34c759' }}
            />
          </View>
        </View>
        <Text style={styles.hint}>
          Lower the amount of data used during a call on cellular.
        </Text>

        {/* Usage */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowLabel}>Network Usage</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.row}>
            <Text style={styles.rowLabel}>Storage Usage</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f7' },
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
  content: { flex: 1 },
  sectionLabel: {
    fontSize: 13,
    color: '#8e8e93',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  section: { backgroundColor: '#fff' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowLabel: { fontSize: 16, color: '#000' },
  rowRight: { flexDirection: 'row', alignItems: 'center' },
  rowValue: { fontSize: 16, color: '#8e8e93', marginRight: 4 },
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
